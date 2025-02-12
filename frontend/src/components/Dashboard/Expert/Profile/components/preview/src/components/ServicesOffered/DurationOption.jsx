import React from 'react';

const DurationOption = ({ duration, price, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer ${
        isSelected 
          ? 'border-[2px] border-[#16A348] bg-white' 
          : 'border-[1px] border-[#E5E7EB] bg-white'
      } rounded-md p-2 hover:border-[#16A348] transition-colors`}
    >
      <div className="text-sm text-gray-900">{duration} min</div>
      <div className="text-[#16A348] font-medium">€{price}</div>
    </div>
  );
};

export default DurationOption;