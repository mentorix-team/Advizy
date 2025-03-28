import React, { useState } from "react";
import { domainOptions } from "../../utils/Options";
import { Menu, X } from "lucide-react";

const DomainBar = ({
  onDomainSelect,
  resetFilters,
  sorting,
  setSorting,
  toggleSidebar,
}) => {
  const primaryDomains = domainOptions.slice(0, 5);
  const remainingDomains = domainOptions.slice(5);

  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const handleMoreClick = () => {
    setDropdownVisible((prev) => !prev);
  };
  

  return (
    <div className="bg-white p-2 flex flex-wrap border shadow-sm items-center gap-2 md:gap-4 fixed top-[57px] w-full h-[62px] z-40 overflow-x-auto">
      {/* Mobile Filter Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden p-2 rounded-md hover:bg-gray-100"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Primary Domain Buttons - Hidden on Mobile */}
      {primaryDomains.map((domain) => (
        <button
          key={domain.value}
          className="hidden md:block px-3 py-1 md:px-4 md:py-2 rounded-md border border-gray-200 hover:bg-gray-100 transition text-xs md:text-sm font-medium whitespace-nowrap"
          onClick={() => onDomainSelect(domain)}
        >
          {domain.label}
        </button>
      ))}

      {/* More Dropdown - Visible on both mobile and desktop*/}
      {/* {remainingDomains.length > 0 && ( */}
      <div className="relative">
        <button
          onClick={handleMoreClick}
          className="px-3 py-1 md:px-4 md:py-2 rounded-md border border-gray-200 hover:bg-gray-100 transition text-xs md:text-sm font-medium whitespace-nowrap flex items-center gap-1"
        >
          More
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 transition-transform duration-300 ${
              isDropdownVisible ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown Content - Fixed positioning to ensure it's not constrained */}
        {isDropdownVisible && (
          <div
            className="fixed bg-white shadow-lg border rounded-md w-48 md:w-56 mt-1 z-50 max-h-60 overflow-y-auto"
            style={{
              top: "auto",
              left: "auto",
              transform: "none",
            }}
          >
            {/* On mobile, show all domains */}
            <div className="md:hidden">
              {primaryDomains.map((domain) => (
                <button
                  key={domain.value}
                  className="w-full text-left px-4 py-2 text-xs md:text-sm font-medium hover:bg-gray-100 transition"
                  onClick={() => {
                    onDomainSelect(domain);
                    setDropdownVisible(false);
                  }}
                >
                  {domain.label}
                </button>
              ))}
              <div className="border-t border-gray-100 my-1"></div>
            </div>

            {/* Show remaining domains on both mobile and desktop */}
            {remainingDomains.map((domain) => (
              <button
                key={domain.value}
                className="w-full text-left px-4 py-2 text-xs md:text-sm font-medium hover:bg-gray-100 transition"
                onClick={() => {
                  onDomainSelect(domain);
                  setDropdownVisible(false);
                }}
              >
                {domain.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Reset Filter Button - Visible on both mobile and desktop */}
      <button
        onClick={resetFilters}
        className="px-3 py-1 md:px-4 md:py-2 rounded-md border border-gray-200 hover:bg-gray-100 transition text-xs md:text-sm font-medium whitespace-nowrap"
      >
        Reset Filter
      </button>

      {/* Sorting Dropdown - Visible on both mobile and desktop */}
      <select
        value={sorting}
        onChange={(e) => setSorting(e.target.value)}
        className="ml-auto px-2 py-1 md:px-4 md:py-2 border border-gray-300 rounded-md text-xs md:text-sm"
      >
        <option value="">Sort By</option>
        <option value="price-low-high">Price: Low to High</option>
        <option value="price-high-low">Price: High to Low</option>
        <option value="highest-rated">Highest Rated</option>
      </select>
    </div>
  );
};
export default DomainBar;
