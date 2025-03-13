import PropTypes from 'prop-types';

const SearchBar = ({ placeholder, onChange }) => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        onChange={onChange}
        className="w-64 pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
      />
    </div>
  );
};

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  onChange: PropTypes.func
};

export default SearchBar;