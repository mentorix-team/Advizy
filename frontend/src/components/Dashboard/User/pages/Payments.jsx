import { useEffect, useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import clsx from 'clsx';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { getMeetingByUserId } from '@/Redux/Slices/meetingSlice';

const ITEMS_PER_PAGE = 10;

export default function Payments() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const { meetings } = useSelector((state) => state.meeting);
  const { data } = useSelector((state) => state.auth);

  // Filter meetings where isPayed is true
  const paidMeetings = meetings?.filter(meeting => meeting.isPayed) || [];

  const payments = paidMeetings.map(meeting => ({
    id: meeting.razorpay_payment_id,  // Use actual transaction ID
    expert: meeting.expertName,
    service: meeting.serviceName,
    timeSlot: {
      date: meeting.daySpecific.date,
      time: `${meeting.daySpecific.slot.startTime} - ${meeting.daySpecific.slot.endTime}`
    },
    amount: meeting.amount,
    status: 'paid' // Since we are filtering only paid meetings
  }));
  console.log("This is payments",payments)
  const filteredPayments = payments.filter(payment =>
    payment.expert?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.service?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPayments = filteredPayments.slice(startIndex, endIndex);

  const user = data && typeof data === "string" ? JSON.parse(data) : data;

  useEffect(() => {
    dispatch(getMeetingByUserId(user._id));
  }, [dispatch, user._id]);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleCopyTransactionId = async (id) => {
    try {
      await navigator.clipboard.writeText(id);
      toast.success('Transaction ID copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy transaction ID');
    }
  };

  const handleDownloadInvoice = () => {
    toast.success('Invoice downloaded successfully');
  };

  return (
    <div className="p-4 sm:p-8">
      <Toaster position="top-right" />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-600 mt-1">
          Track your transactions and manage your subscriptions.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <BiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by expert name or service..."
            value={searchTerm}
            onChange={handleSearch}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expert
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time Slot
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Download Invoice
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <span>{payment.id}</span>
                      <button
                        onClick={() => handleCopyTransactionId(payment.id)}
                        className="ml-2 text-green-600 hover:text-green-700 text flex items-center justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path fillRule="evenodd" clipRule="evenodd" d="M12.5 1.04199H9.12C7.58833 1.04199 6.375 1.04199 5.42583 1.16949C4.44917 1.30116 3.65833 1.57783 3.03417 2.20116C2.41083 2.82533 2.13417 3.61616 2.0025 4.59283C1.875 5.54283 1.875 6.75533 1.875 8.28699V13.3337C1.87485 14.0782 2.14055 14.7984 2.62425 15.3644C3.10795 15.9305 3.77786 16.3052 4.51333 16.4212C4.6275 17.0578 4.84833 17.6012 5.29 18.0437C5.79167 18.5453 6.42333 18.7603 7.17333 18.862C7.89583 18.9587 8.815 18.9587 9.95417 18.9587H12.5458C13.685 18.9587 14.6042 18.9587 15.3267 18.862C16.0767 18.7603 16.7083 18.5453 17.21 18.0437C17.7117 17.542 17.9267 16.9103 18.0283 16.1603C18.125 15.4378 18.125 14.5187 18.125 13.3795V9.12116C18.125 7.98199 18.125 7.06283 18.0283 6.34033C17.9267 5.59033 17.7117 4.95866 17.21 4.45699C16.7675 4.01533 16.2242 3.79449 15.5875 3.68033C15.4715 2.94485 15.0968 2.27494 14.5308 1.79124C13.9647 1.30754 13.2446 1.04184 12.5 1.04199ZM14.275 3.55949C14.1483 3.18949 13.909 2.86838 13.5908 2.6411C13.2725 2.41382 12.8911 2.29175 12.5 2.29199H9.16667C7.5775 2.29199 6.44917 2.29366 5.59167 2.40866C4.75417 2.52116 4.27083 2.73283 3.91833 3.08533C3.56583 3.43783 3.35417 3.92116 3.24167 4.75866C3.12667 5.61616 3.125 6.74449 3.125 8.33366V13.3337C3.12476 13.7248 3.24683 14.1061 3.4741 14.4244C3.70138 14.7427 4.0225 14.9819 4.3925 15.1087C4.375 14.6003 4.375 14.0253 4.375 13.3795V9.12116C4.375 7.98199 4.375 7.06283 4.4725 6.34033C4.5725 5.59033 4.78917 4.95866 5.29 4.45699C5.79167 3.95533 6.42333 3.74033 7.17333 3.63949C7.89583 3.54199 8.815 3.54199 9.95417 3.54199H12.5458C13.1917 3.54199 13.7667 3.54199 14.275 3.55949ZM6.17333 5.34199C6.40417 5.11116 6.7275 4.96116 7.34 4.87866C7.96833 4.79449 8.80333 4.79283 9.99917 4.79283H12.4992C13.695 4.79283 14.5292 4.79449 15.1592 4.87866C15.7708 4.96116 16.0942 5.11199 16.325 5.34199C16.5558 5.57283 16.7058 5.89616 16.7883 6.50866C16.8725 7.13699 16.8742 7.97199 16.8742 9.16783V13.3345C16.8742 14.5303 16.8725 15.3645 16.7883 15.9945C16.7058 16.6062 16.555 16.9295 16.325 17.1603C16.0942 17.3912 15.7708 17.5412 15.1583 17.6237C14.5292 17.7078 13.695 17.7095 12.4992 17.7095H9.99917C8.80333 17.7095 7.96833 17.7078 7.33917 17.6237C6.7275 17.5412 6.40417 17.3903 6.17333 17.1603C5.9425 16.9295 5.7925 16.6062 5.71 15.9937C5.62583 15.3645 5.62417 14.5303 5.62417 13.3345V9.16783C5.62417 7.97199 5.62583 7.13699 5.71 6.50783C5.7925 5.89616 5.94333 5.57283 6.17333 5.34199Z" fill="currentColor"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.expert}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.service}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div>{payment.timeSlot.date}</div>
                      <div>{payment.timeSlot.time}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      <span>₹{payment.amount}</span>
                      <span className={clsx(
                        'ml-2 px-2 py-1 text-xs font-medium rounded-full',
                        payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      )}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <button
                      onClick={handleDownloadInvoice}
                      className="inline-flex items-center justify-center text-green-600 hover:text-green-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="mx-auto">
                        <path d="M14 3V7C14 7.26522 14.1054 7.51957 14.2929 7.70711C14.4804 7.89464 14.7348 8 15 8H19" stroke="currentColor" strokeOpacity="0.9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 17V11M17 21H7C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H14L19 8V19C19 19.5304 18.7893 20.0391 18.4142 20.4142C18.0391 20.7893 17.5304 21 17 21Z" stroke="currentColor" strokeOpacity="0.9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9.5 14.5L12 17L14.5 14.5" stroke="currentColor" strokeOpacity="0.9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                currentPage === totalPages
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(endIndex, filteredPayments.length)}
                </span>{' '}
                of <span className="font-medium">{filteredPayments.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <AiOutlineLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === totalPages
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <AiOutlineRight className="w-5 h-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}