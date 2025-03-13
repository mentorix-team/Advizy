import React from 'react';
import MentoringCard from './MentoringCard';
import ServiceCard from './ServiceCard';

const ServicesOffered = ({ services }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <div className="border border-[#E5E7EB] rounded-2xl p-4 sm:p-6 mb-6">
        <h2 className="text-[#101828] text-lg sm:text-xl font-medium mb-1">
          Services Offered <span className="text-gray-500 font-normal">(Select service)</span>
        </h2>
        {/* <div className="text-sm">
          Next Available Slot:{' '}
          <span className="text-[#16A348] underline cursor-pointer">
            Tomorrow, 10:00 AM
          </span>
        </div> */}
      </div>

      <div className="space-y-4">
        <MentoringCard />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.length > 0 ? (
            services.map((service) => (
              <ServiceCard key={service.serviceId} service={service} />
            ))
          ) : (
            <p>No services available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicesOffered;
