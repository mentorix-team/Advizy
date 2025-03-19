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


const MentoringCard = ({ service,onEdit }) => {
  const [selectedDuration, setSelectedDuration] = React.useState(null);
  const [isEnabled, setIsEnabled] = useState(true);
  return (
    <div className="border border-[#16A348] rounded-lg p-4 bg-white">
      <h3 className="text-[#101828] font-medium">{service?.title}</h3>
      <div className="flex items-center gap-3">
         
          <button
            onClick={() => onEdit(service)}
            className={`rounded-full transition-colors ${
              isEnabled ? "hover:bg-gray-100" : "cursor-not-allowed"
            }`}
            disabled={!isEnabled}
          >
            <EditIcon className="w-5 h-4.5 text-gray-600" />
          </button>
        </div>
      <p className="text-sm text-gray-600">{service?.shortDescription}</p>
      <div className="mt-4">
        <ServiceFeatures features={service?.features} />
      </div>
      <div className="grid grid-cols-4 gap-3 mt-4">
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
