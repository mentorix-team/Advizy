import React, { useState } from "react";
import { Range } from "react-range";
import { nicheOptions, languageOptions } from "../../utils/Options";
import '../../index.css'

const FilterSidebar = ({ selectedDomain, onApplyFilters }) => {
  const [selectedNiches, setSelectedNiches] = useState([]);
  const [priceRange, setPriceRange] = useState([200, 100000]); // Initial state within valid range
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

  return (
    <div className="max-w-80 w-80 p-4 border shadow-md">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>
      <div className="mb-4">
        <label className="font-medium">Domain</label>
        <div className="p-1">
          <p>{selectedDomain?.label || "All"}</p>
        </div>
      </div>

      {/* Expertise (Niches) */}
      <div className="mb-4 max-w-80 w-80">
        <label className="font-medium">Expertise (Niches)</label>
        <div className="flex flex-col gap-2 mt-2">
          {filteredNiches.map((niche) => (
            <label key={niche.value} className="flex items-center gap-2">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 custom-checkbox"
                checked={selectedNiches.includes(niche.value)}
                onChange={() =>
                  handleCheckboxChange(setSelectedNiches, niche.value)
                }
              />
              {niche.label}
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-4 max-w-80 w-80">
        <label className="font-medium">Price Range</label>
        <div className="w-52 mt-4 flex flex-col gap-4 p-2">
          {/* Inputs for min and max prices */}
          <div className="flex justify-between items-center gap-1 text-sm">
            <span>Rs.</span>
            <input
              type="number"
              className="border rounded px-2 py-1 w-20"
              value={priceRange[0]}
              onChange={(e) => handlePriceChange(0, e.target.value)}
              min="200"
              max="100000"
            />
            <span className="text-gray-500">to</span>
            <span>Rs.</span>
            <input
              type="number"
              className="border rounded px-2 py-1 w-20"
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(1, e.target.value)}
              min="200"
              max="100000"
            />
          </div>

          {/* Slider */}
          <Range
            step={1}
            min={200}
            max={100000}
            values={priceRange}
            onChange={(values) => setPriceRange(values)}
            renderTrack={({ props, children }) => (
              <div
                {...props}
                style={{
                  height: "6px",
                  width: "100%",
                  background: "lightgray",
                  position: "relative",
                  borderRadius: "3px",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    height: "6px",
                    background: "#16A348",
                    left: `${((priceRange[0] - 200) / (100000 - 200)) * 100}%`,
                    right: `${
                      100 - ((priceRange[1] - 200) / (100000 - 200)) * 100
                    }%`,
                    borderRadius: "3px",
                  }}
                />
                {children}
              </div>
            )}
            renderThumb={({ props, isDragged }) => (
              <div
                {...props}
                className={{
                  height: "50px",
                  width: "50px",
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                  border: "2px solid #008080",
                  boxShadow: isDragged
                    ? "0 2px 6px rgba(0, 0, 0, 0.3)"
                    : "0 1px 3px rgba(0, 0, 0, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <div
                  style={{
                    height: "20px",
                    width: "20px",
                    borderRadius: "50%",
                    backgroundColor: isDragged ? "#388544" : "#16A348",
                  }}
                />
              </div>
            )}
          />
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
      </div>

      {/* Ratings */}
      <div className="mb-4">
        <label className="font-medium">Ratings</label>
        <div className="flex flex-col gap-2 mt-2">
          {ratings.map((rate) => (
            <label key={rate} className="flex items-center gap-2">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 custom-checkbox"
                checked={selectedRatings.includes(rate)}
                onChange={() => handleCheckboxChange(setSelectedRatings, rate)}
              />
              {rate} ★ & Above
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
                className="form-checkbox h-4 w-4 custom-checkbox"
                checked={selectedDurations.includes(dur)}
                onChange={() => handleCheckboxChange(setSelectedDurations, dur)}
              />
              {dur}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
