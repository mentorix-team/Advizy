import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { generateOtp, loginWithOtp } from "../../Redux/Slices/authSlice";
import SignupWithEmail from "./SignupWithEmail.auth";
import LoginWithEmail from "./LoginWithEmail.auth";
import PhoneNumberValidation from "@/utils/PhoneNumberValidation/PhoneNumberValidation.util";
import OTPInput from "@/utils/otpInput/OtpInput.util";

const LoginWithOTP = ({ onClose, onSwitchView }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileData, setMobileData] = useState({ number: "", countryCode: "" });
  const [otpSent, setOtpSent] = useState(false);
  const [validNumber, setValidNumber] = useState(false);
  const [timer, setTimer] = useState(60);
  const [resendVisible, setResendVisible] = useState(false);

  // Handle phone number validation
  const handleValidPhoneNumber = (number, isValid, countryData) => {
    const countryCode = `+${countryData.dialCode}`; // Ensure we have the correct country code
    const rawPhoneNumber = number.replace(`${countryData.dialCode}`, "").trim(); // Remove country code from the number

    setMobileData({
      number: rawPhoneNumber,
      countryCode: countryCode,
    });
    setValidNumber(isValid);
  };

  // Handle OTP generation
  async function handleGenerateOtp(event) {
    event.preventDefault();
    if (!validNumber) {
      toast.error("Please enter a valid mobile number");
      return;
    }

    const response = await dispatch(generateOtp(mobileData));
    if (response?.payload?.success) {
      setOtpSent(true);
      setTimer(60); // Reset timer
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
    const handleGoogleSignup = () => {
      window.open("https://advizy.onrender.com/api/v1/user/auth/google", "_self");
    };
  
    const response = await dispatch(
      loginWithOtp({ otpToken, number: mobileData.number })
    );
    if (response?.payload?.success) {
      navigate("/");
    } else {
      toast.error("Invalid OTP. Please try again.");
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
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
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Mobile Number*
              </label>
              <PhoneNumberValidation
                onValidNumber={handleValidPhoneNumber}
                value={mobileData.number}
              />
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
            className={`w-full py-2 rounded-lg text-white ${
              validNumber
                ? "bg-[#169544] hover:bg-green-700"
                : "bg-[#169544] cursor-not-allowed"
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
          <div className="flex flex-col gap-4">
            <button className="w-full h-10 flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-100 transition-colors" onClick={handleGoogleSignup}> 
              <img
                src="https://img.icons8.com/color/24/000000/google-logo.png"
                alt="Google Logo"
                className="w-6 h-6"
              />
              Login with Google
            </button>
            <button
              className="w-full h-10 flex items-center justify-center gap-2 py-2 mb-4 border border-gray-300 rounded-lg text-black hover:bg-gray-100 transition-colors"
              onClick={() => onSwitchView("LoginWithEmail")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
              >
                <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z" />
              </svg>
              Login with Email
            </button>
          </div>
        </form>

        {/* Policy Text */}
        <p className="text-xs m-32 text-gray-500 text-center mt-28">
          By joining, you agree to the Mentorix Terms of Service and to
          occasionally receive emails from us. Please read our Privacy Policy to
          learn how we use your personal data.
        </p>
      </div>
    </div>
  );
};

export default LoginWithOTP;
