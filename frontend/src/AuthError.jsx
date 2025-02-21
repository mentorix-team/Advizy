import { CircleX } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";

const AuthError = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const message =
    searchParams.get("message") || "An account with this email already exists. Please log in using your original method.";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md text-center">
        
        {/* Centered CircleX Icon */}
        <div className="flex justify-center">
          <CircleX className="w-12 h-12 text-red-500" />
        </div>

        <h2 className="text-xl font-semibold text-red-600 mt-2">
          Authentication Error
        </h2>

        <p className="text-gray-600 mt-2">{message}</p>

        <button
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-2 bg-primary text-white rounded-md transition"
        >
          Go to home
        </button>
      </div>
    </div>
  );
};

export default AuthError;
