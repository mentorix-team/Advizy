import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { forgotPassword } from "../../Redux/Slices/authSlice";
import { IoIosClose } from "react-icons/io";
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
  const [touched, setTouched] = useState(false);
  const dispatch = useDispatch();

  function handleEmailChange(event) {
    const value = event.target.value;
    setEmail(value);
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    setIsValid(emailRegex.test(value));
  }

  function handleEmailBlur() {
    setTouched(true);
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
    <div className="fixed inset-0 z-50 flex items-center justify-evenly bg-black bg-opacity-50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-[420px] bg-white rounded-2xl shadow-xl p-8 md:p-10 overflow-y-auto max-h-[90vh]">
        <div className="flex flex-col items-center mb-4">
          <button
            onClick={onClose}
            aria-label="Close"
          >
            <IoIosClose
            className="hover:cursor-pointer hover:bg-gray-100 rounded-full hover:shadow-md absolute top-4 right-4 text-black hover:text-black text-4xl font-bold  " />
          </button>

          <h2 className="text-3xl mb-3 font-bold tracking-tight text-center text-gray-900">
            Forgot Password
          </h2>

          <p className="text-sm leading-tight text-gray-700 text-center max-w-md px-8 mx-auto mb-2">
            Enter your email address and we’ll send you an OTP to reset your password.
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto mb-8">
          {inputType === "email" ? (
            <div className="mb-6">
              <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                Email Address{touched && !isValid && <span className="text-red-500">*</span>}
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 ${
                  touched && !isValid
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                required
              />
              {/* {touched && !isValid && (
                <p className="text-sm mt-2 text-red-600">
                  {email ? "Please enter a valid email." : "Email is required."}
                </p>
              )} */}
            </div>
          ) : (
            <div className="mb-6">
              <PhoneNumberValidation
                onValidNumber={handlePhoneNumberChange}
                value={phoneData.phoneNumber}
              />
            </div>
          )}

          <button
            type="submit"
            className={`w-full py-2.5 rounded-lg text-white text-base font-medium transition-colors ${
              isValid
                ? "bg-[#169544] hover:bg-green-700"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={!isValid}
          >
            Send OTP
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-sm text-center text-gray-600">
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
