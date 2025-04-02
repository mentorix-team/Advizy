import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import { Check } from "lucide-react";
import CustomDatePicker from "./CustomDatePicker";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";
import PhoneNumberValidation from "@/utils/PhoneNumberValidation/PhoneNumberValidation.util";
import { useDispatch } from "react-redux";
import VerifyAccount from "../../../../Auth/VerifyAccount.auth";
import { forgotPassword, generateOtp } from "@/Redux/Slices/authSlice";
import { generateOtpforValidating } from "@/Redux/Slices/expert.Slice";
import VerifyThedetails from "@/components/Auth/VerifyThedetails";
import { Toaster } from "react-hot-toast";

const BasicInfo = ({ formData, onUpdate, errors, touched, onBlur }) => {
  const dispatch = useDispatch();
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [contactInfo, setContactInfo] = useState("");
  const [verificationType, setVerificationType] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isMobileVerified, setIsMobileVerified] = useState(false);

  const languageOptions = [
    { value: "english", label: "English" },
    { value: "hindi", label: "Hindi" },
    { value: "marathi", label: "Marathi" },
    { value: "punjabi", label: "Punjabi" },
    { value: "telugu", label: "Telugu" },
    { value: "gujarati", label: "Gujarati" },
    { value: "bengali", label: "Bengali" },
    { value: "tamil", label: "Tamil" },
    { value: "urdu", label: "Urdu" },
    { value: "kannada", label: "Kannada" },
    // ... rest of the language options
  ];

  // Load verification status from localStorage on component mount
  useEffect(() => {
    const loadVerificationStatus = () => {
      const storedEmailVerification = localStorage.getItem('emailVerification');
      if (storedEmailVerification) {
        const { email, verified } = JSON.parse(storedEmailVerification);
        if (email === formData.email) {
          setIsEmailVerified(verified);
        }
      }

      const storedMobileVerification = localStorage.getItem('mobileVerification');
      if (storedMobileVerification) {
        const { mobile, verified } = JSON.parse(storedMobileVerification);
        if (mobile === formData.mobile) {
          setIsMobileVerified(verified);
        }
      }
    };

    loadVerificationStatus();
  }, [formData.email, formData.mobile]);

  useEffect(() => {
    if (formData.email) {
      const storedEmailVerification = localStorage.getItem('emailVerification');
      if (!storedEmailVerification || JSON.parse(storedEmailVerification).email !== formData.email) {
        setIsEmailVerified(false);
      }
    }

    if (formData.mobile) {
      const storedMobileVerification = localStorage.getItem('mobileVerification');
      if (!storedMobileVerification || JSON.parse(storedMobileVerification).mobile !== formData.mobile) {
        setIsMobileVerified(false);
      }
    }
  }, [formData.email, formData.mobile]);

  const handleChange = (field, value) => {
    if (field === 'email') {
      setIsEmailVerified(false);
    } else if (field === 'mobile') {
      setIsMobileVerified(false);
    }
    onUpdate({ ...formData, [field]: value });
  };

  const handlePhoneChange = ({ countryCode, phoneNumber, isValid }) => {
    if (isValid) {
      setIsMobileVerified(false);
      onUpdate({
        ...formData,
        countryCode,
        mobile: phoneNumber,
      });
    }
  };

  const handleVerifyClick = async (type) => {
    setVerificationType(type);
    setContactInfo(
      type === "email" ? formData.email : formData.countryCode + formData.mobile
    );
    setShowOtpPopup(true);

    if (type === "email") {
      await dispatch(generateOtpforValidating(formData.email));
    }
    if (type === "mobile") {
      await dispatch(generateOtpforValidating(formData.mobile));
    }
  };

  const handleOtpVerificationSuccess = () => {
    setShowOtpPopup(false);
    if (verificationType === "email") {
      setIsEmailVerified(true);
      localStorage.setItem('emailVerification', JSON.stringify({
        email: formData.email,
        verified: true
      }));
    } else if (verificationType === "mobile") {
      setIsMobileVerified(true);
      localStorage.setItem('mobileVerification', JSON.stringify({
        mobile: formData.mobile,
        verified: true
      }));
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
      <Toaster position="top-right" />
      
      <div className="bg-green-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-green-800 mb-2">Why Basic Info Matters</h3>
        <p className="text-green-700">
          Your basic information is the first thing potential clients see. A complete and professional profile increases your
          chances of making a great first impression and attracting more clients.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            onBlur={() => onBlur("firstName")}
            placeholder="John"
            className={`w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-primary ${
              errors.firstName && touched.firstName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.firstName && touched.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            onBlur={() => onBlur("lastName")}
            placeholder="Doe"
            className={`w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-primary ${
              errors.lastName && touched.lastName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.lastName && touched.lastName && (
            <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.gender}
            onChange={(e) => handleChange("gender", e.target.value)}
            onBlur={() => onBlur("gender")}
            className={`w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-primary ${
              errors.gender && touched.gender ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && touched.gender && (
            <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <CustomDatePicker
            selectedDate={formData.dateOfBirth ? new Date(formData.dateOfBirth) : null}
            onChange={(date) => {
              handleChange("dateOfBirth", date.toISOString().split("T")[0]);
              onBlur("dateOfBirth");
            }}
            type="dob"
          />
          {errors.dateOfBirth && touched.dateOfBirth && (
            <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>
          )}
        </div>

        {/* Nationality */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nationality <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.nationality}
            onChange={(e) => handleChange("nationality", e.target.value)}
            onBlur={() => onBlur("nationality")}
            className={`w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-primary ${
              errors.nationality && touched.nationality ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select nationality</option>
            <option value="in">Indian</option>
            <option value="us">American</option>
            <option value="uk">British</option>
            <option value="ca">Canadian</option>
            <option value="au">Australian</option>
            {/* Add more nationalities as needed */}
          </select>
          {errors.nationality && touched.nationality && (
            <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleChange("city", e.target.value)}
            onBlur={() => onBlur("city")}
            placeholder="New York"
            className={`w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-primary ${
              errors.city && touched.city ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.city && touched.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city}</p>
          )}
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <div className="flex-1">
              <PhoneNumberValidation
                country={"in"}
                value={formData.countryCode + formData.mobile}
                onChange={handlePhoneChange}
                inputProps={{
                  required: true,
                  className: "w-full p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary pl-12",
                }}
                containerClass="phone-input"
                buttonClass="phone-input-button"
                dropdownClass="phone-input-dropdown"
              />
            </div>
            {formData.mobile && (
              <button
                type="button"
                onClick={() => handleVerifyClick("mobile")}
                disabled={isMobileVerified}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  isMobileVerified
                    ? "bg-green-100 text-green-700 cursor-default"
                    : "bg-primary text-white hover:bg-green-600"
                }`}
              >
                {isMobileVerified ? (
                  <>
                    Verified
                    <Check className="w-4 h-4" />
                  </>
                ) : (
                  "Verify"
                )}
              </button>
            )}
          </div>
          {errors.mobile && touched.mobile && (
            <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => onBlur("email")}
              placeholder="john@example.com"
              className={`flex-1 p-2.5 border rounded-lg focus:ring-1 focus:ring-primary ${
                errors.email && touched.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {formData.email && (
              <button
                type="button"
                onClick={() => handleVerifyClick("email")}
                disabled={isEmailVerified}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  isEmailVerified
                    ? "bg-green-100 text-green-700 cursor-default"
                    : "bg-primary text-white hover:bg-green-600"
                }`}
              >
                {isEmailVerified ? (
                  <>
                    Verified
                    <Check className="w-4 h-4" />
                  </>
                ) : (
                  "Verify"
                )}
              </button>
            )}
          </div>
          {errors.email && touched.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
      </div>

      {/* Languages */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Languages Known <span className="text-red-500">*</span>
        </label>
        <Select
          isMulti
          options={languageOptions}
          value={formData.languages}
          onChange={(value) => handleChange("languages", value)}
          onBlur={() => onBlur("languages")}
          className={`${
            errors.languages && touched.languages ? "border-red-500" : ""
          }`}
          classNamePrefix="select"
        />
        {errors.languages && touched.languages && (
          <p className="text-red-500 text-sm mt-1">{errors.languages}</p>
        )}
      </div>

      {/* Bio Description */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bio Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => handleChange("bio", e.target.value)}
          onBlur={() => onBlur("bio")}
          placeholder="Tell us about yourself..."
          rows={4}
          className={`w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-primary ${
            errors.bio && touched.bio ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.bio && touched.bio && (
          <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
        )}
        <p className="text-sm text-gray-500 mt-1">
          Your bio is your chance to showcase your expertise and personality. Make it count!
        </p>
      </div>

      {showOtpPopup && (
        <VerifyThedetails
          onClose={() => setShowOtpPopup(false)}
          onSwitchView={handleOtpVerificationSuccess}
          contactInfo={contactInfo}
        />
      )}
    </div>
  );
};

export default BasicInfo;