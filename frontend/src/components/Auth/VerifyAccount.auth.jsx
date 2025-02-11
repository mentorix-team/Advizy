import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { regenerateOtpEmail, validateOtpEmail } from "../../Redux/Slices/authSlice";
import toast from "react-hot-toast";
import OTPInput from "@/utils/otpInput/OtpInput.util";

const VerifyAccount = ({ onClose, onSwitchView, contactInfo }) => {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for handling button state
  const [isResending, setIsResending] = useState(false)
  const dispatch = useDispatch();

  const handleOtpChange = (otpValue) => {
    setOtp(otpValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log("Submitted OTP:", otp);
  
    if (otp.length !== 6) {
      toast.error("Please enter a 6-digit OTP.");
      return;
    }
  
    setIsSubmitting(true); // Disable the button to prevent multiple submissions
  
    const response = await dispatch(validateOtpEmail( {otp} ));
  
    setIsSubmitting(false); // Re-enable the button after processing
  
    if (response?.payload?.success) {
      toast.success("OTP validated successfully!");
      onSwitchView("NextStep");
    } else {
      toast.error(response?.payload?.message || "Invalid or expired OTP.");
    }
  };
  

  const handleResendOTP = async () => {
    setIsResending(true); // Disable the button to prevent multiple clicks

    const response = await dispatch(regenerateOtpEmail(contactInfo));

    setIsResending(false); // Re-enable the button after processing

    if (response?.payload?.success) {
      toast.success("OTP resent successfully!");
    } else {
      toast.error(response?.payload?.message || "Failed to resend OTP.");
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md"
      aria-labelledby="verify-account-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-[820px] h-[400px] bg-white rounded-[15px] shadow-lg flex flex-col items-center justify-center p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl font-bold"
          aria-label="Close verification popup"
        >
          &times;
        </button>

        <h2
          id="verify-account-title"
          className="text-2xl font-semibold text-gray-900 mb-4 text-center"
        >
          Verify Your Account
        </h2>

        <p className="text-sm text-gray-600 text-center max-w-[360px] mb-8">
          We’ve sent a One Time Password (OTP) to the{" "}
          <span className="font-medium">{contactInfo}</span>. Please enter it to
          complete verification.
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          <OTPInput count={6} onOTPComplete={handleOtpChange} />

          <button
            type="submit"
            className={`w-80 h-12 mt-8 bg-[#169544] text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-700 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Validating..." : "Continue"}
          </button>
        </form>

        <button
          onClick={handleResendOTP}
          type="button"
          className="text-xs text-[#169544] mt-4 underline"
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
};

export default VerifyAccount;
