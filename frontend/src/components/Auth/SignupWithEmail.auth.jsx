import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createAccount,
  generateOtpEmail,
  loginaccount,
} from "../../Redux/Slices/authSlice";
import LoginWithEmail from "./LoginWithEmail.auth";
import PasswordInput from "@/utils/PasswordInput/InputPassword.util";

const SignupWithEmail = ({ onClose, onSwitchView }) => {
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
    policy: "",
  });

  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
  });

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
        return value.trim()
          ? value.length >= 8
            ? ""
            : "Password must be at least 8 characters"
          : "Password is required";
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

    // Validate on change if field has been touched
    if (touched[name]) {
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
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handlePolicyChange = (event) => {
    setPolicyAccepted(event.target.checked);
    if (event.target.checked) {
      setErrors((prev) => ({ ...prev, policy: "" }));
    }
  };

  const handlePasswordChange = (value) => {
    setSignupData((prev) => ({ ...prev, password: value }));
    if (touched.password) {
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
      policy: !policyAccepted ? "Please accept the Terms & Conditions" : "",
    };

    setErrors(newErrors);

    // Show toast for each error
    const errorMessages = Object.values(newErrors).filter((error) => error);
    if (errorMessages.length > 0) {
      errorMessages.forEach((error) => toast.error(error));
      return false;
    }

    return true;
  };

  const createNewAccount = async (event) => {
    event.preventDefault();

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

    try {
      const otpResponse = await dispatch(generateOtpEmail(signupData)).unwrap();

      if (otpResponse?.success) {
        toast.success("OTP sent to your email. Please verify.");
        onSwitchView("VerifyAccount");
      } else {
        toast.error(otpResponse?.message || "Failed to generate OTP.");
      }
    } catch (error) {
      toast.error("Error generating OTP.");
    }
  };

  const handleGoogleSignup = () => {
    window.open("https://advizy.onrender.com/api/v1/user/auth/google", "_self");
  };

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

        <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
          Sign Up
        </h2>

        <div className="text-sm text-gray-500 text-right mb-6">
          <span>Already have an account? </span>
          <button
            className="text-black hover:underline"
            onClick={() => onSwitchView("LoginWithEmail")}
          >
            Login
          </button>
        </div>

        <form onSubmit={createNewAccount} className="w-full max-w-md mx-auto">
          <div className="flex gap-4 mb-2">
            <div className="w-1/2">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                First Name*
              </label>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={signupData.firstName}
                onChange={handleUserInput}
                onBlur={handleBlur}
                className={`w-full h-10 px-4 py-2 border rounded-lg bg-gray-50 ${
                  errors.firstName && touched.firstName
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {/* {errors.firstName && touched.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )} */}
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Last Name*
              </label>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={signupData.lastName}
                onChange={handleUserInput}
                onBlur={handleBlur}
                className={`w-full h-10 px-4 py-2 border rounded-lg bg-gray-50 ${
                  errors.lastName && touched.lastName
                    ? "border-red-500"
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
              Email address*
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={signupData.email}
              onChange={handleUserInput}
              onBlur={handleBlur}
              className={`w-full h-10 px-4 py-2 border rounded-lg bg-gray-50 ${
                errors.email && touched.email
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />{" "}
            {/* {errors.email && touched.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
 */}
          </div>

          <div className="mb-2">
            <PasswordInput
              label="Create Password*"
              showPasswordConditions="true"
              name="password"
              placeholder="Create your password"
              value={signupData.password}
              onChange={(e) =>
                handleUserInput({
                  target: { name: "password", value: e.target.value },
                })
              }
              onBlur={(e) => handleBlur(e)}
              // error={errors.password && touched.password ? errors.password : ""}
            />
          </div>

          <div className="mb-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="policy"
                id="policy"
                checked={policyAccepted}
                onChange={handlePolicyChange}
                className="w-4 h-4 accent-[#169544] cursor-pointer"
              />
              <label htmlFor="policy" className="text-sm cursor-pointer">
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
            {/* {errors.policy && (
              <p className="text-red-500 text-xs mt-1">{errors.policy}</p>
            )} */}
          </div>

          <button
            type="submit"
            className="w-full bg-[#169544] text-white py-2 rounded-lg hover:bg-primary/90 transition-colors mb-2"
          >
            Create Account
          </button>

          <div className="flex items-center mb-2">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-4 text-gray-500">Or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="flex flex-col gap-4">
            <button
              type="button"
              className="flex-1 h-10 flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-100 transition-colors"
              onClick={handleGoogleSignup}
            >
              <img
                src="https://img.icons8.com/color/24/000000/google-logo.png"
                alt="Google"
                className="w-6 h-6"
              />
              Continue with Google
            </button>
            <button
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
            </button>
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
