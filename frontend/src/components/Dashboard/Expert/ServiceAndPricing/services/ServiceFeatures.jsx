import { useState } from 'react';
import PropTypes from 'prop-types';
import { CheckIcon } from '../icons';

export default function ServiceFeatures({ features, showMore }) {
  const [showAll, setShowAll] = useState(false);
  const displayedFeatures = showAll || !showMore ? features : features.slice(0, 2);

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-900 mb-3">Features:</h4>
      <ul className="space-y-2">
        {displayedFeatures.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-gray-600">
            <CheckIcon />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      {showMore && features.length > 2 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-green-600 hover:text-green-700 mt-3"
        >
          {showAll ? 'Show less' : `+${features.length - 2} more`}
        </button>
      )}
    </div>
  );
}

ServiceFeatures.propTypes = {
  features: PropTypes.arrayOf(PropTypes.string).isRequired,
  showMore: PropTypes.bool,
};