import React, { useState } from 'react';
import PhoneSupport from './PhoneSupport';
import FAQSection from './FAQSection';
import RequestCallModal from './RequestCallModal';

function HelpCenter() {
  const [showRequestCall, setShowRequestCall] = useState(false);

  const handleRequestCall = () => {
    setShowRequestCall(true);
  };

  const handleCloseRequestCall = () => {
    setShowRequestCall(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      <h1 className="text-3xl md:text-4xl font-medium text-center my-8">
        How can we <span className="text-green-600 font-semibold">HELP</span> you today?
      </h1>
      
      <div className="max-w-md mx-auto mb-12">
        <PhoneSupport onRequestCall={handleRequestCall} />
      </div>
      
      <FAQSection />
      
      <RequestCallModal 
        isOpen={showRequestCall} 
        onClose={handleCloseRequestCall} 
      />
    </div>
  );
}

export default HelpCenter;