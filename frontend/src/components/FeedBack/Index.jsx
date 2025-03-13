import { useState } from "react";
import FeedbackPopup from "./FeedbackPopup"; // Ensure the correct path

const Index = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
        Open Feedback Popup
      </button>

      {isOpen && <FeedbackPopup onClose={() => setIsOpen(false)} />}
    </div>
  );
};

export default Index;
