import { useState } from 'react'
import CheckIcon from './icons/CheckIcon'

export function ServiceFeatures({ features = [] }) {
  const [showAllFeatures, setShowAllFeatures] = useState(false)

  if (!features.length) return null

  const visibleFeatures = showAllFeatures ? features : features.slice(0, 2)
  const toggleFeatures = () => setShowAllFeatures(!showAllFeatures)

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-900 mb-2">Features:</h4>
      <ul className="space-y-2">
        {visibleFeatures.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
            <CheckIcon />
            {feature}
          </li>
        ))}
      </ul>
      {features.length > 2 && (
        <button 
          onClick={toggleFeatures}
          className="text-sm text-gray-600 hover:text-gray-900 mt-2"
        >
          {showAllFeatures ? 'Show less' : `+${features.length - 2} more`}
        </button>
      )}
    </div>
  )
}