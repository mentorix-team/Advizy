import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoIosClose } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import {
  createAccount,
  generateOtpEmail,
  loginaccount,
} from "../../Redux/Slices/authSlice";
import LoginWithEmail from "./LoginWithEmail.auth";
import PasswordInput from "@/utils/PasswordInput/InputPassword.util";

const SignupWithEmail = ({ onClose, onSwitchView }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    // policy: "",
  });

  // const [policyAccepted, setPolicyAccepted] = useState(false);
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
  });

  const [submitAttempted, setSubmitAttempted] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case "firstName":
        return value.trim() ? "" : "First name is required";
      case "lastName":
        return value.trim() ? "" : "Last name is required";
      case "email":
        return value.trim()
          ? /^\S+@\S+\.\S+$/.test(value)
            ? ""
            : "Invalid email format"
          : "Email is required";
      case "password":
        if (!value.trim()) return "Password is required";
        // enforce regex: at least 8 chars, uppercase, lowercase, number and special char
        const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
        return pwdRegex.test(value)
          ? ""
          : "Password must contain at least 8 characters, a uppercase letter, a lowercase letter, a number, and a special character.";
      default:
        return "";
    }
  };

  const handleUserInput = (event) => {
    const { name, value } = event.target;
    setSignupData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Only validate password after submit attempt, validate other fields if touched
    if (name === 'password') {
      if (submitAttempted) {
        setErrors((prev) => ({
          ...prev,
          [name]: validateField(name, value),
        }));
      }
    } else if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    
    // Don't validate password on blur, only on submit
    if (name !== 'password') {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };

  // const handlePolicyChange = (event) => {
  //   setPolicyAccepted(event.target.checked);
  //   if (event.target.checked) {
  //     setErrors((prev) => ({ ...prev, policy: "" }));
  //   }
  // };

  const handlePasswordChange = (value) => {
    setSignupData((prev) => ({ ...prev, password: value }));
    // Only validate password after submit attempt
    if (submitAttempted) {
      setErrors((prev) => ({
        ...prev,
        password: validateField("password", value),
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      firstName: validateField("firstName", signupData.firstName),
      lastName: validateField("lastName", signupData.lastName),
      email: validateField("email", signupData.email),
      password: validateField("password", signupData.password),
      // policy: !policyAccepted ? "Please accept the Terms & Conditions" : "",
    };

    setErrors(newErrors);

    // Show toast for each error
    const errorMessages = Object.values(newErrors).filter((error) => error);
    if (errorMessages.length > 0) {
      // Inline errors will show under each field; do not show toasts for validation errors.
      return false;
    }

    return true;
  };

  const createNewAccount = async (event) => {
    event.preventDefault();

    // Mark that submit was attempted (for password validation)
    setSubmitAttempted(true);

    // Mark all fields as touched
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
    });

    if (!validateForm()) {
      return;
    }

    setIsLoading(true); // Set loading to true

    try {
      const otpResponse = await dispatch(generateOtpEmail(signupData)).unwrap();

      if (otpResponse?.success) {
        toast.success("OTP sent to your email. Please verify.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        onSwitchView("VerifyAccount");
      } else {
        // Don't show toast for server-side OTP errors; log for debugging and let inline UI handle it
        console.warn("OTP generation failed:", otpResponse?.message || "Failed to generate OTP.");
      }
    } catch (error) {
      // Network/server error while generating OTP — log for debugging. No toast shown.
      console.error("Error generating OTP:", error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const handleGoogleSignup = () => {
    window.open("https://advizy.onrender.com/api/v1/user/auth/google", "_self");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md px-4 py-8 overflow-auto">
      <div className="relative w-full max-h-[90vh] bg-white rounded-3xl shadow-lg p-4 sm:p-6 md:p-8 overflow-auto mx-4 sm:mx-6 lg:mx-0 sm:max-w-lg md:max-w-xl lg:max-w-2xl">
        <IoIosClose
          className="hover:cursor-pointer hover:bg-gray-100 rounded-full hover:shadow-md absolute top-6 right-6 text-black hover:text-black text-4xl font-bold"
          onClick={onClose}
        />

        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-2 text-center">
          Sign Up
        </h2>

        <div className="text-sm text-gray-500 text-center mb-6">
          <span>Already have an account? </span>
          <button
            className="text-gray-700 font-medium tracking-tight hover:underline"
            onClick={() => onSwitchView("LoginWithEmail")}
          >
            Login
          </button>
        </div>

        <form onSubmit={createNewAccount} className="w-full sm:w-[480px] md:w-[520px] max-w-full mx-auto flex flex-col gap-3">
          <div className="flex gap-4 mb-2">
            <div className="w-1/2">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                First Name{errors.firstName && touched.firstName && (<span className="text-red-500">*</span>)}
              </label>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={signupData.firstName}
                onChange={handleUserInput}
                onBlur={handleBlur}
                className={`w-full h-10 px-4 py-2 border rounded-lg bg-gray-50 text-sm placeholder:text-sm text-gray-900 ${
                  errors.firstName && touched.firstName
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              {/* {errors.firstName && touched.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )} */}
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Last Name{errors.lastName && touched.lastName && (<span className="text-red-500">*</span>)}
              </label>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={signupData.lastName}
                onChange={handleUserInput}
                onBlur={handleBlur}
                className={`w-full h-10 px-4 py-2 border rounded-lg bg-gray-50 text-sm placeholder:text-sm text-gray-900 ${
                  errors.lastName && touched.lastName
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              {/* {errors.lastName && touched.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )} */}
            </div>
          </div>

          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Mail id{errors.email && touched.email && (<span className="text-red-500">*</span>)}
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={signupData.email}
              onChange={handleUserInput}
              onBlur={handleBlur}
              className={`w-full h-10 px-4 py-2 border rounded-lg bg-gray-50 text-sm placeholder:text-sm text-gray-900 ${
                errors.email && touched.email
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
            />
            {/* {errors.email && touched.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )} */}
          </div>

          <div className="">
            <PasswordInput
              label="Create Password"
              showPasswordConditions={true}
              name="password"
              placeholder="Create your password"
              value={signupData.password}
              onChange={(e) =>
                handleUserInput({
                  target: { name: "password", value: e.target.value },
                })
              }
              onBlur={(e) => handleBlur(e)}
              error={submitAttempted && errors.password ? errors.password : ""}
            />
            {/* {errors.password && touched.password && (
              <p className="text-red-500 text-xs">{errors.password}</p>
            )} */}
          </div>

          <div className="mb-2">
            <div className="flex items-center gap-2">
              <label htmlFor="policy" className="text-xs cursor-pointer">
                By continuing you agree to our{" "}
                <a
                  href="/terms-of-service"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Privacy Policy
                </a>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#169544] text-white py-2 md:py-3 rounded-lg shadow-sm hover:shadow-md hover:bg-primary/90 transition-colors mb-2 flex items-center justify-center text-sm md:text-base font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Create Account"
            )}
          </button>

          <div className="flex items-center mb-2">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-4 text-gray-500">Or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="flex flex-col gap-4">
            <button
              type="button"
              className="flex-1 h-10  flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg text-black shadow-sm hover:shadow-md hover:bg-gray-100 transition-colors text-sm md:text-base"
              onClick={handleGoogleSignup}
            >
              <FcGoogle size={24} />
              Continue with Google
            </button>
            {/* <button
              type="button"
              className="flex-1 h-10 flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-100 transition-colors"
              onClick={() => onSwitchView("SignupWithMobile")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
              >
                <path d="M20 2c0-1.105-.896-2-2-2h-12c-1.105 0-2 .896-2 2v20c0 1.104.895 2 2 2h12c1.104 0 2-.896 2-2v-20zm-9.501 0h3.001c.276 0 .5.224.5.5s-.224.5-.5.5h-3.001c-.275 0-.499-.224-.499-.5s.224-.5.499-.5zm1.501 20c-.553 0-1-.448-1-1s.447-1 1-1c.552 0 .999.448.999 1s-.447 1-.999 1zm6-3h-12v-14.024h12v14.024z" />
              </svg>
              Signup with Mobile Number
            </button> */}
          </div>
        </form>

        <p className="text-xs text-gray-500 text-center px-10 mt-6">
          By signing up, you agree to the Advizy Terms of Service and to
          occasionally receive emails from us. Please read our Privacy Policy to
          learn how we use your personal data.
        </p>
      </div>
    </div>
  );
};

export default SignupWithEmail;
