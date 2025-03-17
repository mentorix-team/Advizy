import React, { useState, useEffect } from "react";
import ServiceDetailsModal from "./ServiceDetailsModal";
import { InformationIcon } from "@/icons/Icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getServicebyid } from "@/Redux/Slices/expert.Slice";

const DurationOption = ({ duration, price, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`p-3 rounded-lg text-left border ${
      isSelected ? "border-[#16A348] border-2 bg-[#E6F4EA]" : "border-[#E5E7EB]"
    } hover:border-[#16A348] transition-colors`}
  >
    <div className="text-sm">{duration} min</div>
    <div className="text-[#16A348] font-semibold">₹{price}</div>
  </button>
);

const MentoringCard = ({ mentoringService }) => {
  console.log("This is mentoringService:", mentoringService);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedExpert } = useSelector((state) => state.expert);

  const [selectedDuration, setSelectedDuration] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!mentoringService) return null; // Prevent rendering if no data

  // Extract available durations
  const durations = mentoringService.one_on_one?.filter((option) => option.enabled) || [];

  // Set default selection only if none is selected
  useEffect(() => {
    if (durations.length > 0 && !selectedDuration) {
      setSelectedDuration(durations[0]); // Store full object {duration, price}
      console.log("Default duration set:", durations[0]);
    }
  }, [durations, selectedDuration]);

  const serviceId = mentoringService.serviceId;

  const handleBook = async () => {
    if (selectedExpert?.expert?._id && serviceId && selectedDuration) {
      console.log("Dispatching getServicebyid...");
      const expertId = selectedExpert.expert._id;
      console.log("Expert ID:", expertId);
      console.log("Selected Duration:", selectedDuration);

      try {
        await dispatch(getServicebyid({ serviceId, expertId })).unwrap();
        navigate(`/expert/scheduling/${serviceId}`, {
          state: selectedDuration, // Passing { duration, price }
        });
      } catch (error) {
        console.error("Failed to fetch service details:", error);
      }
    } else {
      console.error(
        "Cannot dispatch getServicebyid - Missing expertId, serviceId, or selectedDuration"
      );
    }
  };

  return (
    <>
      <div className="border border-[#16A348] rounded-2xl p-4 bg-white">
        <div className="flex items-start gap-2 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#16A348" viewBox="0 0 24 24">
            <path d="M13.5 8c.276 0 .5.224.5.5v7c0 .276-.224.5-.5.5h-11c-.276 0-.5-.224-.5-.5v-7c0-.276.224-.5.5-.5h11zm2.5 0c0-1.104-.896-2-2-2h-12c-1.104 0-2 .896-2 2v8c0 1.104.896 2 2 2h12c1.104 0 2-.896 2-2v-8zm6 1.854v4.293l-2-1.408v-1.478l2-1.407zm2-3.854l-6 4.223v3.554l6 4.223v-12z" />
          </svg>
          <div>
            <h3 className="text-[#101828] font-medium">{mentoringService.title}</h3>
            <p className="text-sm text-gray-600">{mentoringService.shortDescription}</p>
          </div>
        </div>

        <div className="mb-2 text-sm font-medium">Select Duration:</div>
        <div className="grid grid-cols-4 gap-3 mb-4">
          {durations.length > 0 ? (
            durations.map((option) => (
              <DurationOption
                key={option._id}
                duration={option.duration}
                price={option.price}
                isSelected={
                  selectedDuration?.duration === option.duration &&
                  selectedDuration?.price === option.price
                }
                onClick={() => {
                  setSelectedDuration(option);
                  console.log("Selected Duration Changed:", option);
                }}
              />
            ))
          ) : (
            <p className="text-gray-500 text-sm">No available durations.</p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 text-[#1D1D1F] text-sm border border-[#000000] rounded-md py-2.5 hover:bg-gray-50"
          >
            <InformationIcon className="w-4 h-4" />
            Show Details
          </button>
          <button
            onClick={handleBook}
            className="flex-1 bg-[#16A348] text-white py-2.5 rounded-md hover:bg-[#128A3E] text-sm font-medium"
            disabled={durations.length === 0}
          >
            Book Session
          </button>
        </div>
      </div>

      <ServiceDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={{
          title: mentoringService.title,
          description: mentoringService.detailedDescription,
          features: mentoringService.features,
        }}
      />
    </>
  );
};

export default MentoringCard;
