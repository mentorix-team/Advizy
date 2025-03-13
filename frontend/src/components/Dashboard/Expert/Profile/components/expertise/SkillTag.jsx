import React from 'react';
import PropTypes from 'prop-types';

export default function SkillTag({ skill, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full">
      {skill}
      <button
        onClick={() => onRemove(skill)}
        className="ml-1 text-green-600 hover:text-green-800"
      >
        ×
      </button>
    </span>
  );
}

SkillTag.propTypes = {
  skill: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired
};