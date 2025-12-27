import React from 'react';
import { Link } from 'react-router-dom';
import Button, { PRIMARY_BLUE } from '../components/Button';
import StatsCard from '../components/StatsCard';
import MatchCard from '../components/MatchCard';

const mockData = {
  matches: [
    { id: 1, status: 'upcoming', homeTeam: 'Chelsea', awayTeam: 'Arsenal', date: '2025-10-20 15:00', league: 'EPL', userPrediction: 'Chelsea 2-1 Arsenal' },
    { id: 2, status: 'upcoming', homeTeam: 'Man Utd', awayTeam: 'Liverpool', date: '2025-10-21 17:30', league: 'EPL', userPrediction: null },
    { id: 3, status: 'upcoming', homeTeam: 'PSG', awayTeam: 'Monaco', date: '2025-10-22 20:00', league: 'Ligue 1', userPrediction: 'PSG 3-1 Monaco' },
    { id: 4, status: 'finished', homeTeam: 'Real Madrid', awayTeam: 'Barcelona', date: '2025-10-18 20:00', league: 'La Liga', userPrediction: 'Real Madrid 2-2 Barcelona' },
  ],
  leagues: [
    { id: 'L1', name: 'The Premier League Predictors', userRank: 3, members: 45 },
  ],
  friendsActivity: [
    { id: 1, user: 'JaneDoe', action: 'predicted Chelsea 1-1 Arsenal', time: '5 mins ago', points: 0 },
    { id: 2, user: 'AlexF', action: 'won 10 points in the La Liga match', time: '1 hour ago', points: 10 },
    { id: 3, user: 'Sam_G', action: 'joined The Championship League', time: '2 hours ago', points: 0 },
  ]
};

const Dashboard = ({ currentUser }) => {
  const user = currentUser || {
    name: 'Guest Predictor',
    points: 1250,
    accuracy: 65,
    rank: 1204,
    totalPredictions: 78
  };

  const upcomingMatches = mockData.matches.filter(match => match.status === 'upcoming').slice(0, 3);
  const mainLeague = mockData.leagues[0];
  const recentActivity = mockData.friendsActivity.slice(0, 4);

  return (
    // REMOVED bg-slate-900. Added pb-8 for spacing at bottom.
    <div className="py-8 font-['Inter',_sans-serif]"> 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-slate-900 dark:text-white">
            Welcome back, {user?.name || 'User'}! ⚽
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Ready to make some winning predictions?
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* My Main League Card */}
          <div className="lg:col-span-1">
            <div className={`rounded-xl p-6 border transition-colors bg-white border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:shadow-none hover:border-blue-500`}>
              <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2 text-slate-900 dark:text-white">
                <span className="text-yellow-500">🏆</span> <span>My Main League</span>
              </h2>
              <div className="space-y-3">
                <h3 className={`text-lg font-medium ${PRIMARY_BLUE}`}>{mainLeague.name}</h3>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Your Rank:</span>
                  <span className="font-medium text-slate-900 dark:text-white">#{mainLeague.userRank}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Members:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{mainLeague.members}</span>
                </div>
                <Link to={`/leagues/${mainLeague.id}`}>
                  <Button variant="primary" size="sm" className="w-full mt-4">View League</Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2 text-slate-900 dark:text-white">
              <span className="text-indigo-500 dark:text-indigo-400">📊</span> <span>Your Stats Summary</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatsCard title="Total Points" value={user?.points} subtitle="Current season" icon="🎯" trend="up" />
              <StatsCard title="Accuracy" value={`${user?.accuracy}%`} subtitle="Prediction rate" icon="📈" trend="up" />
              <StatsCard title="Global Rank" value={`#${user?.rank}`} subtitle="Worldwide" icon="🌍" trend="down" />
              <StatsCard title="Predictions" value={user?.totalPredictions} subtitle="This season" icon="⚽" trend="flat" />
            </div>
          </div>
        </div>

        {/* Upcoming Matches & Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold flex items-center space-x-2 text-slate-900 dark:text-white">
                <span className="text-purple-500 dark:text-purple-400">🔮</span> <span>Upcoming Matches</span>
              </h2>
              <Link to="/schedule">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
            <div className="space-y-4">
              {upcomingMatches.map((match) => (
                <MatchCard key={match.id} match={match} showPrediction={true} />
              ))}
              {upcomingMatches.length === 0 && (
                <p className="p-4 rounded-xl text-center bg-white text-slate-500 dark:bg-slate-800 dark:text-slate-400">No upcoming matches!</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2 text-slate-900 dark:text-white">
              <span className="text-teal-500 dark:text-teal-400">👥</span> <span>Friends Activity</span>
            </h2>
            <div className="rounded-xl border p-6 bg-white border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:shadow-none">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-medium text-white flex-shrink-0">
                      {activity.user.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate text-slate-900 dark:text-white">
                        <span className="font-medium">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{activity.time}</p>
                    </div>
                    {activity.points > 0 && <div className="text-sm font-medium text-green-600 dark:text-green-400">+{activity.points} pts</div>}
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                <Link to="/leagues">
                  <Button variant="outline" size="sm" className="w-full">View All Activity</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 rounded-xl p-6 border bg-white border-slate-200 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:shadow-none">
          <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/leagues"><Button variant="primary" className="w-full">🏆 Create New League</Button></Link>
            <Link to="/leagues"><Button variant="secondary" className="w-full">🔗 Join League</Button></Link>
            <Link to="/schedule"><Button variant="accent" className="w-full">📅 View Schedule</Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;