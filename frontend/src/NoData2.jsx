import React from "react";
import { useNavigate } from "react-router-dom";

const NoData2 = () => {
  const navigate = useNavigate();

  const handleMeetings = () => {
    navigate("/explore");
  };
  return (
    <div className="flex flex-col items-center p-8 justify-center bg-transparent w-fit h-fit">
      <div className="text-center">
        <img
          src="/No-data2.svg"
          alt="No data available"
          className="w-auto max-w-md sm:max-w-sm md:max-w-md lg:max-w-lg h-auto"
        />
        <h1 className="py-2 font-medium text-center">
          No Meeting Data Found
        </h1>
        <button
          onClick={handleMeetings}
          className="bg-primary py-2 px-4 rounded-md text-white font-semibold mt-2"
        >
          Book a Meeting
        </button>
      </div>
    </div>
  );
};

export default NoData2;
