import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function PhoneNumberValidation({ onValidNumber, value, resetTrigger, onChange }) {
  const [phoneNumber, setPhoneNumber] = useState(value || "");
  const [valid, setValid] = useState(false);

  useEffect(() => {
    setPhoneNumber("");
    setValid(false);
  }, [resetTrigger]);

  const validatePhoneNumber = (number, country) => {
    if (!country || !country.dialCode) return false;
    const dialCode = `+${country.dialCode}`;
    const phoneWithoutCode = number.replace(dialCode, "");
    return (
      phoneWithoutCode.length >= 7 &&
      phoneWithoutCode.length <= 15 &&
      /^[0-9]+$/.test(phoneWithoutCode)
    );
  };

  const handleChange = (value, countryData) => {
    const dialCode = `+${countryData.dialCode}`; // Example: "+1"
    
    // Ensure we properly extract only the mobile number
    let phoneNumberWithoutCode = value.replace(dialCode, "").trim(); 
  
    // Some cases might still have the country code at the beginning due to formatting
    if (phoneNumberWithoutCode.startsWith(countryData.dialCode)) {
      phoneNumberWithoutCode = phoneNumberWithoutCode.replace(countryData.dialCode, "").trim();
    }
  
    setPhoneNumber(value);
    const isValid = validatePhoneNumber(value, countryData);
    setValid(isValid);
  
    if (onChange) {
      onChange({
        countryCode: dialCode,  // Store "+1"
        phoneNumber: phoneNumberWithoutCode,  // Store only "7864516168"
        isValid,
        fullNumber: value, // Full formatted number with country code
      });
    }
  
    if (onValidNumber) {
      onValidNumber(value, isValid, countryData);
    }
  };
  

  return (
    <div className="w-full">
      <div className="relative w-full">
        <PhoneInput
          enableSearch={true}
          autoFormat={true}
          country={"in"} // Default country
          value={phoneNumber}
          onChange={(value, countryData) => handleChange(value, countryData)}
          inputProps={{
            required: true,
            className: "w-full h-10 border border-gray-300 rounded-lg bg-gray-50",
          }}
          containerStyle={{
            width: "100%",
          }}
          inputStyle={{
            width: "100%",
            height: "40px",
            fontSize: "16px",
            borderRadius: "0.5rem",
            backgroundColor: "rgb(249 250 251)",
            paddingLeft: "48px", // Increased padding to accommodate country code
          }}
          buttonStyle={{
            border: "1px solid rgb(209 213 219)",
            borderRadius: "0.5rem 0 0 0.5rem",
            backgroundColor: "rgb(249 250 251)",
            padding: "0 0 0 8px",
            height: "38px",
          }}
          dropdownStyle={{
            width: "300px",
          }}
        />
      </div>
      {!valid && phoneNumber && (
        <p className="text-red-500 text-sm">Please enter a valid phone number.</p>
      )}
    </div>
  );
}

export default PhoneNumberValidation;