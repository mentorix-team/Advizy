import React, { useState } from 'react';
import ServiceDetailsModal from './ServiceDetailsModal';
import { InformationIcon } from '@/icons/Icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getServicebyid } from '@/Redux/Slices/expert.Slice';

const ServiceCard = ({ service }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { title, description, duration, price, serviceId, shortDescription, detailedDescription } = service;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedExpert } = useSelector((state) => state.expert);
  // normalize in component (defensive)
  const expertObj = selectedExpert?.expert || selectedExpert;

  const handleBook = async () => {
    if (expertObj?._id && serviceId) {
      console.log('Dispatching getServicebyid...');
      const expertId = expertObj._id;
      try {
        await dispatch(getServicebyid({ serviceId, expertId })).unwrap();
        navigate(`/expert/scheduling/${serviceId}`);
      } catch (error) {
        console.error('Failed to fetch service details:', error);
      }
    } else {
      console.error('Cannot dispatch getServicebyid - missing expertId or serviceId');
    }
  };

  return (
    <>
      <div className="border h-fit bg-white border-[#16A348] rounded-2xl p-3 sm:p-4">
        <div className="flex items-start gap-2 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" fill="#16A348" height="24" viewBox="0 0 24 24">
            <path d="M10.118 16.064c2.293-.529 4.428-.993 3.394-2.945-3.146-5.942-.834-9.119 2.488-9.119 3.388 0 5.644 3.299 2.488 9.119-1.065 1.964 1.149 2.427 3.394 2.945 1.986.459 2.118 1.43 2.118 3.111l-.003.825h-15.994c0-2.196-.176-3.407 2.115-3.936zm-10.116 3.936h6.001c-.028-6.542 2.995-3.697 2.995-8.901 0-2.009-1.311-3.099-2.998-3.099-2.492 0-4.226 2.383-1.866 6.839.775 1.464-.825 1.812-2.545 2.209-1.49.344-1.589 1.072-1.589 2.333l.002.619z" />
          </svg>
          <div>
            <h3 className="text-[#101828] font-medium text-sm sm:text-base">{title}</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-snug">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2 sm:mt-3 mb-2 sm:mb-3">
          <svg className="w-4 h-4 text-gray-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs sm:text-sm text-gray-600">{duration} min</span>
          <span className="text-[#16A348] text-xs sm:text-sm font-medium">₹{price}</span>
        </div>

        <div className="flex xs:flex-row gap-2 mt-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 text-[#1D1D1F] text-xs sm:text-sm border border-[#000000] rounded-md px-3 sm:px-4 py-2 hover:bg-gray-50 w-full xs:w-auto transition-colors"
          >
            <InformationIcon className="w-4 h-4" />
            Show Details
          </button>
          <button
            onClick={handleBook}
            className="bg-[#16A348] text-white px-4 sm:px-6 py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-[#128A3E] w-full xs:w-auto text-center transition-colors"
          >
            Book Session
          </button>
        </div>
      </div>

      <ServiceDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={{
          title,
          shortDescription,
          detailedDescription,
          duration,
          price,
          serviceId
        }}
        expertId={expertObj?._id}
      />
    </>
  );
};

export default ServiceCard;
