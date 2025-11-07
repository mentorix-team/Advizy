import User from "../config/model/user.model.js";
import AppError from "../utils/AppError.js";
import cloudinary from "cloudinary";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import passport from "passport";
import UserGoogle from "../config/model/user.google.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import { sendOtpMessage } from "../utils/sendnotification.js";
import {
  ExpertBasics,
  ExpertCredentials,
} from "../config/model/expert/expertfinal.model.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
// Cookie options tuned for local dev (http://localhost) and production (https)
const isDev = process.env.NODE_ENV !== "production";
const cookieOption = {
  maxAge: 15 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  // Secure cookies cannot be set or sent over http. In dev we use http, so keep false.
  secure: !isDev, // true in production, false in development
  // On localhost, ports differ but it's still same-site; Lax works and avoids None+Secure requirement
  sameSite: isDev ? "Lax" : "None",
};

const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

const googleCallback = passport.authenticate("google", {
  failureRedirect: "/",
});

const handleGoogleCallback = async (req, res, next) => {
  if (!req.user) {
    console.error("Error: req.user is undefined");
    return next(new AppError("Authentication failed: User not found", 504));
  }

  console.log("req.user:", req.user);

  const { googleId, email, name } = req.user;

  try {
    let user = await User.findOne({ googleId });

    if (user) {
      console.log("User found with googleId, logging in...");
    } else {
      console.log("User with googleId not found, checking by email...");

      const existingUserByEmail = await User.findOne({ email });

      if (existingUserByEmail) {
        console.log(
          "User found with the same email but without Google ID, redirecting to error page..."
        );

        const errorURL = `https://advizy.in/auth-error?message=${encodeURIComponent(
          "An account with this email already exists. Please log in using your original method."
        )}`;
        return res.redirect(errorURL);
      }

      console.log("User not found, creating new user...");

      const [firstName, ...lastNameParts] = name
        ? name.split(" ")
        : ["Google", "User"];
      const lastName = lastNameParts.join(" ");

      user = await User.create({
        googleId,
        email,
        name,
        firstName: firstName || "Google",
        lastName: lastName || "User",
        provider: "google",
      });
    }

    // Generate Access & Refresh Tokens
    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      "R5sWL56Li7DgtjNly8CItjADuYJY6926pE9vn823eD0=",
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      { id: user._id, email: user.email },
      "R5sWL56Li7DgtjNly8CItjADuYJY6926pE9vn823eD0=",
      { expiresIn: "70d" }
    );

    console.log("Access & Refresh Tokens generated");

    // Set Cookies
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: !isDev,
      sameSite: isDev ? "Lax" : "None",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: !isDev,
      sameSite: isDev ? "Lax" : "None",
      maxAge: 70 * 24 * 60 * 60 * 1000, // 70 days
    });

    // Check if the user is an expert
    const expert = await ExpertBasics.findOne({ user_id: user._id });

    let expertAccessToken = null;
    let expertRefreshToken = null;

    if (expert) {
      console.log("User is an expert, generating expert tokens...");

      expertAccessToken = expert.generateExpertToken({ expiresIn: "1d" });
      expertRefreshToken = jwt.sign(
        { id: expert._id, email: user.email },
        "3qdcBCZzmSE9H39Radno+8AbM6QqI6pTUD0rF7cD0ew=",
        { expiresIn: "7d" }
      );

      // Set Expert Tokens in Cookies
      res.cookie("expertToken", expertAccessToken, {
        httpOnly: true,
        secure: !isDev,
        sameSite: isDev ? "Lax" : "None",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.cookie("expertRefreshToken", expertRefreshToken, {
        httpOnly: true,
        secure: !isDev,
        sameSite: isDev ? "Lax" : "None",
        maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
      });
    }

    // Redirect to frontend with tokens
    const frontendURL = `https://advizy.in/google-auth-success?token=${accessToken}&user=${encodeURIComponent(
      JSON.stringify(user)
    )}&expert=${encodeURIComponent(JSON.stringify(expert || null))}`;

    console.log("Redirecting to:", frontendURL);


    return res.redirect(frontendURL);
    // return res.status(200).json({
    //     success:true,
    //     message:'User Logged in ',
    //     user,
    //     expert:expert||null
    // })
  } catch (error) {
    console.error("Error during Google authentication:", error.message);
    return next(new AppError("Error during Google authentication", 500));
  }
};

const setPassword = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return next(new AppError("agian new error", 501));
  }

  const token = header.split(" ")[1];

  try {
    const payload = jwt.verify(
      token,
      "R5sWL56Li7DgtjNly8CItjADuYJY6926pE9vn823eD0="
    );
    const email = payload.emailId;

    const usergoogle = await UserGoogle.findOne({ email });

    if (!usergoogle) {
      return next(new AppError("user not found", 500));
    }

    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 12);

    usergoogle.password = hashedPassword;
    await usergoogle.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully!",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error processing request", error: error.message }); // Handle errors
  }
};

const register_with_email = async (req, res, next) => {
  try {
    const { firstName, lastName, gender, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return next(new AppError("all fields are required", 500));
    }
    const userExists = await User.findOne({ email });

    if (userExists) {
      return next(new AppError("try again", 500));
    }
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      gender,
    });

    if (!user) {
      return next(new AppError("user not created", 500));
    }

    await user.save();
    user.password = undefined;

    const token = await user.generateJWTToken();
    res.cookie("token", token, cookieOption);
    return res.status(200).json({
      success: true,
      message: "user registered succesfully",
      user,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};
const register_with_mobile = async (req, res, next) => {
  try {
    const { firstName, lastName, gender, password, number } = req.body;

    if (!firstName || !lastName || !password || !number) {
      return next(new AppError("all fields are required", 511));
    }
    // const userExists = await User.findOne({email})
    // if(userExists){
    //     return next(new AppError('try again',500))
    // }
    const user = await User.create({
      firstName,
      lastName,
      password,
      number,
      gender,
    });

    if (!user) {
      return next(new AppError("user not created", 502));
    }

    await user.save();
    user.password = undefined;

    const token = await user.generateJWTToken();
    res.cookie("token", token, cookieOption);
    return res.status(200).json({
      success: true,
      message: "user registered succesfully",
      user,
    });
  } catch (error) {
    // return next(new AppError(error.message,522))
    console.log(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, number, password } = req.body;

    if ((!email && !number) || !password) {
      return next(
        new AppError("Email or number and password are required", 400)
      );
    }

    let user;

    if (email) {
      user = await User.findOne({ email }).select("+password");
    } else if (number) {
      user = await User.findOne({ number }).select("+password");
    }

    if (!user) {
      return next(new AppError("User not found", 401));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new AppError("Invalid email/number or password", 401));
    }

    // ✅ Generate Access & Refresh Tokens for User
    const accessToken = user.generateJWTToken({ expiresIn: "1d" });
    const refreshToken = user.generateJWTToken({ expiresIn: "30d" });

    // ✅ Store User Tokens in HTTP-only Cookies
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: !isDev,
      sameSite: isDev ? "Lax" : "None",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: !isDev,
      sameSite: isDev ? "Lax" : "None",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // ✅ Check if User is an Expert & Generate Expert Tokens
    const expert = await ExpertBasics.findOne({ user_id: user._id });

    if (expert) {
      const expertToken = expert.generateExpertToken({ expiresIn: "7d" });
      const expertRefreshToken = expert.generateExpertToken({
        expiresIn: "30d",
      });

      res.cookie("expertToken", expertToken, {
        httpOnly: true,
        secure: !isDev,
        sameSite: isDev ? "Lax" : "None",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.cookie("expertRefreshToken", expertRefreshToken, {
        httpOnly: true,
        secure: !isDev,
        sameSite: isDev ? "Lax" : "None",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
    }

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
      expert: expert || null,
    });
  } catch (error) {
    console.log(error);
    return next(new AppError("Server error", 500));
  }
};

const logout = async (req, res, next) => {
  try {
    // ✅ Clear Access Token
    res.cookie("token", null, {
      httpOnly: true,
      secure: !isDev,
      sameSite: isDev ? "Lax" : "None",
      maxAge: 0,
    });

    // ✅ Clear Refresh Token
    res.cookie("refreshToken", null, {
      httpOnly: true,
      secure: !isDev,
      sameSite: isDev ? "Lax" : "None",
      maxAge: 0,
    });

    // ✅ Clear Expert Token
    res.cookie("expertToken", null, {
      httpOnly: true,
      secure: !isDev,
      sameSite: isDev ? "Lax" : "None",
      maxAge: 0,
    });

    // ✅ Clear Expert Refresh Token
    res.cookie("expertRefreshToken", null, {
      httpOnly: true,
      secure: !isDev,
      sameSite: isDev ? "Lax" : "None",
      maxAge: 0,
    });

    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    return next(new AppError("Server error", 500));
  }
};

const myprofile = async (req, res, next) => {
  try {
    const id = req.user.id; // fixed
    const user = await User.findById(id).populate("favourites");
    if (!user) {
      return next(new AppError("user not found", 404));
    }
    return res.status(200).json({
      success: true,
      message: "user profile",
      user,
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};

const forgot = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError("All Fields Are required", 511));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("User with this email does not exist", 512));
  }

  const resetToken = await user.generateForgotPasswordToken();
  await user.save();

  const resetPasswordUrl = `${process.env.frontendURL}/reset-password/${resetToken}`;

  // Define subject and message for the email
  const message = `${resetPasswordUrl}`;
  const subject = "Reset Password";
  try {
    res.status(200).json({
      success: true,
      message: `Reset password token has been sent to ${email}`,
    });
  } catch (error) {
    // If email sending fails, reset the token fields
    user.forgotpasswordtoken = undefined;
    user.forgotpasswordexpiry = undefined;
    await user.save();

    return next(new AppError("Failed to send reset password email", 500));
  }
};
const reset = async (req, res, next) => {
  const { resetToken } = req.params;
  const { password } = req.body;

  const forgotpasswordtoken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const user = await User.findOne({
    forgotpasswordtoken,
    forgotpasswordexpiry: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("User not found, please try again", 500));
  }

  user.password = password;
  user.forgotpasswordtoken = undefined;
  user.forgotpasswordexpiry = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
};
const login_with_mobile = async (req, res, next) => {
  try {
    const { number, password } = req.body;

    // Query the user by mobile number
    const user = await User.findOne({ number }).select("+password");

    // If user does not exist, return an error
    if (!user) {
      return next(new AppError("User not found, register again", 401)); // Use 401 Unauthorized instead of 501
    }

    // Compare the password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return next(new AppError("Invalid credentials", 401)); // Handle invalid credentials
    }
    const token = user.generateJWTToken();
    res.cookie("token", token, cookieOption);
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(error.message, 500)); // Internal server error
  }
};

const formatPhoneNumber = (number) => {
  if (!number.startsWith("+")) {
    return `+${number}`;
  }
  return number;
};

const updateUser = async (req, res, next) => {
  const { id } = req.user; // Get the user's ID from the request
  const { firstName, lastName, number, email, interests } = req.body; // Extract the fields to update

  try {
    const user = await User.findById(id);
    if (!user) {
      return next(new AppError("User not found", 404)); // User not found
    }

    if (interests && !Array.isArray(interests)) {
      return next(new AppError("Interests must be an array of strings.", 400));
    }

    if (interests) {
      const invalidInterests = interests.filter(
        (interest) => typeof interest !== "string" || !interest.trim()
      );
      if (invalidInterests.length > 0) {
        return next(
          new AppError("All interests must be non-empty strings.", 400)
        );
      }
    }

    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (number !== undefined) user.number = number;
    if (email !== undefined) user.email = email;
    if (interests !== undefined) user.interests = interests;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully.",
      user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return next(new AppError(error.message || "Error updating user.", 500));
  }
};

const generateOtp = async (req, res, next) => {
  let user; // Declare user outside the try block

  try {
    const { number } = req.body;
    console.log("This is the request coming", req.body);

    // Remove any country code (assuming all numbers are stored without country code in the DB)
    const normalizedNumber = number.startsWith("+")
      ? number.slice(3) // Remove '+91' or other codes
      : number.startsWith("91")
        ? number.slice(2)
        : number;

    user = await User.findOne({ number: normalizedNumber });

    if (!user) {
      return next(new AppError("User not found", 502));
    }

    const otp = user.generateVerifyToken();
    await user.save();

    const formattedNumber = String(number).startsWith("+")
      ? String(number)
      : `+91${number}`; // Assuming all numbers are Indian

    await sendOtpMessage(formattedNumber, otp);

    return res.status(200).json({
      success: true,
      message: "OTP generated and sent successfully",
    });
  } catch (error) {
    if (user) {
      user.otptoken = undefined;
      user.otpexpiry = undefined;
      await user.save();
    }
    console.error(error);
    return next(
      new AppError(
        error.message || "Failed to send OTP. Please try again later.",
        504
      )
    );
  }
};

const login_with_otp = async (req, res, next) => {
  try {
    const { number, otpToken } = req.body;

    // Normalize number
    const normalizedNumber = number.replace(/^(\+91|91)/, "");

    // Find user
    const user = await User.findOne({ number: normalizedNumber });
    if (!user || !user.compareOtp(otpToken)) {
      return next(
        new AppError("Invalid OTP or OTP expired, please try again", 503)
      );
    }

    // Find expert details
    const expert = await ExpertBasics.findOne({ user_id: user._id });

    // Generate User Tokens
    const accessToken = user.generateJWTToken({ expiresIn: "1d" });
    const refreshToken = user.generateJWTToken({ expiresIn: "30d" });

    // Set User Access Token (1 day)
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Set User Refresh Token (30 days)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // If user is an expert, generate Expert Tokens
    if (expert) {
      const expertAccessToken = expert.generateExpertToken({ expiresIn: "7d" });
      const expertRefreshToken = expert.generateExpertToken({
        expiresIn: "30d",
      });

      // Set Expert Access Token (7 days)
      res.cookie("expertToken", expertAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Set Expert Refresh Token (30 days)
      res.cookie("expertRefreshToken", expertRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
    }

    // Send response
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
      expert,
    });
  } catch (error) {
    console.error(error);
    return next(
      new AppError("An error occurred while logging in with OTP.", 500)
    );
  }
};

// Refresh access token using refresh token cookie
const refresh_token = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    const expertRefreshToken = req.cookies?.expertRefreshToken;

    const mask = (t) => (t && typeof t === "string" ? `${t.slice(0, 6)}...${t.slice(-6)}` : "");
    console.log("refresh_token called; cookies keys:", Object.keys(req.cookies || {}));
    console.log("refresh_token: refreshToken=", mask(refreshToken), " expertRefreshToken=", mask(expertRefreshToken));

    if (!refreshToken) {
      console.warn("Refresh token missing; clearing cookies");
      res.clearCookie("refreshToken");
      res.clearCookie("token");
      if (expertRefreshToken) {
        res.clearCookie("expertToken");
        res.clearCookie("expertRefreshToken");
      }
      return res.status(403).json({ success: false, message: "Refresh token missing" });
    }

    // Use environment secrets when available, fallback to legacy hardcoded secrets
    const jwtSecret = process.env.JWT_SECRET || "R5sWL56Li7DgtjNly8CItjADuYJY6926pE9vn823eD0=";
    const expertJwtSecret = process.env.EXPERT_JWT_SECRET || "3qdcBCZzmSE9H39Radno+8AbM6QqI6pTUD0rF7cD0ew=";

    let payload = null;
    try {
      payload = jwt.verify(refreshToken, jwtSecret);
    } catch (verifyErr) {
      console.error("Refresh token verification failed:", verifyErr && verifyErr.message);
      res.clearCookie("refreshToken");
      res.clearCookie("token");
      res.clearCookie("expertToken");
      res.clearCookie("expertRefreshToken");
      return res.status(403).json({ success: false, message: "Invalid or expired refresh token" });
    }

    const userId = payload?.id || payload?._id || payload?.userId;
    if (!userId) {
      console.error("Refresh token payload missing id:", payload);
      res.clearCookie("refreshToken");
      res.clearCookie("token");
      return res.status(403).json({ success: false, message: "Invalid token payload" });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.warn("Refresh token user not found for id", userId);
      res.clearCookie("refreshToken");
      res.clearCookie("token");
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const newAccessToken = user.generateJWTToken({ expiresIn: "1d" });
    res.cookie("token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    let expert = null;
    if (expertRefreshToken) {
      try {
        const expertPayload = jwt.verify(expertRefreshToken, expertJwtSecret);
        const expertId = expertPayload?.id || expertPayload?._id || expertPayload?.expertId;
        if (expertId) {
          expert = await ExpertBasics.findById(expertId);
          if (expert) {
            const newExpertToken = expert.generateExpertToken({ expiresIn: "7d" });
            res.cookie("expertToken", newExpertToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
              maxAge: 7 * 24 * 60 * 60 * 1000,
            });
          } else {
            console.warn("Expert not found for refresh token", expertId);
            res.clearCookie("expertToken");
            res.clearCookie("expertRefreshToken");
          }
        } else {
          console.warn("Expert refresh payload missing id", expertPayload);
          res.clearCookie("expertToken");
          res.clearCookie("expertRefreshToken");
        }
      } catch (expertErr) {
        console.warn("Expert refresh token verification failed:", expertErr && expertErr.message);
        res.clearCookie("expertToken");
        res.clearCookie("expertRefreshToken");
      }
    }

    console.log("Issued new access token for user:", user._id.toString());
    return res.status(200).json({ success: true, message: "Token refreshed", user, expert });
  } catch (error) {
    console.error("Error in refresh_token:", error && error.message);
    return next(new AppError(error.message || "Failed to refresh token", 500));
  }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generate_otp_for_Signup = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    console.log("Request Body:", req.body);

    if (!firstName || !lastName || !email || !password) {
      return next(new AppError("All fields are required", 400));
    }

    // Check if user already exists in User model (form signups)
    const userExists = await User.findOne({ email });

    if (userExists) {
      if (userExists.googleId) {
        return next(
          new AppError("User already exists, login with Google.", 400)
        );
      }
      return next(new AppError("User already exists. Please log in.", 400));
    }

    // For form signups, we allow creating accounts even if Google account exists
    // The Google account and form account will be separate

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpToken = await bcrypt.hash(otp, 10); // Async hashing

    // Store user details and OTP in cookies securely
    res.cookie("otpToken", otpToken, {
      httpOnly: true,
      maxAge: 10 * 60 * 1000, // 10 minutes
      secure: process.env.NODE_ENV === "production", // Only secure in production
      sameSite: "None",
    });

    res.cookie(
      "tempUser",
      JSON.stringify({ firstName, lastName, email, password }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
      }
    );

    // Read and format the email template
    const templatePath = path.join(
      __dirname,
      "./EmailTemplates/verifyaccount.html"
    );
    let emailTemplate = fs.readFileSync(templatePath, "utf8");

    emailTemplate = emailTemplate.replace("{OTP_CODE}", otp);
    emailTemplate = emailTemplate.replace(
      "{USER_NAME}",
      `${firstName} ${lastName}`
    );

    // Send email
    await sendEmail(email, "Your OTP Code", emailTemplate);

    return res.status(200).json({
      success: true,
      message: "OTP sent to email",
    });
  } catch (error) {
    console.error("Error in OTP generation:", error);
    return next(new AppError("Something went wrong. Please try again.", 500));
  }
};
const regenerate_otp = async (req, res, next) => {
  try {
    let tempUser = req.cookies?.tempUser;

    if (!tempUser) {
      return next(
        new AppError("No pending user data found. Please sign up first.", 400)
      );
    }

    // Ensure tempUser is parsed into an object
    try {
      tempUser = JSON.parse(tempUser);
    } catch (err) {
      return next(new AppError("Invalid tempUser data in cookies.", 400));
    }

    const { email } = tempUser;
    const { lastName } = tempUser;
    const { firstName } = tempUser;
    if (!email) {
      return next(new AppError("Email not found. Please sign up again.", 400));
    }

    console.log("Extracted Email:", email); // Debugging log

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpToken = bcrypt.hashSync(otp, 10);

    res.cookie("otpToken", otpToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 10 * 60 * 1000,
    });

    // await sendEmail(email, "Your Regenerated OTP", `Your new OTP is ${otp}`);
    const templatePath = path.join(
      __dirname,
      "./EmailTemplates/verifyaccount.html"
    );
    let emailTemplate = fs.readFileSync(templatePath, "utf8");

    emailTemplate = emailTemplate.replace("{OTP_CODE}", otp);
    emailTemplate = emailTemplate.replace(
      "{USER_NAME}",
      `${firstName} ${lastName}`
    );

    // Send email
    await sendEmail(email, "Your OTP Code", emailTemplate);
    return res.status(200).json({
      success: true,
      message: "A new OTP has been sent to your email.",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const validate_otp_email = async (req, res, next) => {
  try {
    const { otp } = req.body;
    console.log("Received OTP:", otp);
    console.log("Received Cookies:", req.cookies);

    const otpToken = req.cookies.otpToken; // Retrieve the hashed OTP
    const tempUser = req.cookies.tempUser; // Retrieve temporary user details

    if (!otpToken || !tempUser) {
      return next(new AppError("OTP expired or user details missing", 400));
    }

    // Parse tempUser as it's stored as a JSON string
    let userData;
    try {
      userData = JSON.parse(tempUser);
    } catch (error) {
      return next(new AppError("Invalid user data in cookies", 400));
    }

    console.log("Parsed tempUser:", userData);

    // Use `bcrypt.compare()` instead of `compareSync()` (Fixes async issue)
    const isOtpValid = await bcrypt.compare(String(otp), otpToken);

    if (!isOtpValid) {
      return next(new AppError("Invalid OTP", 400));
    }

    // OTP is valid; create the user
    const { firstName, lastName, email, password } = userData;

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    if (!user) {
      return next(new AppError("Failed to register user", 500));
    }

    await user.save();
    console.log("User created successfully:", user);

    // Clear OTP and tempUser cookies
    res.clearCookie("otpToken");
    res.clearCookie("tempUser");

    // ✅ Generate Access & Refresh Tokens
    const accessToken = await user.generateJWTToken({ expiresIn: "1d" });
    const refreshToken = await user.generateJWTToken({ expiresIn: "30d" });

    // ✅ Store Refresh Token in an HTTP-only cookie
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error("Error in OTP validation:", error);
    return next(new AppError(error.message || "Server error", 500));
  }
};

const generate_otp_for_Signup_mobile = async (req, res, next) => {
  try {
    const { firstName, lastName, phoneNumber, password } = req.body;
    console.log("Request Body:", req.body);
    if (!firstName || !lastName || !phoneNumber || !password) {
      return next(new AppError("All fields are required", 400));
    }

    // Extract countryCode and number separately
    const { countryCode, phoneNumber: number } = phoneNumber;
    console.log("Extracted countryCode:", countryCode);
    console.log("Extracted number:", number);

    // Check if user already exists in User model (form signups)
    const userExists = await User.findOne({ number });

    if (userExists) {
      if (userExists.googleId) {
        return next(
          new AppError("User already exists, login with Google.", 400)
        );
      }
      return next(new AppError("User already exists. Please log in.", 400));
    }

    // For form signups, we allow creating accounts even if Google account exists

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpToken = bcrypt.hashSync(otp, 10);

    res.cookie("otpToken", otpToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 10 * 60 * 1000,
    });
    res.cookie(
      "tempUser",
      { firstName, lastName, countryCode, number, password },
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
      }
    );

    const formattedNumber = String(number).startsWith("+")
      ? String(number)
      : `+91${number}`;

    await sendOtpMessage(formattedNumber, otp);

    return res.status(200).json({
      success: true,
      message: `OTP sent to ${number}`,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const validate_otp_mobile = async (req, res, next) => {
  const { otp } = req.body;
  const otpToken = req.cookies.otpToken; // Retrieve the hashed OTP
  const tempUser = req.cookies.tempUser; // Retrieve temporary user details

  if (!otpToken || !tempUser) {
    return next(new AppError("OTP expired or user details missing", 400));
  }

  try {
    // Validate OTP
    const isOtpValid = bcrypt.compareSync(otp, otpToken);
    if (!isOtpValid) {
      return next(new AppError("Invalid OTP", 400));
    }

    // Parse tempUser JSON
    let userData;
    try {
      userData = JSON.parse(tempUser);
    } catch (error) {
      return next(new AppError("Invalid user data in cookies", 400));
    }

    // OTP is valid; create the user
    const { firstName, lastName, number, password, countryCode } = userData;

    const user = await User.create({
      firstName,
      lastName,
      countryCode, // Save country code
      number,
      password, // Save hashed password
    });

    if (!user) {
      return next(new AppError("Failed to register user", 500));
    }

    await user.save();
    res.clearCookie("otpToken");
    res.clearCookie("tempUser");

    // ✅ Generate Access & Refresh Tokens
    const accessToken = await user.generateJWTToken({ expiresIn: "1d" });
    const refreshToken = await user.generateJWTToken({ expiresIn: "30d" });

    // ✅ Store Refresh Token in an HTTP-only cookie
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return next(new AppError(error.message, 500));
  }
};

const generate_otp_with_email = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("User not found", 500));
  }

  // Extract user details
  const { firstName, lastName } = user;

  // Generate OTP and save it to the user document
  const otp = user.generateVerifyToken(); // Generates OTP
  await user.save();

  const subject = "Verify Your Email - Advizy";

  // Read the email template file
  const templatePath = path.join(
    __dirname,
    "./EmailTemplates/verifyaccount.html"
  );
  let emailTemplate = fs.readFileSync(templatePath, "utf8");

  // Replace placeholders with dynamic values
  emailTemplate = emailTemplate.replace("{OTP_CODE}", otp);
  emailTemplate = emailTemplate.replace(
    "{{USER_NAME}}",
    `${firstName} ${lastName}`
  );

  try {
    await sendEmail(email, subject, emailTemplate);

    // Store email in an HTTP-only cookie for temporary use
    res.cookie("email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 5 * 60 * 1000, // 5 minutes expiry
    });

    res.status(200).json({
      success: true,
      message: `Verification OTP has been sent to ${email}`,
    });
  } catch (error) {
    // Clean up OTP fields in case of email failure
    user.otptoken = undefined;
    user.otpexpiry = undefined;
    await user.save();

    return next(new AppError("Failed to send verification OTP email", 500));
  }
};

const forgot_with_otp_email = async (req, res, next) => {
  const { otp } = req.body;

  try {
    const email = req.cookies.email;
    if (!email) {
      return next(new AppError("Email not found in cookies", 400));
    }

    const user = await User.findOne({ email });
    if (!user || !user.compareOtp(otp)) {
      return next(new AppError("User not registered or OTP invalid", 511));
    }

    const resetToken = user.generatePasswordResetToken();
    await user.save();

    const cookieOption = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 15 * 60 * 1000,
    };
    res.cookie("resettoken", resetToken, cookieOption);

    return res.status(200).json({
      success: true,
      message: "OTP verified, redirecting to reset password page",
      redirectUrl: `/reset-password/${resetToken}`,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(error.message, 500));
  }
};

const reset_password = async (req, res, next) => {
  const { resettoken } = req.cookies;
  const { password } = req.body;

  if (!resettoken) {
    return next(new AppError("Invalid or expired token", 400));
  }

  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(resettoken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return next(new AppError("Invalid or expired token", 400));
    }

    // if (password.length < 8) {
    //     return next(new AppError("Password must be at least 8 characters long", 400));
    // }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.clearCookie("resettoken");

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const generate_otp_with_mobile = async (res, req, next) => {
  try {
    const { number } = req.body;
    const user = await User.findOne({ number });
    if (!user) {
      return next(new AppError("user not found", 500));
    }
    await user.generateVerifyToken();
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Otp sent to mobile",
    });
  } catch (error) {
    if (user) {
      user.otptoken = undefined;
      user.otpexpiry = undefined;
      await user.save();
    }
    return next(new AppError(error.message, 500));
  }
};
const forgot_with_otp_mobile = async (res, req, next) => {
  const { number, otptoken } = req.user;
};

const validateToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, valid: false, message: 'Token not found' });
    }
    jwt.verify(
      token,
      "R5sWL56Li7DgtjNly8CItjADuYJY6926pE9vn823eD0=",
      (err, decoded) => {
        if (err) {
          return res.status(401).json({ success: false, valid: false, message: 'Invalid or expired token' });
        }
        return res.json({ success: true, valid: true, userId: decoded.userId, role: decoded.role });
      }
    );
  } catch (e) {
    next(e);
  }
};

// const addFavouriteExpert = async (req, res) => {
//   try {
//     const { expertId } = req.body;
//     if (!expertId) {
//       return res.status(400).json({ success: false, message: "expertId is required" });
//     }

//     // Fetch user WITHOUT populate first
//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     // Validate expert exists
//     const expert = await ExpertBasics.findById(expertId);
//     if (!expert) {
//       return res.status(404).json({ success: false, message: "Expert not found" });
//     }

//     // Normalize favourites array to ObjectId strings only
//     user.favourites = user.favourites.map(id => id.toString());

//     const isAlready = user.favourites.some(id => id === expertId);
//     let action;

//     if (isAlready) {
//       user.favourites = user.favourites.filter(id => id !== expertId);
//       action = "removed";
//     } else {
//       user.favourites.push(expertId);
//       action = "added";
//     }

//     await user.save();

//     // Re-fetch populated for response
//     const populatedUser = await User.findById(req.user.id).populate("favourites");

//     return res.status(200).json({
//       success: true,
//       message: `Expert ${action} to favourites`,
//       action,
//       favourites: populatedUser.favourites.map(exp => exp._id),
//       user: populatedUser
//     });
//   } catch (error) {
//     console.log("Error updating favourites:", error);
//     return res.status(500).json({ success: false, message: "Server error", error: error.message });
//   }
// };

const normalizeToObjectIds = (arr = []) => {
  return arr
    .filter(v => v !== null && v !== undefined)
    .map(v => {
      if (typeof v === "string") {
        if (mongoose.Types.ObjectId.isValid(v)) return new mongoose.Types.ObjectId(v);
      } else if (v instanceof mongoose.Types.ObjectId) {
        return v;
      }
      // Fallback: try toString then cast
      const asStr = v?.toString?.();
      if (asStr && mongoose.Types.ObjectId.isValid(asStr)) {
        return new mongoose.Types.ObjectId(asStr);
      }
      return null;
    })
    .filter(Boolean);
};

const toggleFavouriteExpert = async (req, res) => {
  try {
    let { expertId } = req.body;
    if (!expertId) {
      return res.status(400).json({ success: false, message: "expertId is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(expertId)) {
      return res.status(400).json({ success: false, message: "Invalid expertId" });
    }
    const expertObjId = new mongoose.Types.ObjectId(expertId);

    const expertExists = await ExpertBasics.exists({ _id: expertObjId });
    if (!expertExists) {
      return res.status(404).json({ success: false, message: "Expert not found" });
    }

    // Load user raw
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Normalize current favourites
    let favourites = normalizeToObjectIds(user.favourites || []);

    const already = favourites.some(f => f.equals(expertObjId));
    let action;
    if (already) {
      favourites = favourites.filter(f => !f.equals(expertObjId));
      action = "removed";
    } else {
      favourites.push(expertObjId);
      action = "added";
    }

    // De-duplicate just in case
    const seen = new Set();
    favourites = favourites.filter(f => {
      const key = f.toString();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    user.favourites = favourites;
    await user.save();

    // Populate (optional, keep lightweight)
    const populated = await User.findById(user._id)
      .populate({
        path: "favourites",
        select: "firstName lastName credentials profileImage redirect_url" // keep narrow
      })
      .lean();

    const favEntities = (populated?.favourites || []).filter(e => e && e._id);
    const favouriteIds = favEntities.map(e => e._id.toString());

    return res.status(200).json({
      success: true,
      action,
      favourites: favouriteIds,
      favouritesPopulated: favEntities
    });
  } catch (e) {
    console.error("toggleFavouriteExpert error:", e);
    return res.status(500).json({ success: false, message: "Server error", error: e.message });
  }
};

const getFavourites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favourites");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const uniqueMap = new Map();
    (user.favourites || []).forEach(e => {
      if (e?._id) uniqueMap.set(e._id.toString(), e);
    });
    const entities = Array.from(uniqueMap.values());
    return res.status(200).json({
      success: true,
      favourites: entities,
      favouriteIds: entities.map(e => e._id)
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: "Server error", error: e.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favourites");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.status(200).json({ success: true, user });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

// Ensure these are exported
export {
  refresh_token,
  register_with_email,
  register_with_mobile,
  login,
  logout,
  myprofile,
  forgot,
  reset,
  handleGoogleCallback,
  googleAuth,
  googleCallback,
  setPassword,
  login_with_mobile,
  login_with_otp,
  generateOtp,
  forgot_with_otp_email,
  generate_otp_with_email,
  reset_password,
  generate_otp_with_mobile,
  forgot_with_otp_mobile,
  generate_otp_for_Signup_mobile,
  validate_otp_mobile,
  validate_otp_email,
  generate_otp_for_Signup,
  regenerate_otp,
  updateUser,
  validateToken,
  // addFavouriteExpert,
  toggleFavouriteExpert,
  getFavourites,
  getUserProfile, // add this back
};
