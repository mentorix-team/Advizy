import { FunnelIcon } from '@heroicons/react/24/outline';

export function FilterButton() {
  return (
    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
      <FunnelIcon className="w-5 h-5 text-gray-400" />
      Filter
    </button>
  );
}