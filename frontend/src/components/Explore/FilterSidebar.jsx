import React, { useState, useRef, useEffect } from "react";
import { Range } from "react-range";
import {
  domainOptions,
  nicheOptions,
  languageOptions,
} from "../../utils/Options";
import { X } from "lucide-react";
import "../../index.css";

const FilterSidebar = ({ selectedDomain, onApplyFilters }) => {
  const INITIAL_FILTERS = {
    selectedNiches: [],
    priceRange: [1, 100000],
    selectedLanguages: [],
    selectedRatings: [],
    selectedDurations: [],
    sorting: "",
  };

  const [selectedNiches, setSelectedNiches] = useState([]);
  const [priceRange, setPriceRange] = useState([1, 100000]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedDurations, setSelectedDurations] = useState([]);
  const [sorting, setSorting] = useState("");
  const [showAllNiches, setShowAllNiches] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const languageDropdownRef = useRef(null);
  const durations = ["15 mins", "30 mins", "45 mins", "90 mins", "1 hour"];
  const ratings = [5, 4, 3, 2, 1];
  const filteredNiches = selectedDomain
    ? nicheOptions[selectedDomain.value] || []
    : Object.values(nicheOptions).flat();
  const visibleNiches = showAllNiches
    ? filteredNiches
    : filteredNiches.slice(0, 3);

  // Check if filters have been changed from initial state
  useEffect(() => {
    const checkForChanges = () => {
      const isChanged = 
        !arraysEqual(selectedNiches, INITIAL_FILTERS.selectedNiches) ||
        !arraysEqual(priceRange, INITIAL_FILTERS.priceRange) ||
        !arraysEqual(selectedLanguages, INITIAL_FILTERS.selectedLanguages) ||
        !arraysEqual(selectedRatings, INITIAL_FILTERS.selectedRatings) ||
        !arraysEqual(selectedDurations, INITIAL_FILTERS.selectedDurations) ||
        sorting !== INITIAL_FILTERS.sorting;
      
      setHasUnsavedChanges(isChanged);
    };

    checkForChanges();
  }, [selectedNiches, priceRange, selectedLanguages, selectedRatings, selectedDurations, sorting]);

  // Helper function to compare arrays
  const arraysEqual = (a, b) => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    // Sort both arrays to compare regardless of order
    const aSorted = [...a].sort();
    const bSorted = [...b].sort();
    
    for (let i = 0; i < aSorted.length; ++i) {
      if (aSorted[i] !== bSorted[i]) return false;
    }
    return true;
  };

  const resetFilters = () => {
    setSelectedNiches(INITIAL_FILTERS.selectedNiches);
    setPriceRange(INITIAL_FILTERS.priceRange);
    setSelectedLanguages(INITIAL_FILTERS.selectedLanguages);
    setSelectedRatings(INITIAL_FILTERS.selectedRatings);
    setSelectedDurations(INITIAL_FILTERS.selectedDurations);
    setSorting(INITIAL_FILTERS.sorting);
    
    onApplyFilters({
      selectedDomain,
      ...INITIAL_FILTERS,
    });
  };

  const handleCheckboxChange = (setFunction, value) => {
    setFunction((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
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
    const numericValue = Math.max(1, Math.min(Number(value), 100000));
    const newRange = [...priceRange];
    newRange[index] = numericValue;
    
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
    <div className="max-w-80 w-[300px] border shadow-md p-5 relative">
      {/* Sticky header with buttons */}
      <div className="sticky pt-2 top-0 bg-white z-10 border-b">
        <div className="flex gap-2 mb-4">
          <button
            onClick={handleApplyFilters}
            className={`flex-1 px-4 py-2 rounded-md transition text-sm font-medium ${
              hasUnsavedChanges
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-green-400 text-white hover:bg-green-500'
            }`}
          >
            Apply Filters
          </button>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-md border border-gray-1 hover:bg-gray-100 transition text-sm font-medium"
          >
            Reset
          </button>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Filters</h2>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden text-gray-500"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      {/* Domain */}
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
          <div className="flex items-center text-sm">
            <span className="mr-1">Rs.</span>
            <input
              type="number"
              className="border rounded px-2 py-1 w-24 text-sm"
              value={priceRange[0]}
              onChange={(e) => handlePriceChange(0, e.target.value)}
              min="1"
              max="100000"
            />
            <span className="mx-2 text-gray-500">to</span>
            <span className="mr-1">Rs.</span>
            <input
              type="number"
              className="border rounded px-2 py-1 w-24 text-sm"
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(1, e.target.value)}
              min="1"
              max="100000"
            />
          </div>
          
          <div className="py-2">
            <Range
              step={100}
              min={1}
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
                        ((priceRange[0] - 1) / (100000 - 1)) * 100
                      }%`,
                      width: `${
                        ((priceRange[1] - priceRange[0]) / (100000 - 1)) * 100
                      }%`,
                    }}
                  />
                  {children}
                </div>
              )}
              renderThumb={({ props, index }) => {
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
      
      {/* Languages */}
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
    </div>
  );
};

export default FilterSidebar;