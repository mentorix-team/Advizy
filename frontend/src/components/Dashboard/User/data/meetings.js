// Meeting data store
let meetings = [
  // ... existing meetings ...
];

// Load meetings from localStorage if available
const loadMeetings = () => {
  const savedMeetings = localStorage.getItem('pastMeetings');
  if (savedMeetings) {
    const parsedMeetings = JSON.parse(savedMeetings);
    meetings = meetings.map(meeting => {
      const savedMeeting = parsedMeetings.find(m => m.id === meeting.id);
      return savedMeeting ? { ...meeting, ...savedMeeting } : meeting;
    });
  }
};

// Initialize meetings from localStorage
loadMeetings();

export const getMeetingById = (id) => {
  loadMeetings(); // Reload meetings to get latest data
  return meetings.find(meeting => meeting.id === Number(id));
};

export const updateMeetingRating = (id, rating, feedback) => {
  meetings = meetings.map(meeting =>
    meeting.id === Number(id)
      ? { ...meeting, rating, feedback }
      : meeting
  );
  // Save to localStorage
  const pastMeetings = meetings.filter(m => m.status === 'Completed');
  localStorage.setItem('pastMeetings', JSON.stringify(pastMeetings));
};