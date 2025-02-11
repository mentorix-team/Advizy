import React from 'react';
import PropTypes from 'prop-types';
import { FaCoffee } from 'react-icons/fa';
import ServiceCard from './ServiceCard';

export default function ServicesList({ services, onAddClick }) {
  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 text-green-700">
          <FaCoffee />
          <h2 className="text-lg font-semibold">Services</h2>
        </div>
        <button
          onClick={onAddClick}
          className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600 flex items-center justify-center gap-2"
        >
          <span>+</span> Add Service
        </button>
      </div>

      {services.length === 0 ? (
        <p className="text-gray-500 text-center sm:text-left">Add the services you offer to clients</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}

ServicesList.propTypes = {
  services: PropTypes.arrayOf(PropTypes.object).isRequired,
  onAddClick: PropTypes.func.isRequired
};