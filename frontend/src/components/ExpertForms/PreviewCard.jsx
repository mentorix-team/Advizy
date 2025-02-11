function PreviewCard({ title, subtitle, skills }) {
  if (!title) return null;

  // Split skills by commas and remove extra spaces
  const skillsList = skills
    .split(',')
    .map(skill => skill.trim())
    .filter(skill => skill);

  return (
    <div className="border border-gray-300 rounded-md shadow-md p-4 bg-gray-50">
      {/* Header Section */}
      <div className="mb-4">
        <h4 className="text-lg font-semibold text-gray-700">{title}</h4>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>

      {/* Skills Section */}
      {skillsList.length > 0 && (
        <div>
          <strong className="block mb-2 text-gray-700">Expertise/Skills:</strong>
          <div className="flex flex-wrap gap-2">
            {skillsList.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PreviewCard;
