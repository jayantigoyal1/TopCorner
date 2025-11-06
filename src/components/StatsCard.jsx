import React from 'react';

const StatsCard = ({ title, value, subtitle, icon }) => (
  // Uses the same dark theme styling as the rest of the application
  <div className="bg-slate-800 rounded-xl p-4 flex items-center space-x-3 border border-slate-700 hover:border-blue-500 transition-colors">
    <div className="text-2xl">{icon}</div>
    <div>
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-slate-400 text-xs">{subtitle}</p>
    </div>
  </div>
);

export default StatsCard;
