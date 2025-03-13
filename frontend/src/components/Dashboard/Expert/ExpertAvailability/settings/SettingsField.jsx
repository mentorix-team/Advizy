import React from "react";

function SettingsField({ labelIcon, label, description, children }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-200">
      {/* Left Section: LabelIcon, Label, and Description */}
      <div className="flex items-start gap-2 flex-1">
        {/* Icon */}
        {labelIcon && <div className="mt-3">{labelIcon}</div>}

        {/* Label and Description */}
        <div className="flex flex-col items-start">
          <label className="text-base font-medium text-gray-900">{label}</label>
          {description && (
            <p className="text-sm text-gray-700 mt-1">{description}</p>
          )}
        </div>
      </div>

      {/* Right Section: Dropdown */}
      <div className="ml-4">{children}</div>
    </div>
  );
}

export default SettingsField;
