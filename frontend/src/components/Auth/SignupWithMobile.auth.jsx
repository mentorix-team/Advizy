import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { generateOtpEmail, signupUsingMobile } from "../../Redux/Slices/authSlice";
import PasswordInput from "@/utils/PasswordInput/InputPassword.util";
import PhoneNumberValidation from "@/utils/PhoneNumberValidation/PhoneNumberValidation.util";

const SignupWithMobile = ({ onClose, onSwitchView }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    password: "",
    policy: "",
  });

  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    phoneNumber: false,
    password: false,
  });

  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [validNumber, setValidNumber] = useState(false);

  const handlePolicyChange = (event) => {
    setPolicyAccepted(event.target.checked);
    if (event.target.checked) {
      setErrors((prev) => ({ ...prev, policy: "" }));
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case "firstName":
        return !value.trim() ? "First name is required" : "";
      case "lastName":
        return !value.trim() ? "Last name is required" : "";
      case "password":
        return !value.trim() ? "Password is required" : "";
      default:
        return "";
    }
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, signupData[name]);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleUserInput = (event) => {
    const { name, value } = event.target;
    setSignupData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleValidPhoneNumber = (phoneNumber, isValid, countryData) => {
    const countryCode = `+${countryData.dialCode}`;
    const rawPhoneNumber = phoneNumber
      .replace(`${countryData.dialCode}`, "")
      .trim();
    setSignupData((prev) => ({
      ...prev,
      phoneNumber: {
        countryCode: countryCode,
        phoneNumber: rawPhoneNumber,
      },
    }));
    setValidNumber(isValid);
    setErrors((prev) => ({
      ...prev,
      phoneNumber: isValid ? "" : "Please enter a valid phone number",
    }));
  };

  const validateForm = () => {
    const newErrors = {
      firstName: validateField("firstName", signupData.firstName),
      lastName: validateField("lastName", signupData.lastName),
      password: validateField("password", signupData.password),
      phoneNumber: !validNumber ? "Please enter a valid phone number" : "",
      policy: !policyAccepted ? "You must accept the Terms & Conditions" : "",
    };

    setErrors(newErrors);
    setTouched({
      firstName: true,
      lastName: true,
      phoneNumber: true,
      password: true,
    });

    return !Object.values(newErrors).some((error) => error);
  };

  const createNewAccount = async (event) => {
    event.preventDefault();

    if (!policyAccepted) {
      toast.error("Please accept the Terms & Conditions");
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      console.log(signupData)
      const otpResponse = await dispatch(signupUsingMobile(signupData)).unwrap();

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
                  touched.firstName && errors.firstName
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {touched.firstName && errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
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
                  touched.lastName && errors.lastName
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {touched.lastName && errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Mobile Number*
            </label>
            <PhoneNumberValidation
              onValidNumber={(phoneNumber, isValid, countryData) =>
                handleValidPhoneNumber(phoneNumber, isValid, countryData)
              }
              value={signupData.phoneNumber.phoneNumber || ""}
              country={"in"}
            />
            {touched.phoneNumber && errors.phoneNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
            )}
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
              onBlur={handleBlur}
              error={touched.password && errors.password}
            />
            {touched.password && errors.password && (
              <p className="text-red-500 text-xs">{errors.password}</p>
            )}
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
                I agree with Terms & Conditions
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

          <div className="flex flex-col">
            <button
              type="button"
              className="w-full h-10 flex items-center justify-center gap-2 py-2 mb-4 border border-gray-300 rounded-lg text-black hover:bg-gray-100 transition-colors"
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
              className="w-full h-10 flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-100 transition-colors"
              onClick={() => onSwitchView("SignupWithEmail")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
              >
                <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z" />
              </svg>
              Signup with Email
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-500 text-center px-10 mt-6">
          By signing up, you agree to the Mentorix Terms of Service and to
          occasionally receive emails from us. Please read our Privacy Policy to
          learn how we use your personal data.
        </p>
      </div>
    </div>
  );
};

export default SignupWithMobile;
