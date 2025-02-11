import React from 'react';

const StatCard = ({ number, label }) => (
  <div className="text-center">
    <div className="text-black text-center font-figtree text-lg font-semibold leading-[28px]">{number}</div>
    <div className="text-black text-center font-figtree text-sm font-normal leading-[21px]">{label}</div>
  </div>
);

const ConsultantStats = () => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-black font-figtree text-xl font-semibold leading-[36px]">Consultant Stats</h2>
     <div className="grid grid-cols-2 gap-8 p-4">
        <StatCard number="500+" label="Sessions Completed" />
        <StatCard number="98%" label="Success Rate" />
        <StatCard number="4.9" label="Average Rating" />
        <StatCard number="10+" label="Years Experience" />
      </div>
    </div>
  );
};

export default ConsultantStats;
