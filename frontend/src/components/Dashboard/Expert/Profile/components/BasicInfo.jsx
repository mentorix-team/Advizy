import React, { useState, useMemo } from "react";
import { Check } from "lucide-react";
import CustomDatePicker from "./CustomDatePicker";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";
import PhoneNumberValidation from "@/utils/PhoneNumberValidation/PhoneNumberValidation.util";
import { useDispatch } from "react-redux";
import { generateOtpforValidating } from "@/Redux/Slices/expert.Slice";
import VerifyThedetails from "@/components/Auth/VerifyThedetails";
import { Toaster } from "react-hot-toast";
import {
  nationalityOptions,
  getCitiesForNationality,
} from "../../ProfileDetails/components/nationalityCities";

// Custom Option component with checkbox
const CustomOption = (props) => {
  const { isSelected, label, innerProps, innerRef } = props;

  return (
    <div
      ref={innerRef}
      {...innerProps}
      className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => { }}
        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
      />
      <span className="ml-2">{label}</span>
    </div>
  );
};

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

  // Convert languages from backend format to Select format
  const convertedLanguages = useMemo(() => {
    if (!formData.languages) return [];

    // If formData.languages is already in the correct format (array of objects)
    if (Array.isArray(formData.languages) && formData.languages.length > 0 &&
      typeof formData.languages[0] === 'object' && formData.languages[0].value) {
      return formData.languages;
    }

    // If formData.languages is an array of strings, convert to objects
    if (Array.isArray(formData.languages)) {
      return formData.languages
        .map(lang => {
          if (typeof lang === 'string') {
            const option = languageOptions.find(opt => opt.value === lang);
            return option || { value: lang, label: lang };
          }
          // If it's already an object but missing properties, ensure it has value and label
          if (typeof lang === 'object') {
            return {
              value: lang.value || lang,
              label: lang.label || lang
            };
          }
          return null;
        })
        .filter(Boolean); // Remove any null values
    }

    return [];
  }, [formData.languages, languageOptions]);

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

    const updatedForm = {
      ...formData,
      [field]: value,
    };

    if (field === "nationality") {
      updatedForm.city = "";
    }

    onUpdate(updatedForm);
  };

  const handlePhoneChange = ({ countryCode, phoneNumber }) => {
    const newMobile = `${countryCode}${phoneNumber}`;

    const savedMobileVerification = localStorage.getItem(
      `mobileVerified_${newMobile}`
    );

    if (savedMobileVerification === "true") {
      // setIsMobileVerified(true); // Restore verification if the mobile matches the previously verified one
    } else {
      // setIsMobileVerified(false); // Otherwise, reset verification
    }
    setPhoneNumber({
      countryCode,
      number: phoneNumber,
    });

    // Update parent form data with both countryCode and mobile number
    onUpdate({
      ...formData,
      countryCode: countryCode,
      mobile: phoneNumber, // This is the actual phone number without country code
    });
  };

  const cityOptions = useMemo(
    () => getCitiesForNationality(formData.nationality),
    [formData.nationality]
  );

  const selectedNationality = useMemo(
    () =>
      nationalityOptions.find((option) => option.value === formData.nationality) || null,
    [formData.nationality]
  );

  const selectedCity = useMemo(
    () => cityOptions.find((option) => option.value === formData.city) || null,
    [cityOptions, formData.city]
  );

  const getSelectStyles = (hasError) => ({
    control: (provided, state) => ({
      ...provided,
      minHeight: "42px",
      borderColor: hasError
        ? "#ef4444"
        : state.isFocused
          ? "#16a34a"
          : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 1px #16a34a" : "none",
      backgroundColor: hasError ? "#fef2f2" : provided.backgroundColor,
      "&:hover": {
        borderColor: state.isFocused ? "#16a34a" : hasError ? "#ef4444" : "#16a34a",
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 20,
    }),
  });

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
            className={`w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-primary text-sm sm:text-base ${errors.firstName && touched.firstName
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
            className={`w-full p-2.5 border ${errors.lastName && touched.lastName
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
            className={`w-full p-2.5 border ${errors.gender && touched.gender
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
          <Select
            value={selectedNationality}
            onChange={(option) => handleChange("nationality", option ? option.value : "")}
            onBlur={() => onBlur("nationality")}
            options={nationalityOptions}
            placeholder="Select nationality"
            classNamePrefix="advizy-select"
            isClearable
            styles={getSelectStyles(errors.nationality && touched.nationality)}
            menuPlacement="bottom"
            menuShouldScrollIntoView={false}
          />
          {errors.nationality && touched.nationality && (
            <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <Select
            value={selectedCity}
            onChange={(option) => handleChange("city", option ? option.value : "")}
            onBlur={() => onBlur("city")}
            options={formData.nationality ? cityOptions : []}
            placeholder={formData.nationality ? "Select city" : "Select nationality first"}
            classNamePrefix="advizy-select"
            isDisabled={!formData.nationality}
            isClearable
            styles={getSelectStyles(errors.city && touched.city)}
            menuPlacement="bottom"
            menuShouldScrollIntoView={false}
            noOptionsMessage={() => "No cities available"}
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
              className={`flex-1 p-2.5 border ${errors.email && touched.email
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
          value={convertedLanguages} // Use the converted languages
          onChange={(value) => {
            // Convert the Select component's value format to match your form data structure
            handleChange("languages", value || []);
          }}
          className={`${errors.languages && touched.languages
            ? "border-red-500"
            : "border-gray-300"
            }`}
          components={{
            Option: CustomOption
          }}
          closeMenuOnSelect={false}
          menuPlacement="bottom"
          menuShouldScrollIntoView={false}
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