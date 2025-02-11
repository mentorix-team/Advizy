// Mock data for all clients
export const clientsData = {
  1: {
    id: 1,
    name: 'John Doe',
    status: 'Active',
    service: 'Web Development',
    totalSessions: 15,
    notes: 'John is a long-term client working on an e-commerce project.',
    upcomingSessions: [
      {
        id: 1,
        date: '2023-07-01',
        time: '10:00 AM',
        title: 'Project Review',
        service: 'Web Development',
        duration: '60 min'
      },
      {
        id: 2,
        date: '2023-07-15',
        time: '2:00 PM',
        title: 'Progress Update',
        service: 'Web Development',
        duration: '30 min'
      }
    ],
    pastSessions: [
      {
        id: 1,
        date: '2023-06-15',
        time: '11:00 AM',
        title: 'Initial Consultation',
        service: 'Web Development',
        status: 'Session Complete & Payment Received',
        rating: 5,
        notes: 'Discussed project requirements and timeline.',
        attachments: [
          { id: 1, name: 'project_requirements.pdf' },
          { id: 2, name: 'timeline.xlsx' }
        ],
        feedback: 'Great session! The consultant was very knowledgeable and helpful.'
      },
      {
        id: 2,
        date: '2023-06-01',
        time: '3:00 PM',
        title: 'Design Review',
        service: 'Web Development',
        status: 'Session Complete',
        paymentStatus: 'Payment Pending',
        rating: 4,
        notes: 'Reviewed initial mockups and gathered feedback.',
        attachments: [
          { id: 3, name: 'initial_mockups.pdf' }
        ],
        feedback: 'Good session overall. Would have liked more time for questions.'
      }
    ]
  },
  2: {
    id: 2,
    name: 'Jane Smith',
    status: 'Active',
    service: 'UI/UX Design',
    totalSessions: 8,
    notes: 'Working on redesigning the company website.',
    upcomingSessions: [
      {
        id: 3,
        date: '2023-07-03',
        time: '2:00 PM',
        title: 'Design Review',
        service: 'UI/UX Design',
        duration: '45 min'
      }
    ],
    pastSessions: [
      {
        id: 3,
        date: '2023-06-20',
        time: '10:00 AM',
        title: 'Initial Design Discussion',
        service: 'UI/UX Design',
        status: 'Session Complete & Payment Received',
        rating: 5,
        notes: 'Discussed design requirements and brand guidelines.',
        attachments: [
          { id: 4, name: 'brand_guidelines.pdf' }
        ],
        feedback: 'Excellent session, very productive!'
      }
    ]
  },
  3: {
    id: 3,
    name: 'Alice Johnson',
    status: 'Inactive',
    service: 'Digital Marketing',
    totalSessions: 5,
    notes: 'Focus on social media marketing strategy.',
    upcomingSessions: [],
    pastSessions: [
      {
        id: 4,
        date: '2023-06-10',
        time: '1:00 PM',
        title: 'Marketing Strategy Session',
        service: 'Digital Marketing',
        status: 'Session Complete & Payment Received',
        rating: 4,
        notes: 'Developed social media content calendar.',
        attachments: [
          { id: 5, name: 'content_calendar.pdf' }
        ],
        feedback: 'Very informative session.'
      }
    ]
  },
  4: {
    id: 4,
    name: 'Bob Williams',
    status: 'Active',
    service: 'SEO Optimization',
    totalSessions: 12,
    notes: 'Ongoing SEO improvements for e-commerce site.',
    upcomingSessions: [
      {
        id: 5,
        date: '2023-07-05',
        time: '3:00 PM',
        title: 'SEO Performance Review',
        service: 'SEO Optimization',
        duration: '60 min'
      }
    ],
    pastSessions: [
      {
        id: 5,
        date: '2023-06-18',
        time: '2:00 PM',
        title: 'Keyword Analysis',
        service: 'SEO Optimization',
        status: 'Session Complete & Payment Received',
        rating: 5,
        notes: 'Reviewed keyword performance and updated strategy.',
        attachments: [
          { id: 6, name: 'keyword_analysis.pdf' }
        ],
        feedback: 'Great insights and actionable recommendations.'
      }
    ]
  },
  5: {
    id: 5,
    name: 'Eva Brown',
    status: 'New',
    service: 'Content Writing',
    totalSessions: 3,
    notes: 'Blog content creation for tech startup.',
    upcomingSessions: [
      {
        id: 6,
        date: '2023-07-10',
        time: '11:00 AM',
        title: 'Content Planning',
        service: 'Content Writing',
        duration: '45 min'
      }
    ],
    pastSessions: [
      {
        id: 6,
        date: '2023-06-25',
        time: '10:00 AM',
        title: 'Initial Content Strategy',
        service: 'Content Writing',
        status: 'Session Complete & Payment Received',
        rating: 5,
        notes: 'Defined content pillars and editorial calendar.',
        attachments: [
          { id: 7, name: 'content_strategy.pdf' }
        ],
        feedback: 'Very thorough and well-structured session.'
      }
    ]
  }
};