import React from 'react';

const ComingSoon = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Coming Soon!</h1>
        <h2 className="text-2xl text-gray-600 mb-8">We are working on it!</h2>
        <img 
          src="/Coding-bro.svg" 
          alt="coding illustration" 
          className="max-w-4xl w-full h-auto mx-auto" // Increased from max-w-md to max-w-2xl
        />
      </div>
    </div>
  );
};

export default ComingSoon;