import React from 'react';
import { Link } from 'react-router-dom';

const Error404 = () => {
  return (
    <div className="min-h-screen bg-white py-10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* 404 Animated Section */}
          <div 
            className="h-[400px] bg-center bg-no-repeat"
            style={{
              backgroundImage: "url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)"
            }}
          >
            <h1 className="text-8xl">404</h1>
          </div>

          {/* Content Box */}
          <div className="-mt-12">
            <h3 className="text-2xl font-bold mb-4">
              Look like you're lost
            </h3>
            <p className="text-gray-600 mb-6">
              The page you are looking for is not available!
            </p>
            <Link 
              to="/" 
              className="inline-block px-6 py-3 bg-[#169544] border rounded-md text-white hover:bg-[#2d8a26] transition-colors"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error404;