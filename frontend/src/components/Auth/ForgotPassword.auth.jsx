import { useState, useEffect } from "react";
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
      const countryCode = `+${countryData.dialCode}`; // Get dynamic country code
      const rawPhoneNumber = phoneNumber
        .replace(`${countryData.dialCode}`, "")
        .trim(); // Remove country code from number

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

    // Log the formatted output
    console.log(inputType === "email" ? email : phoneData);

    if (response?.payload?.success) {
      setEmail("");
      setPhoneData({
        countryCode: "",
        phoneNumber: "",
      });
      setIsValid(false);
      onSwitchView("ForgotOTP");
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
      <div className="relative w-[820px] h-[400px] bg-white rounded-[15px] shadow-lg p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-8 text-black hover:text-black text-3xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-2xl mb-4 font-semibold text-gray-900 text-center">
          Forgot Password
        </h2>

        <div className="w-full flex flex-col items-center">
          <p className="text-sm text-gray-600 text-center mb-8 max-w-sm">
            Enter your email address or mobile number and we'll send you a OTP
            to reset your password
          </p>
        </div>

        <div className="flex justify-center gap-3 mb-6">
          <button
            onClick={() => setInputType("email")}
            className={`py-2 px-8 rounded-md text-sm font-medium ${
              inputType === "email" ? "bg-[#169544] text-white" : "bg-gray-200"
            }`}
          >
            Email
          </button>
          <button
            onClick={() => setInputType("mobile")}
            className={`py-2 px-8 rounded-md text-sm font-medium ${
              inputType === "mobile" ? "bg-[#169544] text-white" : "bg-gray-200"
            }`}
          >
            Mobile
          </button>
        </div>

        <form onSubmit={handleSubmit} className="w-80 max-w-md mx-auto">
          {inputType === "email" ? (
            <div className="mb-6">
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
              {!isValid && email && (
                <p className="text-sm text-red-600">
                  Please enter a valid email.
                </p>
              )}
            </div>
          ) : (
            <div className="mb-6">
              <PhoneNumberValidation
                onValidNumber={(phoneNumber, isValid, countryData) =>
                  handlePhoneNumberChange(phoneNumber, isValid, countryData)
                }
                value={phoneData.phoneNumber}
              />
              {/* {!isValid && phoneData.phoneNumber && (
                <p className="text-sm text-red-600">
                  Please enter a valid phone number.
                </p>
              )} */}
            </div>
          )}

          <button
            type="submit"
            className={`w-full bg-[#169544] text-white py-2 rounded-lg ${
              isValid
                ? "hover:bg-green-700 transition-colors"
                : " cursor-not-allowed"
            }`}
            disabled={!isValid}
          >
            Send OTP
          </button>
        </form>

        <div className="text-sm m-32 text-gray-500 text-center mt-3">
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
}

export default ForgotPassword;
