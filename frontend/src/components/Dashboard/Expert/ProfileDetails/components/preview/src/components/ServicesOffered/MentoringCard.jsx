import React, { useState } from 'react';
import { Edit } from 'lucide-react';
import { ServiceFeatures } from '@/components/Dashboard/Expert/ServiceAndPricing/ServiceFeatures';

import ConfirmDialog from '@/components/Dashboard/Expert/ServiceAndPricing/ConfirmDialog';

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

const MentoringCard = ({ service, onEdit, onToggle }) => {
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [isEnabled, setIsEnabled] = useState(true);
  const [showToggleConfirm, setShowToggleConfirm] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleToggleConfirm = () => {
    if (isEnabled) {
      setShowToggleConfirm(true);
    } else {
      handleToggle();
    }
  };

  const handleToggle = () => {
    setIsEnabled(!isEnabled);
    onToggle?.(!isEnabled);
    setShowToggleConfirm(false);
  };

  if (!service) return null;

  return (
    <div className={`border rounded-lg p-4 bg-white relative w-full max-w-lg mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-4xl transition-colors ${
      isEnabled ? 'border-[#16A348]' : 'border-gray-300'
    }`}>
      <ConfirmDialog
        isOpen={showToggleConfirm}
        message="Are you sure you want to turn off your service?"
        onConfirm={handleToggle}
        onCancel={() => setShowToggleConfirm(false)}
      />

      <div className="flex justify-between items-start">
        <h3 className={`text-lg sm:text-xl font-medium ${
          isEnabled ? 'text-[#101828]' : 'text-gray-500'
        }`}>
          {service.title}
        </h3>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={handleToggleConfirm}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${
                isEnabled ? 'bg-[#16A348] text-white' : 'bg-gray-300 text-gray-500'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            {showTooltip && isEnabled && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-md whitespace-nowrap">
                Click to toggle service status
              </div>
            )}
          </div>
          <button
            onClick={() => onEdit(service)}
            className={`rounded-full p-1 transition-colors ${
              isEnabled ? 'hover:bg-gray-100' : 'cursor-not-allowed'
            }`}
            disabled={!isEnabled}
          >
            <Edit className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <p className={`text-sm sm:text-base mt-2 ${
        isEnabled ? 'text-gray-600' : 'text-gray-400'
      }`}>
        {service.shortDescription}
      </p>

      <div className="mt-4">
        <ServiceFeatures features={service.features} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
        {service.one_on_one.map(({ duration, price, enabled, _id }) => (
          <DurationOption
            key={_id}
            duration={duration}
            price={price}
            enabled={enabled && isEnabled}
            onClick={() => enabled && isEnabled && setSelectedDuration(duration)}
          />
        ))}
      </div>
    </div>
  );
};


export default MentoringCard;