import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import { FaPlus } from "react-icons/fa";
import CustomDatePicker from "./CustomDatePicker";
import { CircleCheckBig,Info } from "lucide-react";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";
import PhoneNumberValidation from "@/utils/PhoneNumberValidation/PhoneNumberValidation.util";
import { useDispatch } from "react-redux";
import VerifyAccount from "../../../../Auth/VerifyAccount.auth";
import { forgotPassword, generateOtp } from "@/Redux/Slices/authSlice";
import { generateOtpforValidating } from "@/Redux/Slices/expert.Slice";
import VerifyThedetails from "@/components/Auth/VerifyThedetails";
import Tooltip from "../../ToolTip";

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
    { value: "hindi", label: "Hindi" },
    { value: "marathi", label: "Marathi" },
    { value: "english", label: "English" },
    { value: "telugu", label: "Telugu" },
    { value: "punjabi", label: "Punjabi" },
    { value: "gujarati", label: "Gujarati" },
    { value: "tamil", label: "Tamil" },
    { value: "bengali", label: "Bengali" },
    { value: "urdu", label: "Urdu" },
    { value: "kannada", label: "Kannada" },
    { value: "odia", label: "Odia" },
    { value: "malayalam", label: "Malayalam" },
    { value: "assamese", label: "Assamese" },
    { value: "maithili", label: "Maithili" },
    { value: "santali", label: "Santali" },
    { value: "kashmiri", label: "Kashmiri" },
    { value: "nepali", label: "Nepali" },
    { value: "gondi", label: "Gondi" },
    { value: "sindhi", label: "Sindhi" },
    { value: "konkani", label: "Konkani" },
    { value: "dogri", label: "Dogri" },
    { value: "mandarin", label: "Mandarin Chinese" },
    { value: "spanish", label: "Spanish" },
    { value: "french", label: "French" },
    { value: "arabic", label: "Arabic" },
    { value: "portuguese", label: "Portuguese" },
    { value: "russian", label: "Russian" },
    { value: "indonesian", label: "Indonesian" },
    { value: "japanese", label: "Japanese" },
    { value: "german", label: "German" },
    { value: "nigerian_pidgin", label: "Nigerian Pidgin" },
    { value: "turkish", label: "Turkish" },
    { value: "hausa", label: "Hausa" },
    { value: "vietnamese", label: "Vietnamese" },
    { value: "yue", label: "Yue Chinese (Cantonese)" },
    { value: "swahili", label: "Swahili" },
    { value: "tagalog", label: "Tagalog" },
    { value: "punjabi_western", label: "Western Punjabi" },
    { value: "korean", label: "Korean" },
    { value: "persian", label: "Iranian Persian" },
    { value: "javanese", label: "Javanese" },
    { value: "italian", label: "Italian" },
    { value: "thai", label: "Thai" },
    { value: "amharic", label: "Amharic" },
    { value: "levantine_arabic", label: "Levantine Arabic" },
    { value: "bhojpuri", label: "Bhojpuri" },
    { value: "min_nan", label: "Min Nan Chinese" },
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
      {/* Bio Description */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Bio Description
          </label>
          <Tooltip text="Tell Your Story. This is your chance to connect. Share what you do, why you do it, and how you help people.">
            <Info className="w-4 h-4 text-gray-400 cursor-help" />
          </Tooltip>
        </div>
        <textarea
          value={formData.bio}
          onChange={(e) => handleChange("bio", e.target.value)}
          
          onBlur={() => onBlur("bio")}
          placeholder="Write a short description about yourself. For Example: I am a certified career coach with 5+ years of experience helping professionals navigate career transitions and achieve their goals. I specialize in resume building, interview preparation, and career planning."
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

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div className="col-span-1">
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
        <div className="col-span-1">
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
        <div className="col-span-1">
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
        <div className="col-span-1">
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
        <div className="col-span-1">
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
            <option value="">Select nationality</option>
            <option value="in">Indian</option>
            <option value="cn">Chinese</option>
            <option value="us">American</option>
            <option value="id">Indonesian</option>
            <option value="pk">Pakistani</option>
            <option value="ng">Nigerian</option>
            <option value="br">Brazilian</option>
            <option value="bd">Bangladeshi</option>
            <option value="ru">Russian</option>
            <option value="mx">Mexican</option>
            <option value="jp">Japanese</option>
            <option value="et">Ethiopian</option>
            <option value="ph">Filipino</option>
            <option value="eg">Egyptian</option>
            <option value="vn">Vietnamese</option>
            <option value="cd">Congolese</option>
            <option value="tr">Turkish</option>
            <option value="ir">Iranian</option>
            <option value="de">German</option>
            <option value="th">Thai</option>
            <option value="gb">British</option>
            <option value="fr">French</option>
            <option value="it">Italian</option>
            <option value="tz">Tanzanian</option>
            <option value="za">South African</option>
            <option value="mm">Burmese</option>
            <option value="ke">Kenyan</option>
            <option value="kr">South Korean</option>
            <option value="co">Colombian</option>
            <option value="es">Spanish</option>
            <option value="ug">Ugandan</option>
            <option value="ar">Argentinian</option>
            <option value="dz">Algerian</option>
            <option value="sd">Sudanese</option>
            <option value="ua">Ukrainian</option>
            <option value="iq">Iraqi</option>
            <option value="af">Afghan</option>
            <option value="pl">Polish</option>
            <option value="ca">Canadian</option>
            <option value="ma">Moroccan</option>
            <option value="sa">Saudi Arabian</option>
            <option value="uz">Uzbekistani</option>
            <option value="pe">Peruvian</option>
            <option value="ao">Angolan</option>
            <option value="my">Malaysian</option>
            <option value="gh">Ghanaian</option>
            <option value="mz">Mozambican</option>
            <option value="ye">Yemeni</option>
          </select>
          {errors.nationality && touched.nationality && (
            <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>
          )}
        </div>

        {/* City */}
        <div className="col-span-1">
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
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Number
          </label>
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="tel"
                value={formData.mobile}
                onChange={handlePhoneChange}
                onBlur={() => onBlur("mobile")}
                className={`w-full p-2.5 border ${
                  errors.mobile && touched.mobile ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-1 focus:ring-primary`}
                placeholder="Enter 10-digit phone number"
                maxLength={10}
              />
            </div>
            <div className="flex items-center px-4 py-2 text-sm font-semibold bg-green-100 text-green-800 rounded-full">
              <CircleCheckBig className="w-4 h-4 mr-1 text-primary" />
              Verified
            </div>
          </div>
          {errors.mobile && touched.mobile && (
            <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
          )}
        </div>

        {/* Email Address */}
        <div className="col-span-1">
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
            <div className="flex items-center px-4 py-2 text-sm font-semibold bg-green-100 text-green-800 rounded-full">
              <CircleCheckBig className="w-4 h-4 mr-1 text-primary" />
              Verified
            </div>
          </div>
          {errors.email && touched.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
      </div>

      {/* Languages Known */}
      <div className="mt-6">
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
          className="w-full"
        />
        {errors.languages && touched.languages && (
          <p className="text-red-500 text-sm mt-1">{errors.languages}</p>
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
            className="flex items-center px-4 py-2 gap-2 bg-primary text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
          >
            <span>Add More Link</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
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
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary transition-all duration-200"
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
