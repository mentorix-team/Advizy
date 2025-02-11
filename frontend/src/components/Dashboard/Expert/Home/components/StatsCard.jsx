import React from 'react';

export default function StatsCard({ title, value, change, icon }) {
  const isPositive = change > 0;
  
  return (
    <div className="bg-white border p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        {icon}
      </div>
      {change && (
        <p className={`text-sm mt-2 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? '+' : ''}{change}%
        </p>
      )}
    </div>
  );
}