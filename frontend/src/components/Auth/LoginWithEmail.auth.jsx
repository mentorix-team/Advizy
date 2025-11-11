import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { IoIosClose } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { useLocation, useNavigate } from "react-router-dom";
import { loginaccount } from "../../Redux/Slices/authSlice";
import LoginPasswordInput from "@/utils/PasswordInput/LoginPasswordInput.util";

const LoginWithEmail = ({ onClose, onSwitchView }) => {
  const [logindata, setlogindata] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

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

  // Unified submit handler — prevents default form submit (page reload),
  // awaits the login dispatch, and only closes/navigates on success.
  const handleSubmit = async (event) => {
    event?.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Await the thunk so we can inspect the result synchronously
      const result = await dispatch(loginaccount(logindata)).unwrap();
      // console.log("Login result:", result);

      if (result?.success) {
        const redirectURL = sessionStorage.getItem("redirectURL");
        // Close popup first
        onClose();

        if (redirectURL && redirectURL.trim() !== "") {
          sessionStorage.removeItem("redirectURL");
          navigate(redirectURL);
        } else {
          const currentPath = location.pathname;
          if (currentPath === "/" || currentPath.includes("auth")) {
            navigate("/dashboard/user/meetings");
          }
        }
      } else {
        // Explicit failure path: show inline error and keep modal open
        setErrors((prev) => ({ ...prev, password: "Wrong email or password" }));
        setTouched({ email: true, password: true });
      }
    } catch (err) {
      // Unwrap errors from thunk or network issues
      console.error("Login error:", err);
      setErrors((prev) => ({ ...prev, password: err?.message || "Login failed" }));
      setTouched({ email: true, password: true });
    } finally {
      setlogindata({ email: "", password: "" });
    }
  };

  // Google login handler
  const handleGoogleSignup = (event) => {
    event.preventDefault();

    // Store current redirectURL if it exists, or store current page as backup
    const existingRedirectURL = sessionStorage.getItem("redirectURL");
    if (!existingRedirectURL) {
      const currentPage = window.location.pathname + window.location.search;
      // console.log("🔗 Storing preOAuthPath for Google login:", currentPage);
      sessionStorage.setItem("preOAuthPath", currentPage);
    } else {
      // console.log("📌 redirectURL already exists:", existingRedirectURL);
    }

    window.open(`https://advizy.onrender.com/api/v1/user/auth/google`, "_self");
  };

  const handleCloseClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    // console.log("Close button clicked");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md px-4 py-8 overflow-auto">
      <div className="relative w-full max-w-xl max-h-xl bg-white rounded-3xl shadow-lg p-6 overflow-auto">
        <IoIosClose
          className="hover:cursor-pointer hover:bg-gray-100 rounded-full hover:shadow-md absolute top-6 right-6 text-black hover:text-black text-4xl font-bold"
          onClick={handleCloseClick}
        />

        <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
          Log In
        </h2>

        <div className="text-sm text-gray-500 text-center mb-6">
          <span>Don't have an account? </span>
          <button
            className="text-gray-700 font-medium tracking-tight hover:underline"
            onClick={() => onSwitchView("SignupWithEmail")}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="w-80 max-w-md mx-auto flex flex-col gap-2">
          <div className="">
            <label className="block text-gray-700 text-sm md:text-base font-medium mb-1">
              Email address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={logindata.email}
              onChange={handleUserInput}
              onBlur={handleBlur}
              className={`w-full h-10 px-4 py-2 border rounded-lg bg-gray-50 text-gray-900 text-sm placeholder:text-sm `}
            />
            {/* {touched.email && errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )} */}
          </div>

          <div className="relative">
            <LoginPasswordInput
              label="Password"
              name="password"
              value={logindata.password}
              onChange={handleUserInput}
              onBlur={handleBlur}
              error={touched.password && errors.password}
              placeholder="Enter your password"
            />
            {/* {touched.password && errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )} */}
          </div>

          <div className="text-right mb-2">
            <button
              type="button"
              className="text-gray-500 tracking-tight font-medium text-sm hover:text-gray-700 hover:underline"
              onClick={() => onSwitchView("ForgotPassword")}
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-[#169544] text-white py-2 rounded-lg shadow-sm hover:shadow-md hover:bg-green-700 transition-colors mb-2"
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
              className="w-full h-10 flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg text-black shadow-sm hover:shadow-md hover:bg-gray-100 transition-colors"
              onClick={handleGoogleSignup}
            >
              <FcGoogle size={24} />
              Login with Google
            </button>
          </div>
        </form>

        <p className="text-xs px-4 sm:px-6 text-gray-500 text-center mt-4 sm:mt-6">
          By joining, you agree to the Advizy Terms of Service and to
          occasionally receive emails from us. Please read our Privacy Policy to
          learn how we use your personal data.
        </p>
      </div>
    </div>
  );
};

export default LoginWithEmail;
