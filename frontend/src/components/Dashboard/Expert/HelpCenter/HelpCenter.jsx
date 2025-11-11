import React, { useState } from "react";
import PhoneSupport from "./PhoneSupport";
import FAQSection from "./FAQSection";
import RequestCallModal from "./RequestCallModal";
import { useSelector } from "react-redux";
import SupportRequests from "./SupportRequests";

function HelpCenter() {
  const [showRequestCall, setShowRequestCall] = useState(false);
  const { expertData, loading, error } = useSelector((state) => state.expert);

  let expert = null;

  if (expertData) {
    if (typeof expertData === "string") {
      try {
        expert = JSON.parse(expertData);
        // console.log("This is expertData", expert);
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

  const expertName = `${expert?.firstName} ${expert?.lastName}`;
  const expertPhone = `${expert?.countryCode} ${expert?.mobile}`;

  const handleRequestCall = () => {
    setShowRequestCall(true);
  };

  const handleCloseRequestCall = () => {
    setShowRequestCall(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      <h1 className="text-3xl md:text-4xl font-medium text-center my-8">
        How can we <span className="text-green-600 font-semibold">HELP</span>{" "}
        you today?
      </h1>

      <div className="max-w-md mx-auto mb-12">
        <PhoneSupport onRequestCall={handleRequestCall} />
      </div>

      <SupportRequests />

      <FAQSection />

      <RequestCallModal
        isOpen={showRequestCall}
        onClose={handleCloseRequestCall}
        expertName={expertName}
        expertPhone={expertPhone}
      />
    </div>
  );
}

export default HelpCenter;
