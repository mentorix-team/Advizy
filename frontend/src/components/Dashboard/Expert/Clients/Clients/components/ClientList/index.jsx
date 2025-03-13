import { useState, useEffect } from 'react';
import { SearchBar } from './SearchBar';
import { FilterDropdown } from './FilterDropdown';
import { ClientTable } from './ClientTable';
import { Pagination } from '../Pagination/Pagination';

export function ClientList({ initialClients, onClientsChange }) {
  console.log("This is initialClients",initialClients)
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('active');
  const [clients, setClients] = useState(initialClients);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setClients(initialClients);
  }, [initialClients]);

  const filteredClients = clients.filter((client) => {
    // Ensure name and service exist before calling toLowerCase()
    if (!client?.name || !client?.service) return false; 
  
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.service.toLowerCase().includes(searchQuery.toLowerCase());
  
    const matchesTab =
      activeTab === 'active'
        ? client.status?.toLowerCase() === 'active' || client.status?.toLowerCase() === 'new'
        : client.status?.toLowerCase() === 'inactive';
  
    return matchesSearch && matchesTab;
  });
  

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClients = filteredClients.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b mb-6">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 sm:px-6 py-3 font-medium text-sm whitespace-nowrap ${
                activeTab === 'active'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Active Client
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-4 sm:px-6 py-3 font-medium text-sm whitespace-nowrap ${
                activeTab === 'past'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Past Client
            </button>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4 sm:mt-0 pb-3">
            <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            {/* <FilterDropdown /> */}
          </div>
        </div>

        <ClientTable 
          clients={paginatedClients.map((client, index) => ({
            ...client,
            number: startIndex + index + 1
          }))} 
        />
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}