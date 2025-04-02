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

  // Load verification status from localStorage on component mount
  useEffect(() => {
    const loadVerificationStatus = () => {
      // Check if email exists and is verified
      const storedEmailVerification = localStorage.getItem('emailVerification');
      if (storedEmailVerification) {
        const { email, verified } = JSON.parse(storedEmailVerification);
        if (email === formData.email) {
          setIsEmailVerified(verified);
        }
      }

      // Check if mobile exists and is verified
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

  // Update verification status when email/mobile changes
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
    // If changing email or mobile, reset verification status
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
      const response = await dispatch(generateOtpforValidating(formData.email));
    }
    if (type === "mobile") {
      const response = await dispatch(generateOtpforValidating(formData.mobile));
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
    <div>
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
            className={`flex-1 p-2.5 border ${
              errors.email && touched.email
                ? "border-red-500"
                : "border-gray-300"
            } rounded-lg focus:ring-1 focus:ring-primary`}
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
  );
};

export default BasicInfo;