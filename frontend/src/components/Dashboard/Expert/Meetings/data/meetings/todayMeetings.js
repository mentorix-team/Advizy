import { formatDate } from '../utils/dateUtils';

// Set today's date to January 1, 1970
const today = new Date(1970, 0, 1);

export const todayMeetings = [
  {
    client: "John Doe",
    service: "Project Consultation",
    date: formatDate(today),
    time: "10:00 AM - 11:00 AM",
    sessionStatus: "Confirmed",
    paymentStatus: "Pending",
    amount: 2500,
    summary: "Initial project scope discussion"
  },
  {
    client: "Jane Smith",
    service: "Feature Implementation",
    date: formatDate(today),
    time: "2:00 PM - 2:30 PM",
    sessionStatus: "Confirmed",
    paymentStatus: "Paid",
    amount: 3000,
    summary: "Feature review and implementation planning"
  },
  {
    client: "Robert Johnson",
    service: "Code Review",
    date: formatDate(today),
    time: "4:00 PM - 5:00 PM",
    sessionStatus: "Confirmed",
    paymentStatus: "Pending",
    amount: 3500,
    summary: "Review of new authentication system"
  }
];