import React from 'react';
import { BiFile, BiVideo, BiBook } from 'react-icons/bi';
import PropTypes from 'prop-types';

const RESOURCE_ICONS = {
  'article': BiFile,
  'video': BiVideo,
  'ebook': BiBook
};

const ICON_COLORS = {
  'article': 'text-blue-500',
  'video': 'text-green-500',
  'ebook': 'text-purple-500'
};

export default function RecommendedResources({ 
  resources = [],
  onViewResource = () => {}
}) {
  const getIcon = (type) => {
    const IconComponent = RESOURCE_ICONS[type.toLowerCase()] || BiFile;
    return <IconComponent className={ICON_COLORS[type.toLowerCase()]} size={24} />;
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg sm:text-xl font-bold">Recommended Resources</h2>
        <button className="text-gray-400 hover:text-gray-600">→</button>
      </div>

      <div className="space-y-4">
        {resources.map((resource, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              {getIcon(resource.type)}
              <div className="min-w-0">
                <h3 className="font-medium truncate">{resource.title}</h3>
                <p className="text-sm text-gray-600">{resource.type}</p>
              </div>
            </div>
            <button 
              onClick={() => onViewResource(resource.url)}
              className="text-primary hover:text-secondary text-sm whitespace-nowrap ml-4"
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

RecommendedResources.propTypes = {
  resources: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['Article', 'Video', 'Ebook']).isRequired,
    url: PropTypes.string
  })),
  onViewResource: PropTypes.func
};