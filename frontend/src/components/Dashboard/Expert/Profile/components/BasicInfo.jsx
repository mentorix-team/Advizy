import React, { useState } from "react";
import { Check } from "lucide-react";
import CustomDatePicker from "./CustomDatePicker";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";
import PhoneNumberValidation from "@/utils/PhoneNumberValidation/PhoneNumberValidation.util";
import { useDispatch } from "react-redux";
import { generateOtpforValidating } from "@/Redux/Slices/expert.Slice";
import VerifyThedetails from "@/components/Auth/VerifyThedetails";
import { Toaster } from "react-hot-toast";

const BasicInfo = ({
  formData,
  onUpdate,
  errors,
  touched,
  onBlur,
  // isEmailVerified,
  // isMobileVerified,
  // onVerificationSuccess,
  // setIsEmailVerified,
  // setIsMobileVerified,
  // showMobileVerification,
}) => {
  const dispatch = useDispatch();
  // const [showOtpPopup, setShowOtpPopup] = useState(false);
  // const [contactInfo, setContactInfo] = useState("");
  // const [verificationType, setVerificationType] = useState("");
  const [phoneNumber, setPhoneNumber] = useState({
    countryCode: formData.countryCode || "",
    number: formData.mobile || "",
  });

  const handleChange = (field, value) => {
    if (field === "email") {
      const savedEmailVerification = localStorage.getItem(
        `emailVerified_${value}`
      );

      // if (savedEmailVerification === "true") {
      //   setIsEmailVerified(true); // Restore verification if the email matches the previously verified one
      // } else {
      //   setIsEmailVerified(false); // Otherwise, reset verification
      // }
    }

    onUpdate({ ...formData, [field]: value });
  };

  const handlePhoneChange = ({ countryCode, phoneNumber }) => {
    const newMobile = `${countryCode}${phoneNumber}`;

    const savedMobileVerification = localStorage.getItem(
      `mobileVerified_${newMobile}`
    );

    if (savedMobileVerification === "true") {
      setIsMobileVerified(true); // Restore verification if the mobile matches the previously verified one
    } else {
      setIsMobileVerified(false); // Otherwise, reset verification
    }
    setPhoneNumber({
      countryCode,
      number: phoneNumber,
    });
  };

  const handleVerifyClick = async (type) => {
    if (type === "mobile") {
      // Update the form data with current phone number only when verifying
      onUpdate({
        ...formData,
        countryCode: phoneNumber.countryCode,
        mobile: phoneNumber.number,
      });
    }

    setVerificationType(type);
    setContactInfo(
      type === "email"
        ? formData.email
        : phoneNumber.countryCode + phoneNumber.number
    );
    // setShowOtpPopup(true);

    try {
      if (type === "email") {
        await dispatch(generateOtpforValidating(formData.email));
      } else if (type === "mobile") {
        await dispatch(generateOtpforValidating(phoneNumber.number));
      }
    } catch (error) {
      console.error("Error generating OTP:", error);
    }
  };

  const handleOtpVerificationSuccess = () => {
    setShowOtpPopup(false);
    onVerificationSuccess(verificationType);
  };

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

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
      <Toaster position="top-right" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* First Name */}
        <div>
          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            onBlur={() => onBlur("firstName")}
            placeholder="John"
            className={`w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-primary text-sm sm:text-base ${
              errors.firstName && touched.firstName
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {errors.firstName && touched.firstName && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">
              {errors.firstName}
            </p>
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
            Nationality <span className="text-red-500">*</span>
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City <span className="text-red-500">*</span>
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
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <div className="flex-1">
              <PhoneNumberValidation
                country={"in"}
                value={phoneNumber.countryCode + phoneNumber.number}
                onChange={handlePhoneChange}
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
            {/* <button
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
            </button> */}
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
              placeholder="name@example.com"
              className={`flex-1 p-2.5 border ${
                errors.email && touched.email
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-lg focus:ring-1 focus:ring-primary`}
            />
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
          className={`${
            errors.languages && touched.languages
              ? "border-red-500"
              : "border-gray-300"
          }`}
        />
        {errors.languages && touched.languages && (
          <p className="text-red-500 text-sm mt-1">{errors.languages}</p>
        )}
      </div>

      {/* {showOtpPopup && (
        <VerifyThedetails
          onClose={() => setShowOtpPopup(false)}
          onSwitchView={handleOtpVerificationSuccess}
          contactInfo={contactInfo}
        />
      )} */}
    </div>
  );
};

export default BasicInfo;