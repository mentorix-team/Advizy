// import React from "react";
// import { NavLink, Outlet } from "react-router-dom";
// import {
//   BadgeIndianRupee,
//   CalendarDays,
//   HandPlatter,
//   House,
//   MessageSquareText,
//   Star,
//   UserPen,
//   Users,
//   Video,
// } from "lucide-react";

// const ExpertDashboardLayout = () => {
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
//               <a href="/" className="flex ms-2 md:me-24">
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
//               {/* <NavLink
//                 to="/dashboard/expert"
//                 className={() =>
//                   `flex items-center p-2 rounded-lg transition-colors duration-150 ease-in-out ${"text-gray-900 hover:bg-[#d6fae2] dark:text-white dark:hover:bg-gray-700"}`
//                 }
//               >
//                 <span className="ms-3">
//                   <House className="w-5 h-5" />
//                   Home
//                 </span>
//               </NavLink> */}
//               <NavLink
//                 to="/dashboard/expert"
//                 className={({ isActive }) =>
//                   `flex items-center p-2 rounded-lg transition-colors duration-150 ease-in-out  ${
//                     isActive
//                       ? "bg-[#d6fae2] font-semibold text-green-900"
//                       : "text-gray-900 hover:bg-[#d6fae2] dark:text-white dark:hover:bg-gray-700"
//                   }`
//                 }
//               >
//                 <House className="w-5 h-5" />
//                 <span className="ms-3">Home</span>
//               </NavLink>
//             </li>
//             <li>
//               <NavLink
//                 to="/dashboard/expert/availability"
//                 className={({ isActive }) =>
//                   `flex items-center p-2 rounded-lg transition-colors duration-150 ease-in-out ${
//                     isActive
//                       ? "bg-[#d6fae2] font-semibold text-green-900"
//                       : "text-gray-900 hover:bg-[#d6fae2] dark:text-white dark:hover:bg-gray-700"
//                   }`
//                 }
//               >
//                 <CalendarDays className="w-5 h-5" />
//                 <span className="ms-3">Availability</span>
//               </NavLink>
//             </li>
//             <li>
//               <NavLink
//                 to="/dashboard/expert/service-pricing"
//                 className={({ isActive }) =>
//                   `flex items-center p-2 rounded-lg transition-colors duration-150 ease-in-out ${
//                     isActive
//                       ? "bg-[#d6fae2] font-semibold text-green-900"
//                       : "text-gray-900 hover:bg-[#d6fae2] dark:text-white dark:hover:bg-gray-700"
//                   }`
//                 }
//               >
//                 <HandPlatter className="w-5 h-5" />
//                 <span className="ms-3">Pricing & Services</span>
//               </NavLink>
//             </li>
//             <li>
//               <NavLink
//                 to="/dashboard/expert/profile-detail"
//                 className={({ isActive }) =>
//                   `flex items-center p-2 rounded-lg transition-colors duration-150 ease-in-out ${
//                     isActive
//                       ? "bg-[#d6fae2] font-semibold text-green-900"
//                       : "text-gray-900 hover:bg-[#d6fae2] dark:text-white dark:hover:bg-gray-700"
//                   }`
//                 }
//               >
//                 <UserPen className="w-5 h-5" />
//                 <span className="ms-3">Profile Detail</span>
//               </NavLink>
//             </li>
//             <li>
//               <NavLink
//                 to="/dashboard/expert/meetings"
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
//                 to="/dashboard/expert/clients"
//                 className={({ isActive }) =>
//                   `flex items-center p-2 rounded-lg transition-colors duration-150 ease-in-out ${
//                     isActive
//                       ? "bg-[#d6fae2] font-semibold text-green-900"
//                       : "text-gray-900 hover:bg-[#d6fae2] dark:text-white dark:hover:bg-gray-700"
//                   }`
//                 }
//               >
//                 <Users className="w-5 h-5" />
//                 <span className="ms-3">Clients</span>
//               </NavLink>
//             </li>
//             <li>
//               <NavLink
//                 to="/dashboard/expert/chats"
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
//             <li>
//               <NavLink
//                 to="/dashboard/expert/reviews"
//                 className={({ isActive }) =>
//                   `flex items-center p-2 rounded-lg transition-colors duration-150 ease-in-out ${
//                     isActive
//                       ? "bg-[#d6fae2] font-semibold text-green-900"
//                       : "text-gray-900 hover:bg-[#d6fae2] dark:text-white dark:hover:bg-gray-700"
//                   }`
//                 }
//               >
//                 <Star className="w-5 h-5" />
//                 <span className="ms-3">Reviews</span>
//               </NavLink>
//             </li>
//             <li>
//               <NavLink
//                 to="/dashboard/expert/payments"
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

// export default ExpertDashboardLayout;

import React, { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "@/Redux/Slices/authSlice";
import AuthPopup from "@/components/Auth/AuthPopup.auth";
import {
  ChevronDown,
  LogOut,
  User,
  CircleUserRound,
  BadgeIndianRupee,
  CalendarDays,
  HandPlatter,
  House,
  MessageSquareText,
  Star,
  UserPen,
  Users,
  Video,
  LayoutDashboard,
  UserCheck,
  Home,
} from "lucide-react";

const ExpertDashboardLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const [isExpertMode, setIsExpertMode] = useState(false);
  const [isAuthPopupOpen, setAuthPopupOpen] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userName = useSelector((state) => state.auth.user?.name || "User");
  const [hasExpertData, setHasExpertData] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();

  const isLinkActive = (path) => {
    return location.pathname === path;
  };

  // Check for expertData in localStorage on component mount
  useEffect(() => {
    const expertData = localStorage.getItem("expertData");
    const expertMode = localStorage.getItem("expertMode");

    if (expertData) {
      setHasExpertData(true);
    }
    if (expertMode === "true") {
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
    navigate("/");
  };
  

  const handleToggleExpertMode = () => {
    const newMode = !isExpertMode;
    setIsExpertMode(newMode);

    // Update localStorage to reflect the new mode
    if (newMode) {
      localStorage.setItem("expertMode", "true");
    } else {
      localStorage.removeItem("expertMode");
    }

    // Redirect based on the mode
    if (newMode) {
      navigate("/dashboard/expert/");
    } else {
      navigate("/"); // Navigate to the landing page
    }
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
                  href="/"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  <Home className="w-4 h-4" />
                  Back to Home
                </a>
                <button
                  onClick={handleToggleExpertMode}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 w-full text-left"
                >
                  <User className="w-4 h-4" />
                  {/* Switch to User Mode */}
                  {isExpertMode
                    ? "Switch to User Mode"
                    : "Switch to Expert Mode"}
                </button>
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
                  <LayoutDashboard className="w-4 h-4" />
                  User Dashboard
                </a>
                {isLoggedIn && hasExpertData && (
                  <button
                    onClick={handleToggleExpertMode}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 w-full text-left"
                  >
                    <UserCheck className="w-4 h-4" />
                    Switch to Expert Mode
                  </button>
                )}
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
        <div className="max-w-7xl px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="/" className="flex items-center font-bold text-gray-900">
                <img src="/logo104.99&44.svg" alt="Advizy Logo" />
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              <a
                href="/about-us"
                className={`transition-colors duration-200 text-base font-medium ${
                  isLinkActive("/about-us")
                    ? "text-primary underline underline-offset-4"
                    : "text-gray-600 hover:text-primary"
                }`}
              >
                About Us
              </a>

              {!isExpertMode && (
                <a
                  href="/become-expert"
                  className={`transition-colors duration-200 text-base font-medium ${
                    isLinkActive("/become-expert")
                      ? "text-primary underline underline-offset-4"
                      : "text-gray-600 hover:text-primary"
                  }`}
                >
                  Share Your Expertise
                </a>
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
        <AuthPopup isOpen={isAuthPopupOpen} onClose={handleCloseAuthPopup} />
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
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-colors duration-150 ease-in-out  ${
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
                to="/dashboard/expert/availability"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-colors duration-150 ease-in-out ${
                    isActive
                      ? "bg-[#d6fae2] font-semibold text-green-900"
                      : "text-gray-900 hover:bg-[#d6fae2] dark:text-white dark:hover:bg-gray-700"
                  }`
                }
              >
                <CalendarDays className="w-5 h-5" />
                <span className="ms-3">Availability</span>
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
                <HandPlatter className="w-5 h-5" />
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
                <UserPen className="w-5 h-5" />
                <span className="ms-3">Profile Detail</span>
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
                <Video className="w-5 h-5" />
                <span className="ms-3">Meetings</span>
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
                <Users className="w-5 h-5" />
                <span className="ms-3">Clients</span>
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
                <MessageSquareText className="w-5 h-5" />
                <span className="ms-3">Chats</span>
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
                <Star className="w-5 h-5" />
                <span className="ms-3">Reviews</span>
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
                <BadgeIndianRupee className="w-5 h-5" />
                <span className="ms-3">Payments</span>
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

export default ExpertDashboardLayout;
