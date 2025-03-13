import React from 'react';

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative inline-flex items-center">
        <input 
          type="checkbox" 
          className="sr-only" 
          checked={checked}
          onChange={onChange}
        />
        <div className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
          checked ? 'bg-green-500' : 'bg-gray-200'
        }`} />
        <div className={`absolute w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${
          checked ? 'translate-x-6' : 'translate-x-0.5'
        }`} />
      </div>
      <span className="ml-3 text-sm font-medium text-gray-700">{label}</span>
    </label>
  );
}

export default Toggle;