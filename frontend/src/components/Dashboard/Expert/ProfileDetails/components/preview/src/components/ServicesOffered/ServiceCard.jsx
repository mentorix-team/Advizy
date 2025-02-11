import React from 'react';

const ServiceCard = ({ service }) => {
  const { title, description, duration, price } = service;
  
  return (
    <div className="border rounded-[32px] bg-white border-[#16A348] rounded-2xl p-4 bg-white">
      <div className="flex items-start gap-2 mb-2">
        <svg className="w-5 h-5 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="#16A348">
          <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
        </svg>
        <div>
          <h3 className="text-[#101828] font-medium">{title}</h3>
          <p className="text-sm text-gray-600 leading-snug">{description}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-3 mb-3">
        <svg className="w-4 h-4 text-gray-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span className="text-sm text-gray-600">{duration} min</span>
        <span className="text-[#16A348] text-sm font-medium">₹{price}</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2">
        <button className="flex items-center justify-center gap-2 text-[#1D1D1F] text-sm border border-[#000000] rounded-md px-4 py-2 hover:bg-gray-50 w-full sm:w-auto">
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="none">
            <path d="M8 14.6667C11.6819 14.6667 14.6667 11.6819 14.6667 8C14.6667 4.3181 11.6819 1.33333 8 1.33333C4.3181 1.33333 1.33333 4.3181 1.33333 8C1.33333 11.6819 4.3181 14.6667 8 14.6667Z" stroke="#98A2B3" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 5.33333V8" stroke="#98A2B3" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 10.6667H8.00667" stroke="#98A2B3" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Show Details
        </button>
        <button className="bg-[#16A348] text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-[#128A3E] w-full sm:w-auto text-center">
          Book Session
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;