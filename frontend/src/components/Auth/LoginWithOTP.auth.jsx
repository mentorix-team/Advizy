import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { generateOtp, loginWithOtp } from "../../Redux/Slices/authSlice";
import SignupWithEmail from './SignupWithEmail.auth'
import LoginWithMobile from "./LoginWithMobile.auth";
import PhoneNumberValidation from "../../utils/PhoneNumberValidation/PhoneNumberValidation.util";
import OTPInput from "../../utils/otpInput/OtpInput.util";

const LoginWithOTP = ({ onClose, onSwitchView }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileData, setMobileData] = useState({ number: "" });
  const [otpSent, setOtpSent] = useState(false);
  const [validNumber, setValidNumber] = useState(false);
  const [timer, setTimer] = useState(60);
  const [resendVisible, setResendVisible] = useState(false);

  // Handle phone number validation
  const handleValidPhoneNumber = (number, isValid) => {
    setMobileData({ number });
    setValidNumber(isValid);
  };

  // Handle OTP generation
  async function handleGenerateOtp(event) {
    event.preventDefault();
    if (!validNumber) {
      toast.error("Please enter a valid mobile number", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    const response = await dispatch(generateOtp(mobileData));
    if (response?.payload?.success) {
      setOtpSent(true);
      setTimer(60); // 
      setResendVisible(false);
    } else {
      toast.error("Failed to send OTP. Please try again.");
    }
  }

  // Timer logic
  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setResendVisible(true);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  // Handle OTP login
  async function handleOtpLogin(event) {
    event.preventDefault();
    const otpToken = mobileData.otp; // Assuming OTP is saved in mobileData

    if (!otpToken || !mobileData.number) {
      toast.error("OTP and mobile number are required");
      return;
    }

    const response = await dispatch(
      loginWithOtp({ number: mobileData.number,otpToken})
    );
    
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="relative w-[820px] h-[620px] bg-white rounded-[20px] shadow-lg p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-8 text-black hover:text-black text-3xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
          {otpSent ? "Enter OTP" : "Log In"}
        </h2>

        {/* Sign Up Link */}
        <div className="text-sm text-gray-500 text-right mb-6">
          <span>Don't have an account? </span>
          <button
            className="text-black hover:underline"
            onClick={() => onSwitchView("SignupWithEmail")}
          >
            Sign Up
          </button>
        </div>

        {/* Form Fields */}
        <form
          onSubmit={otpSent ? handleOtpLogin : handleGenerateOtp}
          className="w-80 max-w-md mx-auto"
        >
          {!otpSent && (
            <div className="mb-4">
              {/* <label className="block text-gray-700 text-sm font-medium mb-1">
                Mobile Number*
              </label>
              <input
                type="text"
                name="number"
                placeholder="Enter your mobile number"
                value={mobileData.number}
                onChange={handleInputChange}
                className="w-full h-10 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
              /> */}
              {!otpSent && (
                <div className="mb-4">
                  <PhoneNumberValidation
                    onValidNumber={handleValidPhoneNumber}
                    value={mobileData.number}
                  />
                </div>
              )}
            </div>
          )}

          {otpSent && (
            <>
              <div className="mb-4">
                <OTPInput
                  count={6}
                  onOTPComplete={(otp) => setMobileData({ ...mobileData, otp })}
                />
              </div>

              <p className="text-sm text-gray-600 text-center">
                {resendVisible ? (
                  <button
                    type="button"
                    className="text-black underline"
                    onClick={handleGenerateOtp}
                  >
                    Resend OTP
                  </button>
                ) : (
                  `Resend OTP in ${timer}s`
                )}
              </p>
            </>
          )}

          <button
            type="submit"
            className={`w-80 py-2 rounded-lg text-white ${
              validNumber
                ? "bg-black hover:bg-gray-800"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!validNumber}
          >
            Send OTP
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-4 text-gray-500">Or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Alternative Login Options */}
          <button
            className="w-full h-10 flex items-center justify-center gap-2 py-2 mb-4 border border-gray-300 rounded-lg text-black hover:bg-gray-100 transition-colors"
            onClick={() => onSwitchView("LoginWithMobile")}
          >
            <img
              src="https://img.icons8.com/fluency-systems-regular/50/google-pixel6.png"
              alt="Mobile Icon"
              className="w-6 h-6"
            />
            Login with Mobile Number
          </button>

          <button className="w-full h-10 flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-100 transition-colors">
            <img
              src="https://img.icons8.com/color/24/000000/google-logo.png"
              alt="Google Logo"
              className="w-6 h-6"
            />
            Login with Google
          </button>
        </form>

        {/* Policy Text */}
        <p className="text-xs sm:text-sm px-4 sm:px-6 text-gray-500 text-center mt-4 sm:mt-6">
  By joining, you agree to the Advizy Terms of Service and to
  occasionally receive emails from us. Please read our Privacy Policy to
  learn how we use your personal data.
        </p>
      </div>
    </div>
  );
};

export default LoginWithOTP;
