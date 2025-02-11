// EducationPreview Component
function EducationPreview({ education, onRemove }) {
  return (
    <div className="flex items-center justify-between bg-gray-100 border border-gray-300 rounded-md p-4 mb-2">
      <div className="flex flex-col">
        <h4 className="text-lg font-semibold text-gray-800">{education.degree}</h4>
        <p className="text-sm text-gray-600">{education.institution}, {education.passingYear}</p>
        <p className="text-sm text-green-500 font-medium">Certificate uploaded</p>
      </div>
      <button
        type="button"
        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-100 rounded-full transition-colors"
        onClick={onRemove}
      >
        ×
      </button>
    </div>
  );
}

export default EducationPreview;