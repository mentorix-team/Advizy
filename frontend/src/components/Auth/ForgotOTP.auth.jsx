import React, { useState } from "react";
import ResetPassword from "./ResetPassword.auth";
import { useDispatch } from "react-redux";
import { forgotOTP } from "../../Redux/Slices/authSlice";
import OTPInput from "@/utils/otpInput/OtpInput.util";

const ForgotOTP = ({ onClose, onSwitchView }) => {
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const dispatch = useDispatch();

  async function handleOtpChange(otpValue) {
    setOtp(otpValue);

    if (!otpValue || otpValue.length !== 6) {
      console.error("Invalid OTP length");
      return;
    }

    const response = await dispatch(forgotOTP(otpValue)); // Send otpValue as the payload
    if (response?.payload?.success) {
      setVerified(true); // OTP verified successfully
      console.log("OTP Verified:", response.payload.message);
    } else {
      setVerified(false);
      console.error("OTP Verification Failed:", response.payload?.message);
    }
  }

  const handleContinue = () => {
    console.log("Submitting OTP:", otp);
    onSwitchView("ResetPassword"); // Proceed to Reset Password
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
      <div className="relative w-[820px] h-[400px] bg-white rounded-[12px] shadow-lg flex flex-col items-center justify-center p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
          Enter OTP
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-600 text-center max-w-[360px] mb-8">
          We've sent a verification code to your email
        </p>

        {/* OTP Input */}
        <div className="w-full flex flex-col items-center">
          <OTPInput count={6} onOTPComplete={handleOtpChange} />
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!verified} // Button enabled only if OTP is verified
          className={`w-80 h-12 mt-8 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 ${
            verified
              ? "bg-[#169544] hover:bg-green-700"
              : "bg-[#169544] cursor-not-allowed"
          }`}
        >
          Verify OTP
        </button>

        <div className="flex gap-1 text-sm mt-2">
          <span className="text-gray-600">Didn't receive the code?</span>
          <button className="text-[#169544] hover:underline">Resend</button>
        </div>

        {/* Login Link */}
        <div className="text-sm text-gray-500 text-center mt-5">
          <span>Remember your password? </span>
          <button
            className="text-[#169544] underline"
            onClick={() => onSwitchView("LoginWithEmail")}
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotOTP;
