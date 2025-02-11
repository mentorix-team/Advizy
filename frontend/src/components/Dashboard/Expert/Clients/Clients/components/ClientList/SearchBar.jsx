import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export function SearchBar({ searchQuery, onSearchChange }) {
  return (
    <div className="relative w-full sm:w-[300px]">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search clients..."
        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
      <MagnifyingGlassIcon className="w-5 h-5 text-green-600 absolute left-3 top-2.5" />
    </div>
  );
}