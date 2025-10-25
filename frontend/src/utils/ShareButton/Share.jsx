import { VerifiedTickIcon } from "@/icons/Icons";
import React, { useState } from "react";

export default function Share({ onClose, redirect_url }) {
  const link = `https://www.advizy.in/expert/${redirect_url}`;
  const [copied, setCopied] = useState(false);
  const customMessage = `Check out this expert on Advizy\n${link}\nExplore his page and services`;

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);

    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 600);
  };

  const handleShare = async () => {
    try {
      // Check if Web Share API is supported
      if (navigator.share) {
        await navigator.share({
          title: "Expert Profile on Advizy",
          text: customMessage,
        });
      } else {
        // Fallback: Copy the message to clipboard
        await navigator.clipboard.writeText(customMessage);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
      onClose();
    } catch (err) {
      console.error("Failed to share:", err);
      // Fallback: Copy the message to clipboard
      try {
        await navigator.clipboard.writeText(customMessage);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (copyErr) {
        console.error("Failed to copy:", copyErr);
      }
    }
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

        <div className="flex items-center gap-2 mb-4">
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
              <VerifiedTickIcon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16,6 12,2 8,6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          Share Expert Profile
        </button>
      </div>
    </div>
  );
}
