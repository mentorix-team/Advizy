import { SearchBar } from './SearchBar';
import { FilterDropdown } from './FilterDropdown';

export function ClientListHeader({ searchQuery, onSearchChange, onFilterChange }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
      <h2 className="text-xl font-semibold">Client List</h2>
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar searchQuery={searchQuery} onSearchChange={onSearchChange} />
        <FilterDropdown onFilterChange={onFilterChange} />
      </div>
    </div>
  );
}