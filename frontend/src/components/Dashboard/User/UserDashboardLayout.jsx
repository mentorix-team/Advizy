import React from "react";
import { NavLink, Outlet } from "react-router-dom";
// import {
//   HomeIcon,
//   ClipboardListIcon,
//   ChatIcon,
//   BellIcon,
//   CogIcon,
//   UserIcon,
// } from "@heroicons/react/outline";

const UserDashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-900">
            User Dashboard
          </h2>
        </div>
        <nav>
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/dashboard/user"
                className={({ isActive }) =>
                  `flex items-center gap-2 p-3 rounded-md text-gray-600 ${
                    isActive ? "bg-gray-100 text-blue-600" : "hover:bg-gray-50"
                  }`
                }
              >
                {/* <HomeIcon className="w-5 h-5" /> */}
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/user/bookings"
                className={({ isActive }) =>
                  `flex items-center gap-2 p-3 rounded-md text-gray-600 ${
                    isActive ? "bg-gray-100 text-blue-600" : "hover:bg-gray-50"
                  }`
                }
              >
                {/* <ClipboardListIcon className="w-5 h-5" /> */}
                Bookings
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/user/scheduling"
                className={({ isActive }) =>
                  `flex items-center gap-2 p-3 rounded-md text-gray-600 ${
                    isActive ? "bg-gray-100 text-blue-600" : "hover:bg-gray-50"
                  }`
                }
              >
                Scheduling
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/user/messages"
                className={({ isActive }) =>
                  `flex items-center gap-2 p-3 rounded-md text-gray-600 ${
                    isActive ? "bg-gray-100 text-blue-600" : "hover:bg-gray-50"
                  }`
                }
              >
                {/* <ChatIcon className="w-5 h-5" /> */}
                Messages
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/user/notifications"
                className={({ isActive }) =>
                  `flex items-center gap-2 p-3 rounded-md text-gray-600 ${
                    isActive ? "bg-gray-100 text-blue-600" : "hover:bg-gray-50"
                  }`
                }
              >
                {/* <BellIcon className="w-5 h-5" /> */}
                Notifications
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/user/settings"
                className={({ isActive }) =>
                  `flex items-center gap-2 p-3 rounded-md text-gray-600 ${
                    isActive ? "bg-gray-100 text-blue-600" : "hover:bg-gray-50"
                  }`
                }
              >
                {/* <CogIcon className="w-5 h-5" /> */}
                Settings
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/user/profile"
                className={({ isActive }) =>
                  `flex items-center gap-2 p-3 rounded-md text-gray-600 ${
                    isActive ? "bg-gray-100 text-blue-600" : "hover:bg-gray-50"
                  }`
                }
              >
                {/* <UserIcon className="w-5 h-5" /> */}
                Profile
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default UserDashboardLayout;
