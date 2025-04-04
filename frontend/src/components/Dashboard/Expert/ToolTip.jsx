import React, { useState } from 'react';

function Tooltip({ text, children }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="inline-block"
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-10 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm tooltip dark:bg-gray-700 -top-16 left-1/2 transform -translate-x-1/2 min-w-[200px] max-w-xs">
          {text}
          <div className="tooltip-arrow absolute left-1/2 -bottom-1 w-2 h-2 bg-gray-900 transform rotate-45 -translate-x-1/2"></div>
        </div>
      )}
    </div>
  );
}

export default Tooltip;