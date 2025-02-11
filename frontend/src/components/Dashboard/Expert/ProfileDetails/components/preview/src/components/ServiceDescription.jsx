import React, { useState } from 'react';

const ServiceDescription = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 100; // Approximately 2 lines of text

  if (description.length <= maxLength) {
    return <p className="text-gray-600 text-sm mb-4">{description}</p>;
  }

  return (
    <p className="text-gray-600 text-sm mb-4">
      {isExpanded ? description : `${description.slice(0, maxLength)}...`}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-blue-600 hover:text-blue-700 ml-1"
      >
        {isExpanded ? 'see less' : 'see more'}
      </button>
    </p>
  );
};

export default ServiceDescription;