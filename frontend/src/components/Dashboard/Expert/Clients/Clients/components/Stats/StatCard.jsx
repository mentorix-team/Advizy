import { UserIcon } from '@heroicons/react/24/outline';

export function StatCard({ title, value, subtext }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600">{title}</p>
          <h3 className="text-3xl font-bold mt-2">{value}</h3>
          <p className="text-sm text-gray-500 mt-1">{subtext}</p>
        </div>
        <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
          <UserIcon className="w-6 h-6 text-green-600" />
        </div>
      </div>
    </div>
  );
}