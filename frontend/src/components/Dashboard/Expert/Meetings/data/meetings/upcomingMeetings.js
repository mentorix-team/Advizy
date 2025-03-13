import { formatDate } from '../utils/dateUtils';

// Set a specific date for today (January 1, 1970)
const today = new Date(1970, 0, 1);

export const upcomingMeetings = [
  // Tomorrow
  {
    client: 'Alice Johnson',
    service: 'Branding Consultation',
    date: formatDate(new Date(1970, 0, 2)),
    time: '11:00 AM - 11:45 AM',
    sessionStatus: 'Confirmed',
    paymentStatus: 'Pending',
    amount: 3500,
    summary: 'Brand identity discussion',
    keyPoints: ['Brand guidelines', 'Visual identity', 'Market positioning'],
    actionItems: ['Prepare mood board', 'Competitor analysis']
  },
  // Day after tomorrow
  {
    client: 'Bob Williams',
    service: 'Web Development',
    date: formatDate(new Date(1970, 0, 3)),
    time: '3:00 PM - 4:00 PM',
    sessionStatus: 'Confirmed',
    paymentStatus: 'Paid',
    amount: 5000,
    summary: 'Website redesign planning',
    keyPoints: ['Technical requirements', 'Design preferences'],
    actionItems: ['Create sitemap', 'Define tech stack']
  },
  // This week
  {
    client: 'Emma Davis',
    service: 'Content Strategy',
    date: formatDate(new Date(1970, 0, 4)),
    time: '2:00 PM - 3:00 PM',
    sessionStatus: 'Confirmed',
    paymentStatus: 'Pending',
    amount: 2800,
    summary: 'Content calendar planning',
    keyPoints: ['Content themes', 'Distribution channels'],
    actionItems: ['Draft editorial calendar', 'Define KPIs']
  },
  {
    client: 'Mark Thompson',
    service: 'SEO Consultation',
    date: formatDate(new Date(1970, 0, 5)),
    time: '10:00 AM - 11:00 AM',
    sessionStatus: 'Confirmed',
    paymentStatus: 'Paid',
    amount: 3200,
    summary: 'SEO strategy review',
    keyPoints: ['Keyword analysis', 'Technical SEO audit'],
    actionItems: ['Optimize meta tags', 'Fix crawl issues']
  },
  {
    client: 'Sarah Miller',
    service: 'UI/UX Review',
    date: formatDate(new Date(1970, 0, 6)),
    time: '1:00 PM - 2:30 PM',
    sessionStatus: 'Confirmed',
    paymentStatus: 'Pending',
    amount: 4500,
    summary: 'User experience analysis',
    keyPoints: ['Usability testing', 'Interface audit'],
    actionItems: ['Create wireframes', 'Update design system']
  }
];