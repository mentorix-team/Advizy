import { Award, CalendarDays, Landmark, Pencil, Star } from "lucide-react";
import React from "react";
import { BiMessageSquare } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import SuccessMessage from "./SuccessMessage";
import Tooltip from "../../ToolTip";

const iconMap = {
  message: <Award className="w-6 h-6 text-red-600" />,
  star: <Star className="text-yellow-500 w-6 h-6" />,
  calendar: <CalendarDays className="text-blue-500 w-6 h-6" />,
  edit: <Pencil className="text-green-500 w-6 h-6" />,
  payment: <Landmark className="text-green-500 w-6 h-6" />,
};

const actionTooltips = {
  "Add Your Expertise": "Help clients understand your expertise.",
  "Add Your Services": "Set your own price and duration for sessions.",
  "Set your Availability": "Let clients know when they can book you.",
  "Update your Payment Details": "Get ready to receive hassle-free payments.",
  "Edit your One-on-One Service": "Set your own price and duration for sessions.",
  
};

const actionRoutes = {
  "Add Your Expertise": "/dashboard/expert/profile-detail",
  "Add Your Services": "/dashboard/expert/service-pricing",
  "Set your Availability": "/dashboard/expert/availability",
  "Edit your One-on-One Service": "/dashboard/expert/service-pricing",
  "Update your Payment Details": "/dashboard/expert/payments",
};

function ActionNeeded({ actions }) {
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
          <h2 className="text-xl font-bold">Quick Actions</h2>
        </div>
        <div className="space-y-4">
          {actions.length > 0 ? (
            actions.map((action) => (
              <div
                key={action.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {iconMap[action.icon] || <BiMessageSquare size={24} />}
                  <Tooltip text={actionTooltips[action.text] || ""}>
                    <span className="text-sm font-medium cursor-help">
                      {action.text}
                    </span>
                  </Tooltip>
                </div>
                <button
                  onClick={() => handleNavigation(action.text)}
                  className="text-primary py-2 px-3 rounded-md border border-primary hover:text-secondary text-sm font-medium transition-colors duration-200"
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
    </div>
  );
}

export default ActionNeeded;