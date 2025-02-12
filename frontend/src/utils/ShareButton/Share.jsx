import { VerifiedTickIcon } from "@/icons/Icons";
import React, { useState } from "react";

export default function Share({ onClose }) {
  const link = "https://www.aisoul.in/";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);

    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 600);
  };

  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[400px] relative">
        {/* Close Button */}
        <button
          className="absolute top-3 right-5 text-gray-700 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-4">Share link</h2>

        <div className="flex items-center gap-2">
          {/* Disabled Input Field */}
          <input
            type="text"
            value={link}
            disabled
            className="w-64 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
          />

          {/* Copy/Paste Button */}
          <button
            onClick={handleCopy}
            className="px-3 py-2 border border-gray-300 rounded-md transition-all duration-200"
          >
            {/* Smooth Transition between Copy and Paste Icons */}
            {!copied ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#16A348" 
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-copy"
              >
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
              </svg>
            ) : (
              // <svg
              //   xmlns="http://www.w3.org/2000/svg"
              //   viewBox="0 0 48 48"
              //   className="PasteIcon"
              //   width="24"
              //   height="24"
              // >
              //   <path
              //     d="M38 4h-8.37c-.82-2.32-3.02-4-5.63-4s-4.81 1.68-5.63 4H10C7.79 4 6 5.79 6 8v32c0 2.21 1.79 4 4 4h28c2.21 0 4-1.79 4-4V8c0-2.21-1.79-4-4-4zM24 4c1.1 0 2 .89 2 2s-.9 2-2 2-2-.89-2-2 .9-2 2-2zm14 36H10V8h4v6h20V8h4v32z"
              //     fill="#34a853"
              //     className="color000000 svgShape"
              //   ></path>
              //   <path fill="none" d="M0 0h48v48H0z"></path>
              // </svg>
              <VerifiedTickIcon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
