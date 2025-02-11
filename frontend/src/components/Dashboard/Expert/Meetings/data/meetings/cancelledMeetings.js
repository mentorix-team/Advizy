import { formatDate } from '../utils/dateUtils';

export const cancelledMeetings = [
  {
    client: "David Wilson",
    service: "Technical Consultation",
    date: formatDate(new Date(1970, 0, 3)),
    time: "2:00 PM - 3:00 PM",
    sessionStatus: "Cancelled",
    paymentStatus: "Refunded",
    amount: 4000,
    summary: "Technical architecture review",
    keyPoints: ["System design", "Performance optimization"],
    actionItems: ["Reschedule for next week"],
    cancellationReason: "Client emergency"
  },
  {
    client: "Emily Chen",
    service: "Project Planning",
    date: formatDate(new Date(1970, 0, 4)),
    time: "11:00 AM - 12:00 PM",
    sessionStatus: "Cancelled",
    paymentStatus: "Refunded",
    amount: 3500,
    summary: "Project kickoff meeting",
    keyPoints: ["Timeline discussion", "Resource allocation"],
    actionItems: ["Send new availability"],
    cancellationReason: "Schedule conflict"
  }
];