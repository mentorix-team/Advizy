import React from 'react';

const NoData = () => {
  return (
    <div className="min-[340px] flex flex-col gap-2 items-center justify-center">
      <div className="text-center">
        <h1 className='text-xl font-bold text-gray-500'>Nothing To See Here</h1>
        <h1 className='font-medium text-gray-400'>You Don't have any Meetings Today</h1>
        </div>
    </div>
  );
};

export default NoData;