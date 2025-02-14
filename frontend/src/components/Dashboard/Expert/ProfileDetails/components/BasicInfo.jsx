import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import { FaPlus } from "react-icons/fa";
import CustomDatePicker from "./CustomDatePicker";
import { CircleCheckBig } from "lucide-react";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";
import PhoneNumberValidation from "@/utils/PhoneNumberValidation/PhoneNumberValidation.util";
import { useDispatch } from "react-redux";
import VerifyAccount from "../../../../Auth/VerifyAccount.auth";
import { forgotPassword, generateOtp } from "@/Redux/Slices/authSlice";
import { generateOtpforValidating } from "@/Redux/Slices/expert.Slice";
import VerifyThedetails from "@/components/Auth/VerifyThedetails";

const BasicInfo = ({ formData, onUpdate, errors, touched, onBlur }) => {
  const dispatch = useDispatch();
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [contactInfo, setContactInfo] = useState("");
  const [verificationType, setVerificationType] = useState(""); // 'email' or 'mobile'

  // Add verification status state
  const [verificationStatus, setVerificationStatus] = useState({
    email: false,
    mobile: false,
  });

  const handleChange = (field, value) => {
    onUpdate({ ...formData, [field]: value });
    // Reset verification status when email/mobile changes
    if (field === "email" || field === "mobile") {
      setVerificationStatus((prev) => ({
        ...prev,
        [field]: false,
      }));
      // Save updated verification status
      localStorage.setItem(
        "verificationStatus",
        JSON.stringify({
          ...verificationStatus,
          [field]: false,
        })
      );
    }
  };

  // Load verification status from localStorage on component mount
  useEffect(() => {
    const savedVerification = localStorage.getItem("verificationStatus");
    if (savedVerification) {
      setVerificationStatus(JSON.parse(savedVerification));
    }
  }, []);

  const languageOptions = [
    { value: "english", label: "English" },
    { value: "marathi", label: "Marathi" },
    { value: "hindi", label: "Hindi" },
    { value: "telugu", label: "Telugu" },
    { value: "bengali", label: "Bengali" },
  ];

  const handlePhoneChange = ({ countryCode, phoneNumber, isValid }) => {
    if (isValid) {
      onUpdate({
        ...formData,
        countryCode,
        mobile: phoneNumber,
      });
      // Reset mobile verification status when phone number changes
      setVerificationStatus((prev) => ({
        ...prev,
        mobile: false,
      }));
      localStorage.setItem(
        "verificationStatus",
        JSON.stringify({
          ...verificationStatus,
          mobile: false,
        })
      );
    }
  };
  // const handlePhoneChange = (phoneData) => {
  //   const { countryCode, phoneNumber, isValid, fullNumber } = phoneData;

  //   const formattedPhoneNumber = phoneNumber.startsWith(countryCode)
  //     ? phoneNumber.replace(countryCode, "")
  //     : phoneNumber;

  //   onUpdate({
  //     ...formData,
  //     countryCode: countryCode,
  //     mobile: formattedPhoneNumber,
  //   });

  //   // Optionally, you can also set some state to indicate if the phone number is valid
  //   setIsPhoneValid(isValid);
  // };

  const handleAddSocialLink = () => {
    onUpdate({
      ...formData,
      socialLinks: [...formData.socialLinks, ""],
    });
  };

  const handleVerifyClick = async (type) => {
    setVerificationType(type);
    setContactInfo(
      type === "email" ? formData.email : formData.countryCode + formData.mobile
    );
    setShowOtpPopup(true);
    if (type === "email") {
      const response = await dispatch(generateOtpforValidating(formData.email));
    }
    if (type === "mobile") {
      const response = await dispatch(
        generateOtpforValidating(formData.mobile)
      );
    }
  };

  const handleOtpVerificationSuccess = () => {
    setShowOtpPopup(false);
    // Update verification status based on type
    setVerificationStatus((prev) => ({
      ...prev,
      [verificationType]: true,
    }));
    // Save verification status to localStorage
    localStorage.setItem(
      "verificationStatus",
      JSON.stringify({
        ...verificationStatus,
        [verificationType]: true,
      })
    );
  };

  return (
    <div className="py-6">
      {/* Info Banner */}
      <div className="bg-[#F0FFF2] p-6 rounded-lg mb-8">
        <h3 className="text-[#16A348] text-lg font-semibold mb-2">
          Why Basic Info Matters
        </h3>
        <p className="text-[#16A348]">
          Your basic information is the first thing potential clients see. A
          complete and professional profile increases your chances of making a
          great first impression and attracting more clients.
        </p>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-2 gap-6">
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
            className={`w-full p-2.5 border ${
              errors.firstName && touched.firstName
                ? "border-red-500"
                : "border-gray-300"
            } rounded-lg focus:ring-1 focus:ring-primary`}
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
            className={`w-full p-2.5 border ${
              errors.lastName && touched.lastName
                ? "border-red-500"
                : "border-gray-300"
            } rounded-lg focus:ring-1 focus:ring-primary`}
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
            className={`w-full p-2.5 border ${
              errors.gender && touched.gender
                ? "border-red-500"
                : "border-gray-300"
            } rounded-lg focus:ring-1 focus:ring-primary`}
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
            selectedDate={
              formData.dateOfBirth ? new Date(formData.dateOfBirth) : null
            }
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
            Nationality
          </label>
          <select
            value={formData.nationality}
            onChange={(e) => handleChange("nationality", e.target.value)}
            onBlur={() => onBlur("nationality")}
            className={`w-full p-2.5 border ${
              errors.nationality && touched.nationality
                ? "border-red-500"
                : "border-gray-300"
            } rounded-lg focus:ring-1 focus:ring-primary`}
          >
            <option value="">Select a Nationality</option>
            <option value="in">Indian</option>
            <option value="us">American</option>
            <option value="uk">British</option>
            <option value="au">Australian</option>
            <option value="ca">Canadian</option>
          </select>
          {errors.nationality && touched.nationality && (
            <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleChange("city", e.target.value)}
            onBlur={() => onBlur("city")}
            placeholder="New Delhi"
            className={`w-full p-2.5 border ${
              errors.city && touched.city ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:ring-1 focus:ring-primary`}
          />
          {errors.city && touched.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city}</p>
          )}
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Number
          </label>
          <div className="flex gap-2">
            <div className="flex-1">
              <PhoneNumberValidation
                country={"in"} // Default country
                value={formData.countryCode + formData.mobile}
                onChange={handlePhoneChange} // Pass the cleaned and separated values
                inputProps={{
                  required: true,
                  className:
                    "w-full p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary pl-12",
                }}
                containerClass="phone-input"
                buttonClass="phone-input-button"
                dropdownClass="phone-input-dropdown"
              />
            </div>
            {verificationStatus.mobile ? (
              <div className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                <CircleCheckBig className="w-4 h-4 mr-1 text-primary" />
                Verified
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleVerifyClick("mobile")}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600"
              >
                Verify
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
            Email Address
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => onBlur("email")}
              placeholder="john@example.com"
              className={`flex-1 p-2.5 border ${
                errors.email && touched.email
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-lg focus:ring-1 focus:ring-primary`}
            />
            {verificationStatus.email ? (
              <div className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                <CircleCheckBig className="w-4 h-4 mr-1 text-primary" />
                Verified
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleVerifyClick("email")}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600"
              >
                Verify
              </button>
            )}
          </div>
          {errors.email && touched.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Languages Known
        </label>
        <Select
          name="languages"
          options={languageOptions}
          isMulti
          hideSelectedOptions={false}
          onBlur={() => onBlur("languages")}
          value={formData.languages}
          onChange={(value) => handleChange("languages", value)}
          className={`flex-1 p-2.5 border ${
            errors.languages && touched.languages
              ? "border-red-500"
              : "border-gray-300"
          } rounded-lg focus:ring-1 focus:ring-primary`}
        />
        {errors.languages && touched.languages && (
          <p className="text-red-500 text-sm mt-1">{errors.languages}</p>
        )}
      </div>

      {/* Bio Description */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bio Description
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => handleChange("bio", e.target.value)}
          onBlur={() => onBlur("bio")}
          placeholder="Write a short description about yourself"
          rows={4}
          className={`w-full p-2.5 border ${
            errors.bio && touched.bio ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:ring-1 focus:ring-primary`}
        />
        <p className="text-sm text-gray-500 mt-1">
          Your bio is your chance to showcase your expertise and personality.
          Make it count!
        </p>
        {errors.bio && touched.bio && (
          <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
        )}
      </div>

      {/* Social Media Links */}
      <div className="mt-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#16A348]">
            Social Media Links
          </h3>
          <button
            type="button"
            onClick={handleAddSocialLink}
            className="flex items-center px-4 py-2 gap-2 bg-primary text-white rounded-lg hover:bg-green-600"
          >
            Add More Link
          </button>
        </div>
        <div className="space-y-4">
          {formData.socialLinks.map((link, index) => (
            <input
              key={index}
              type="url"
              value={link}
              onChange={(e) => {
                const newLinks = [...formData.socialLinks];
                newLinks[index] = e.target.value;
                handleChange("socialLinks", newLinks);
              }}
              placeholder="https://linkedin.com/in/username"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary"
            />
          ))}
        </div>
      </div>

      {/* OTP Popup */}
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
