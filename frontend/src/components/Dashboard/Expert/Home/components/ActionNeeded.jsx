import { Award, CalendarDays, Pencil, Star } from "lucide-react";
import React from "react";
import { BiMessageSquare, BiStar, BiCalendar } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import SuccessMessage from "./SuccessMessage";

const iconMap = {
  message: <Award className="w-6 h-6 text-red-600" />,
  star: <Star className="text-yellow-500 w-6 h-6" />,
  calendar: <CalendarDays className="text-blue-500 w-6 h-6" />,
  edit: <Pencil className="text-green-500 w-6 h-6" />,
};

const actionRoutes = {
  "Add Your Expertise": "/dashboard/expert/profile-detail",
  "Add Your Services": "/dashboard/expert/service-pricing",
  "Set your Availability": "/dashboard/expert/availability",
  "Edit your One-on-One Service": "/dashboard/expert/service-pricing",
};

export default function ActionNeeded({ actions }) {
  const navigate = useNavigate();

  const handleNavigation = (actionText) => {
    const route = actionRoutes[actionText];
    if (route) {
      navigate(route);
    }
  };
  return (
    <div>
      <div className="bg-white border rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Action Needed</h2>
        </div>
        <div className="space-y-4">
          {actions.length > 0 ? (
            actions.map((action) => (
              <div
                key={action.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {iconMap[action.icon] || <BiMessageSquare size={24} />}{" "}
                  {/* Fallback icon */}
                  <span className="text-sm font-medium">{action.text}</span>
                </div>
                <button
                  onClick={() => handleNavigation(action.text)}
                  className="text-primary py-2 px-3 rounded-md border border-primary hover:text-secondary text-sm font-medium"
                >
                  Take Action
                </button>
              </div>
            ))
          ) : (
            <SuccessMessage />
          )}
        </div>
      </div>

      {/* <div className="space-y-4">
      {actions.length > 0 ? (
        actions.map((action) => (
          <div
            key={action.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg gap-2 sm:gap-4"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              {iconMap[action.icon] || <BiMessageSquare size={20} sm:size={24} />}
              <span className="text-sm sm:text-base font-medium">{action.text}</span>
            </div>
            <button
              onClick={() => handleNavigation(action.text)}
              className="w-full sm:w-auto text-primary py-2 px-3 rounded-md border border-primary hover:text-secondary text-sm font-medium"
            >
              Take Action
            </button>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-sm text-center">All actions completed! 🎉</p>
      )}
    </div> */}
    </div>
  );
}
