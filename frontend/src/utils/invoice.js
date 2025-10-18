export const getInvoiceOrderId = (meeting = {}) => {
  if (!meeting || typeof meeting !== "object") return "N/A";

  return (
    meeting.razorpay_order_id ||
      meeting.orderId ||
      meeting.razorpay_payment_id ||
      meeting.orderID ||
    meeting.paymentId ||
    "N/A"
  );
};

export const getInvoiceTransactionId = (meeting = {}) => {
  if (!meeting || typeof meeting !== "object") return "N/A";

  return (
    meeting.razorpay_payment_id ||
    meeting.paymentId ||
    meeting.transactionId ||
    meeting.transactionID ||
    getInvoiceOrderId(meeting)
  );
};
