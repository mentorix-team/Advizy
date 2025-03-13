import React from 'react';

const DurationOption = ({ duration, price, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`p-3 rounded-lg text-left border ${
      isSelected 
        ? 'border-[#16A348] border-2' 
        : 'border-[#E5E7EB]'
    } hover:border-[#16A348] transition-colors`}
  >
    <div className="text-sm">{duration} min</div>
    <div className="text-[#16A348] font-medium">₹{price}</div>
  </button>
);

const MentoringCard = () => {
  const [selectedDuration, setSelectedDuration] = React.useState('15');
  
  const durations = [
    { time: '15', price: '30' },
    { time: '30', price: '60' },
    { time: '60', price: '120' },
    { time: '90', price: '150' }
  ];

  return (
    <div className="border border-[#16A348] rounded-lg p-4 bg-white">
      <div className="flex items-start gap-2 mb-4">
        <svg className="w-5 h-5 mt-1" viewBox="0 0 20 20" fill="#16A348">
          <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
        </svg>
        <div>
          <h3 className="text-[#101828] font-medium">One-on-One Mentoring</h3>
          <p className="text-sm text-gray-600">Personalized guidance for your career growth and technical challenges</p>
        </div>
      </div>

      <div className="mb-2 text-sm font-medium">Select Duration:</div>
      <div className="grid grid-cols-4 gap-3 mb-4">
        {durations.map(({ time, price }) => (
          <DurationOption
            key={time}
            duration={time}
            price={price}
            isSelected={selectedDuration === time}
            onClick={() => setSelectedDuration(time)}
          />
        ))}
      </div>

      <div className="flex gap-4">
        <button className="flex-1 flex items-center justify-center gap-2 text-[#1D1D1F] text-sm border border-[#000000] rounded-md py-2.5 hover:bg-gray-50">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 14.6667C11.6819 14.6667 14.6667 11.6819 14.6667 8C14.6667 4.3181 11.6819 1.33333 8 1.33333C4.3181 1.33333 1.33333 4.3181 1.33333 8C1.33333 11.6819 4.3181 14.6667 8 14.6667Z" stroke="#98A2B3" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 5.33333V8" stroke="#98A2B3" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 10.6667H8.00667" stroke="#98A2B3" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Show Details
        </button>
        <button className="flex-1 bg-[#16A348] text-white py-2.5 rounded-md hover:bg-[#128A3E] text-sm font-medium">
          Book Session
        </button>
      </div>
    </div>
  );
};

export default MentoringCard;