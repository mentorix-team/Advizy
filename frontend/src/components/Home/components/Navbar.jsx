import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, LogOut, User, CircleUserRound, UserCheck, LayoutDashboard } from 'lucide-react';
import { logout } from '@/Redux/Slices/authSlice';
import AuthPopup from '@/components/Auth/AuthPopup.auth';

const Navbar = ({ onSearch }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [isExpertMode, setIsExpertMode] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userName = useSelector((state) => state.auth.user?.name || "User");
  const [isAuthPopupOpen, setAuthPopupOpen] = useState(false);
  const [hasExpertData, setHasExpertData] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();

  const isLinkActive = (path) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const expertData = localStorage.getItem("expertData");
    setIsExpertMode(true);
    if (expertData) {
      setHasExpertData(true);
    }
  }, []);

  useEffect(() => {
    const expertMode = localStorage.getItem("expertMode") === "true";
    setIsExpertMode(expertMode);
  }, []);

  useEffect(() => {
    const expertMode = localStorage.getItem("expertMode");
    if (expertMode === "true") {
      setIsExpertMode(true);
    } else {
      setIsExpertMode(false);
    }
  }, []);

  const handleOpenAuthPopup = () => {
    setAuthPopupOpen(true);
  };

  const handleCloseAuthPopup = () => {
    setAuthPopupOpen(false);
  };

  const handleLogout = async () => {
    await dispatch(logout());
    setIsDropdownOpen(false);
    navigate('/');
  };

  const handleToggleExpertMode = () => {
    const newMode = !isExpertMode;
  
    if (newMode) {
      localStorage.setItem("expertMode", "true");
    } else {
      localStorage.removeItem("expertMode");
    }
  
    setIsExpertMode(newMode);
  
    if (newMode) {
      console.log("Navigating to Expert Dashboard");
      navigate("/dashboard/expert/");
    } else {
      console.log("Navigating to User Dashboard");
      navigate("/dashboard/user/meetings");
    }
    
    // Close mobile menu after switching modes
    setIsMenuOpen(false);
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
                  <LayoutDashboard className="w-4 h-4" />
                  Expert Dashboard
                </a>
                <button
                  onClick={handleToggleExpertMode}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 w-full text-left"
                >
                  <User className="w-4 h-4" />
                  Switch to User Mode
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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-[#FCFCFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center font-bold text-gray-900">
              <img src="/logo104.99&44.svg" alt="Advizy Logo" />
            </a>
          </div>

          <div className="hidden lg:block flex-1 max-w-2xl mx-8">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search mentors by name or expertise..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none text-base cursor-pointer transition-all duration-200 hover:border-primary/50 shadow-sm hover:shadow-md"
                onClick={onSearch}
                readOnly
              />
            </motion.div>
          </div>

          <div className="flex lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none p-2"
              aria-label="Toggle menu"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

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

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden py-4 border-t border-gray-200 bg-white"
          >
            <div className="flex flex-col space-y-4">
              <div className="w-full px-4">
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search mentors..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none text-sm cursor-pointer transition-all duration-200 hover:border-primary/50 shadow-sm hover:shadow-md"
                    onClick={onSearch}
                    readOnly
                  />
                </motion.div>
              </div>
              <a
                href="/about-us"
                className={`w-full text-center py-2 transition-colors duration-200 text-sm font-medium ${
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
                  className={`w-full text-center py-2 transition-colors duration-200 text-sm font-medium ${
                    isLinkActive("/become-expert")
                      ? "text-primary underline underline-offset-4"
                      : "text-gray-600 hover:text-primary"
                  }`}
                >
                  Share Your Expertise
                </a>
              )}
              <div className="px-4">
                {isLoggedIn ? (
                  <div className="space-y-2">
                    {isExpertMode ? (
                      <>
                        <a
                          href="/dashboard/expert"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Expert Dashboard
                        </a>
                        <button
                          onClick={handleToggleExpertMode}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 w-full"
                        >
                          <User className="w-4 h-4" />
                          Switch to User Mode
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
                        {hasExpertData && (
                          <button
                            onClick={handleToggleExpertMode}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 w-full"
                          >
                            <UserCheck className="w-4 h-4" />
                            Switch to Expert Mode
                          </button>
                        )}
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors duration-200 w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                    onClick={handleOpenAuthPopup}
                  >
                    Login
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
      <AuthPopup isOpen={isAuthPopupOpen} onClose={handleCloseAuthPopup} />
    </nav>
  );
};

export default Navbar;