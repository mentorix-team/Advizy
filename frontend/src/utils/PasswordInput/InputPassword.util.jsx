import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const PasswordInput = ({ label, placeholder, name, value, onChange, onBlur, showPasswordConditions, error }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Full password regex: at least 8 chars, one lowercase, one uppercase, one digit, one special char
  const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  // Full password regex: single concise rule (min 8 chars, uppercase, lowercase, number, special char)
  const fullRegexValid = PASSWORD_REGEX.test(value || "");
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="block text-sm font-medium text-gray-700 ">{label}{error && <span className="text-red-500">*</span>}</label>}
      <div className="relative">
        <input
          type={isPasswordVisible ? "text" : "password"}
          placeholder={placeholder}
          name={name} // Pass name prop for parent form compatibility
          value={value} // Controlled by parent state
          onChange={onChange} // Use parent's onChange handler
          onBlur={onBlur}
          aria-invalid={!!error}
          className={`w-full h-10 px-4 py-2 pr-12 border rounded-lg bg-gray-50 text-sm placeholder:text-sm text-gray-900 ${
            error ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          {isPasswordVisible ? (
            <FaEye size={20} />
          ) : (
            <FaEyeSlash size={20} />
          )}
        </button>
      </div>
      {showPasswordConditions && (
        <div className={`text-xs ${error && !fullRegexValid ? 'text-red-500' : 'text-gray-500'}`}>
          Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number and a special character.
        </div>
      )}
    </div>
  );
};

export default PasswordInput;
