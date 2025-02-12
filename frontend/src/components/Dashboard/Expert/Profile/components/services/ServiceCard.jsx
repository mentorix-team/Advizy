import React from 'react';
import PropTypes from 'prop-types';
import { FaEdit, FaTrash, FaClock, FaDollarSign } from 'react-icons/fa';

export default function ServiceCard({ service }) {
  return (
    <div className="border rounded-lg p-3 sm:p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-sm sm:text-base">{service.serviceName}</h3>
        <div className="flex gap-2">
          <button className="text-gray-500 hover:text-primary">
            <FaEdit className="text-sm sm:text-base" />
          </button>
          <button className="text-gray-500 hover:text-red-500">
            <FaTrash className="text-sm sm:text-base" />
          </button>
        </div>
      </div>
      
      <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">{service.shortDescription}</p>
      
      <div className="space-y-2">
        {service.timeSlots?.map((slot, index) => (
          <div key={index} className="flex items-center gap-3 text-xs sm:text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <FaClock /> {slot.duration}min
            </span>
            <span className="flex items-center gap-1">
              <FaDollarSign /> {slot.price}
            </span>
          </div>
        ))}
      </div>
      
      {service.features?.length > 0 && (
        <div className="mt-3 sm:mt-4">
          <p className="text-xs sm:text-sm font-medium mb-1 sm:mb-2">Features:</p>
          <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
            {service.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="text-primary">•</span> {feature}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

ServiceCard.propTypes = {
  service: PropTypes.shape({
    serviceName: PropTypes.string.isRequired,
    shortDescription: PropTypes.string.isRequired,
    timeSlots: PropTypes.arrayOf(PropTypes.shape({
      duration: PropTypes.number.isRequired,
      price: PropTypes.number.isRequired
    })),
    features: PropTypes.arrayOf(PropTypes.string)
  }).isRequired
};