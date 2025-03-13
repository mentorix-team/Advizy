export const calculateStats = (meetings) => {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisWeek = getWeekNumber(now);

  const stats = {
    total: meetings.length,
    upcoming: meetings.filter(m => new Date(m.date) > now).length,
    uniqueClients: new Set(meetings.map(m => m.client)).size,
    averageDuration: calculateAverageDuration(meetings),
    thisMonth: meetings.filter(m => new Date(m.date).getMonth() === thisMonth).length,
    completed: meetings.filter(m => m.sessionStatus.toLowerCase() === 'completed').length,
    cancelled: meetings.filter(m => m.sessionStatus.toLowerCase().includes('cancel')).length
  };

  return stats;
};

const calculateAverageDuration = (meetings) => {
  // Assuming time format is "X:XX AM/PM - Y:YY AM/PM"
  const durations = meetings.map(meeting => {
    const [start, end] = meeting.time.split(' - ');
    const startTime = new Date(`2024-01-01 ${start}`);
    const endTime = new Date(`2024-01-01 ${end}`);
    return (endTime - startTime) / (1000 * 60); // Convert to minutes
  });

  const average = durations.reduce((a, b) => a + b, 0) / durations.length;
  return Math.round(average);
};

const getWeekNumber = (date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  return Math.ceil((((date - firstDayOfYear) / 86400000) + firstDayOfYear.getDay() + 1) / 7);
};