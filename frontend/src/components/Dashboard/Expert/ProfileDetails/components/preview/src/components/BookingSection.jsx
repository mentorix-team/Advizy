import React from "react";

const TimeSlot = ({ time }) => (
  <button className="w-full border rounded-lg py-2 text-center hover:bg-gray-100 focus:outline-none">
    {time}
  </button>
);

const BookingSection = () => {
  return (
    <div className="bg-white rounded-lg p-6 border">
      <h2 className="text-lg font-bold mb-4">Available Slots</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <TimeSlot time="09:00 AM" />
        <TimeSlot time="14:00 PM" />
        <TimeSlot time="09:00 AM" />
        <TimeSlot time="14:00 PM" />
        <TimeSlot time="09:00 AM" />
        <TimeSlot time="14:00 PM" />
        <TimeSlot time="09:00 AM" />
        <TimeSlot time="14:00 PM" />
        <TimeSlot time="09:00 AM" />
        <TimeSlot time="14:00 PM" />
      </div>
      <button className="w-full bg-teal-600 text-white py-3 rounded-full text-center hover:bg-teal-700">
        BOOK NOW
      </button>
    </div>
  );
};

export default BookingSection;
