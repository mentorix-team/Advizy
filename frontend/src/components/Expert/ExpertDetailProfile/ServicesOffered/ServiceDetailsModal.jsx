import { getServicebyid } from "@/Redux/Slices/expert.Slice";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const ServiceDetailsModal = ({ isOpen, onClose, service, expertId }) => {
  // Hooks must be called unconditionally at the top level
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  if (!isOpen) return null;
  const handleBook = async () => {
    // console.log("Dispatching getServicebyid...");
    // const expertId = selectedExpert.expert._id;
    const serviceId = service.serviceId;
    try {
      await dispatch(getServicebyid({ serviceId, expertId })).unwrap();
      navigate(`/expert/scheduling/${serviceId}`);
    } catch (error) {
      console.error("Failed to fetch service details:", error);
    }
    // } else {
    //   console.error('Cannot dispatch getServicebyid - missing expertId or serviceId');
    // }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 !mt-0">
      <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-0 sm:mb-6">
          <div className="flex-1 items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-medium">
              {service?.title || "Service Details"}
              <p className="text-gray-600 text-sm sm:text-base">
                {service?.shortDescription || "No description available."}
              </p>
            </h2>
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
          <h3 className="text-base sm:text-lg font-medium mb-1">
            Detailed Description:
          </h3>
          <p className="text-gray-600 text-sm sm:text-base line-clamp-3">
            {service?.detailedDescription || "No description available."}
          </p>
        </div>
        <div>
          <h4 className="mb-1">What's Included: </h4>
          {service?.features && service.features.length > 0 ? (
            service.features.map((feature, index) => (
              <div key={index} className="flex items-center my-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="8"
                  height="8"
                  fill="currentColor"
                  className="bi bi-check-circle-fill text-green-500 mr-2"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8a8 8 0 1 1-16 0 8 8 0 0 1 16 0zM7.247 11.14-3.14 3.14a.5.5 0 1 1 .707-.707l4.5 4.5L12.854.646a.5.5 0 1 1 .707.707l-6.354 6.354a.5.5 0 0 1-.707-.707z" />
                </svg>
                <p className="text-gray-600 text-sm sm:text-base">{feature}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm italic">
              No features available
            </p>
          )}
        </div>
        {/* Duration & Price Section */}


        {/* Book Button */}
      </div>
    </div>
  );
};

export default ServiceDetailsModal;
