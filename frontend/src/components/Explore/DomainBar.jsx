import React, { useState, useEffect, useRef } from "react";
import { domainOptions } from "../../utils/Options";
import { Menu } from "lucide-react";

const DomainBar = ({
  onDomainSelect,
  resetFilters,
  sorting,
  setSorting,
  toggleSidebar,
  selectedDomain,
}) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [visibleDomains, setVisibleDomains] = useState(domainOptions.slice(0, 5));
  const [remainingDomains, setRemainingDomains] = useState(domainOptions.slice(5));

  const containerRef = useRef(null);
  const moreButtonRef = useRef(null);
  const sortDropdownRef = useRef(null);
  const domainButtonRefs = useRef([]);

  const updateVisibleDomains = () => {
    if (!containerRef.current || !moreButtonRef.current || !sortDropdownRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const moreButtonWidth = moreButtonRef.current.offsetWidth;
    const sortSelectWidth = sortDropdownRef.current.offsetWidth;
    const mobileFilterButtonWidth = 48; // mobile filter button (hamburger)
    const gapWidth = 16;

    const availableWidth =
      containerWidth -
      moreButtonWidth -
      sortSelectWidth -
      mobileFilterButtonWidth -
      gapWidth * 4;

    let currentWidth = 0;
    const newVisibleDomains = [];
    const newRemainingDomains = [];

    domainOptions.forEach((domain, index) => {
      const buttonWidth = domainButtonRefs.current[index]?.offsetWidth || 100;
      if (currentWidth + buttonWidth <= availableWidth) {
        newVisibleDomains.push(domain);
        currentWidth += buttonWidth + gapWidth;
      } else {
        newRemainingDomains.push(domain);
      }
    });

    setVisibleDomains(newVisibleDomains);
    setRemainingDomains(newRemainingDomains);
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => requestAnimationFrame(updateVisibleDomains));
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMoreClick = () => setDropdownVisible((prev) => !prev);
  const isDomainSelected = (domainValue) => selectedDomain?.value === domainValue;

  return (
    <div
      ref={containerRef}
      className="mt-2 bg-white p-2 flex flex-nowrap border shadow-sm items-center gap-2 md:gap-4 fixed top-[57px] w-full h-[62px] z-40"
    >
      {/* Mobile Filter Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden p-2 rounded-md hover:bg-gray-100 flex-shrink-0"
        style={{ width: "48px" }}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Domain Buttons */}
      {visibleDomains.map((domain, index) => (
        <button
          key={domain.value}
          ref={(el) => (domainButtonRefs.current[index] = el)}
          className={`px-3 py-1 md:px-4 md:py-2 rounded-md border transition text-xs md:text-sm font-medium whitespace-nowrap flex-shrink-0 ${
            isDomainSelected(domain.value)
              ? "bg-primary text-white border-primary"
              : "border-gray-200 hover:bg-gray-100"
          }`}
          onClick={() => onDomainSelect(domain)}
        >
          {domain.label}
        </button>
      ))}

      {/* More Dropdown */}
      <div ref={moreButtonRef} className="flex-shrink-0 relative">
        <button
          onClick={handleMoreClick}
          className={`px-3 py-1 md:px-4 md:py-2 rounded-md border transition text-xs md:text-sm font-medium whitespace-nowrap flex items-center gap-1 ${
            selectedDomain && remainingDomains.some((d) => d.value === selectedDomain.value)
              ? "bg-primary text-white border-primary"
              : "border-gray-200 hover:bg-gray-100"
          }`}
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isDropdownVisible && (
          <div className="absolute bg-white shadow-lg border rounded-md w-48 md:w-56 mt-1 z-50 max-h-60 overflow-y-auto">
            {remainingDomains.map((domain) => (
              <button
                key={domain.value}
                className={`w-full text-left px-4 py-2 text-xs md:text-sm font-medium transition ${
                  isDomainSelected(domain.value) ? "bg-primary text-white" : "hover:bg-gray-100"
                }`}
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

      {/* Sorting Dropdown (measured dynamically) */}
      <select
        ref={sortDropdownRef}
        value={sorting}
        onChange={(e) => setSorting(e.target.value)}
        className="ml-auto px-2 py-1 md:px-4 md:py-2 border border-gray-300 rounded-md text-xs md:text-sm flex-shrink-0"
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