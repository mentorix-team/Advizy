import React from 'react';

const ServiceOption = ({ price, duration }) => (
  <button className="w-full bg-[#F8FFF9] hover:bg-[#F0FFF2] border border-[#E5E7EB] rounded-lg py-2 px-4 text-left flex items-center justify-between transition-colors">
    <span>₹{price}/{duration}min</span>
    <span className="text-gray-400">›</span>
  </button>
);

export default ServiceOption;