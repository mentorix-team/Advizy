function AchievementPreview({ achievement, onRemove }) {
    return (
      <div className="flex justify-between items-center border border-gray-300 rounded-lg p-4 mb-4 shadow-md bg-white">
        <div>
          {/* Title */}
          <h4 className="text-lg font-bold text-gray-800 mb-2">{achievement.title}</h4>
          {/* Description */}
          <p className="text-sm text-gray-600 mb-1">{achievement.description}</p>
          {/* Year */}
          <p className="text-sm font-medium text-gray-800">{achievement.year}</p>
          {/* File Status */}
          <p className="text-sm text-green-600 mt-1">Certificate uploaded</p>
        </div>
        {/* Remove Button */}
        <button
          type="button"
          className="flex items-center justify-center w-8 h-8 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-all"
          onClick={onRemove}
          aria-label="Remove Achievement"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  }
  
  export default AchievementPreview;
  