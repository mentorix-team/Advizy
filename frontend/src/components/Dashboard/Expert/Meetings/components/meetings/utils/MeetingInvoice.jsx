import { Download } from "lucide-react";
import { useRef } from "react";
import { useLocation } from "react-router-dom";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
  getMeetingStatusLabel,
  getMeetingStatusPillTone,
} from "@/utils/meetingStatus";
import {
  getInvoiceOrderId,
  getInvoiceTransactionId,
} from "@/utils/invoice";

const MAX_SERVICE_NAME_LENGTH = 48;

const MeetingInvoice = () => {
  const location = useLocation();
  const meeting = location.state?.meeting;
  const invoiceRef = useRef(null);
  const controlsRef = useRef(null);

  if (!meeting) {
    return <div>No meeting data found.</div>;
  }

  const { daySpecific } = meeting || {};
  const { date, slot } = daySpecific || {};
  const { startTime, endTime } = slot || {};

  const amount = Number(meeting.amount ?? 0);
  const addOns = Number(meeting.addOnsTotal ?? meeting.addOnsAmount ?? 0);
  const discount = Number(meeting.discountAmount ?? 0);
  const platformFee = Number(meeting.platformFee ?? amount * 0.2);
  const grossCollected = amount + addOns - discount;
  const netEarning = grossCollected - platformFee;

  const orderId = getInvoiceOrderId(meeting);
  const transactionId = getInvoiceTransactionId(meeting);
  const paymentMethod = meeting.payoutMethod || meeting.paymentMethod || "N/A";
  const formattedOrderDate = (meeting.createdAt || date)
    ? new Date(meeting.createdAt || date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    : "N/A";
  const formattedSessionDate = date
    ? new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    : "Not scheduled";
  const sessionTime = startTime && endTime
    ? `${startTime} - ${endTime}`
    : startTime || endTime || "N/A";

  // // Calculate duration from start and end times
  // const calculateDuration = () => {
  //   if (!startTime || !endTime) return "Not specified";

  //   try {
  //     // Parse the time strings (format: "HH:mm")
  //     const [startHours, startMinutes] = startTime.split(':').map(Number);
  //     const [endHours, endMinutes] = endTime.split(':').map(Number);

  //     // Create Date objects for today with the given times
  //     const start = new Date();
  //     start.setHours(startHours, startMinutes, 0, 0);

  //     const end = new Date();
  //     end.setHours(endHours, endMinutes, 0, 0);

  //     // If end time is before start time, assume it's the next day
  //     if (end < start) {
  //       end.setDate(end.getDate() + 1);
  //     }

  //     // Calculate difference in minutes
  //     const diffMs = end - start;
  //     const diffMins = Math.floor(diffMs / 60000); // 60000 ms in a minute

  //     return `${diffMins} minutes`;
  //   } catch (error) {
  //     console.error("Error calculating duration:", error);
  //     return "Not specified";
  //   }
  // };

  // const formattedDuration = calculateDuration();

  const normalisedServiceName =
    meeting.serviceName && meeting.serviceName.length > MAX_SERVICE_NAME_LENGTH
      ? `${meeting.serviceName.slice(0, MAX_SERVICE_NAME_LENGTH)}...`
      : meeting.serviceName || "Consultation";

  const statusLabel = getMeetingStatusLabel(meeting);
  const statusToneClass = getMeetingStatusPillTone(meeting);
  const payoutSuccessful = Boolean(meeting.isPayed);

  const formatCurrency = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const handleDownload = async () => {
    if (!invoiceRef.current) {
      return;
    }

    try {
      if (controlsRef.current) {
        controlsRef.current.style.display = "none";
      }

      const canvas = await html2canvas(invoiceRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: 0,
        windowWidth: 800,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const yOffset = imgHeight < pdfHeight ? (pdfHeight - imgHeight) / 2 : 0;
      pdf.addImage(imgData, "PNG", 0, yOffset, imgWidth, imgHeight, "", "FAST");

      pdf.save(`${orderId !== "N/A" ? orderId : "invoice"}.pdf`);
    } catch (error) {
      console.error("Failed to export invoice", error);
      alert("Unable to download the invoice right now. Please try again.");
    } finally {
      if (controlsRef.current) {
        controlsRef.current.style.display = "inline-flex";
      }
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <style>
        {`
          @media print {
            .no-print {
              display: none !important;
            }
            html, body {
              margin: 0;
              padding: 0;
              width: 210mm;
              height: 297mm;
            }
            body * {
              visibility: hidden;
            }
            #invoice-content,
            #invoice-content * {
              visibility: visible;
            }
            #invoice-content {
              position: absolute;
              left: 0;
              top: 0;
              width: calc(100% - 12mm);
              max-width: 100%;
              padding: 10mm 14mm !important;
              box-shadow: none !important;
              margin: 0 !important;
            }
            nav, header, footer, .navbar, .no-print {
              display: none !important;
            }
            @page {
              margin: 0;
              size: A4;
            }
          }
          @media screen {
            #invoice-content {
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
          }
        `}
      </style>

      <div
        id="invoice-content"
        ref={invoiceRef}
        style={{
          width: "186mm",
          minHeight: "282mm",
          padding: "12mm 16mm",
          backgroundColor: "white",
          fontFamily: "Inter, sans-serif",
          color: "#111827",
          margin: "0 auto",
          fontSize: "0.88rem",
          lineHeight: "1.55",
        }}
        className="font-sans text-gray-800"
      >
        {/* Header */}
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Advizy</h1>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Expert Payout Confirmation</h2>
            <p className="text-xs text-gray-600">Thank you for your service.</p>
          </div>
          <button
            ref={controlsRef}
            onClick={handleDownload}
            type="button"
            className="no-print inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </button>
        </div>

        <hr className="border-gray-200 mb-4" />

        {/* Order Details & Client */}
        <div className="grid grid-cols-2 gap-x-8 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Order Details</h3>
            <div className="space-y-1 text-xs">
              <div>
                <span className="text-gray-600">Order ID: </span>
                <span className="font-medium text-gray-900">{orderId}</span>
              </div>
              <div>
                <span className="text-gray-600">Date: </span>
                <span className="font-medium text-gray-900">{formattedOrderDate}</span>
              </div>
              <div>
                <span className="text-gray-600">Status: </span>
                <span className={`font-semibold ${payoutSuccessful ? "text-green-600" : "text-amber-600"}`}>
                  {payoutSuccessful ? "Completed" : "Pending"}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Client</h3>
            <div className="space-y-1 text-xs">
              <div>
                <span className="text-gray-600">Name: </span>
                <span className="font-medium text-gray-900 capitalize">{meeting.userName || "N/A"}</span>
              </div>
              {meeting.userEmail && (
                <div>
                  <span className="text-gray-600">Email: </span>
                  <span className="font-medium text-gray-900">{meeting.userEmail}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className="bg-gray-50 border border-gray-100 rounded-md p-4 mb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Service Details</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
            <div className="flex flex-col">
              <span className="text-gray-600 mb-0.5">Expert:</span>
              <span className="font-medium text-gray-900">{meeting.expertName || "N/A"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-600 mb-0.5">Session Date:</span>
              <span className="font-medium text-gray-900">{formattedSessionDate}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-600 mb-0.5">Service:</span>
              <span className="font-medium text-gray-900">{normalisedServiceName}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-600 mb-0.5">Session Time:</span>
              <span className="font-medium text-gray-900">{sessionTime}</span>
            </div>
            {/* <div className="flex flex-col col-span-2">
              <span className="text-gray-600 mb-0.5">Duration:</span>
              <span className="font-medium text-gray-900">{formattedDuration}</span>
            </div> */}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Payment Summary</h3>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-900">Base Price</span>
              <span className="text-gray-900 text-right">{formatCurrency(amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-900">Add-ons</span>
              <span className="text-gray-900 text-right">{formatCurrency(addOns)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-900">Discount</span>
              <span className="text-green-600 text-right">-{formatCurrency(discount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-900">Platform Fee</span>
              <span className="text-rose-600 text-right">-{formatCurrency(platformFee)}</span>
            </div>
          </div>
        </div>

        <hr className="border-gray-200 mb-3" />

        {/* Net Earnings */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold text-gray-900">Net Earnings</h3>
          <span className="text-xl font-bold text-gray-900">{formatCurrency(netEarning)}</span>
        </div>

        {/* Payout Status */}
        <div className={`rounded-md p-3.5 mb-4 ${payoutSuccessful ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"}`}>
          <div className="flex items-center gap-2.5">
            <svg
              className={`h-4 w-4 flex-shrink-0 ${payoutSuccessful ? "text-green-600" : "text-amber-600"}`}
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.9998 5.5L8.24984 14.25L3.99984 10"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex-1">
              <h4 className={`text-xs font-semibold ${payoutSuccessful ? "text-green-800" : "text-amber-700"}`}>
                {payoutSuccessful ? "Payout Released" : "Payout Pending"}
              </h4>
              <p className={`text-xs ${payoutSuccessful ? "text-green-700" : "text-amber-700"}`}>
                Transaction ID: {transactionId} | Method: {paymentMethod}
              </p>
              <p className={`text-xs ${payoutSuccessful ? "text-green-700" : "text-amber-700"}`}>
                {payoutSuccessful
                  ? `Your earnings of ${formatCurrency(netEarning)} have been transferred successfully.`
                  : `Earnings of ${formatCurrency(netEarning)} will be transferred shortly.`}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-[10px] text-gray-500 space-y-0.5 pt-3 border-t border-gray-200">
          <p>
            For payout assistance contact{" "}
            <a href="mailto:support@advizy.com" className="text-blue-600">
              support@advizy.com
            </a>
          </p>
          <p>
            Refer to your service agreement for settlement timelines and terms.
          </p>
        </div>
      </div>

    </div>
  );
};

export default MeetingInvoice;