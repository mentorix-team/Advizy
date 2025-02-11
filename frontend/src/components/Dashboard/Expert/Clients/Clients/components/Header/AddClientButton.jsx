import { PlusIcon } from '@heroicons/react/24/outline';

export function AddClientButton() {
  return (
    <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700">
      <PlusIcon className="w-5 h-5" />
      Add New Client
    </button>
  );
}