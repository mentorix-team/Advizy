import { ArrowLeftIcon, UserIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

export function Header({ name, status }) {
  const navigate = useNavigate();
  return (
    <div className="mb-8">
      <button 
        className="inline-flex items-center text-green-600 mb-4 sm:mb-6 hover:text-green-700"
        onClick={() => navigate(`/dashboard/expert/clients/`)}
      >
        <ArrowLeftIcon className="w-4 h-4 mr-2" />
        Back to Clients
      </button>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
            <UserIcon className="w-4 h-4 text-green-600" />
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold">{name}</h1>
        </div>
        <span className="inline-flex px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
          {status}
        </span>
      </div>
    </div>
  );
}