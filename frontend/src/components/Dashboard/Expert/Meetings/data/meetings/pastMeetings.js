import { formatDate } from '../utils/dateUtils';

// Set a specific date for today (January 1, 1970)
const today = new Date(2025, 0, 1);

export const pastMeetings = [
  // Yesterday
  {
    client: 'Sarah Davis',
    service: 'UI/UX Review',
    date: formatDate(new Date(2025, 11, 31)),
    time: '1:00 PM - 2:00 PM',
    sessionStatus: 'Completed',
    paymentStatus: 'Paid',
    amount: 3000,
    summary: 'User interface audit and recommendations',
    keyPoints: ['Usability issues', 'Design improvements'],
    actionItems: ['Implement changes', 'Schedule follow-up'],
    rating: 5,
    feedback: 'Excellent insights and actionable recommendations!'
  },
  // Two days ago
  {
    client: 'Michael Brown',
    service: 'Code Review',
    date: formatDate(new Date(2025, 11, 30)),
    time: '10:30 AM - 11:30 AM',
    sessionStatus: 'Completed',
    paymentStatus: 'Paid',
    amount: 2500,
    summary: 'Code quality assessment and optimization suggestions',
    keyPoints: ['Performance issues', 'Best practices'],
    actionItems: ['Refactor code', 'Add tests'],
    rating: 4,
    feedback: 'Very thorough review with helpful suggestions'
  }
];