import React from 'react';
import { useNavigate } from 'react-router-dom';

const NoData2 = () => {
  const navigate = useNavigate();

  const handleMeeting =() => {
    navigate('/explore')
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent">
      <div className="text-center">
        <img 
          src="/No-data2.svg" 
          alt="coding illustration" 
          className="max-w-lg w-full h-auto mx-auto" 
        />
        <h1 className='py-2 font-medium'>No Meeting Data Found</h1>
        <button
        onClick={handleMeeting}
        className='bg-primary py-2 px-4 rounded-md text-white font-semibold'>Book Meeting</button>
        </div>
    </div>
  );
};

export default NoData2;