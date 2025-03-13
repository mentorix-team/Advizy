import React, { useState } from "react";
import ServiceDetailsModal from "./ServiceDetailsModal";
import { InformationIcon } from "@/icons/Icons";
import { useNavigate } from "react-router-dom";

const DurationOption = ({ duration, price, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`p-3 rounded-lg text-left border ${
      isSelected ? "border-[#16A348] border-2" : "border-[#E5E7EB]"
    } hover:border-[#16A348] transition-colors`}
  >
    <div className="text-sm">{duration} min</div>
    <div className="text-[#16A348] font-semibold">₹{price}</div>
  </button>
);

const MentoringCard = ({}) => {
  const [selectedDuration, setSelectedDuration] = React.useState("15");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const durations = [
    { time: "15", price: "30" },
    { time: "30", price: "60" },
    { time: "60", price: "120" },
    { time: "90", price: "150" },
  ];

  const navigate = useNavigate();


  const handleBook = () => {
    navigate(`/expert/scheduling`);
  };

  return (
    <>
      <div className="border border-[#16A348] rounded-2xl p-4 bg-white">
        <div className="flex items-start gap-2 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="#16A348"
            viewBox="0 0 24 24"
          >
            <path d="M13.5 8c.276 0 .5.224.5.5v7c0 .276-.224.5-.5.5h-11c-.276 0-.5-.224-.5-.5v-7c0-.276.224-.5.5-.5h11zm2.5 0c0-1.104-.896-2-2-2h-12c-1.104 0-2 .896-2 2v8c0 1.104.896 2 2 2h12c1.104 0 2-.896 2-2v-8zm6 1.854v4.293l-2-1.408v-1.478l2-1.407zm2-3.854l-6 4.223v3.554l6 4.223v-12z" />
          </svg>
          <div>
            <h3 className="text-[#101828] font-medium">One-on-One Mentoring</h3>
            <p className="text-sm text-gray-600">
              Personalized guidance for your career growth and technical
              challenges
            </p>
          </div>
        </div>

        <div className="mb-2 text-sm font-medium">Select Duration:</div>
        <div className="grid grid-cols-4 gap-3 mb-4">
          {durations.map(({ time, price }) => (
            <DurationOption
              key={time}
              duration={time}
              price={price}
              isSelected={selectedDuration === time}
              onClick={() => setSelectedDuration(time)}
            />
          ))}
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
          className="flex-1 bg-[#16A348] text-white py-2.5 rounded-md hover:bg-[#128A3E] text-sm font-medium">
            Book Session
          </button>
        </div>
      </div>

      <ServiceDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={{
          title: "One-on-One Mentoring",
          description:
            "Personalized guidance for your career growth and technical challenges",
        }}
      />
    </>
  );
};

export default MentoringCard;
