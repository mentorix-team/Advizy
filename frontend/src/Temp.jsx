import React from "react";
import { getExpertById } from "@/Redux/Slices/expert.Slice";
import { useSelector } from "react-redux";

const HelpCenter = () => {
  const { expertData, loading, error } = useSelector((state) => state.expert);

  let expert = null;

  if (expertData) {
    if (typeof expertData === "string") {
      try {
        expert = JSON.parse(expertData);
        console.log("This is expertData", expert);
      } catch (error) {
        console.error("Error parsing expertData:", error);
        expert = null; // Handle parsing errors safely
      }
    } else if (
      typeof expertData === "object" &&
      Object.keys(expertData).length > 0
    ) {
      expert = expertData; // Already an object and not empty
    }
  }
  return (
    <div>
      <h1>Help Center</h1>{" "}
      <p>
        Welcome to the Help Center, {expert?.firstName} {expert?.lastName}!

        <h2>here is ur data:</h2>
        <input type="text"
        value={`${expert?.firstName} ${expert?.lastName}`} />
        <input type="text" 
        value={`${expert?.countryCode} ${expert?.mobile}`}/>

      </p>
    </div>
  );
};

export default HelpCenter;
