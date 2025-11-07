import React, { useState } from "react";
import { FaEye, FaEyeSlash  } from "react-icons/fa";

const LoginPasswordInput = ({ label, placeholder, name, value, onChange, onBlur, error }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => setIsPasswordVisible((s) => !s);

  return (
    <div className="flex flex-col">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="relative ">
        <input
          type={isPasswordVisible ? "text" : "password"}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`w-full h-10 px-4 py-2 pr-12 border rounded-lg bg-gray-50 text-sm placeholder:text-sm  text-gray-900 `}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-600 hover:text-gray-800 focus:outline-none"
          aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
        >
          {isPasswordVisible ? (
            <FaEye size={24} />
          ) : (
            <FaEyeSlash size={24} />
          )}
        </button>
      </div>
    </div>
  );
};

export default LoginPasswordInput;
