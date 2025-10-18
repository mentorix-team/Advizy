import React, { useMemo } from 'react';
import MentoringCard from './MentoringCard';
import ServiceCard from './ServiceCard';
import { UserCog } from 'lucide-react';

const ServicesOffered = ({ id, services = [] }) => {
  const visibleServices = useMemo(
    () => services.filter((service) => service?.showMore),
    [services]
  );

  const mentoringService = useMemo(
    () => visibleServices.find((service) => service.title === 'One-on-One Mentoring'),
    [visibleServices]
  );

  const filteredServices = useMemo(
    () =>
      visibleServices.filter((service) => service.title !== 'One-on-One Mentoring'),
    [visibleServices]
  );
  return (
    <div id={id} className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <div className="pt-2 sm:p-4 mb-2">
        <h2 className="flex items-center gap-1 text-[#101828] text-lg sm:text-xl font-medium mb-1">
          <UserCog className='w-5 h-5 text-primary' />
          Services Offered <span className="text-gray-500 font-normal">(Select service)</span>
        </h2>
      </div>

      <div className="space-y-4">
        {mentoringService && <MentoringCard mentoringService={mentoringService} />}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <ServiceCard key={service.serviceId || service._id} service={service} />
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
