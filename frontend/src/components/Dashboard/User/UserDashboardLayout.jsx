// import React from "react";
// import { NavLink, Outlet } from "react-router-dom";

// const UserDashboardLayout = () => {
//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white border-r border-gray-200">
//         <div className="p-4">
//           <h2 className="text-xl font-semibold text-gray-900">
//             User Dashboard
//           </h2>
//         </div>
//         <nav>
//           <ul className="space-y-2">
//             <li>
//               <NavLink
//                 to="/dashboard/user/meetings"
//                 className={({ isActive }) =>
//                   `flex items-center gap-2 p-3 rounded-md text-gray-600 ${
//                     isActive ? "bg-gray-100 text-blue-600" : "hover:bg-gray-50"
//                   }`
//                 }
//               >
//                 {/* <ClipboardListIcon className="w-5 h-5" /> */}
//                 Meetings
//               </NavLink>
//             </li>
//             <li>
//               <NavLink
//                 to="/dashboard/user/payments"
//                 className={({ isActive }) =>
//                   `flex items-center gap-2 p-3 rounded-md text-gray-600 ${
//                     isActive ? "bg-gray-100 text-blue-600" : "hover:bg-gray-50"
//                   }`
//                 }
//               >
//                 {/* <ChatIcon className="w-5 h-5" /> */}
//                 Payments
//               </NavLink>
//             </li>
//             <li>
//               <NavLink
//                 to="/dashboard/user/profile"
//                 className={({ isActive }) =>
//                   `flex items-center gap-2 p-3 rounded-md text-gray-600 ${
//                     isActive ? "bg-gray-100 text-blue-600" : "hover:bg-gray-50"
//                   }`
//                 }
//               >
//                 {/* <UserIcon className="w-5 h-5" /> */}
//                 Profile
//               </NavLink>
//             </li>
//             <li>
//               <NavLink
//                 to="/dashboard/user/chats"
//                 className={({ isActive }) =>
//                   `flex items-center gap-2 p-3 rounded-md text-gray-600 ${
//                     isActive ? "bg-gray-100 text-blue-600" : "hover:bg-gray-50"
//                   }`
//                 }
//               >
//                 {/* <ChatIcon className="w-5 h-5" /> */}
//                 Chats
//               </NavLink>
//             </li>
//           </ul>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-6 bg-gray-50">
//         <Outlet />
//       </main>
//     </div>
//   );
// };

// export default UserDashboardLayout;


import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  Video,
  BadgeIndianRupee,
  UserCircle,
  MessageSquareText,
  House,
} from "lucide-react";

const UserDashboardLayout = () => {
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
                to="/dashboard/user"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-colors duration-150 ease-in-out ${
                    isActive
                      ? "bg-[#d6fae2] font-semibold text-green-900"
                      : "text-gray-900 hover:bg-[#d6fae2] dark:text-white dark:hover:bg-gray-700"
                  }`
                }
              >
                <House className="w-5 h-5" />
                <span className="ms-3">Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/user/meetings"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-colors duration-150 ease-in-out ${
                    isActive
                      ? "bg-[#d6fae2] font-semibold text-green-900"
                      : "text-gray-900 hover:bg-[#d6fae2] dark:text-white dark:hover:bg-gray-700"
                  }`
                }
              >
                <Video className="w-5 h-5" />
                <span className="ms-3">Meetings</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/user/payments"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-colors duration-150 ease-in-out ${
                    isActive
                      ? "bg-[#d6fae2] font-semibold text-green-900"
                      : "text-gray-900 hover:bg-[#d6fae2] dark:text-white dark:hover:bg-gray-700"
                  }`
                }
              >
                <BadgeIndianRupee className="w-5 h-5" />
                <span className="ms-3">Payments</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/user/profile"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-colors duration-150 ease-in-out ${
                    isActive
                      ? "bg-[#d6fae2] font-semibold text-green-900"
                      : "text-gray-900 hover:bg-[#d6fae2] dark:text-white dark:hover:bg-gray-700"
                  }`
                }
              >
                <UserCircle className="w-5 h-5" />
                <span className="ms-3">Profile</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/user/chats"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-colors duration-150 ease-in-out ${
                    isActive
                      ? "bg-[#d6fae2] font-semibold text-green-900"
                      : "text-gray-900 hover:bg-[#d6fae2] dark:text-white dark:hover:bg-gray-700"
                  }`
                }
              >
                <MessageSquareText className="w-5 h-5" />
                <span className="ms-3">Chats</span>
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

export default UserDashboardLayout;