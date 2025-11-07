import { useEffect, useState } from 'react';
import { BiCopy } from 'react-icons/bi';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import DatePicker from 'react-datepicker';
import clsx from 'clsx';
import toast, { Toaster } from 'react-hot-toast';
import PaymentHeader from './PaymentHeader';
import { useDispatch, useSelector } from 'react-redux';
import { getMeetingByExpertId } from '@/Redux/Slices/meetingSlice';

const ITEMS_PER_PAGE = 10;

export default function Payments() {
  const [activeTab, setActiveTab] = useState('transactions');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState([new Date(), null]);
  const [startDate, endDate] = dateRange;
  const { meetings, loading, error } = useSelector((state) => state.meeting);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMeetingByExpertId());
  }, [dispatch]);

  const paidMeetings = meetings.filter((meeting) => meeting.isPayed);

  const summary = {
    totalBalance: paidMeetings.reduce((sum, meeting) => sum + parseFloat(meeting.amount || 0), 0),
    withdrawable: paidMeetings.filter(meeting => meeting.isPayed).reduce((sum, meeting) => sum + (parseFloat(meeting.amount) || 0), 0),
    pending: 0, // Assuming no pending payments in your data
    lifetime: paidMeetings.reduce((sum, meeting) => sum + parseFloat(meeting.amount || 0), 0)
  };

  const filteredData = paidMeetings.filter((meeting) => {
    const meetingDate = new Date(meeting.daySpecific.date);

    // Date range filter
    const isInDateRange = startDate && endDate
      ? meetingDate >= startDate && meetingDate <= endDate
      : true;

    // Status filter (assuming all paid meetings are "paid")
    const matchesStatus = statusFilter === 'all' || meeting.isPayed;

    // Search filter (if applicable)
    const matchesSearch = searchTerm
      ? meeting.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    return isInDateRange && matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const currentItems = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setStatusFilter('all');
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handleCopyId = async (id) => {
    try {
      await navigator.clipboard.writeText(id);
      toast.success('ID copied to clipboard', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      toast.error('Failed to copy ID', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="p-4 sm:p-8">
      <Toaster position="top-right" />
      <PaymentHeader />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-gray-600 text-sm mb-2">Total Balance</div>
          <div className="text-2xl font-bold mb-1">₹{summary.totalBalance.toLocaleString()}</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-gray-600 text-sm mb-2">Withdrawable</div>
          <div className="text-2xl font-bold mb-1">₹{summary.withdrawable.toLocaleString()}</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-gray-600 text-sm mb-2">Pending</div>
          <div className="text-2xl font-bold mb-1">₹{summary.pending.toLocaleString()}</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-gray-600 text-sm mb-2">Lifetime</div>
          <div className="text-2xl font-bold mb-1">₹{summary.lifetime.toLocaleString()}</div>
        </div>
      </div>

      {/* Tabs and Actions */}
      {/* <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => handleTabChange('transactions')}
            className={clsx(
              'px-4 py-2 text-sm font-semibold rounded-md transition-colors',
              activeTab === 'transactions'
                ? 'bg-green-50 text-green-700 border border-gray-300'
                : 'text-gray-800 hover:bg-gray-50 border'
            )}
          >
            Transactions
          </button>
        </div>
      </div> */}

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-2">Transactions</h2>
          </div>
          <div className="flex gap-4 items-center">
          <DatePicker
  selectsRange={true}
  startDate={startDate}
  endDate={endDate}
  onChange={(update) => {
    setDateRange(update);
    setCurrentPage(1);
  }}
  dateFormat="MMMM yyyy"
  showMonthYearPicker
  className="w-full sm:w-auto min-w-[180px] sm:min-w-[250px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base truncate"
  placeholderText="Select months range"
  isClearable={true}
/>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <input
            type="text"
            placeholder="Search by client or service..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Table */}
     <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Transaction ID
        </th>
        <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Client Name
        </th>
        <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Service
        </th>
        <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Time Slot
        </th>
        <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Amount
        </th>
        <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Status
        </th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {currentItems.map((meeting) => (
        <tr key={meeting._id} className="hover:bg-gray-50">
          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <span className="text-sm text-gray-900">{meeting._id}</span>
              <button
                onClick={() => handleCopyId(meeting._id)}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                <BiCopy className="w-4 h-4" />
              </button>
            </div>
          </td>
          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {meeting.userName}
          </td>
          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {meeting.serviceName}
          </td>
          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            <div>
              <div>{formatDate(new Date(meeting.daySpecific.date))}</div>
              <div className="text-gray-500">
                {meeting.daySpecific.slot.startTime} - {meeting.daySpecific.slot.endTime}
              </div>
            </div>
          </td>
          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            ₹{parseFloat(meeting.amount).toLocaleString()}
          </td>
          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
            <span
              className={clsx(
                'px-2 py-1 text-xs font-medium rounded-full',
                meeting.isPayed
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              )}
            >
              {meeting.isPayed ? 'Paid' : 'Failed'}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={clsx(
                'relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md',
                currentPage === 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={clsx(
                'relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md',
                currentPage === totalPages
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)}
                </span>{' '}
                of <span className="font-medium">{filteredData.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={clsx(
                    'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium',
                    currentPage === 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:bg-gray-50'
                  )}
                >
                  <AiOutlineLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={clsx(
                    'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium',
                    currentPage === totalPages
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:bg-gray-50'
                  )}
                >
                  <AiOutlineRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}