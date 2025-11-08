import React, { useState, useEffect, useMemo } from "react";
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

  const domainFromUrl = useMemo(() => {
    const categoryValue = searchParams.get("category");
    return domainOptions.find((opt) => opt.value === categoryValue) || null;
  }, [searchParams]);

  const [selectedDomain, setSelectedDomain] = useState(domainFromUrl);
  const [filters, setFilters] = useState(() => ({
    selectedDomain: domainFromUrl,
    selectedNiches: [],
    priceRange: [1, 100000],
    selectedLanguages: [],
    selectedRatings: [],
    selectedDurations: [],
  }));
  const [sorting, setSorting] = useState("highest-rated"); // Default to highest-rated sort
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
    setSelectedDomain((prev) => {
      if (prev?.value === domainFromUrl?.value) {
        return prev;
      }
      return domainFromUrl;
    });

    setFilters((prev) => {
      if (prev.selectedDomain?.value === domainFromUrl?.value) {
        return prev;
      }
      return {
        ...prev,
        selectedDomain: domainFromUrl,
      };
    });
  }, [domainFromUrl]);

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
  };

  // Check if any filters are active (excluding selectedDomain)
  const hasActiveFilters =
    filters.selectedNiches.length > 0 ||
    filters.priceRange[0] !== 1 ||
    filters.priceRange[1] !== 100000 ||
    filters.selectedLanguages.length > 0 ||
    filters.selectedRatings.length > 0 ||
    filters.selectedDurations.length > 0;

  const resetFilters = () => {
    setSelectedDomain(null);
    setFilters({
      selectedDomain: null,
      selectedNiches: [],
      priceRange: [1, 100000],
      selectedLanguages: [],
      selectedRatings: [],
      selectedDurations: [],
    });
    setSorting("highest-rated"); // Reset to highest-rated sort instead of empty
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handle Escape key to close sidebar
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isSidebarOpen]);

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
          hasActiveFilters={hasActiveFilters}
          isSidebarOpen={isSidebarOpen}
        />
      </div>

      {/* Main Content */}
      <div className="flex pt-28">
        {" "}
        {/* Reduced padding-top for mobile */}
        {/* Sidebar - Now controlled by button click */}
        <div
          className={`fixed left-0 top-28 md:top-32 h-[calc(100vh-7rem)] md:h-[calc(100vh-8rem)] w-80 md:w-80 overflow-y-auto border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out z-40 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <FilterSidebar
            selectedDomain={selectedDomain}
            onApplyFilters={handleApplyFilters}
            onCloseSidebar={() => setIsSidebarOpen(false)}
          />
        </div>
        {/* Overlay for sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
        {/* Content Area - Always full width now */}
        <div className="w-full p-4 md:p-6">
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