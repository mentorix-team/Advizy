import React, { useState } from 'react';
import TimeSlot from './TimeSlot';
import PackageOption from './PackageOption';

const BookingSection = () => {
  const [selectedPackage, setSelectedPackage] = useState('one-time');

  const packages = [
    { duration: '50 Mins', price: '80.00' },
    { duration: '100 Mins', price: '150.00' },
    { duration: '150 Mins', price: '220.00' },
  ];

  const timeSlots = [
    { morning: '09:00 AM', afternoon: '14:00 PM' },
    { morning: '09:00 AM', afternoon: '14:00 PM' },
    { morning: '09:00 AM', afternoon: '14:00 PM' },
    { morning: '09:00 AM', afternoon: '14:00 PM' },
    { morning: '09:00 AM', afternoon: '14:00 PM' },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-4">Book a Session</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-gray-700 mb-2">Select a package</h3>
          <button className="w-full p-3 rounded-lg bg-white text-center border-[6px] ">
            One-time
          </button>
        </div>

        <div className="space-y-2">
          {packages.map((pkg, index) => (
            <PackageOption
              key={index}
              duration={pkg.duration}
              price={pkg.price}
            />
          ))}
        </div>

        <div>
          <h3 class="text-black font-medium text-lg leading-[150%] font-figtree mb-2" >Select a Date</h3>
          <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
        </div>

        <div>
          <h3 class="text-black font-medium text-xl leading-[150%] font-figtree mb-2"          >Available Slots</h3>
          <div className="grid grid-cols-2 gap-3 text-center">
            {timeSlots.map((slot, index) => (
              <React.Fragment key={index}>
                <TimeSlot time={slot.morning} />
                <TimeSlot time={slot.afternoon} />
              </React.Fragment>
            ))}
          </div>
        </div>

        <button className="w-full bg-[#508689] text-white py-3 rounded-lg hover:bg-[#4a7262] transition-colors">
          BOOK NOW
        </button>
      </div>
    </div>
  );
};

export default BookingSection;