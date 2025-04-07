import { getServicebyid } from "@/Redux/Slices/expert.Slice";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const ServiceDetailsModal = ({ isOpen, onClose, service,expertId }) => {
  if (!isOpen) return null;
  const navigate = useNavigate()
  const dispatch= useDispatch()
  console.log("Tihis is service open",service)
  const handleBook = async () => {
    
      console.log('Dispatching getServicebyid...');
      // const expertId = selectedExpert.expert._id;
      const serviceId = service.serviceId
      try {
        await dispatch(getServicebyid({ serviceId, expertId })).unwrap();
        navigate(`/expert/scheduling/${serviceId}`);
      } catch (error) {
        console.error('Failed to fetch service details:', error);
      }
    // } else {
    //   console.error('Cannot dispatch getServicebyid - missing expertId or serviceId');
    // }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-medium">{service?.title || "Service Details"}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
            aria-label="Close modal"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Description Section */}
        <div className="mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-medium mb-2">Description:</h3>
          <p className="text-gray-600 text-sm sm:text-base">{service?.shortDescription || "No description available."}</p>
        </div>
          {/* Duration & Price Section */}
          {service?.one_on_one?.length > 0 ? (
            <div className="mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Select Duration:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
                {service.one_on_one
                  .filter(opt => opt.enabled)
                  .map((option, idx) => (
                    <div
                      key={idx}
                      className="p-3 border rounded-xl text-center bg-gray-50 hover:bg-gray-100 transition"
                    >
                      <div className="text-sm font-medium">{option.duration} min</div>
                      <div className="text-xs text-gray-600">₹{option.price}</div>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Duration:</h3>
                <div className="text-sm sm:text-base font-medium">{service.duration} min</div>
              </div>
              <div className="mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-medium mb-2">Price:</h3>
                <p className="text-gray-900 text-sm sm:text-base font-medium">₹{service?.price || "N/A"}</p>
              </div>
            </>
          )}


        {/* Book Button */}
        <button className="w-full bg-[#16A348] text-white py-2.5 sm:py-3 rounded-lg hover:bg-[#128A3E] font-medium text-sm sm:text-base transition-colors" onClick={handleBook}>
          Book Session
        </button>
      </div>
    </div>
  );
};

export default ServiceDetailsModal;
