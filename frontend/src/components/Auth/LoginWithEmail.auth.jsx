import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginaccount } from "../../Redux/Slices/authSlice";
import toast from "react-hot-toast";
import SignupWithEmail from "./SignupWithEmail.auth";
import LoginWithMobile from "./LoginWithMobile.auth";
import ForgotPassword from "./ForgotPassword.auth";
import PasswordInput from "@/utils/PasswordInput/InputPassword.util";

const LoginWithEmail = ({ onClose, onSwitchView }) => {
  const [logindata, setlogindata] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleGoogleSignup = (event) => {
    event.preventDefault(); // Prevent the form from submitting
    window.open("https://advizy.onrender.com/api/v1/user/auth/google", "_self");
  };

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(value)) return "Please enter a valid email";
        return "";
      case "password":
        if (!value.trim()) return "Password is required";
        return "";
      default:
        return "";
    }
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    const error = validateField(name, logindata[name]);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  function handleUserInput(event) {
    const { name, value } = event.target;
    setlogindata((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  }

  const validateForm = () => {
    const newErrors = {
      email: validateField("email", logindata.email),
      password: validateField("password", logindata.password),
    };

    setErrors(newErrors);
    setTouched({
      email: true,
      password: true,
    });

    return !Object.values(newErrors).some((error) => error);
  };

  async function login(event) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const response = await dispatch(loginaccount(logindata));
    if (response?.payload?.success) {
      // navigate("/");
    } else {
      navigate("/signup");
    }

    setlogindata({
      email: "",
      password: "",
    });
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

        <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
          Log In
        </h2>

        <div className="text-sm text-gray-500 text-right mb-6">
          <span>Don't have an account? </span>
          <button
            className="text-black hover:underline"
            onClick={() => onSwitchView("SignupWithEmail")}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={login} className="w-80 max-w-md mx-auto">
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Email address*
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={logindata.email}
              onChange={handleUserInput}
              onBlur={handleBlur}
              className={`w-full h-10 px-4 py-2 border rounded-lg bg-gray-50 text-gray-900 autofill:bg-gray-50 autofill:text-gray-900 ${
                touched.email && errors.email
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
            />
            {touched.email && errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-2 relative">
            <PasswordInput
              label="Password*"
              name="password"
              showPasswordConditions="true"
              value={logindata.password}
              onChange={handleUserInput}
              onBlur={handleBlur}
              error={touched.password && errors.password}
              placeholder="Enter your password"
            />
            {touched.password && errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div className="text-right mb-3">
            <button
              className="text-black underline"
              onClick={() => onSwitchView("ForgotPassword")}
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-[#169544] text-white py-2 rounded-lg hover:bg-green-700 transition-colors mb-2"
          >
            Log In
          </button>

          <div className="flex items-center mb-3">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-4 text-gray-500">Or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="flex flex-col gap-4">
            <button
              type="button"
              className="w-full h-10 flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-100 transition-colors"
              onClick={handleGoogleSignup}
            >
              <img
                src="https://img.icons8.com/color/24/000000/google-logo.png"
                alt="Google Logo"
                className="w-6 h-6"
              />
              Login with Google
            </button>

            <button
              className="w-full h-10 flex items-center justify-center gap-2 py-2 mb-4 border border-gray-300 rounded-lg text-black hover:bg-gray-100 transition-colors"
              onClick={() => onSwitchView("LoginWithMobile")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
              >
                <path d="M20 2c0-1.105-.896-2-2-2h-12c-1.105 0-2 .896-2 2v20c0 1.104.895 2 2 2h12c1.104 0 2-.896 2-2v-20zm-9.501 0h3.001c.276 0 .5.224.5.5s-.224.5-.5.5h-3.001c-.275 0-.499-.224-.499-.5s.224-.5.499-.5zm1.501 20c-.553 0-1-.448-1-1s.447-1 1-1c.552 0 .999.448.999 1s-.447 1-.999 1zm6-3h-12v-14.024h12v14.024z" />
              </svg>
              Login with Mobile
            </button>
          </div>
        </form>

        <p className="text-xs m-32 text-gray-500 text-center mt-6">
          By joining, you agree to the Mentorix Terms of Service and to
          occasionally receive emails from us. Please read our Privacy Policy to
          learn how we use your personal data.
        </p>
      </div>
    </div>
  );
};

export default LoginWithEmail;
