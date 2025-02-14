// import React, { useState } from "react";
// import { domainOptions } from "../../utils/Options";

// const DomainBar = ({ onDomainSelect, sorting, setSorting }) => {
//   const primaryDomains = domainOptions.slice(0, 5);
//   const remainingDomains = domainOptions.slice(5);

//   const [isDropdownVisible, setDropdownVisible] = useState(false);

//   const handleMoreClick = () => {
//     setDropdownVisible((prev) => !prev);
//   };

//   return (
//     <div className="bg-white p-2 flex border shadow-sm items-center gap-4 fixed top-[57px] w-full z-40">
//       {/* Primary Domain Buttons */}
//       {primaryDomains.map((domain) => (
//         <button
//           key={domain.value}
//           className="px-4 py-2 rounded-md border-gray-200 hover:bg-gray-100 transition text-sm font-medium whitespace-nowrap"
//           onClick={() => onDomainSelect(domain)}
//         >
//           {domain.label}
//         </button>
//       ))}

//       {/* More Dropdown */}
//       {remainingDomains.length > 0 && (
//         <div className="relative">
//           <button
//             onClick={handleMoreClick}
//             className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-100 transition text-sm font-medium whitespace-nowrap flex items-center gap-1"
//           >
//             More
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className={`h-4 w-4 transition-transform duration-300 ${
//                 isDropdownVisible ? "rotate-180" : ""
//               }`}
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               strokeWidth={2}
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M19 9l-7 7-7-7"
//               />
//             </svg>
//           </button>

//           {/* Dropdown Content */}
//           <div
//             className={`absolute bg-white shadow-lg border rounded-md w-56 mt-1 z-50 transition-all duration-300 ease-in-out ${
//               isDropdownVisible ? "opacity-100 visible" : "opacity-0 invisible"
//             }`}
//           >
//             {remainingDomains.map((domain) => (
//               <button
//                 key={domain.value}
//                 className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-100 transition"
//                 onClick={() => onDomainSelect(domain)}
//               >
//                 {domain.label}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Sorting Dropdown */}
//       <select
//         value={sorting}
//         onChange={(e) => setSorting(e.target.value)}
//         className="ml-auto px-4 py-2 border border-gray-300 rounded-md text-sm"
//       >
//         <option value="">Sort By</option>
//         <option value="price-low-high">Price: Low to High</option>
//         <option value="price-high-low">Price: High to Low</option>
//         <option value="highest-rated">Highest Rated</option>
//       </select>
//     </div>
//   );
// };

// export default DomainBar;

import React, { useState } from "react";
import { domainOptions } from "../../utils/Options";

const DomainBar = ({ onDomainSelect, resetFilters }) => {
  const primaryDomains = domainOptions.slice(0, 5);
  const remainingDomains = domainOptions.slice(5);

  const [isDropdownVisible, setDropdownVisible] = useState(false);
  
  const handleMoreClick = () => {
    setDropdownVisible((prev) => !prev);
  };

  return (
    <div className="bg-white p-2 flex border shadow-sm items-center gap-4 fixed top-[57px] w-full z-40">
      {/* Primary Domain Buttons */}
      {primaryDomains.map((domain) => (
        <button
          key={domain.value}
          className="px-4 py-2 rounded-md border-gray-200 hover:bg-gray-100 transition text-sm font-medium whitespace-nowrap"
          onClick={() => onDomainSelect(domain)}
        >
          {domain.label}
        </button>
      ))}

      {/* More Dropdown */}
      {remainingDomains.length > 0 && (
        <div className="relative">
          <button
            onClick={handleMoreClick}
            className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-100 transition text-sm font-medium whitespace-nowrap flex items-center gap-1"
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

          {/* Dropdown Content */}
          <div
            className={`absolute bg-white shadow-lg border rounded-md w-56 mt-1 z-50 transition-all duration-300 ease-in-out ${
              isDropdownVisible ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
          >
            {remainingDomains.map((domain) => (
              <button
              key={domain.value}
                className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-100 transition"
                onClick={() => onDomainSelect(domain)}
              >
                {domain.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reset Filter Button */}
      <button
        onClick={resetFilters}
        className="px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-100 transition text-sm font-medium whitespace-nowrap"
        >
        Reset Filter
      </button>

      {/* Sorting Dropdown */}
      <select
        value={sorting}
        onChange={(e) => setSorting(e.target.value)}
        className="ml-auto px-4 py-2 border border-gray-300 rounded-md text-sm"
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