const MeetingInvoice = ({ meeting }) => {
  const { daySpecific } = meeting || {};
  const { date, slot } = daySpecific || {};
  const { startTime, endTime } = slot || {};

  const amount = meeting.amount;
  const baseRate = Math.round(amount); // total amount
  const platformFee = Math.round(amount * 0.2); // 20% platform fee
  const netEarning = baseRate - platformFee;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      {/* Print-specific styles */}
      <style>
        {`
          @media print {
            body {
              margin: 0;
              padding: 0;
              font-size: 12px;
              width: 100%;
              height: 100%;
            }
            
            .print-container {
              padding: 10px !important;
              max-width: 100% !important;
              box-shadow: none !important;
            }
            
            .print-header {
              margin-bottom: 10px !important;
            }
            
            .print-divider {
              margin: 10px 0 !important;
            }
            
            .print-section {
              margin-bottom: 10px !important;
              page-break-inside: avoid;
            }
            
            .print-grid {
              gap: 10px !important;
            }
            
            .print-service {
              padding: 10px !important;
              margin-bottom: 10px !important;
            }
            
            .print-payment {
              margin-bottom: 10px !important;
            }
            
            .print-success {
              padding: 10px !important;
              margin-bottom: 10px !important;
            }
            
            .print-footer {
              font-size: 10px !important;
            }
            
            .no-print {
              display: none !important;
            }
          }
        `}
      </style>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Advizy</h1>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Order Confirmation - Session Details
        </h2>
        <p className="text-gray-600">
          Thank you for your booking. Here are your order details:
        </p>
      </div>

      <hr className="my-6 border-gray-200" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Order Details
          </h3>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 no-print"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            Print Receipt
          </button>

          <div className="space-y-1">
            <p className="text-gray-600">
              Order ID: {meeting.razorpay_order_id}
            </p>
            <p className="text-gray-600">
              Status:{" "}
              <span className="text-green-600 bg-green-100 w-fit rounded-full p-1 font-medium">
                {meeting.sessionStatus}
              </span>
            </p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Customer Information
          </h3>
          <p className="text-gray-600">{meeting.userName}</p>
        </div>
      </div>

      <div className="bg-gray-50 p-5 rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Service Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">
              <span className="font-medium">Expert:</span> {meeting.expertName}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Service:</span>{" "}
              {meeting.serviceName}
            </p>
          </div>
          <div>
            <p className="text-gray-600">
              <span className="font-medium">Date:</span>{" "}
              {date ? new Date(date).toLocaleDateString("en-GB") : "no date"}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Time Slots: </span>{" "}
              {startTime && endTime ? `${startTime} - ${endTime}` : "-"}
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Payment Summary
      </h3>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Base Price</span>
          <span className="text-gray-800">₹{amount}</span>
        </div>
        {/* <div className="flex justify-between">
          <span className="text-gray-600">Add-ons</span>
          <span className="text-gray-800">₹{addOns.toFixed(2)}</span>
        </div> */}
        <div className="flex justify-between">
          <span className="text-gray-600">Plateform Fee (20%)</span>
          <span className="text-red-500">- ₹{platformFee}</span>
        </div>
      </div>

      <hr className="my-4 border-gray-200" />

      <div className="flex justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Net Earnings</h3>
        <span className="text-lg font-semibold text-primary">
          ₹{netEarning}
        </span>
      </div>

      <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-green-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            {meeting.isPayed && (
              <>
                <h4 className="text-sm font-medium text-green-800">
                  Payment Successful
                </h4>
                <p className="mt-1 text-sm text-green-700">
                  Your payment of ₹{netEarning} has been processed successfully.
                </p>
                {/* <p className="mt-1 text-sm text-green-700">
                  Transaction ID: {transactionId} | Method: {paymentMethod}
                </p> */}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-500">
        <p className="mb-1">
          For our cancellation and refund policy, please visit:{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Cancellation & Refund Policy
          </a>
        </p>
        <p>
          If you have any questions, please contact our support team at{" "}
          <a
            href="mailto:support@mentorix.com"
            className="text-blue-600 hover:underline"
          >
            support@mentorix.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default MeetingInvoice;
