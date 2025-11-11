import React, { useState, useEffect, useRef } from "react";
import ServiceDetailsModal from "./ServiceDetailsModal";
import { InformationIcon } from "@/icons/Icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getServicebyid } from "@/Redux/Slices/expert.Slice";

const DurationOption = ({ duration, price, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between gap-4 border transition-colors ${isSelected
      ? "border-[#16A348] bg-[#E6F4EA] font-medium"
      : "border-[#E5E7EB] hover:border-[#16A348]"
      }`}
  >
    <span className="text-sm">{duration} min</span>
    <span className="text-[#16A348] font-semibold whitespace-nowrap">₹{price}</span>
  </button>
);

const MentoringCard = ({ mentoringService }) => {
  // console.log("This is mentoringService:", mentoringService);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedExpert } = useSelector((state) => state.expert);
  const expertObj = selectedExpert?.expert || selectedExpert; // normalized

  const [selectedDuration, setSelectedDuration] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  if (!mentoringService) return null; // Prevent rendering if no data

  // Extract available durations
  const durations = mentoringService.one_on_one?.filter((option) => option.enabled) || [];

  // Set default selection only if none is selected
  useEffect(() => {
    if (durations.length > 0 && !selectedDuration) {
      setSelectedDuration(durations[0]); // Store full object {duration, price}
      // console.log("Default duration set:", durations[0]);
    }
  }, [durations, selectedDuration]);

  const serviceId = mentoringService.serviceId;

  const handleBook = async () => {
    if (expertObj?._id && serviceId && selectedDuration) {
      // console.log("Dispatching getServicebyid...");
      const expertId = expertObj._id;
      // console.log("Expert ID:", expertId);
      // console.log("Selected Duration:", selectedDuration);

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

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  const selectedLabel = selectedDuration
    ? `${selectedDuration.duration} min  •  ₹${selectedDuration.price}`
    : "Select slot";

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
        {/* Mobile Dropdown */}
        <div className="mb-4 md:hidden" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => durations.length > 0 && setIsDropdownOpen((o) => !o)}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-md border text-sm transition-colors ${isDropdownOpen
              ? "border-[#16A348] bg-[#E6F4EA]"
              : "border-[#D1D5DB] hover:border-[#16A348]"
              }`}
            disabled={durations.length === 0}
          >
            <span className={selectedDuration ? "text-[#101828]" : "text-gray-500"}>{selectedLabel}</span>
            <svg
              className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.126l3.71-3.896a.75.75 0 111.08 1.04l-4.24 4.46a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                fill="#101828"
              />
            </svg>
          </button>
          {isDropdownOpen && (
            <div className="mt-2 border border-[#E5E7EB] rounded-md p-2 bg-white max-h-60 overflow-auto shadow-sm">
              {durations.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {durations.map((option) => {
                    const selected =
                      selectedDuration?.duration === option.duration &&
                      selectedDuration?.price === option.price;
                    return (
                      <DurationOption
                        key={option._id}
                        duration={option.duration}
                        price={option.price}
                        isSelected={selected}
                        onClick={() => {
                          setSelectedDuration(option);
                          setIsDropdownOpen(false); // collapse after choosing
                        }}
                      />
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-sm px-2 py-1">No available durations.</p>
              )}
            </div>
          )}
        </div>
        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-4 gap-3 mb-4">
          {durations.length > 0 ? (
            durations.map((option) => {
              const selected =
                selectedDuration?.duration === option.duration &&
                selectedDuration?.price === option.price;
              return (
                <button
                  key={option._id}
                  onClick={() => setSelectedDuration(option)}
                  className={`p-3 rounded-lg text-left border transition-colors ${selected
                    ? "border-[#16A348] border-2 bg-[#E6F4EA]"
                    : "border-[#E5E7EB] hover:border-[#16A348]"
                    }`}
                >
                  <div className="text-sm">{option.duration} min</div>
                  <div className="text-[#16A348] font-semibold">₹{option.price}</div>
                </button>
              );
            })
          ) : (
            <p className="text-gray-500 text-sm col-span-4">No available durations.</p>
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
          detailedDescription: mentoringService.detailedDescription,
          shortDescription: mentoringService.shortDescription,
          features: mentoringService.features,
          one_on_one: mentoringService.one_on_one,
          serviceId: mentoringService.serviceId,
          hourlyRate: mentoringService.hourlyRate
        }}
      />
    </>
  );
};

export default MentoringCard;
