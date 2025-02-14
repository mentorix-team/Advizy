import { logout } from "@/Redux/Slices/authSlice";
import AuthPopup from "@/components/Auth/AuthPopup.auth";
import { ChevronDown, LogOut, User, CircleUserRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
 

const Navbar = ({ onSearch }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate(); // Initialize router
  const [isExpertMode, setIsExpertMode] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userName = useSelector((state) => state.auth.user?.name || "User");
  const [isAuthPopupOpen, setAuthPopupOpen] = useState(false);
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
    const newMode = !isExpertMode;
    setIsExpertMode(newMode);

    // Redirect based on the mode
    if (newMode) {
      navigate("/dashboard/expert/");
    } else {
      localStorage.removeItem("expertData"); // Remove expert data when switching to user mode
      window.location.href = "/"; // Force full reload to ensure mode switch
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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-[#FCFCFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center font-bold text-gray-900">
              <img src="/logo104.99&44.svg" alt="Advizy Logo" />
            </a>
          </div>

          <div className="flex lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
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

          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
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
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm cursor-pointer"
                onClick={onSearch}
                readOnly
              />
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <a
              href="/about-us"
              className="text-gray-600 hover:text-primary transition-colors duration-200 text-sm font-medium"
            >
              About Us
            </a>
            {/* <a
              href="/become-expert"
              className="text-gray-600 hover:text-primary transition-colors duration-200 text-sm font-medium"
            >
              Become an Expert
            </a> */}
            {!isExpertMode && (
              <a
                href="/become-expert"
                className="text-gray-600 hover:text-primary transition-colors duration-200 text-sm font-medium"
              >
                Become an Expert
              </a>
            )}

            {isLoggedIn && localStorage.getItem("expertData") && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">
                  {isExpertMode ? "Expert Mode" : "User Mode"}
                </span>
                <button
                  onClick={handleToggleExpertMode}
                  className="flex items-center justify-center w-10 h-6 rounded-full bg-gray-200 relative cursor-pointer transition-colors duration-300"
                  aria-label={`Switch to ${
                    isExpertMode ? "User" : "Expert"
                  } Mode`}
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

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden py-4 border-t border-gray-200"
          >
            <div className="flex flex-col space-y-4">
              <div className="px-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
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
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm cursor-pointer"
                    onClick={onSearch}
                    readOnly
                  />
                </div>
              </div>
              <a
                href="/about"
                className="text-gray-600 hover:text-primary transition-colors duration-200 text-sm font-medium px-2"
              >
                About Us
              </a>
              {!isExpertMode && (
                <a
                  href="/become-expert"
                  className="text-gray-600 hover:text-primary transition-colors duration-200 text-sm font-medium px-2"
                >
                  Become an Expert
                </a>
              )}
              <div className="px-2">
                {isLoggedIn ? (
                  <div className="space-y-2">
                    <a
                      href={
                        isExpertMode ? "/dashboard/expert/" : "/dashboard/user/"
                      }
                      className="flex items-center gap-2 w-full text-sm text-gray-700 hover:text-primary transition-colors duration-200"
                    >
                      <User className="w-4 h-4" />
                      {isExpertMode ? "Expert Dashboard" : "Dashboard"}
                    </a>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-sm text-red-600 hover:text-red-700 transition-colors duration-200"
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
