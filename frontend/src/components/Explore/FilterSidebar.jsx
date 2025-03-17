import React, { useState, useRef, useEffect } from "react";
import { Range } from "react-range";
import { nicheOptions, languageOptions } from "../../utils/Options";
import { X } from "lucide-react";
import "../../index.css";

const FilterSidebar = ({ selectedDomain, onApplyFilters }) => {
  const [selectedNiches, setSelectedNiches] = useState([]);
  const [priceRange, setPriceRange] = useState([200, 100000]); // Initial state within valid range
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedDurations, setSelectedDurations] = useState([]);
  const [sorting, setSorting] = useState("");
  const [showAllNiches, setShowAllNiches] = useState(false); // State to control visibility of all niches
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const languageDropdownRef = useRef(null);

  const durations = ["15 mins", "30 mins", "45 mins", "90 mins", "1 hour"];
  const ratings = [5, 4, 3, 2, 1];

  const filteredNiches = selectedDomain
    ? nicheOptions[selectedDomain.value] || []
    : Object.values(nicheOptions).flat();

  // Slice the niches to show only 3 by default
  const visibleNiches = showAllNiches
    ? filteredNiches
    : filteredNiches.slice(0, 3);

  const handleCheckboxChange = (setFunction, value) => {
    setFunction((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
    console.log(selectedRatings);
  };

  const handleApplyFilters = () => {
    const filters = {
      selectedDomain,
      selectedNiches,
      priceRange,
      selectedLanguages,
      selectedRatings,
      selectedDurations,
      sorting,
    };
    onApplyFilters(filters);
  };

  const handlePriceChange = (index, value) => {
    const numericValue = Math.max(200, Math.min(Number(value), 100000)); // Clamp values to min and max
    const newRange = [...priceRange];
    newRange[index] = numericValue;

    // Ensure left value is not greater than the right and vice versa
    if (index === 0 && numericValue > priceRange[1]) {
      newRange[1] = numericValue;
    } else if (index === 1 && numericValue < priceRange[0]) {
      newRange[0] = numericValue;
    }

    setPriceRange(newRange);
  };

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target)
      ) {
        setIsLanguageDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full h-full p-6 border-r overflow-y-auto overflow-x-hidden">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Filters</h2>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden text-gray-500"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Domain - Left aligned text */}
      <div className="mb-6">
        <label className="font-medium text-base text-left block">Domain</label>
        <div className="mt-2">
          <p className="text-base text-left">
            {selectedDomain?.label || "All"}
          </p>
        </div>
      </div>

      {/* Expertise (Niches) */}
      <div className="mb-6">
        <label className="font-medium text-base text-left block">
          Expertise (Niches)
        </label>
        <div className="flex flex-col gap-3 mt-3">
          {visibleNiches.map((niche) => (
            <label key={niche.value} className="flex items-center gap-3">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 custom-checkbox"
                checked={selectedNiches.includes(niche.value)}
                onChange={() =>
                  handleCheckboxChange(setSelectedNiches, niche.value)
                }
              />
              <span className="text-base">{niche.label}</span>
            </label>
          ))}
          {filteredNiches.length > 3 && (
            <button
              onClick={() => setShowAllNiches(!showAllNiches)}
              className="text-primary hover:underline focus:outline-none"
            >
              {showAllNiches ? "Show Less" : "Show More"}
            </button>
          )}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="font-medium text-base text-left block">
          Price Range
        </label>
        <div className="w-full mt-3 flex flex-col gap-3">
          {/* Inputs for min and max prices */}
          <div className="flex items-center text-sm">
            <span className="mr-1">Rs.</span>

            <input
              type="number"
              className="border rounded px-2 py-1 w-24 text-sm"
              value={priceRange[0]}
              onChange={(e) => handlePriceChange(0, e.target.value)}
              min="200"
              max="100000"
            />
            <span className="mx-2 text-gray-500">to</span>
            <span className="mr-1">Rs.</span>
            <input
              type="number"
              className="border rounded px-2 py-1 w-24 text-sm"
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(1, e.target.value)}
              min="200"
              max="100000"
            />
          </div>

          {/* Range slider using react-range */}
          <div className="py-2">
            <Range
              step={100}
              min={200}
              max={100000}
              values={priceRange}
              onChange={(values) => setPriceRange(values)}
              renderTrack={({ props, children }) => (
                <div
                  {...props}
                  className="w-full h-1 bg-gray-200 rounded-full"
                  style={{
                    ...props.style,
                  }}
                >
                  <div
                    className="h-1 bg-primary rounded-full"
                    style={{
                      position: "absolute",
                      left: `${
                        ((priceRange[0] - 200) / (100000 - 200)) * 100
                      }%`,
                      width: `${
                        ((priceRange[1] - priceRange[0]) / (100000 - 200)) * 100
                      }%`,
                    }}
                  />
                  {children}
                </div>
              )}
              renderThumb={({ props, index }) => {
                // Extract the key from props to handle it separately
                const { key, ...restProps } = props;
                return (
                  <div
                    key={key}
                    {...restProps}
                    className="w-5 h-5 bg-primary rounded-full border-2 border-white shadow focus:outline-none"
                    style={{
                      ...restProps.style,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                    }}
                  />
                );
              }}
            />
          </div>
        </div>
      </div>

      {/* languages */}
      <div className="mb-4 relative" ref={languageDropdownRef}>
        <label className="font-medium">Languages</label>
        <button
          type="button"
          className="mt-2 w-full px-4 py-2 border rounded-md bg-white text-left shadow-sm flex items-center justify-between"
          onClick={toggleLanguageDropdown}
        >
          <span className="truncate">
            {selectedLanguages.length > 0
              ? selectedLanguages
                  .map(
                    (val) =>
                      languageOptions.find((opt) => opt.value === val)?.label
                  )
                  .join(", ")
              : "Select languages"}
          </span>
          <svg
            className={`h-5 w-5 transition-transform ${
              isLanguageDropdownOpen ? "rotate-180" : ""
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {isLanguageDropdownOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
            {languageOptions.map((lang) => (
              <label
                key={lang.value}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 custom-checkbox"
                  checked={selectedLanguages.includes(lang.value)}
                  onChange={() =>
                    handleCheckboxChange(setSelectedLanguages, lang.value)
                  }
                />
                {lang.label}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Ratings */}
      <div className="mb-6">
        <label className="font-medium text-base text-left block">Ratings</label>
        <div className="flex flex-col gap-3 mt-3">
          {ratings.map((rate) => (
            <label key={rate} className="flex items-center gap-3">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 custom-checkbox"
                checked={selectedRatings.includes(rate)}
                onChange={() => handleCheckboxChange(setSelectedRatings, rate)}
              />
              <span className="text-base">{rate} ★</span>
            </label>
          ))}
        </div>
      </div>

      {/* Time Duration */}
      <div className="mb-6">
        <label className="font-medium text-base text-left block">
          Time Duration
        </label>
        <div className="flex flex-col gap-3 mt-3">
          {durations.map((dur) => (
            <label key={dur} className="flex items-center gap-3">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 custom-checkbox"
                checked={selectedDurations.includes(dur)}
                onChange={() => handleCheckboxChange(setSelectedDurations, dur)}
              />
              <span className="text-base">{dur}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Apply Filters Button */}
      <button
        onClick={handleApplyFilters}
        className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary/90 transition text-base font-medium"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default FilterSidebar;