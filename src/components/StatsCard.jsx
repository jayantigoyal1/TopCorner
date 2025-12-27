import React from 'react';

const StatsCard = ({ title, value, subtitle, icon, trend }) => {
  return (
    <div className="
      rounded-xl p-4 border transition-colors
      bg-white border-slate-200 shadow-sm
      dark:bg-slate-800 dark:border-slate-700 dark:shadow-none
      hover:border-blue-500 dark:hover:border-blue-500
    ">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        {trend && (
          <span className={`text-sm font-medium flex items-center space-x-1 ${
            trend === 'up' ? 'text-green-600 dark:text-green-400' : trend === 'down' ? 'text-red-500 dark:text-red-400' : 'text-slate-400'
          }`}>
            {trend === 'up' ? '↗️' : trend === 'down' ? '↘️' : '➡️'}
          </span>
        )}
      </div>
      
      <div className="text-2xl font-bold mb-1 text-slate-800 dark:text-white">{value}</div>
      <div className="text-sm text-slate-500 dark:text-slate-400">{title}</div>
      
      {subtitle && (
        <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtitle}</div>
      )}
    </div>
  );
};

export default StatsCard;