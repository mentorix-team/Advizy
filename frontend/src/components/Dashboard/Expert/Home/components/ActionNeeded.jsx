import React from 'react';
import { BiMessageSquare, BiStar, BiCalendar } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

const iconMap = {
  message: <BiMessageSquare className="text-red-500" size={24} />,
  star: <BiStar className="text-yellow-500" size={24} />,
  calendar: <BiCalendar className="text-blue-500" size={24} />,
};

const actionRoutes = {
  'Add Your Expertise': '/dashboard/profile-detail',
  "Add Your Services": "/dashboard/service-pricing",
  "Set your Availability": "/dashboard/availability",
}

export default function ActionNeeded({ actions }) {
  const navigate = useNavigate();

  const handleNavigation = (actionText) => {
    const route = actionRoutes[actionText];
    if
    (route) {
      navigate(route);
    }
  }
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Action Needed</h2>
        <button className="text-gray-400 hover:text-gray-600">→</button>
      </div>
      <div className="space-y-4">
        {actions.length > 0 ? (
          actions.map((action) => (
            <div key={action.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {iconMap[action.icon] || <BiMessageSquare size={24} />} {/* Fallback icon */}
                <span className="text-sm font-medium">{action.text}</span>
              </div>
              <button 
              onClick={() => handleNavigation(action.text)}
              className="text-primary hover:text-secondary text-sm font-medium">
                Take Action
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm text-center">All actions completed! 🎉</p>
        )}
      </div>
    </div>
  );
}
