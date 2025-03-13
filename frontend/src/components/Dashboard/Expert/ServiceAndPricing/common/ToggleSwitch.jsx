import PropTypes from 'prop-types';

export default function ToggleSwitch({ isEnabled, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        isEnabled ? 'bg-green-600' : 'bg-gray-200'
      }`}
      aria-pressed={isEnabled}
      aria-label="Toggle service status"
    >
      <span className="sr-only">Toggle service status</span>
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          isEnabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

ToggleSwitch.propTypes = {
  isEnabled: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};