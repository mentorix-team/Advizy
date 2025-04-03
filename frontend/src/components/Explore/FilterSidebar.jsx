import React, { useState } from "react";
import { Range } from "react-range";
import { nicheOptions, languageOptions } from "../../utils/Options";
import '../../index.css'

const FilterSidebar = ({ selectedDomain, onApplyFilters }) => {
  const [selectedNiches, setSelectedNiches] = useState([]);
  const [priceRange, setPriceRange] = useState([200, 100000]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedDurations, setSelectedDurations] = useState([]);
  const [sorting, setSorting] = useState("");

  const durations = ["15 mins", "30 mins", "45 mins", "1 hour"];
  const ratings = [5, 4, 3, 2, 1];

  const filteredNiches = selectedDomain
    ? nicheOptions[selectedDomain.value] || []
    : Object.values(nicheOptions).flat();

  const handleCheckboxChange = (setFunction, value) => {
    setFunction((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const resetFilters = () => {
    // Reset all state values
    setSelectedNiches([]);
    setPriceRange([200, 100000]);
    setSelectedLanguages([]);
    setSelectedRatings([]);
    setSelectedDurations([]);
    setSorting("");

    // Immediately apply the reset filters
    onApplyFilters({
      selectedDomain,
      selectedNiches: [],
      priceRange: [200, 100000],
      selectedLanguages: [],
      selectedRatings: [],
      selectedDurations: [],
      sorting: "",
    });
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
    const numericValue = Math.max(200, Math.min(Number(value), 100000));
    const newRange = [...priceRange];
    newRange[index] = numericValue;

    if (index === 0 && numericValue > priceRange[1]) {
      newRange[1] = numericValue;
    } else if (index === 1 && numericValue < priceRange[0]) {
      newRange[0] = numericValue;
    }

    setPriceRange(newRange);
  };

  return (
    <div className="max-w-80 w-80 border shadow-md relative">
      {/* Sticky header with buttons */}
      <div className="sticky top-0 bg-white z-10 p-4 border-b">
        <div className="flex gap-2 mb-4">
          <button
            onClick={handleApplyFilters}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition text-sm font-medium"
          >
            Apply Filters
          </button>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-100 transition text-sm font-medium"
          >
            Reset
          </button>
        </div>
        <h2 className="text-xl font-semibold">Filters</h2>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <label className="font-medium">Domain</label>
          <div className="p-1">
            <p>{selectedDomain?.label || "All"}</p>
          </div>
        </div>

        {/* Expertise (Niches) */}
        <div className="mb-4">
          <label className="font-medium">Expertise (Niches)</label>
          <div className="flex flex-col gap-2 mt-2">
            {filteredNiches.map((niche) => (
              <label key={niche.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-green-600 rounded"
                  checked={selectedNiches.includes(niche.value)}
                  onChange={() =>
                    handleCheckboxChange(setSelectedNiches, niche.value)
                  }
                />
                <span className="text-sm">{niche.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-4">
          <label className="font-medium">Price Range</label>
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex justify-between items-center gap-2 text-sm">
              <div className="flex items-center">
                <span className="text-gray-500">Rs.</span>
                <input
                  type="number"
                  className="w-24 border rounded px-2 py-1 ml-1"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(0, e.target.value)}
                  min="200"
                  max="100000"
                />
              </div>
              <span className="text-gray-500">to</span>
              <div className="flex items-center">
                <span className="text-gray-500">Rs.</span>
                <input
                  type="number"
                  className="w-24 border rounded px-2 py-1 ml-1"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(1, e.target.value)}
                  min="200"
                  max="100000"
                />
              </div>
            </div>

            <div className="px-2">
              <Range
                step={100}
                min={200}
                max={100000}
                values={priceRange}
                onChange={setPriceRange}
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    className="h-1 w-full bg-gray-200 rounded-full"
                  >
                    <div
                      className="h-1 bg-green-600 rounded-full"
                      style={{
                        position: "absolute",
                        left: `${((priceRange[0] - 200) / (100000 - 200)) * 100}%`,
                        right: `${100 - ((priceRange[1] - 200) / (100000 - 200)) * 100}%`,
                      }}
                    />
                    {children}
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    className="h-4 w-4 rounded-full bg-white border-2 border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50"
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* Languages */}
        <div className="mb-4">
          <label className="font-medium">Languages</label>
          <div className="flex flex-col gap-2 mt-2">
            {languageOptions.map((lang) => (
              <label key={lang.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-green-600 rounded"
                  checked={selectedLanguages.includes(lang.value)}
                  onChange={() =>
                    handleCheckboxChange(setSelectedLanguages, lang.value)
                  }
                />
                <span className="text-sm">{lang.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Ratings */}
        <div className="mb-4">
          <label className="font-medium">Ratings</label>
          <div className="flex flex-col gap-2 mt-2">
            {ratings.map((rate) => (
              <label key={rate} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-green-600 rounded"
                  checked={selectedRatings.includes(rate)}
                  onChange={() => handleCheckboxChange(setSelectedRatings, rate)}
                />
                <span className="text-sm">{rate} ★ & Above</span>
              </label>
            ))}
          </div>
        </div>

        {/* Time Duration */}
        <div className="mb-4">
          <label className="font-medium">Time Duration</label>
          <div className="flex flex-col gap-2 mt-2">
            {durations.map((dur) => (
              <label key={dur} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-green-600 rounded"
                  checked={selectedDurations.includes(dur)}
                  onChange={() => handleCheckboxChange(setSelectedDurations, dur)}
                />
                <span className="text-sm">{dur}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;