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

// import React from "react";
// import { NavLink, Outlet } from "react-router-dom";
// import {
//   Video,
//   BadgeIndianRupee,
//   UserCircle,
//   MessageSquareText,
//   House,
// } from "lucide-react";

// const UserDashboardLayout = () => {
//   return (
//     <div className="overflow-x-hidden">
//       {/* Navbar */}
//       <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
//         <div className="px-3 py-3 lg:px-5 lg:pl-3">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center justify-start rtl:justify-end">
//               <button
//                 data-drawer-target="logo-sidebar"
//                 data-drawer-toggle="logo-sidebar"
//                 aria-controls="logo-sidebar"
//                 type="button"
//                 className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
//               >
//                 <span className="sr-only">Open sidebar</span>
//                 <svg
//                   className="w-6 h-6"
//                   aria-hidden="true"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     clipRule="evenodd"
//                     fillRule="evenodd"
//                     d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
//                   ></path>
//                 </svg>
//               </button>
//               <a href="https://advizy.in" className="flex ms-2 md:me-24">
//                 {/* <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
//                   Advizy
//                 </span> */}
//                 <img src="/logo104.99&44.svg" alt="Advizy Logo" />
//               </a>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Sidebar */}
//       <aside
//         id="logo-sidebar"
//         className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-green-50 border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
//         aria-label="Sidebar"
//       >
//         <div className="h-full px-3 pb-4 overflow-y-auto bg-green-50 dark:bg-gray-800">
//           <ul className="space-y-2 font-medium">
//             <li>
//               <NavLink
//                 to="/dashboard/user/meetings"
//                 className={({ isActive }) =>
//                   `flex items-center p-2 rounded-lg transition-colors duration-150 ease-in-out ${
//                     isActive
//                       ? "bg-[#d6fae2] font-semibold text-green-900"
//                       : "text-gray-900 hover:bg-[#d6fae2] dark:text-white dark:hover:bg-gray-700"
//                   }`
//                 }
//               >
//                 <Video className="w-5 h-5" />
//                 <span className="ms-3">Meetings</span>
//               </NavLink>
//             </li>
//             <li>
//               <NavLink
//                 to="/dashboard/user/payments"
//                 className={({ isActive }) =>
//                   `flex items-center p-2 rounded-lg transition-colors duration-150 ease-in-out ${
//                     isActive
//                       ? "bg-[#d6fae2] font-semibold text-green-900"
//                       : "text-gray-900 hover:bg-[#d6fae2] dark:text-white dark:hover:bg-gray-700"
//                   }`
//                 }
//               >
//                 <BadgeIndianRupee className="w-5 h-5" />
//                 <span className="ms-3">Payments</span>
//               </NavLink>
//             </li>
//             <li>
//               <NavLink
//                 to="/dashboard/user/profile"
//                 className={({ isActive }) =>
//                   `flex items-center p-2 rounded-lg transition-colors duration-150 ease-in-out ${
//                     isActive
//                       ? "bg-[#d6fae2] font-semibold text-green-900"
//                       : "text-gray-900 hover:bg-[#d6fae2] dark:text-white dark:hover:bg-gray-700"
//                   }`
//                 }
//               >
//                 <UserCircle className="w-5 h-5" />
//                 <span className="ms-3">Profile</span>
//               </NavLink>
//             </li>
//             <li>
//               <NavLink
//                 to="/dashboard/user/chats"
//                 className={({ isActive }) =>
//                   `flex items-center p-2 rounded-lg transition-colors duration-150 ease-in-out ${
//                     isActive
//                       ? "bg-[#d6fae2] font-semibold text-green-900"
//                       : "text-gray-900 hover:bg-[#d6fae2] dark:text-white dark:hover:bg-gray-700"
//                   }`
//                 }
//               >
//                 <MessageSquareText className="w-5 h-5" />
//                 <span className="ms-3">Chats</span>
//               </NavLink>
//             </li>
//           </ul>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="sm:ml-64 pt-20 bg-[#f6f7f7]">
//         <div className="mx-auto px-4">
//           <Outlet />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default UserDashboardLayout;


import React, { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/Redux/Slices/authSlice";
import AuthPopup from "@/components/Auth/AuthPopup.auth";
import {
  ChevronDown,
  LogOut,
  User,
  CircleUserRound,
  Video,
  BadgeIndianRupee,
  UserCircle,
  MessageSquareText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const UserDashboardLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isExpertMode, setIsExpertMode] = useState(false);
  const [isAuthPopupOpen, setAuthPopupOpen] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userName = useSelector((state) => state.auth.user?.name || "User");
  const dispatch = useDispatch();

  useEffect(() => {
    const expertData = localStorage.getItem("expertData");
    if (expertData) {
      setIsExpertMode(true);
    }
  }, []);

  const handleOpenAuthPopup = () => {
    setAuthPopupOpen(true);
  };

  const handleCloseAuthPopup = () => {
    setAuthPopupOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsDropdownOpen(false);
  };

  const handleToggleExpertMode = () => {
    setIsExpertMode(!isExpertMode);
  };

  const UserDropdown = () => (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors duration-200"
      >
        <span className="text-sm font-medium">
          <CircleUserRound className="w-5 h-5" />
        </span>
        <ChevronDown className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-100"
          >
            {isExpertMode ? (
              <>
                <a
                  href="/dashboard/expert"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  <User className="w-4 h-4" />
                  Expert Dashboard
                </a>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors duration-200 w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <a
                  href="/dashboard/user/meetings"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  <User className="w-4 h-4" />
                  User Dashboard
                </a>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors duration-200 w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-[#FCFCFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="/" className="flex items-center font-bold text-gray-900">
                <img src="/logo104.99&44.svg" alt="Advizy Logo" />
              </a>
            </div>

            <div className="hidden lg:flex items-center gap-6">
              <a
                href="/about-us"
                className="text-gray-600 hover:text-primary transition-colors duration-200 text-sm font-medium"
              >
                About Us
              </a>
              {isLoggedIn && localStorage.getItem("expertData") && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">
                    {isExpertMode ? "Expert Mode" : "User Mode"}
                  </span>
                  <button
                    onClick={handleToggleExpertMode}
                    className="flex items-center justify-center w-10 h-6 rounded-full bg-gray-200 relative cursor-pointer transition-colors duration-300"
                    aria-label={`Switch to ${isExpertMode ? "User" : "Expert"} Mode`}
                  >
                    <div
                      className={`absolute w-full h-full rounded-full transition-colors duration-300 ${
                        isExpertMode ? "bg-green-600" : "bg-gray-300"
                      }`}
                    />
                    <div
                      className={`absolute w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                        isExpertMode ? "translate-x-4" : "-translate-x-4"
                      }`}
                    />
                  </button>
                </div>
              )}
              {isLoggedIn ? (
                <UserDropdown />
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-primary text-white text-sm px-8 py-2 rounded-md"
                  onClick={handleOpenAuthPopup}
                >
                  Login
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-green-50 border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-green-50 dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
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
      
      <AuthPopup isOpen={isAuthPopupOpen} onClose={handleCloseAuthPopup} />
    </div>
  );
};

export default UserDashboardLayout;