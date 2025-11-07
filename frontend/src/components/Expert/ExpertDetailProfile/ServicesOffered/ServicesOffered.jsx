import React, { useMemo } from 'react';
import MentoringCard from './MentoringCard';
import ServiceCard from './ServiceCard';
import { UserCog, Clock } from 'lucide-react';

const ServicesOffered = ({ id, services = [], nextAvailableSlot }) => {
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

  const slotLabel = useMemo(() => {
    if (!nextAvailableSlot || !nextAvailableSlot.time) {
      return null;
    }
    const { day, time } = nextAvailableSlot;
    if (!time) return null;
    return day ? `${day}, ${time}` : time;
  }, [nextAvailableSlot]);

  return (
    <div id={id} className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <div className="pt-2 sm:p-4 mb-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="flex items-center gap-1 text-[#101828] text-lg sm:text-xl font-medium">
            <UserCog className='w-5 h-5 text-primary' />
            Services Offered <span className="text-gray-500 font-normal">(Select service)</span>
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-600 sm:text-right">
            <span className="hidden sm:inline-flex items-center gap-1 font-medium text-gray-700">
              <Clock className="w-4 h-4 text-primary" />
              Next Available Slot:
            </span>
            <span className="sm:hidden font-medium text-gray-700">Next Slot:</span>
            <span className={`text-sm font-semibold ${slotLabel ? 'text-emerald-600' : 'text-gray-400'}`}>
              {slotLabel || 'No slots available'}
            </span>
          </div>
        </div>
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
