import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FilterSidebar from "./FilterSidebar";
import DomainBar from "./DomainBar";
import ExpertList from "./ExpertList";
import { useSearchParams } from "react-router-dom";
import { domainOptions } from "@/utils/Options";
import NavbarWithoutSearchModal from "../Home/components/NavbarWithoutSearchModal";

const Homees = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [filters, setFilters] = useState({
    selectedDomain: null,
    selectedNiches: [],
    priceRange: [1, 100000],
    selectedLanguages: [],
    selectedRatings: [],
    selectedDurations: [],
  });
  const [sorting, setSorting] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Log whenever filters or domain change dynamically
  useEffect(() => {
    console.log("Updated Filters:", filters);
  }, [filters]);

  useEffect(() => {
    console.log("Selected Domain:", selectedDomain);
  }, [selectedDomain]);

  // Update filters whenever selectedDomain changes
  const updateDomain = (domain) => {
    setSelectedDomain(domain);
    setFilters((prev) => ({
      ...prev,
      selectedDomain: domain,
    }));

    navigate(`/explore?category=${domain.value}`);
  };

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    const domain = domainOptions.find((opt) => opt.value === categoryFromUrl);
    if (domain) {
      setSelectedDomain(domain);
      setFilters((prev) => ({
        ...prev,
        selectedDomain: domain,
      }));
      // DO NOT navigate here!
    }
  }, [searchParams]);

  // Update filters whenever selectedDomain changes
  // useEffect(() => {
  //   setFilters((prevFilters) => ({
  //     ...prevFilters,
  //     selectedDomain,
  //   }));
  // }, [selectedDomain]);

  const handleApplyFilters = (newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
    // Close sidebar on mobile after applying filters
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const resetFilters = () => {
    setSelectedDomain(null);
    setFilters({
      selectedDomain: null,
      selectedNiches: [],
      priceRange: [200, 100000],
      selectedLanguages: [],
      selectedRatings: [],
      selectedDurations: [],
    });
    setSorting(""); // Reset sorting to initial state
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Domain Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <NavbarWithoutSearchModal
          onSearch={(query) => {
            console.log("Search Query:", query);
          }}
        />
        <DomainBar
          onDomainSelect={updateDomain}
          resetFilters={resetFilters}
          sorting={sorting} // Pass sorting state
          setSorting={setSorting} // Pass setSorting function
          toggleSidebar={toggleSidebar}
          selectedDomain={selectedDomain}
        />
      </div>

      {/* Main Content */}
      <div className="flex pt-28">
        {" "}
        {/* Reduced padding-top for mobile */}
        {/* Mobile Filter Button (visible only on small screens) */}
        <button
          onClick={toggleSidebar}
          className="fixed bottom-4 right-4 md:hidden z-50 bg-primary text-white p-3 rounded-full shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
        </button>
        {/* Sidebar - Increased width on desktop, hidden on mobile by default */}
        <div
          className={`fixed left-0 top-28 md:top-32 h-[calc(100vh-7rem)] md:h-[calc(100vh-8rem)] w-80 md:w-80 overflow-y-auto border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out z-40
                        md:translate-x-0 ${isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
            }`}
        >
          <FilterSidebar
            selectedDomain={selectedDomain}
            onApplyFilters={handleApplyFilters}
          />
        </div>
        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
        {/* Content Area - Full width on mobile, adjusted on desktop */}
        <div className="w-full md:ml-80 p-4 md:p-6">
          <ExpertList
            filters={filters}
            sorting={sorting}
            key={filters.selectedDomain?.value || "all"}
          />
        </div>
      </div>
    </div>
  );
};

export default Homees;