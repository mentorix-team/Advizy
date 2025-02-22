import React from 'react';

const NoUpcoming = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-transparent">
      <div className="text-center">
        <img 
          src="/Calendar.svg" 
          alt="Calendar iilustrations" 
          className="max-w-xl h-auto mx-auto" 
        />
        <h1 className='mb-1 font-medium'>No Upcoming Sessions.</h1>
        </div>
    </div>
  );
};

export default NoUpcoming;