import React from 'react';

const PackageOption = ({ duration, price }) => (
  <div className="flex items-center justify-between p-2 border-[1.9px] border-[#F4F4F5] rounded-md bg-white">
    <span className="text-gray-800 font-medium text-base leading-150% font-figtree">
      {duration}
    </span>
    <span class="text-gray-500 text-right font-medium text-base leading-[150%] font-figtree"
    >
      ${price} / Session
    </span>
  </div>
);

export default PackageOption;
