import React, { useState } from "react";
import Availability from "./components/Dashboard/Expert/ExpertAvailability/Availability";
import ExpertDetailPage from "./components/Expert/ExpertDetailProfile/ExpertDetailPage";
import { CopyIcon, ExpertIcon, ShareIcon } from "./icons/Icons";
import Navbar from "./utils/Navbar/Navbar";
import DomainBar from "./components/Filter_Sort/DomainBar";
import FilterSidebar from "./components/Filter_Sort/FilterSidebar";
import ExpertList from "./components/Expert/ExpertList";
import Meetings from "./components/Dashboard/Expert/Meetings/Meetings";

const Home = () => {
  const [selectedDomain, setSelectedDomain] = useState(null);

  const handleApplyFilters = (filters) => {
    // console.log("Applied Filters:", filters);
  };

  return (
    // <div>
    //   {/* Navbar */}
    //   <nav className="bg-[#16A348] text-white p-4 fixed top-0 w-full z-50">
    //     Navbar
    //   </nav>
    //   {/* <Availability /> */}
    //   {/* <ExpertDetailPage /> */}
    //   {/* <Navbar /> */}

    //   {/* Domain Bar */}
    //   <DomainBar onDomainSelect={(domain) => setSelectedDomain(domain)} />

    //   {/* Main Content Adjust padding for Navbar + DomainBar*/}
    //   <div className="flex pt-[110px] space-x-4">
    //     <FilterSidebar
    //       selectedDomain={selectedDomain}
    //       onApplyFilters={handleApplyFilters}
    //     />

    //     {/* Content Area */}
    //     <div className="flex-1">
    //       <ExpertList />
    //     </div>
    //   </div>
    // </div>
    <Navbar />
  );
};

export default Home;
