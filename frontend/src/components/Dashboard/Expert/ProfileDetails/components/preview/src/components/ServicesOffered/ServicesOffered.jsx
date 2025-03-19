import React, { useEffect } from 'react';
import MentoringCard from './MentoringCard';
import ServiceCard from './ServiceCard';
import { useSelector } from 'react-redux';

const ServicesOffered = ({ services = [] }) => {
  const expertData = useSelector((state) => state.expert.expertData);
  // const services = expertData?.credentials?.services || []; // Fallback to empty array if not available
  const mentoringService = services.find(service => service.title === "One-on-One Mentoring");
  const filteredServices = services.filter(service => service.title !== "One-on-One Mentoring");
  console.log('thhis is ',filteredServices)
  useEffect(() => {
    console.log('Expert Data:', expertData);
    console.log('Services:', services);
  }, [expertData, services]);

  return (
    <div className="bg-white p-6">
      <div className="border border-[#E5E7EB] rounded-2xl p-6 mb-6">
        <h2 className="text-[#101828] text-xl font-medium mb-1">
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
      {mentoringService && <MentoringCard service={mentoringService} />} 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {filteredServices.length > 0 ? (
            filteredServices.map((service, index) => (
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
