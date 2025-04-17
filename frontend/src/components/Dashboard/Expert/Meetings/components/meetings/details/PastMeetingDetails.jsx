import {
  BsArrowLeft,
  BsChevronDown,
  BsChevronUp,
  BsClock,
} from "react-icons/bs";
import PropTypes from "prop-types";
import { FaStar } from "react-icons/fa";
import { useRef, useState } from "react";
import PriceBreakdownModal from "../../modals/PriceBreakdownModal";
import { ArrowRightIcon, CheckIcon, ColorCalendarIcon } from "@/icons/Icons";
import { Download } from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import MeetingInvoice from "../utils/MeetingInvoice";

const PastMeetingDetails = ({ meeting, onBack }) => {
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);
  const [notes, setNotes] = useState(meeting?.notes || "");
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const { daySpecific } = meeting || {};
  const { date, slot } = daySpecific || {};
  const { startTime, endTime } = slot || {};

  const invoiceRef = useRef(null);

  if (!meeting) return null;

  const handleDownloadInvoice = async () => {
    const element = invoiceRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`invoice-${meeting._id || "meeting"}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-3xl">
        <button
          onClick={onBack}
          className="flex items-center text-green-600 mb-6 hover:text-green-700"
        >
          <BsArrowLeft className="mr-2" />
          Back to Meetings
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-lg">
              {Array.isArray(meeting.userName) && meeting.userName.length > 0
                ? meeting.userName[0]
                : "N/A"}
            </span>
          </div>
          <h1 className="text-xl font-semibold">{meeting.userName}</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold mb-6">Meeting Details</h2>
            <button
              onClick={handleDownloadInvoice}
              className="text-primary hover:text-green-700 flex items-center justify-center border border-gray-200 px-4 py-2 rounded-lg text-sm"
            >
              <Download className="w-4 h-4" />
              Download Invoice
            </button>
          </div>

          {/* Invoice preview area (invisible but used for PDF generation) */}
          <div ref={invoiceRef} className="hidden">
            <MeetingInvoice meeting={meeting} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Date</h3>
              <div className="flex items-center gap-2">
                <ColorCalendarIcon className="w-5 h-5" />
                <p className="text-gray-900">
                  {date
                    ? new Date(date).toLocaleDateString("en-GB")
                    : "no date"}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Time</h3>
              <div className="flex items-center gap-2">
                <BsClock className="text-[169544]" />
                <p className="text-gray-900">
                  {startTime && endTime ? `${startTime} - ${endTime}` : "-"}
                </p>
                <span
                  className={`text-sm ${
                    meeting.sessionStatus === "Completed"
                      ? "text-[#169544] bg-green-100 w-fit p-1 rounded-full"
                      : "text-red-600"
                  }`}
                >
                  {meeting.sessionStatus}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Service</h3>
              <p className="text-gray-900">{meeting.serviceName}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Amount</h3>
              <div className="flex items-center gap-2">
                <p className="text-gray-900">₹{meeting.amount}</p>
                <button
                  onClick={() => setShowPriceBreakdown(true)}
                  className="text-sm flex items-center text-gray-500 border py-1 px-3 rounded-2xl border-[#169544]"
                >
                  Price breakdown
                  <ArrowRightIcon className="w-3 h-2" />
                </button>
                <span
                  className={`text-sm ${
                    meeting.paymentStatus === "Paid"
                      ? "text-green-600"
                      : "text-orange-600"
                  }`}
                >
                  {meeting.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* {meeting.summary && (
            <div className="mb-6">
              <h3 className="text-sm text-gray-500 mb-1">Meeting Summary</h3>
              <p className="text-gray-900">{meeting.summary}</p>
            </div>
          )} */}

          {/* Accordion Section */}
          <div className="bg-white p-4 sm:p-6">
            <button
              className="flex justify-between items-center w-full text-left font-semibold text-gray-700 text-lg focus:outline-none"
              onClick={() => setIsAccordionOpen(!isAccordionOpen)}
            >
              <span>Service Description & Features</span>
              {isAccordionOpen ? (
                <BsChevronUp className="text-gray-600 transition-transform duration-300" />
              ) : (
                <BsChevronDown className="text-gray-600 transition-transform duration-300" />
              )}
            </button>
            {isAccordionOpen && (
              <div className="mt-4 transition-opacity duration-300">
                <h3 className="text-base text-gray-600 mb-1">
                  In-depth project review and strategic planning session
                </h3>
                <p className="text-gray-900 mb-4"></p>
                <h3 className="font-semibold text-gray-800 mb-1">
                  Features included:
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-900">
                  {/* {meeting.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))} */}
                  <li className="flex items-center">
                    {" "}
                    <CheckIcon className="w-4 h-4 text-[#169544] mr-1" />{" "}
                    Personalized consultation
                  </li>
                  <li className="flex items-center">
                    {" "}
                    <CheckIcon className="w-4 h-4 text-[#169544] mr-1" />{" "}
                    Project analysis and feedback
                  </li>
                  <li className="flex items-center">
                    {" "}
                    <CheckIcon className="w-4 h-4 text-[#169544] mr-1" />{" "}
                    Strategic planning advice
                  </li>
                </ul>
              </div>
            )}
          </div>

          {meeting.rating && (
            <div className="mb-6">
              <h3 className="text-sm text-gray-500 mb-1">
                Client Rating & Review
              </h3>
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={
                      star <= meeting.rating
                        ? "text-yellow-400"
                        : "text-gray-200"
                    }
                    size={20}
                  />
                ))}
              </div>
              <p className="text-gray-900">
                {meeting.feedback || "No feedback provided"}
              </p>
            </div>
          )}

          {/* {meeting.keyPoints?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm text-gray-500 mb-1">Key Points Discussed</h3>
              <ul className="list-disc list-inside space-y-1">
                {meeting.keyPoints.map((point, index) => (
                  <li key={index} className="text-gray-900">{point}</li>
                ))}
              </ul>
            </div>
          )}

          {meeting.actionItems?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm text-gray-500 mb-1">Action Items</h3>
              <ul className="list-disc list-inside space-y-1">
                {meeting.actionItems.map((item, index) => (
                  <li key={index} className="text-gray-900">{item}</li>
                ))}
              </ul>
            </div>
          )} */}

          {/* <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
              Send Follow-up Message
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
              Schedule Next Meeting
            </button>
          </div> */}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <h2 className="text-xl font-semibold mb-4">Notes</h2>

          <div className="mb-4">
            <textarea
              className="w-full h-32 p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Add meeting notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
            Save Notes
          </button>
        </div>

        <PriceBreakdownModal
          isOpen={showPriceBreakdown}
          onClose={() => setShowPriceBreakdown(false)}
          amount={meeting.amount}
        />
      </div>
    </div>
  );
};

PastMeetingDetails.propTypes = {
  meeting: PropTypes.shape({
    client: PropTypes.string.isRequired,
    service: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    sessionStatus: PropTypes.string.isRequired,
    paymentStatus: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    summary: PropTypes.string,
    rating: PropTypes.number,
    feedback: PropTypes.string,
    keyPoints: PropTypes.arrayOf(PropTypes.string),
    actionItems: PropTypes.arrayOf(PropTypes.string),
    notes: PropTypes.string,
  }),
  onBack: PropTypes.func.isRequired,
};

export default PastMeetingDetails;
