import PropTypes from 'prop-types';
import ToggleSwitch from '../common/ToggleSwitch';

export default function ServiceActions({ isActive, onEdit, onDelete, onToggle, isDefaultService }) {
  if (isDefaultService) {
    return (
      <button 
        onClick={onEdit}
        className="text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Edit service"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <ToggleSwitch isEnabled={isActive} onToggle={onToggle} />
      <button 
        onClick={onEdit}
        className="text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Edit service"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </button>
      <button 
        onClick={onDelete}
        className="text-gray-400 hover:text-red-500 transition-colors"
        aria-label="Delete service"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      </button>
    </div>
  );
}

ServiceActions.propTypes = {
  isActive: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  isDefaultService: PropTypes.bool,
};