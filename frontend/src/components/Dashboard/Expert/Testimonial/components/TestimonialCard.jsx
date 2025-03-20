import React, { useState } from 'react';
import StarRating from './StarRating';
import ResponseModal from './ResponseModal';

const TestimonialCard = ({ testimonial, onRespond }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleResponse = (response) => {
    onRespond(testimonial.id, response);
  };

  return (
    <>
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Side - Client Info */}
          <div className="w-full md:w-1/3">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-lg font-medium">{testimonial.name[0]}</span>
                </div>
              </div>
              {/* Client Details */}
              <div>
                <h3 className="text-lg font-medium text-gray-900">{testimonial.name}</h3>
                <div className="mt-1 space-y-1">
                  <p className="text-gray-600">Duration: {testimonial.duration}</p>
                  <p className="text-gray-600">Service: {testimonial.service}</p>
                </div>
              </div>
            </div>
          </div>
  
          {/* Right Side - Review Content */}
          <div className="w-full md:w-2/3">
            {/* Rating and Date */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <StarRating rating={testimonial.rating} />
              <span className="text-gray-500 text-sm">{testimonial.date}</span>
            </div>
  
            {/* Review Text */}
            <p className="text-gray-700 mb-4">{testimonial.comment}</p>
  
            {/* Response Section */}
            {testimonial.hasResponse && (
              <div className="mb-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Your Response</h4>
                  <p className="text-gray-600">{testimonial.response}</p>
                </div>
              </div>
            )}
  
            {/* Response Button */}
            <div className="flex justify-start">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {testimonial.hasResponse ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  )}
                </svg>
                {testimonial.hasResponse ? 'Update Response' : 'Add Response'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <ResponseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleResponse}
        initialResponse={testimonial.response || ''}
      />
    </>
  );
};

export default TestimonialCard;