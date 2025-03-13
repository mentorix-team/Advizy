import React from 'react';

const NoData = () => {
  return (
    <div className="min-[340px] flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <img 
          src="/No-data.svg" 
          alt="coding illustration" 
          className="max-w-lg w-full h-auto mx-auto" // Increased from max-w-md to max-w-2xl
        />
        <h1 className='py-2 text-xl font-bold'>Nothing To See Here</h1>
        <h1 className='py-2 font-medium'>You Don't have any Meetings Today</h1>
        </div>
    </div>
  );
};

export default NoData;