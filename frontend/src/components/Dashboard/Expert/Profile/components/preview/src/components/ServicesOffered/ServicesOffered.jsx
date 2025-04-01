import React from 'react';
import MentoringCard from './MentoringCard';
import ServiceCard from './ServiceCard';

const ServicesOffered = ({ services = [] }) => {
  return (
    <div className="bg-white p-6">
      <div className=" rounded-2xl p-6 mb-6">
        <h2 className="text-[#101828] text-2xl font-medium mb-1">
          Services Offered <span className="text-gray-500 font-normal">(Select service)</span>
        </h2>
        <div className="text-sm">
          Next Available Slot:{' '}
          <span className="text-[#16A348] underline cursor-pointer">
            Tomorrow, 10:00 AM
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <MentoringCard />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {services.length > 0 ? (
            services.map((service, index) => (
              <ServiceCard key={service._id || index} service={service} />
            ))
          ) : (
            <p className="text-gray-500">No services available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicesOffered;
