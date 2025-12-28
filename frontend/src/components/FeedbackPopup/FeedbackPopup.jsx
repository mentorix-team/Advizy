import { useState } from "react";

const FeedbackPopup = ({ onClose }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (rating === 0 || feedback.trim() === "") {
      setError("Please provide a rating and feedback.");
    } else {
      // console.log("Rating:", rating, "Feedback:", feedback);
      setError("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Rate Your Meeting</h2>
          <button
            onClick={onClose}
            className="text-gray-500 text-3xl hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        <div className="flex items-center mt-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="text-2xl mx-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className={rating >= star ? "text-yellow-400" : "text-gray-600"}
                  fill="currentColor"
                >
                  <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        <textarea
          className="w-full border rounded p-2 mt-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
          placeholder="Share your feedback..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          className={`w-full py-2 rounded mt-4 ${rating > 0 && feedback.trim()
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          onClick={handleSubmit}
          disabled={rating === 0 || feedback.trim() === ""}
        >
          Submit Feedback
        </button>
      </div>
    </div>
  );
};
export default FeedbackPopup;
