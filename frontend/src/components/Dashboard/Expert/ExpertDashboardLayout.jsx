import React, { useState, useEffect, useRef } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "@/Redux/Slices/authSlice";
import AuthPopup from "@/components/Auth/AuthPopup.auth";
import { FaUser } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa6";
import {
  ChevronDown,
  LogOut,
  User,
  CircleUserRound,
  BadgeIndianRupee,
  CalendarDays,
  HandPlatter,
  Mouse as House,
  MessageSquareText,
  Star,
  User as UserPen,
  Users,
  Video,
  LayoutDashboard,
  UserCheck,
  Home,
  Menu,
  X,
  PanelRightCloseIcon,
  HouseIcon,
  Search,
  CircleHelp,
} from "lucide-react";
import Navbar from "@/components/Home/components/Navbar";

const ExpertDashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const [isExpertMode, setIsExpertMode] = useState(false);
  const [isAuthPopupOpen, setAuthPopupOpen] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const { data } = useSelector((state) => state.auth);
  const dropdownTimeoutRef = useRef(null);


  let parsedData;
  try {
    parsedData = typeof data === "string" ? JSON.parse(data) : data;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    parsedData = data;
  }

  const [hasExpertData, setHasExpertData] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest(".user-dropdown")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById("mobile-sidebar");
      const menuButton = document.getElementById("mobile-menu-button");

      if (
        isMobileMenuOpen &&
        sidebar &&
        !sidebar.contains(event.target) &&
        !menuButton?.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const isLinkActive = (path) => {
    return location.pathname === path;
  };

  // Add this helper function before the UserDropdown component
  const isCurrentlyInExpertDashboard = () => {
    return location.pathname.startsWith('/dashboard/expert');
  };

  // Update the useEffect to also check current route
  useEffect(() => {
    const expertData = localStorage.getItem("expertData");
    const expertMode = localStorage.getItem("expertMode");
    const isInExpertDashboard = isCurrentlyInExpertDashboard();

    if (expertData) {
      setHasExpertData(true);
    }

    // Set expert mode if either localStorage says so OR we're in expert dashboard
    if (expertMode === "true" || isInExpertDashboard) {
      setIsExpertMode(true);
    }
  }, [location.pathname]); // Add location.pathname as dependency

  const handleOpenAuthPopup = () => {
    setAuthPopupOpen(true);
    setIsMobileMenuOpen(false);
  };

  const handleCloseAuthPopup = () => {
    setAuthPopupOpen(false);
  };

  const handleLogout = async () => {
    try {
      const response = await dispatch(logout()).unwrap();
      if (response?.success) {
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
        navigate("/");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleToggleExpertMode = () => {
    const newMode = !isExpertMode;
    setIsExpertMode(newMode);

    if (newMode) {
      localStorage.setItem("expertMode", "true");
    } else {
      localStorage.removeItem("expertMode");
    }

    if (newMode) {
      navigate("/dashboard/expert/home");
    } else {
      navigate("/");
    }
    setIsMobileMenuOpen(false);
  };

  const handleMouseEnter = () => {
    // Clear any existing timeout to prevent premature closing
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    // Set a timeout to close the dropdown after a short delay
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200); // Adjust delay as needed
  }

  // Update the UserDropdown component condition
  const UserDropdown = () => {
    const shouldShowExpertMode = isExpertMode || isCurrentlyInExpertDashboard();

    return (
      <div className="relative user-dropdown"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}>
        <button
          className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors duration-200 focus:outline-none p-2 rounded-md"
        >
          <span className="text-sm font-medium">
            {isExpertMode ? (
              <FaUserTie className="w-5 h-5" />
            ) : (
              <FaUser className="w-5 h-5" />
            )}

          </span>
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-100"
            >
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">
                  {parsedData?.firstName} {parsedData?.lastName}
                </p>
                <p className="text-xs text-gray-500">Expert Account</p>
              </div>
              {shouldShowExpertMode ? (
                <>
                  <button
                    onClick={handleToggleExpertMode}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 w-full text-left"
                  >
                    <User className="w-4 h-4" />
                    Switch to User Mode
                  </button>
                  <div className="border-t border-gray-100 mt-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors duration-200 w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
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
                  <div className="border-t border-gray-100 mt-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors duration-200 w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="overflow-x-hidden">
      {/* <Navbar /> */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Left section */}
            <div className="flex items-center gap-8">
              <a href="#" className="flex items-center">
                <img
                  src="/logo104.99&44.svg"
                  alt="Advizy Logo"
                  className="h-12"
                />
              </a>


            </div>

            {/* Right section */}
            <div className="flex items-center lg:pr-10">

              {/* User Profile & Mobile Menu */}
              <div className="flex items-center gap-3 lg:pr-10">
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

                {/* Hamburger Menu Button */}
                <button
                  id="mobile-menu-button"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <PanelRightCloseIcon className="h-8 w-8 text-gray-700" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        <AuthPopup isOpen={isAuthPopupOpen} onClose={handleCloseAuthPopup} />
      </nav>

      {/* Blur Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        id="mobile-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } bg-green-50 border-r border-gray-200 lg:translate-x-0 dark:bg-gray-800 dark:border-gray-700`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-green-50 dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <NavLink
                to="/dashboard/expert/home"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-colors duration-150 ease-in-out  ${isActive
                    ? "bg-[#d6fae2] font-semibold text-green-900"
                    : "text-gray-900 hover:bg-[#d6fae2] dark:text-white dark:hover:bg-gray-700"
                  }`
                }
              >
                <HouseIcon className="w-5 h-5" />
                <span className="ms-3">Home</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/expert/profile-detail"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-colors duration-150 ease-in-out ${isActive
                    ? "bg-[#d6fae2] font-semibold text-green-900"
                    : "text-gray-900 hover:bg-[#d6fae2] dark:text-white dark:hover:bg-gray-700"
                  }`
                }
              >
                <UserPen className="w-5 h-5" />
                <span className="ms-3">Profile</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/expert/service-pricing"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-colors duration-150 ease-in-out ${isActive
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
                to="/dashboard/expert/availability"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-colors duration-150 ease-in-out ${isActive
                    ? "bg-[#d6fae2] font-semibold text-green-900"
                    : "text-gray-900 hover:bg-[#d6fae2] dark:text-white dark:hover:bg-gray-700"
                  }`
                }
              >
                <CalendarDays className="w-5 h-5" />
                <span className="ms-3">Availability</span>
              </NavLink>
            </li>

            <hr className="border-gray-300 dark:border-gray-600 my-2" />

            <li>
              <NavLink
                to="/dashboard/expert/meetings"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-colors duration-150 ease-in-out ${isActive
                    ? "bg-[#d6fae2] font-semibold text-green-900"
                    : "text-gray-900 hover:bg-[#d6fae2] dark:text-white dark:hover:bg-gray-700"
                  }`
                }
              >
                <Video className="w-5 h-5" />
                <span className="ms-3">Meetings</span>
              </NavLink>
            </li>
            {/* <li>
              <NavLink
                to="/dashboard/expert/clients"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-colors duration-150 ease-in-out ${isActive
                    ? "bg-[#d6fae2] font-semibold text-green-900"
                    : "text-gray-900 hover:bg-[#d6fae2] dark:text-white dark:hover:bg-gray-700"
                  }`
                }
              >
                <Users className="w-5 h-5" />
                <span className="ms-3">Client-session</span>
              </NavLink>
            </li> */}
            <li>
              <NavLink
                to="/dashboard/expert/payments"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-colors duration-150 ease-in-out ${isActive
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
                to="/dashboard/expert/chats"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-colors duration-150 ease-in-out ${isActive
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
                  `flex items-center p-2 rounded-lg transition-colors duration-150 ease-in-out ${isActive
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
                to="/dashboard/expert/help-center"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-colors duration-150 ease-in-out ${isActive
                    ? "bg-[#d6fae2] font-semibold text-green-900"
                    : "text-gray-900 hover:bg-[#d6fae2] dark:text-white dark:hover:bg-gray-700"
                  }`
                }
              >
                <CircleHelp className="w-5 h-5" />
                <span className="ms-3">Help Center</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </aside>

      <main className="lg:ml-64 pt-20 bg-[#f6f7f7]">
        <div className="mx-auto px-4">
          <Outlet />
        </div>
      </main>

      <AuthPopup isOpen={isAuthPopupOpen} onClose={handleCloseAuthPopup} />
    </div>
  );
};

export default ExpertDashboardLayout;