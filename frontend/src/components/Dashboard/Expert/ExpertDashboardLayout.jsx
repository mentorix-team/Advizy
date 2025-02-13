import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const ExpertDashboardLayout = () => {
  return (
    <div className="overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
              <a href="https://aisoul.in" className="flex ms-2 md:me-24">
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                  Advizy
                </span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-green-50 border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-green-50 dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <NavLink
                to="/dashboard/expert"
                className={() =>
                  `flex items-center p-2 rounded-lg transition-colors duration-150 ease-in-out ${"text-gray-900 hover:bg-[#d6fae2] dark:text-white dark:hover:bg-gray-700"}`
                }
              >
                <span className="ms-3">Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/expert/chats"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-colors duration-150 ease-in-out ${
                    isActive
                      ? "bg-[#d6fae2] font-semibold text-green-900"
                      : "text-gray-900 hover:bg-[#d6fae2] dark:text-white dark:hover:bg-gray-700"
                  }`
                }
              >
                <span className="ms-3">Chats</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/expert/meetings"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-colors duration-150 ease-in-out ${
                    isActive
                      ? "bg-[#d6fae2] font-semibold text-green-900"
                      : "text-gray-900 hover:bg-[#d6fae2] dark:text-white dark:hover:bg-gray-700"
                  }`
                }
              >
                <span className="ms-3">Meetings</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/expert/payments"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-colors duration-150 ease-in-out ${
                    isActive
                      ? "bg-[#d6fae2] font-semibold text-green-900"
                      : "text-gray-900 hover:bg-[#d6fae2] dark:text-white dark:hover:bg-gray-700"
                  }`
                }
              >
                <span className="ms-3">Payments</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/expert/service-pricing"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-colors duration-150 ease-in-out ${
                    isActive
                      ? "bg-[#d6fae2] font-semibold text-green-900"
                      : "text-gray-900 hover:bg-[#d6fae2] dark:text-white dark:hover:bg-gray-700"
                  }`
                }
              >
                <span className="ms-3">Pricing & Services</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/expert/profile-detail"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-colors duration-150 ease-in-out ${
                    isActive
                      ? "bg-[#d6fae2] font-semibold text-green-900"
                      : "text-gray-900 hover:bg-[#d6fae2] dark:text-white dark:hover:bg-gray-700"
                  }`
                }
              >
                <span className="ms-3">Profile Detail</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/expert/availability"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-colors duration-150 ease-in-out ${
                    isActive
                      ? "bg-[#d6fae2] font-semibold text-green-900"
                      : "text-gray-900 hover:bg-[#d6fae2] dark:text-white dark:hover:bg-gray-700"
                  }`
                }
              >
                <span className="ms-3">Availability</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/expert/clients"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-colors duration-150 ease-in-out ${
                    isActive
                      ? "bg-[#d6fae2] font-semibold text-green-900"
                      : "text-gray-900 hover:bg-[#d6fae2] dark:text-white dark:hover:bg-gray-700"
                  }`
                }
              >
                <span className="ms-3">Clients</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/expert/reviews"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-colors duration-150 ease-in-out ${
                    isActive
                      ? "bg-[#d6fae2] font-semibold text-green-900"
                      : "text-gray-900 hover:bg-[#d6fae2] dark:text-white dark:hover:bg-gray-700"
                  }`
                }
              >
                <span className="ms-3">Reviews</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className="sm:ml-64 pt-20 bg-[#f6f7f7]">
        <div className="mx-auto px-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ExpertDashboardLayout;