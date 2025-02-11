import { useState } from 'react'

function ToggleSwitch({ isEnabled, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
        isEnabled ? 'bg-green-600' : 'bg-gray-200'
      }`}
    >
      <span className="sr-only">Toggle service status</span>
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
          isEnabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

export default ToggleSwitch