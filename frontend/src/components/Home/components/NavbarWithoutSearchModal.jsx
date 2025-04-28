import React, { useEffect, useRef, useCallback, useState } from "react";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import instantsearch from "instantsearch.js";
import { configure } from "instantsearch.js/es/widgets";
import debounce from "lodash/debounce";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  LogOut,
  User,
  CircleUserRound,
  UserCheck,
  LayoutDashboard,
  ChevronRight,
  Search,
} from "lucide-react";
import SearchModal from "./SearchModal";

const NavbarWithSearch = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isExpertMode, setIsExpertMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("User");
  const [isAuthPopupOpen, setAuthPopupOpen] = useState(false);
  const [hasExpertData, setHasExpertData] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const searchClient = useRef(null);
  const searchRef = useRef(null);
  const [hits, setHits] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [query, setQuery] = useState("");

  // Debounced search function
  const handleNavbarSearch = useCallback(
    debounce((query) => {
      if (searchRef.current && searchRef.current.helper) {
        searchRef.current.helper.setQuery(query).search();
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (!searchClient.current) {
      searchClient.current = algoliasearch(
        "XWATQTV8D5", // your App ID
        "1d072ac04759ef34bc76e8216964c29e" // your Search API Key (public)
      );
    }

    if (!searchRef.current) {
      searchRef.current = instantsearch({
        indexName: "experts_index",
        searchClient: searchClient.current,
      });

      searchRef.current.addWidgets([configure({ hitsPerPage: 5 })]);

      searchRef.current.on("render", () => {
        const results = searchRef.current.helper.lastResults;
        if (results && results.hits) {
          console.log("Navbar Search Results:", results.hits); // Optional for debugging
          setHits(results.hits);
          // Only show dropdown if query is not empty
          setShowDropdown(query.trim() !== "");
        }
      });

      searchRef.current.start();
    }

    return () => {
      if (searchRef.current) {
        searchRef.current.dispose();
        searchRef.current = null;
      }
    };
  }, [query]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim() === "") {
      setHits([]);
      setShowDropdown(false);
    } else {
      handleNavbarSearch(value);
    }
  };

  const openExpertProfile = (expertId) => {
    // Navigate to expert profile
    console.log(`Navigating to expert/${expertId}`);
    setShowDropdown(false);
  };

  const handleOpenAuthPopup = () => {
    setAuthPopupOpen(true);
  };

  const handleCloseAuthPopup = () => {
    setAuthPopupOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
  };

  const handleToggleExpertMode = () => {
    const newMode = !isExpertMode;
    setIsExpertMode(newMode);
    setIsMenuOpen(false);
  };

  const handleOpenSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const handleCloseSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  const handleSearchQueryChange = (value) => {
    setQuery(value);
    if (value.trim() === "") {
      setHits([]);
    } else {
      handleNavbarSearch(value);
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
                {hasExpertData && (
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
    <nav className="fixed top-0 left-0 right-0 z-40 border-b border-gray-200 bg-[#FCFCFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center font-bold text-gray-900">
              <img src="/logo104.99&44.svg" alt="Logo" />
            </a>
          </div>

          <div className="hidden lg:block flex-1 max-w-2xl mx-8">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-primary" />
              </div>
              <input
                type="text"
                placeholder="Search mentors by name or expertise..."
                value={query}
                onChange={handleInputChange}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // delay to allow click
                onFocus={() => query.trim() !== "" && hits.length > 0 && setShowDropdown(true)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none text-base cursor-pointer transition-all duration-200 hover:border-primary/50 shadow-sm hover:shadow-md"
              />
              {showDropdown && query.trim() !== "" && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {hits.length > 0 ? (
                    hits.map((hit) => (
                      <div
                        key={hit.objectID}
                        className="flex items-center justify-between px-4 py-3 hover:bg-gray-100 cursor-pointer"
                        onClick={() => openExpertProfile(hit.objectID)}
                      >
                        <div className="flex items-center space-x-3">
                          {hit.profileImage ? (
                            <img
                              src={hit.profileImage}
                              alt={hit.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-500" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{hit.name}</div>
                            <div className="text-sm text-gray-500">
                              {hit.professionalTitle || hit.expertise || "Expert"}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500">
                      No experts found matching your search
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* Mobile navbar actions */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={handleOpenSearchModal}
              className="text-gray-600 hover:text-gray-900 focus:outline-none p-2 mr-1"
              aria-label="Open search"
            >
              <Search className="h-5 w-5" />
            </button>
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

          {/* Desktop navigation - Only visible on desktop */}
          <div className="hidden lg:flex items-center gap-6">
            <a
              href="/about-us"
              className="transition-colors duration-200 text-base font-medium text-gray-600 hover:text-primary"
            >
              About Us
            </a>

            {!isExpertMode && (
              <a
                href="/become-expert"
                className="transition-colors duration-200 text-base font-medium text-gray-600 hover:text-primary"
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

        {/* Mobile menu - Only visible on mobile */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden py-4 border-t border-gray-200 bg-white"
            >
              <div className="flex flex-col space-y-4">
                <a
                  href="/about-us"
                  className="w-full text-center py-2 transition-colors duration-200 text-sm font-medium text-gray-600 hover:text-primary"
                >
                  About Us
                </a>
                {!isExpertMode && (
                  <a
                    href="/become-expert"
                    className="w-full text-center py-2 transition-colors duration-200 text-sm font-medium text-gray-600 hover:text-primary"
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
        </AnimatePresence>
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={handleCloseSearchModal}
        query={query}
        onQueryChange={handleSearchQueryChange}
        hits={hits}
        onExpertSelect={openExpertProfile}
      />
    </nav>
  );
};

export default NavbarWithSearch;