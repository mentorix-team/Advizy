import React, { useState, useEffect } from 'react';

const ResponseModal = ({ isOpen, onClose, onSubmit, initialResponse = '' }) => {
  const [response, setResponse] = useState('');

  // Update response when modal opens with initial response
  useEffect(() => {
    if (isOpen) {
      setResponse(initialResponse);
    }
  }, [isOpen, initialResponse]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(response);
    setResponse('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Respond to Testimonial</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-gray-600 mb-4">Your response will be visible to the client and other users.</p>
          <textarea
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Type your response here..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
          >
            Send Response
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResponseModal;