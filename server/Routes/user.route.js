import { Router } from "express";
import {
  forgot,
  forgot_with_otp_email,
  forgot_with_otp_mobile,
  generate_otp_with_email,
  googleAuth,
  googleCallback,
  handleGoogleCallback,
  login,
  login_with_otp,
  logout,
  myprofile,
  refresh_token,
  regenerate_otp,
  register_with_email,
  register_with_mobile,
  reset,
  reset_password,
  setPassword,
  updateUser,
  validateToken,
  validate_otp_email,
  validate_otp_mobile,
  getFavourites,
  // addFavouriteExpert,
  toggleFavouriteExpert,
  getUserProfile,
  generate_otp_for_Signup_mobile,
  generate_otp_with_mobile,
  generate_otp_for_Signup,
  generateOtp,
  login_with_mobile,
} from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { isLoggedIn } from "../middlewares/auth.middleare.js";

const router = Router();

router.post(
  "/register_with_email",
  upload.single("avatar"),
  register_with_email
);
router.post(
  "/register_with_mobile",
  upload.single("avatar"),
  register_with_mobile
);
router.post("/login", login);
router.put("/update", isLoggedIn, updateUser);
router.post("/login_with_mobile", login_with_mobile);
router.post("/generate_otp", generateOtp); // one
router.post("/login_with_otp", login_with_otp);
router.post("/forgot_with_otp_email", forgot_with_otp_email);
router.post("/generate_otp_with_email", generate_otp_with_email); // two
router.post("/generate_otp_for_Signup", generate_otp_for_Signup);
router.post("/regenerate_otp", regenerate_otp);
router.post("/validate_otp_email", validate_otp_email);
router.post("/reset_pass", reset_password);
router.post("/forgot_with_otp_mobile", forgot_with_otp_mobile);
router.post("/generate_otp_with_mobile", generate_otp_with_mobile);
router.get("/logout", logout);
router.get("/me", myprofile);
router.post("/forgot/password", forgot);
router.post("/reset-password/:resetToken", reset);
router.get("/auth/google", googleAuth);
router.get("/auth/google/callback", googleCallback, handleGoogleCallback);
router.post("/setPassword", setPassword);

router.post("/signup_using_otp_mobile", generate_otp_for_Signup_mobile);
router.post("/validate_otp_mobile", validate_otp_mobile);
router.get("/validate_token", validateToken);

router.post("/refresh-token", refresh_token);

router.get('/favourites', isLoggedIn, getFavourites);
// router.post("/favourites", isLoggedIn, addFavouriteExpert);
router.get("/favprofile", isLoggedIn, getUserProfile);
router.post("/favourites", isLoggedIn, toggleFavouriteExpert);
// router.delete('/favourites/:expertId', isLoggedIn, removeFavouriteExpert)

router.get("/profile", isLoggedIn, getUserProfile);

export default router;
