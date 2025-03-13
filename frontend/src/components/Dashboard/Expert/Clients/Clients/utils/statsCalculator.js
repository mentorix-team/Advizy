export function calculateStats(clients) {
  const totalClients = clients.length;
  
  const activeClients = clients.filter(client => 
    client.status.toLowerCase() === 'active'
  ).length;
  
  const newClients = clients.filter(client => 
    client.status.toLowerCase() === 'new'
  ).length;

  // Calculate average revenue (assuming ₹1000 per session for this example)
  const totalSessions = clients.reduce((sum, client) => sum + client.sessions, 0);
  const averageRevenue = Math.round((totalSessions * 1000) / totalClients);

  // Calculate percentage changes (mock data for demonstration)
  const lastMonthTotal = totalClients - Math.round(totalClients * 0.12); // 12% increase
  const lastMonthActive = activeClients - Math.round(activeClients * 0.05); // 5% increase

  const totalChange = Math.round(((totalClients - lastMonthTotal) / lastMonthTotal) * 100);
  const activeChange = Math.round(((activeClients - lastMonthActive) / lastMonthActive) * 100);

  return {
    totalClients: {
      value: totalClients,
      subtext: `+${totalChange}% from last month`
    },
    activeClients: {
      value: activeClients,
      subtext: `+${activeChange}% from last month`
    },
    newClients: {
      value: newClients,
      subtext: 'This month'
    },
    averageRevenue: {
      value: `₹${averageRevenue.toLocaleString()}`,
      subtext: 'Per client this month'
    }
  };
}