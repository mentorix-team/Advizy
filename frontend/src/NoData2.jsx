import React from 'react';

const NoData2 = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <img 
          src="/No-data2.svg" 
          alt="coding illustration" 
          className="max-w-lg w-full h-auto mx-auto" // Increased from max-w-md to max-w-2xl
        />
        <h1 className='py-2 font-medium'>It seems you don't have any data</h1>
        <button className='bg-primary py-2 px-4 rounded-md text-white font-semibold'>Button</button>
        </div>
    </div>
  );
};

export default NoData2;