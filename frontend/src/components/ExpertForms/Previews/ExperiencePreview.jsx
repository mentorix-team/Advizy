import { format } from 'date-fns';

function ExperiencePreview({ experience, onRemove }) {
  const formatDate = (date) => {
    return format(new Date(date), 'MM-yyyy');
  };

  return (
    <div className="relative w-96 border border-gray-300 rounded-md shadow-md p-4 bg-gray-50">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className=" text-2xl font-bold text-black">{experience.jobTitle}</h4>
          <p className="text-base my-3 text-gray-900">{experience.companyName}</p>
          <p className="text-lg text-gray-800 font-medium">
            {formatDate(experience.startDate)} - {experience.endDate ? formatDate(experience.endDate) : 'Present'}
          </p>
        </div>
        <button
          type="button"
          className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-red-500 hover:bg-red-100 rounded-full transition-colors"
          aria-label="Remove"
          onClick={onRemove}
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
    </div>
  );
}

export default ExperiencePreview;
