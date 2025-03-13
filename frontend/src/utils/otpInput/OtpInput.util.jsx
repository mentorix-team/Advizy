import { useState, useRef } from "react";

function OTPInput({ count, onOTPComplete }) {
  const [otps, setOtps] = useState(new Array(count).fill(""));
  const inputRefs = useRef([]);

  const handleInputChange = (index) => (event) => {
    const { value } = event.target;

    if (!/^\d*$/.test(value)) return;

    setOtps((prev) => {
      const newOtps = [...prev];
      newOtps[index] = value.slice(-1);
      return newOtps;
    });

    const updatedOtp = [...otps.slice(0, index), value, ...otps.slice(index + 1)].join("");
    if (updatedOtp.length === count) {
      onOTPComplete(updatedOtp);
    }

    if (value && index < count - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index) => (event) => {
    const { key } = event;

    // Handle Backspace
    if (key === "Backspace" && index > 0 && !otps[index]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleFocus = (index) => () => {
    inputRefs.current[index]?.select();
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData("text/plain").trim();
    
    // Only proceed if pasted content contains numbers
    if (!/^\d+$/.test(pastedData)) return;

    const pastedArray = pastedData.split("").slice(0, count);
    
    setOtps((prev) => {
      const newOtps = [...prev];
      pastedArray.forEach((value, index) => {
        if (index < count) {
          newOtps[index] = value;
        }
      });
      return newOtps;
    });

    // Focus on the next empty input or the last input
    const nextEmptyIndex = Math.min(pastedArray.length, count - 1);
    inputRefs.current[nextEmptyIndex]?.focus();

    // If we have a complete OTP, call the callback
    if (pastedArray.length >= count) {
      onOTPComplete(pastedArray.join("").slice(0, count));
    }
  };

  return (
    <div className="flex space-x-2">
      {otps.map((value, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          value={value}
          onChange={handleInputChange(index)}
          onKeyDown={handleKeyDown(index)}
          onFocus={handleFocus(index)}
          onPaste={index === 0 ? handlePaste : undefined}
          className="w-11 h-12 text-center text-xl font-medium border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-[#169544]"
          maxLength="1"
          inputMode="numeric"
          autoComplete="one-time-code"
        />
      ))}
    </div>
  );
}

export default OTPInput;