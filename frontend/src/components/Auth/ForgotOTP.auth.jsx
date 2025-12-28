import React, { useState } from "react";
import ResetPassword from "./ResetPassword.auth";
import { IoIosClose } from "react-icons/io";
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
      // console.log("OTP Verified:", response.payload.message);
    } else {
      setVerified(false);
      console.error("OTP Verification Failed:", response.payload?.message);
    }
  }

  const handleContinue = () => {
    // console.log("Submitting OTP:", otp);
    onSwitchView("ResetPassword"); // Proceed to Reset Password
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
      <div className="relative w-[420px] bg-white rounded-[12px] shadow-lg p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4"
        >
          <IoIosClose className="hover:cursor-pointer hover:bg-gray-100 rounded-full hover:shadow-md text-black hover:text-black text-4xl font-bold" />
        </button>

        {/* Header Section */}
        <div className="mb-8 flex flex-col items-center">
          <h2 className="text-2xl tracking-normal font-semibold text-[#1d1d1d] text-center mb-3">
            Enter OTP
          </h2>
          <p className="text-base mt-2 w-fit text-[#169544] bg-green-50 rounded-lg text-center">
            We've sent a verification code to your email
          </p>
        </div>

        {/* OTP Input */}
        <div className="w-full flex flex-col items-center mb-8">
          <OTPInput count={6} onOTPComplete={handleOtpChange} />
        </div>

        {/* Continue Button */}
        <div className="space-y-4">
          <button
            onClick={handleContinue}
            disabled={!verified}
            className={`w-full h-12 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 ${verified
                ? "bg-[#169544] hover:bg-green-700"
                : "bg-[#169544] cursor-not-allowed"
              }`}
          >
            Verify OTP
          </button>

          {/* Resend Link */}
          <div className="space-y-2">
            <div className=" mt-2 flex justify-center gap-1 text-sm">
              <span className="text-gray-600">Didn't receive the code?</span>
              <button className="text-[#169544] hover:underline hover:font-semibold font-medium">Resend</button>
            </div>

            {/* Login Link */}
            <div className="text-sm text-gray-500 text-center ">
              <span>Remember your password? </span>
              <button
                className="text-[#169544] font-medium hover:font-semibold"
                onClick={() => onSwitchView("LoginWithEmail")}
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotOTP;
