import { Link } from "react-router-dom";

const ModeRestrictionError = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Access Restricted
        </h1>
        <p className="text-gray-700 mb-6">
          You must be in Expert Mode to access this page. Please switch to Expert
          Mode from your dashboard.
        </p>
        <Link
          to="/dashboard/user"
          className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors"
        >
          Go to User Dashboard
        </Link>
      </div>
    </div>
  );
};

export default ModeRestrictionError;