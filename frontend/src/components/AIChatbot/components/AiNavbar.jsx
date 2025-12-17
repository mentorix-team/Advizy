import React from 'react';
import { useNavigate } from 'react-router-dom';

const AiNavbar = ({ onSearch }) => {
  const navigate = useNavigate();
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-transparent backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center font-bold text-gray-900">
              <img src="/FooterLogo104.99&44.svg" alt="Advizy Logo" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AiNavbar;