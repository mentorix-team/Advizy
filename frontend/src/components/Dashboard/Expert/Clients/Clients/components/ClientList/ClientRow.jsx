import { useNavigate } from 'react-router-dom';

export function ClientRow({ client }) {
  const navigate = useNavigate();

  return (
    <tr className="border-b border-gray-100">
      <td className="py-4 pl-6">
        {client.number}. {client.name}
      </td>
      <td className="py-4 hidden sm:table-cell">{client.service}</td>
      <td className="py-4 hidden md:table-cell">{client.sessions}</td>
      <td className="py-4 pr-6">
        <button 
          onClick={() => navigate(`/dashboard/expert/clients/${client.id}`)}
          className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap"
        >
          View Details
        </button>
      </td>
    </tr>
  );
}