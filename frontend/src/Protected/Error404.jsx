import React from 'react';
import { Link } from 'react-router-dom';
import NotFoundSvg from './404 svg/404.svg';

const Error404 = () => {
  return (
    <div className="min-h-screen bg-white py-10 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
          {/* 404 Graphic Section */}
          <div
            className="h-[400px] w-full bg-center bg-no-repeat bg-contain"
            style={{
              backgroundImage: `url(${NotFoundSvg})`,
            }}
            aria-label="Page not found graphic"
            role="img"
          />

          {/* Content Box */}
          <div className="mt-6">
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