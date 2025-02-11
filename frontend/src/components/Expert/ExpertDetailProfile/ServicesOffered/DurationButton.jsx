import React from 'react';

const DurationButton = ({ time, price, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-md text-left ${
        isSelected 
          ? 'border-2 border-[#16A348]' 
          : 'border border-[#E5E7EB]'
      }`}
    >
      <div className="text-sm">{time} min</div>
      <div className="text-[#16A348] font-medium">₹{price}</div>
    </button>
  );
};

export default DurationButton;