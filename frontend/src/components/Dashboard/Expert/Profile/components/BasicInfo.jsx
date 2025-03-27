import React, { useState } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import PhoneInput from "react-phone-input-2";
import { FaPlus } from "react-icons/fa";
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

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  gender: Yup.string().required('Gender is required'),
  dateOfBirth: Yup.string().required('Date of birth is required'),
  nationality: Yup.string().required('Nationality is required'),
  city: Yup.string().required('City is required'),
  mobile: Yup.string().required('Mobile number is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  languages: Yup.array().min(1, 'Please select at least one language')
});

const BasicInfo = ({ formData, onUpdate, errors, touched, onBlur }) => {
  const dispatch = useDispatch();
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [contactInfo, setContactInfo] = useState("");
  const [verificationType, setVerificationType] = useState("");

  const formik = useFormik({
    initialValues: formData,
    validationSchema,
    onSubmit: (values) => {
      onUpdate(values);
    },
    validateOnBlur: true,
    validateOnChange: true
  });

  const handleChange = (field, value) => {
    formik.setFieldValue(field, value);
    onUpdate({ ...formData, [field]: value });
  };

  console.log("This is formdata passed to basic", formData);
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

  const handlePhoneChange = ({ countryCode, phoneNumber, isValid }) => {
    if (isValid) {
      handleChange('countryCode', countryCode);
      handleChange('mobile', phoneNumber);
      formik.setFieldTouched('mobile', true);
    }
  };

  const handleVerifyClick = async (type) => {
    setVerificationType(type);
    setContactInfo(
      type === "email" ? formData.email : formData.countryCode + formData.mobile
    );
    setShowOtpPopup(true);
    if (type == "email") {
      const response = await dispatch(generateOtpforValidating(formData.email));
    }
    if (type == "mobile") {
      const response = await dispatch(
        generateOtpforValidating(formData.mobile)
      );
    }
  };

  const handleOtpVerificationSuccess = () => {
    setShowOtpPopup(false);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
      <Toaster position="top-right" />
      
      {/* Info Banner */}
      <div className="bg-[#F0FFF2] p-4 sm:p-6 md:p-8 rounded-lg mb-6 sm:mb-8 lg:mb-10 flex flex-col items-start text-center sm:text-left">
        <h3 className="text-[#16A348] text-lg sm:text-xl md:text-2xl font-semibold mb-2">
          Why Basic Info Matters
        </h3>
        <p className="text-[#16A348] text-sm sm:text-base md:text-lg leading-relaxed">
          Your basic information is the first thing potential clients see. A
          complete and professional profile increases your chances of making a
          great first impression and attracting more clients.
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* First Name */}
        <div>
          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="firstName"
            value={formik.values.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            onBlur={formik.handleBlur}
            placeholder="John"
            className={`w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-primary text-sm sm:text-base ${
              formik.touched.firstName && formik.errors.firstName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {formik.touched.firstName && formik.errors.firstName && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">{formik.errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="lastName"
            value={formik.values.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            onBlur={formik.handleBlur}
            placeholder="Doe"
            className={`w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-primary ${
              formik.touched.lastName && formik.errors.lastName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {formik.touched.lastName && formik.errors.lastName && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">{formik.errors.lastName}</p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            name="gender"
            value={formik.values.gender}
            onChange={(e) => handleChange("gender", e.target.value)}
            onBlur={formik.handleBlur}
            className={`w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-primary ${
              formik.touched.gender && formik.errors.gender ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {formik.touched.gender && formik.errors.gender && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">{formik.errors.gender}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <CustomDatePicker
            selectedDate={formik.values.dateOfBirth ? new Date(formik.values.dateOfBirth) : null}
            onChange={(date) => {
              handleChange("dateOfBirth", date.toISOString().split("T")[0]);
              formik.setFieldTouched('dateOfBirth', true);
            }}
            type="dob"
          />
          {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">{formik.errors.dateOfBirth}</p>
          )}
        </div>

        {/* Nationality */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nationality <span className="text-red-500">*</span>
          </label>
          <select
            name="nationality"
            value={formik.values.nationality}
            onChange={(e) => handleChange("nationality", e.target.value)}
            onBlur={formik.handleBlur}
            className={`w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-primary ${
              formik.touched.nationality && formik.errors.nationality ? "border-red-500" : "border-gray-300"
            }`}
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
          {formik.touched.nationality && formik.errors.nationality && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">{formik.errors.nationality}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="city"
            value={formik.values.city}
            onChange={(e) => handleChange("city", e.target.value)}
            onBlur={formik.handleBlur}
            placeholder="New Delhi"
            className={`w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-primary ${
              formik.touched.city && formik.errors.city ? "border-red-500" : "border-gray-300"
            }`}
          />
          {formik.touched.city && formik.errors.city && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">{formik.errors.city}</p>
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
                value={formik.values.countryCode + formik.values.mobile}
                onChange={handlePhoneChange}
                inputProps={{
                  required: true,
                  className: `w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-primary pl-12 ${
                    formik.touched.mobile && formik.errors.mobile ? "border-red-500" : "border-gray-300"
                  }`,
                }}
                containerClass="phone-input"
                buttonClass="phone-input-button"
                dropdownClass="phone-input-dropdown"
              />
            </div>
          </div>
          {formik.touched.mobile && formik.errors.mobile && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">{formik.errors.mobile}</p>
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
              name="email"
              value={formik.values.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={formik.handleBlur}
              placeholder="john@example.com"
              className={`flex-1 p-2.5 border rounded-lg focus:ring-1 focus:ring-primary ${
                formik.touched.email && formik.errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">{formik.errors.email}</p>
          )}
        </div>

        {/* Languages Known */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Languages Known <span className="text-red-500">*</span>
          </label>
          <Select
            name="languages"
            options={languageOptions}
            isMulti
            value={formik.values.languages}
            onChange={(value) => handleChange("languages", value)}
            onBlur={() => formik.setFieldTouched('languages', true)}
            className={formik.touched.languages && formik.errors.languages ? 'border-red-500' : ''}
          />
          {formik.touched.languages && formik.errors.languages && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">{formik.errors.languages}</p>
          )}
        </div>
      </form>

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