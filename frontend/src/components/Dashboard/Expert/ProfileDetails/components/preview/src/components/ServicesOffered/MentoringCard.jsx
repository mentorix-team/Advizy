import React, { useState } from 'react';
import { ServiceFeatures } from '@/components/Dashboard/Expert/ServiceAndPricing/ServiceFeatures';
import { EditIcon } from '@/icons/Icons';

const DurationOption = ({ duration, price, enabled, onClick }) => (
  <button
    onClick={onClick}
    className={`p-3 rounded-lg text-left border transition-colors ${
      enabled ? 'border-[#16A348] border-2' : 'border-gray-300 text-gray-400 cursor-not-allowed'
    }`}
    disabled={!enabled}
  >
    <div className="text-sm">{duration} min</div>
    <div className={`font-medium ${enabled ? 'text-[#16A348]' : 'text-gray-400'}`}>₹{price}</div>
  </button>
);

const MentoringCard = ({ service, onEdit }) => {
  const [selectedDuration, setSelectedDuration] = React.useState(null);
  const [isEnabled, setIsEnabled] = useState(true);
  
  return (
    <div className="border border-[#16A348] rounded-lg p-4 bg-white relative w-full max-w-lg mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-4xl">
    <div className="relative">
      <h3 className="text-[#101828] font-medium text-lg sm:text-xl">{service?.title}</h3>
      <button
        onClick={() => onEdit(service)}
        className={`absolute top-0 right-0 rounded-full p-1 transition-colors ${
          isEnabled ? "hover:bg-gray-100" : "cursor-not-allowed"
        }`}
        disabled={!isEnabled}
      >
        <EditIcon className="w-5 h-5 text-gray-600" />
      </button>
    </div>
    <p className="text-sm sm:text-base text-gray-600">{service?.shortDescription}</p>
    <div className="mt-4">
      <ServiceFeatures features={service?.features} />
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
      {service?.one_on_one.map(({ duration, price, enabled, _id }) => (
        <DurationOption
          key={_id}
          duration={duration}
          price={price}
          enabled={enabled}
          onClick={() => enabled && setSelectedDuration(duration)}
        />
      ))}
    </div>
  </div>
  );
  
};

export default MentoringCard;