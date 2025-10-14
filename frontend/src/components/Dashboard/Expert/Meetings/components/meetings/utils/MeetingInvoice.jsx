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
  const durationMinutes =
    meeting.durationMinutes ||
    meeting.duration ||
    meeting.sessionDuration ||
    meeting?.daySpecific?.slot?.duration;
  const formattedDuration = durationMinutes
    ? `${durationMinutes} minutes`
    : "Not specified";

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
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

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
    <div className="px-4 py-8">
      <style>
        {`
          @media print {
            .no-print {
              display: none !important;
            }
          }
        `}
      </style>

      <div
        ref={invoiceRef}
        className="mx-auto max-w-3xl rounded-2xl border border-gray-100 bg-white px-8 py-10 shadow-sm"
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Advizy</h1>
            <p className="mt-1 text-sm text-gray-500">Session payout summary</p>
          </div>
          <button
            ref={controlsRef}
            onClick={handleDownload}
            className="no-print inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </button>
        </div>

        <div className="my-8 h-px bg-gray-200" />

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">Order Confirmation</h2>
          <p className="text-sm text-gray-600">
            A snapshot of your recent consultation and payout details is below.
          </p>
        </div>

        <div className="my-8 h-px bg-gray-200" />

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">Order Details</h3>
            <dl className="mt-3 space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <dt className="font-medium text-gray-700">Order ID</dt>
                <dd className="text-gray-900">{orderId}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-gray-700">Date</dt>
                <dd>{formattedOrderDate}</dd>
              </div>
            </dl>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">Client</h3>
            <dl className="mt-3 space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <dt className="font-medium text-gray-700">Name</dt>
                <dd className="text-gray-900">{meeting.userName || "N/A"}</dd>
              </div>
              {meeting.userEmail && (
                <div className="flex justify-between">
                  <dt className="font-medium text-gray-700">Email</dt>
                  <dd className="text-gray-900">{meeting.userEmail}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        <div className="mt-10 rounded-2xl bg-gray-50 p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">Service Details</h3>
          <div className="mt-4 grid gap-4 text-sm text-gray-600 md:grid-cols-2">
            <div className="space-y-2">
              <p>
                <span className="font-medium text-gray-700">Expert:</span> {meeting.expertName || "N/A"}
              </p>
              <p>
                <span className="font-medium text-gray-700">Service:</span> {normalisedServiceName}
              </p>
            </div>
            <div className="space-y-2">
              <p>
                <span className="font-medium text-gray-700">Session Date:</span> {formattedSessionDate}
              </p>
              <p>
                <span className="font-medium text-gray-700">Session Time:</span> {sessionTime}
              </p>
              <p>
                <span className="font-medium text-gray-700">Duration:</span> {formattedDuration}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">Payment Summary</h3>
          <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between px-6 py-3 text-sm text-gray-600">
              <span>Base Price</span>
              <span className="font-medium text-gray-900">{formatCurrency(amount)}</span>
            </div>
            <div className="border-t border-gray-200 px-6 py-3 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>Add-ons</span>
                <span className="font-medium text-gray-900">{formatCurrency(addOns)}</span>
              </div>
            </div>
            <div className="border-t border-gray-200 px-6 py-3 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>Discount</span>
                <span className="font-medium text-gray-900">-{formatCurrency(discount)}</span>
              </div>
            </div>
            <div className="border-t border-gray-200 px-6 py-3 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>Platform Fee</span>
                <span className="font-medium text-rose-600">-{formatCurrency(platformFee)}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between rounded-2xl px-6 py-4 text-black">
            <span className="text-base font-semibold">Net Earnings</span>
            <span className="text-2xl font-semibold">{formatCurrency(netEarning)}</span>
          </div>
        </div>

        <div
          className={`mt-10 rounded-2xl border p-5 ${payoutSuccessful
            ? "border-emerald-200 bg-emerald-50"
            : "border-amber-200 bg-amber-50"
            }`}
        >
          <div className="flex items-start gap-3">
            <span
              className={`mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full ${payoutSuccessful
                ? "bg-emerald-100 text-emerald-600"
                : "bg-amber-100 text-amber-600"
                }`}
            >
              <svg
                className="h-5 w-5"
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
            </span>
            <div className="space-y-1 text-sm">
              <h4
                className={`font-semibold ${payoutSuccessful ? "text-emerald-800" : "text-amber-700"
                  }`}
              >
                {payoutSuccessful ? "Payout Released" : "Payout Pending"}
              </h4>
              <p className={payoutSuccessful ? "text-emerald-700" : "text-amber-700"}>
                Transaction ID: {transactionId} | Method: {paymentMethod}
              </p>
              <p className={payoutSuccessful ? "text-emerald-700" : "text-amber-700"}>
                {payoutSuccessful
                  ? `Your earnings of ${formatCurrency(netEarning)} have been transferred successfully.`
                  : `Earnings of ${formatCurrency(netEarning)} will be transferred shortly.`}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-2xl bg-gray-50 px-6 py-4 text-xs text-gray-500">
          <p>
            For payout assistance contact <a href="mailto:support@advizy.com" className="text-blue-600 hover:underline">support@advizy.com</a>
          </p>
          <p className="mt-1">
            Refer to your service agreement for settlement timelines and terms.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MeetingInvoice;
