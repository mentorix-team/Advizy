import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

export default function PerformanceChart() {
  const data = [
    { month: 'Jan', earnings: 2000 },
    { month: 'Feb', earnings: 2500 },
    { month: 'Mar', earnings: 2300 },
    { month: 'Apr', earnings: 4000 },
    { month: 'May', earnings: 5000 },
    { month: 'Jun', earnings: 5000 },
  ];

  return (
    <div className="bg-white border rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Performance Overview</h2>
        <button className="text-gray-400 hover:text-gray-600">→</button>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Bar dataKey="earnings" fill="#000000" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}