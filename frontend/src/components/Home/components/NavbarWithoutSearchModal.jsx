import React, { useEffect, useRef, useCallback, useState } from "react";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import debounce from "lodash/debounce";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/Redux/Slices/authSlice";
import { useParams, useNavigate } from "react-router-dom";
import AuthPopup from "@/components/Auth/AuthPopup.auth";
import {
  ChevronDown,
  LogOut,
  User,
  CircleUserRound,
  UserCheck,
  LayoutDashboard,
  ChevronRight,
  Search,
  X
} from "lucide-react";
import SearchModal from "./SearchModal";

const NavbarWithSearch = () => {
  // Redux and navigation
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const getRedirect = (hit) => hit.redirect_url || hit.username || hit.objectID;
  // State variables
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isExpertMode, setIsExpertMode] = useState(false);
  const [isAuthPopupOpen, setAuthPopupOpen] = useState(false);
  const [hasExpertData, setHasExpertData] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);

  // Search functionality
  const searchClient = useRef(null);
  const [hits, setHits] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { redirect_url } = useParams();

  // Initialize expert mode and data from localStorage
  useEffect(() => {
    const expertData = localStorage.getItem("expertData");
    const expertMode = localStorage.getItem("expertMode") === "true";
    setHasExpertData(!!expertData);
    setIsExpertMode(expertMode);
  }, []);

  // Initialize Algolia search client
  useEffect(() => {
    if (!searchClient.current) {
      searchClient.current = algoliasearch(
        "XWATQTV8D5", // your App ID
        "1d072ac04759ef34bc76e8216964c29e" // your Search API Key (public)
      );
    }
  }, []);

  // Debounced search function
  const handleNavbarSearch = useCallback(
    debounce((searchQuery) => {
      if (searchClient.current && searchQuery.trim()) {
        setIsSearching(true);
        searchClient.current.search([
          {
            indexName: "experts_index", // Make sure this matches your actual index name
            query: searchQuery.trim(),
            params: {
              hitsPerPage: 5,
            }
          }
        ]).then(({ results }) => {
          const searchHits = results[0]?.hits || [];
          console.log("Search results:", searchHits); // Debug log
          setHits(searchHits);
          setShowDropdown(true);
          setIsSearching(false);
        }).catch(error => {
          console.error("Search error:", error);
          setHits([]);
          setShowDropdown(false);
          setIsSearching(false);
        });
      } else {
        setHits([]);
        setShowDropdown(false);
        setIsSearching(false);
      }
    }, 300),
    []
  );

  // Input change handler
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setHits([]);
      setShowDropdown(false);
      setIsSearching(false);
    } else {
      setShowDropdown(true);
      handleNavbarSearch(value);
    }
  };

  // Navigation handlers
  const openExpertProfile = (redirect_url) => {
    if (!redirect_url) return;
    console.log("Navigating to expert:", redirect_url);
    // close AFTER scheduling navigation so blur won't cancel click
    navigate(`/expert/${redirect_url}`);
    setTimeout(() => {
      setShowDropdown(false);
      setIsMobileSearchActive(false);
      setQuery("");
    }, 0);
  };


  // Authentication handlers
  const handleOpenAuthPopup = () => {
    setAuthPopupOpen(true);
  };

  const handleCloseAuthPopup = () => {
    setAuthPopupOpen(false);
  };

  // Logout handler
  const handleLogout = async () => {
    await dispatch(logout());
    setIsDropdownOpen(false);
    navigate('/');
  };

  // Expert mode toggle
  const handleToggleExpertMode = () => {
    const newMode = !isExpertMode;
    if (newMode) {
      localStorage.setItem("expertMode", "true");
      navigate("/dashboard/expert/");
    } else {
      localStorage.removeItem("expertMode");
      navigate("/dashboard/user/meetings");
    }
    setIsExpertMode(newMode);
    setIsDropdownOpen(false);
  };

  // Mobile search handlers
  const handleOpenMobileSearch = () => {
    setIsMobileSearchActive(true);
  };

  const handleCloseMobileSearch = () => {
    setIsMobileSearchActive(false);
    setQuery("");
    setHits([]);
    setShowDropdown(false);
  };

  // Domain matching function
  const getDomainMatch = (searchQuery) => {
    if (!searchQuery || searchQuery.trim() === "") return null;

    const domainMap = {
      // Existing mappings
      'career': { label: 'Career & Education', value: 'career_and_education' },
      'education': { label: 'Career & Education', value: 'career_and_education' },
      'career & education': { label: 'Career & Education', value: 'career_and_education' },

      'personal': { label: 'Personal Development', value: 'personal_development' },
      'development': { label: 'Personal Development', value: 'personal_development' },
      'personal development': { label: 'Personal Development', value: 'personal_development' },

      'business': { label: 'Business & Entrepreneurship', value: 'business_and_entrepreneurship' },
      'entrepreneur': { label: 'Business & Entrepreneurship', value: 'business_and_entrepreneurship' },
      'startup': { label: 'Business & Entrepreneurship', value: 'business_and_entrepreneurship' },
      'business entrepreneurship': { label: 'Business & Entrepreneurship', value: 'business_and_entrepreneurship' },

      'technology': { label: 'Technology & Digital Skills', value: 'technology_and_digital_skills' },
      'tech': { label: 'Technology & Digital Skills', value: 'technology_and_digital_skills' },
      'digital skills': { label: 'Technology & Digital Skills', value: 'technology_and_digital_skills' },
      'technology and digital skills': { label: 'Technology & Digital Skills', value: 'technology_and_digital_skills' },

      'legal': { label: 'Legal Advice', value: 'legal_advice' },
      'legal advice': { label: 'Legal Advice', value: 'legal_advice' },

      'finance': { label: 'Financial Guidance', value: 'financial_guidance' },
      'financial': { label: 'Financial Guidance', value: 'financial_guidance' },
      'financial guidance': { label: 'Financial Guidance', value: 'financial_guidance' },

      'arts': { label: 'Arts, Media & Entertainment', value: 'arts_media_and_entertainment' },
      'media': { label: 'Arts, Media & Entertainment', value: 'arts_media_and_entertainment' },
      'entertainment': { label: 'Arts, Media & Entertainment', value: 'arts_media_and_entertainment' },
      'arts media & entertainment': { label: 'Arts, Media & Entertainment', value: 'arts_media_and_entertainment' },

      'social impact': { label: 'Social Impact & Volunteering', value: 'social_impact_and_volunteering' },
      'volunteering': { label: 'Social Impact & Volunteering', value: 'social_impact_and_volunteering' },
      'social impact & volunteering': { label: 'Social Impact & Volunteering', value: 'social_impact_and_volunteering' },

      'hobbies': { label: 'Hobbies & Personal Interests', value: 'hobbies_and_personal_interests' },
      'personal interests': { label: 'Hobbies & Personal Interests', value: 'hobbies_and_personal_interests' },
      'hobbies & personal interests': { label: 'Hobbies & Personal Interests', value: 'hobbies_and_personal_interests' },

      // You can keep your previous keys for backward compatibility
      'health': { label: 'Health & Wellness', value: 'health_and_wellness' },
      'wellness': { label: 'Health & Wellness', value: 'health_and_wellness' },
      'health & wellness': { label: 'Health & Wellness', value: 'health_and_wellness' },

      'marketing': { label: 'Marketing', value: 'marketing' },
      'design': { label: 'Design & Creative', value: 'design_and_creative' },
      'creative': { label: 'Design & Creative', value: 'design_and_creative' },
      'design & creative': { label: 'Design & Creative', value: 'design_and_creative' }
    };

    const lowerQuery = searchQuery.toLowerCase().trim();

    // Check for exact matches first
    if (domainMap[lowerQuery]) {
      return domainMap[lowerQuery];
    }

    // Check for partial matches
    for (const [key, value] of Object.entries(domainMap)) {
      if (lowerQuery.includes(key) || value.label.toLowerCase().includes(lowerQuery)) {
        return value;
      }
    }

    return null;
  };

  // Search results rendering with requested changes
  const renderSearchResults = () => {
    const domainMatch = getDomainMatch(query);

    // Filter experts by domain if a domain is matched
    let domainExperts = [];
    if (domainMatch && hits.length > 0) {
      domainExperts = hits.filter(
        (hit) =>
          hit.domain === domainMatch.value ||
          (hit.domains && hit.domains.includes(domainMatch.value))
      );
    }

    return (
      <div className="absolute z-50 w-full bg-white border border-gray-300 mt-1 rounded-lg shadow-lg max-h-60 overflow-y-auto">
        {/* Domain browse button */}
        {domainMatch && (
          <div
            className="flex items-center justify-between px-4 py-3 hover:bg-primary/10 cursor-pointer border-b border-gray-100"
            onMouseDown={(e) => {
              e.preventDefault();
              navigate(`/explore?category=${domainMatch.value}`);
              setTimeout(() => {
                setShowDropdown(false);
                setIsMobileSearchActive(false);
                setQuery("");
              }, 0);
            }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Search className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-medium text-primary">
                  Browse {domainMatch.label} Experts
                </div>
                <div className="text-sm text-gray-500">
                  View all experts in this category
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-primary" />
          </div>
        )}

        {/* Show experts for the matched domain below the browse button */}
        {domainMatch && domainExperts.length > 0 && (
          <>
            <div className="px-4 py-2 text-xs text-gray-500 font-semibold">
              {domainMatch.label} Experts
            </div>
            {domainExperts.map((hit) => (
              <div
                key={getRedirect(hit)}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-100 cursor-pointer"
                onMouseDown={(e) => { e.preventDefault(); openExpertProfile(getRedirect(hit)); }}
              >
                <div className="flex items-center space-x-3">
                  {hit.profileImage ? (
                    <img
                      src={hit.profileImage}
                      alt={hit.name || 'Expert'}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-500" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="font-medium flex items-center gap-2 flex-wrap">
                      <span className="truncate max-w-[140px]">{hit.name || 'Expert'}</span>
                      {hit.redirect_url && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          @{hit.username}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 truncate max-w-[220px]">
                      {hit.professionalTitle || hit.expertise || 'Expert'}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            ))}
          </>
        )}

        {/* If no domain match, show regular expert results */}
        {!domainMatch && hits.length > 0 && (
          hits.map((hit) => (
            <div
              key={getRedirect(hit)}
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-100 cursor-pointer"
              onMouseDown={(e) => { e.preventDefault(); openExpertProfile(getRedirect(hit)); }}
            >
              <div className="flex items-center space-x-3">
                {hit.profileImage ? (
                  <img
                    src={hit.profileImage}
                    alt={hit.name || 'Expert'}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="font-medium flex items-center gap-2 flex-wrap">
                    <span className="truncate max-w-[140px]">{hit.name || 'Expert'}</span>
                    {hit.redirect_url && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        @{hit.username}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 truncate max-w-[220px]">
                    {hit.professionalTitle || hit.expertise || 'Expert'}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          ))
        )}

        {/* No results message */}
        {!isSearching && hits.length === 0 && query.trim() !== "" && (
          <div className="px-4 py-3 text-gray-500 text-center">
            No experts found matching "{query}"
          </div>
        )}
      </div>
    );
  };

  // User dropdown component
  const UserDropdown = () => (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors duration-200 focus:outline-none p-2 rounded-md"
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
              </>
            ) : (
              <>
                <a
                  href="/dashboard/user/meetings"
                  className="z-50 flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
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
              </>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors duration-200 w-full text-left"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const handleModalCategorySelect = (category) => {
    if (category.value) {
      navigate(`/explore?category=${category.value}`);
      setIsSearchModalOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-[#FCFCFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center font-bold text-gray-900">
              <img src="/logo104.99&44.svg" alt="Logo" />
            </a>
          </div>

          {/* Desktop search */}
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
                onFocus={() => {
                  if (query.trim() !== "") {
                    setShowDropdown(true);
                  }
                }}
                onBlur={(e) => {
                  // capture element reference to avoid e.currentTarget becoming null in timeout
                  const target = e.currentTarget;
                  setTimeout(() => {
                    if (target && !target.contains(document.activeElement)) {
                      setShowDropdown(false);
                    }
                  }, 150);
                }}

                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none text-base transition-all duration-200 hover:border-primary/50 shadow-sm hover:shadow-md"
              />
              {showDropdown && query.trim() !== "" && renderSearchResults()}
            </motion.div>
          </div>

          {/* Mobile navbar actions */}
          <div className="flex items-center lg:hidden">
            {!isMobileSearchActive ? (
              <>
                <button
                  onClick={handleOpenMobileSearch}
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
              </>
            ) : (
              <div className="flex items-center w-full">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-primary" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search mentors..."
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => {
                      if (query.trim() !== "") {
                        setShowDropdown(true);
                      }
                    }}
                    onBlur={(e) => {
                      const target = e.currentTarget;
                      setTimeout(() => {
                        if (target && !target.contains(document.activeElement)) {
                          setShowDropdown(false);
                        }
                      }, 150);
                    }}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none text-base transition-all duration-200 hover:border-primary/50 shadow-sm hover:shadow-md"
                    autoFocus
                  />
                  {showDropdown && query.trim() !== "" && renderSearchResults()}
                </div>
                <button
                  onClick={handleCloseMobileSearch}
                  className="text-gray-600 hover:text-gray-900 focus:outline-none p-2"
                  aria-label="Close search"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
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
          {isMenuOpen && !isMobileSearchActive && (
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
        onClose={() => setIsSearchModalOpen(false)}
        onCategorySelect={handleModalCategorySelect}
      />

      {/* Auth Popup */}
      <AuthPopup isOpen={isAuthPopupOpen} onClose={handleCloseAuthPopup} />
    </nav>
  );
};

export default NavbarWithSearch;  