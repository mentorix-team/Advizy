import { ClientRow } from './ClientRow';
import { NoResults } from './NoResults';

export function ClientTable({ clients }) {
  if (clients.length === 0) {
    return <NoResults />;
  }

  return (
    <div className="overflow-x-auto -mx-6">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left pb-4 font-medium text-gray-500 pl-6">Client</th>
                <th className="text-left pb-4 font-medium text-gray-500 hidden sm:table-cell">Service</th>
                <th className="text-left pb-4 font-medium text-gray-500 hidden md:table-cell">Total Sessions</th>
                <th className="text-left pb-4 font-medium text-gray-500 pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clients.map((client) => (
                <ClientRow key={client.id} client={client} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}