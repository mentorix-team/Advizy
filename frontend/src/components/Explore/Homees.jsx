import React, { useState, useEffect } from "react";
import FilterSidebar from "./FilterSidebar";
import ExpertList from "./ExpertList";
import DomainBar from "./DomainBar";
import Navbar from "../Home/components/Navbar";

const Homees = () => {
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [filters, setFilters] = useState({});
  const [sorting, setSorting] = useState("");

  // Log whenever filters or domain change dynamically
  useEffect(() => {
    console.log("Updated Filters:", filters);
  }, [filters, selectedDomain]);
  

  useEffect(() => {
    console.log("Selected Domain:", selectedDomain);
  }, [selectedDomain]);

  const handleApplyFilters = (newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
      selectedDomain, // Ensure selected domain is always included
    }));
  };
  

  return (
    <div className="min-h-screen bg-gray-50">


      {/* Fixed Domain Bar */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-white shadow-sm">
        <Navbar />
        <DomainBar onDomainSelect={(domain) => setSelectedDomain(domain)} />
      </div>

      {/* Main Content */}
      <div className="flex pt-16">
        {/* Sidebar */}
        <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 overflow-y-auto border-r border-gray-200 bg-white">
          <FilterSidebar
            selectedDomain={selectedDomain}
            onApplyFilters={handleApplyFilters}
          />
        </div>

        {/* Content Area */}
        <div className="ml-64 flex-1 p-6">
          <ExpertList filters={filters} sorting={sorting} />
        </div>
      </div>
    </div>
  );
};

export default Homees;
