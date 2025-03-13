import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-between items-center mt-6">
      <button 
        className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium disabled:opacity-50"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>
      
      <div className="flex gap-2">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            className={`w-8 h-8 rounded-lg text-sm ${
              currentPage === index + 1
                ? 'bg-black text-white'
                : 'bg-gray-50 text-gray-600'
            }`}
            onClick={() => onPageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
      
      <button 
        className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium disabled:opacity-50"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;