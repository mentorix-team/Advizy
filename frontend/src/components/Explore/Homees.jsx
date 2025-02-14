// import React, { useState, useEffect } from "react";
// import FilterSidebar from "./FilterSidebar";
// import ExpertList from "./ExpertList";
// import DomainBar from "./DomainBar";
// import Navbar from "../Home/components/Navbar";

// const Homees = () => {
//   const [selectedDomain, setSelectedDomain] = useState(null);
//   const [filters, setFilters] = useState({});
//   const [sorting, setSorting] = useState("");

//   // Log whenever filters or domain change dynamically
//   useEffect(() => {
//     console.log("Updated Filters:", filters);
//   }, [filters, selectedDomain]);
  

//   useEffect(() => {
//     console.log("Selected Domain:", selectedDomain);
//   }, [selectedDomain]);

//   const handleApplyFilters = (newFilters) => {
//     setFilters((prevFilters) => ({
//       ...prevFilters,
//       ...newFilters,
//       selectedDomain, // Ensure selected domain is always included
//     }));
//   };
  

//   return (
//     <div className="min-h-screen bg-gray-50">


//       {/* Fixed Domain Bar */}
//       <div className="fixed top-0 left-0 right-0 z-10 bg-white shadow-sm">
//         <Navbar />
//         <DomainBar onDomainSelect={(domain) => setSelectedDomain(domain)} />
//       </div>

//       {/* Main Content */}
//       <div className="flex pt-16">
//         {/* Sidebar */}
//         <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 overflow-y-auto border-r border-gray-200 bg-white">
//           <FilterSidebar
//             selectedDomain={selectedDomain}
//             onApplyFilters={handleApplyFilters}
//           />
//         </div>

//         {/* Content Area */}
//         <div className="ml-64 flex-1 p-6">
//           <ExpertList filters={filters} sorting={sorting} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Homees;

import React, { useState, useEffect } from "react";
import FilterSidebar from "./FilterSidebar";
import ExpertList from "./ExpertList";
import DomainBar from "./DomainBar";
import Navbar from "../Home/components/Navbar";


// const Homees = () => {
//   const [selectedDomain, setSelectedDomain] = useState(null);
//   const [filters, setFilters] = useState({
//     selectedDomain: null, // Initialize selectedDomain in filters
//     selectedNiches: [],
//     priceRange: [200, 100000],
//     selectedLanguages: [],
//     selectedRatings: [],
//     selectedDurations: [],
//   });
//   const [sorting, setSorting] = useState("");

//   // Log whenever filters or domain change dynamically
//   useEffect(() => {
//     console.log("Updated Filters:", filters);
//   }, [filters]);

//   useEffect(() => {
//     console.log("Selected Domain:", selectedDomain);
//   }, [selectedDomain]);

//   // Update filters whenever selectedDomain changes
//   useEffect(() => {
//     setFilters((prevFilters) => ({
//       ...prevFilters,
//       selectedDomain, // Ensure selectedDomain is always included in filters
//     }));
//   }, [selectedDomain]);

//   const handleApplyFilters = (newFilters) => {
//     setFilters((prevFilters) => ({
//       ...prevFilters,
//       ...newFilters,
//     }));
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Fixed Domain Bar */}
//       <div className="fixed top-0 left-0 right-0 z-10 bg-white shadow-sm">
//         <Navbar />
//         <DomainBar onDomainSelect={(domain) => setSelectedDomain(domain)} />
//       </div>

//       {/* Main Content */}
//       <div className="flex pt-16">
//         {/* Sidebar */}
//         <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 overflow-y-auto border-r border-gray-200 bg-white">
//           <FilterSidebar
//             selectedDomain={selectedDomain}
//             onApplyFilters={handleApplyFilters}
//           />
//         </div>

//         {/* Content Area */}
//         <div className="ml-64 flex-1 p-6">
//           <ExpertList filters={filters} sorting={sorting} />
//         </div>
//       </div>
//     </div>
//   );
// };

const Homees = () => {
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [filters, setFilters] = useState({
    selectedDomain: null,
    selectedNiches: [],
    priceRange: [200, 100000],
    selectedLanguages: [],
    selectedRatings: [],
    selectedDurations: [],
  });
  const [sorting, setSorting] = useState("");

  // Log whenever filters or domain change dynamically
  useEffect(() => {
    console.log("Updated Filters:", filters);
  }, [filters]);

  useEffect(() => {
    console.log("Selected Domain:", selectedDomain);
  }, [selectedDomain]);

  // Update filters whenever selectedDomain changes
  useEffect(() => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      selectedDomain,
    }));
  }, [selectedDomain]);

  const handleApplyFilters = (newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Domain Bar */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-white shadow-sm">
        <Navbar />
        <DomainBar
          onDomainSelect={(domain) => setSelectedDomain(domain)}
          resetFilters={resetFilters}
          sorting={sorting} // Pass sorting state
          setSorting={setSorting} // Pass setSorting function
        />
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