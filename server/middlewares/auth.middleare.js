import AppError from "../utils/AppError.js";
import jwt from "jsonwebtoken";

const isLoggedIn = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    // const { token } = localStorage.getItem("token");

    if (!token) {
      return next(new AppError("User not Authorized", 402));
    }

    const userDetails = await jwt.verify(
      token,
      "R5sWL56Li7DgtjNly8CItjADuYJY6926pE9vn823eD0="
    );

    req.user = userDetails;
    console.log("This is req.user", req.user);
    next();
  } catch (error) {
    return next(new AppError("Invalid or expired User token.", 403));
  }
};

const isExpert = (req, res, next) => {
  try {
    const { expertToken } = req.cookies;

    if (!expertToken) {
      console.log("Expert token missing in cookies.");
      return next(new AppError("Expert access token is missing.", 405));
    }

    const expertDetails = jwt.verify(
      expertToken,
      "3qdcBCZzmSE9H39Radno+8AbM6QqI6pTUD0rF7cD0ew="
    );

    console.log("Expert token verified successfully:", expertDetails);
    req.expert = expertDetails;
    next();
  } catch (error) {
    console.error("Error verifying expert token:", error);
    return next(new AppError("Invalid or expired expert token.", 408));
  }
};

const isMeeting = async (req, res, next) => {
  try {
    // Log all cookies to check for the meeting token
    console.log("Cookies received:", req.cookies);

    const { meetingToken } = req.cookies;
    if (!meetingToken) {
      console.log("Meeting token is missing from cookies.");
      return next(new AppError("Meeting token is missing.", 403));
    }

    console.log("Meeting token found:", meetingToken); // Log the token

    const meetingDetails = jwt.verify(
      meetingToken,
      "sVu4ObGbmS3krUCfW+1wJRzNGnt1LtMy6+oWtO/DJmQ="
    );

    console.log("Meeting token verified successfully:", meetingDetails);

    // If the token is valid, attach it to the request object
    req.meeting = meetingDetails;
    next();
  } catch (error) {
    console.error("Error during meeting token verification:", error.message); // Log error message for debugging
    return next(new AppError("Invalid or expired meeting token.", 403));
  }
};

export { isLoggedIn, isExpert, isMeeting };
