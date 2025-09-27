import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { forgotPassword } from "../../Redux/Slices/authSlice";
import ForgotOTP from "./ForgotOTP.auth";
import LoginWithEmail from "./LoginWithEmail.auth";
import PhoneNumberValidation from "@/utils/PhoneNumberValidation/PhoneNumberValidation.util";

function ForgotPassword({ onClose, onSwitchView }) {
  const [inputType, setInputType] = useState("email");
  const [email, setEmail] = useState("");
  const [phoneData, setPhoneData] = useState({
    countryCode: "",
    phoneNumber: "",
  });
  const [isValid, setIsValid] = useState(false);
  const dispatch = useDispatch();

  function handleEmailChange(event) {
    const value = event.target.value;
    setEmail(value);
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    setIsValid(emailRegex.test(value));
  }

  function handlePhoneNumberChange(phoneNumber, isValid, countryData) {
    if (phoneNumber && countryData) {
      const countryCode = `+${countryData.dialCode}`;
      const rawPhoneNumber = phoneNumber
        .replace(`${countryData.dialCode}`, "")
        .trim();

      setPhoneData({
        countryCode,
        phoneNumber: rawPhoneNumber,
      });
      setIsValid(isValid);
    } else {
      setPhoneData({
        countryCode: "",
        phoneNumber: "",
      });
      setIsValid(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (inputType === "email" && !email) {
      toast.error("Email is required.");
      return;
    }

    if (
      inputType === "mobile" &&
      (!phoneData.countryCode || !phoneData.phoneNumber)
    ) {
      toast.error("Phone number is required.");
      return;
    }

    const response = await dispatch(
      forgotPassword(inputType === "email" ? email : phoneData)
    );

    if (response?.payload?.success) {
      setEmail("");
      setPhoneData({ countryCode: "", phoneNumber: "" });
      setIsValid(false);
      onSwitchView("ForgotOTP");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm px-4 py-8 overflow-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 md:p-10 overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-gray-700 hover:text-black text-3xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-3xl font-semibold text-center text-gray-900 mb-3">
          Forgot Password
        </h2>

        <p className="text-base text-gray-600 text-center max-w-md mx-auto mb-10">
          Enter your email address and we’ll send you an OTP to reset your password.
        </p>

        {/* Email or Phone Input */}
        <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto">
          {inputType === "email" ? (
            <div className="mb-5">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#169544]"
                required
              />
              {!isValid && email && (
                <p className="text-sm text-red-600 mt-1">Please enter a valid email.</p>
              )}
            </div>
          ) : (
            <div className="mb-5">
              <PhoneNumberValidation
                onValidNumber={handlePhoneNumberChange}
                value={phoneData.phoneNumber}
              />
              {/* Add phone validation warning here if needed */}
            </div>
          )}

          <button
            type="submit"
            className={`w-full py-2 mt-4 rounded-lg text-white text-base font-medium ${isValid ? "bg-[#169544] hover:bg-green-700 transition-colors" : "bg-gray-300 cursor-not-allowed"
              }`}
            disabled={!isValid}
          >
            Send OTP
          </button>
        </form>

        <div className="mt-10 text-sm text-center text-gray-600">
          <span>Remember your password? </span>
          <button
            className="text-[#169544] font-medium underline hover:text-green-700"
            onClick={() => onSwitchView("LoginWithEmail")}
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
