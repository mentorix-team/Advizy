import React from 'react';
import { Phone } from 'lucide-react';

function PhoneSupport({ onRequestCall }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <div className="flex items-center mb-4">
        <div className="bg-green-100 p-3 rounded-lg mr-3">
          <Phone className="text-green-600 h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Phone Support</h2>
          <p className="text-gray-600 text-sm">Speak directly with a support agent</p>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-4">
        We'll get back to you as soon as possible.
      </p>
      
      <button 
        onClick={onRequestCall}
        className="w-full py-2.5 px-4 bg-green-500 hover:bg-green-600 text-white rounded flex items-center justify-center transition-colors duration-300"
      >
        Request Call
        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </div>
  );
}

export default PhoneSupport;