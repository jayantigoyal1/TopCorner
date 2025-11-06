import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// --- Theme Constant ---
const PRIMARY_BLUE = "text-blue-500";

// --- Mocked Data (Simulating an external import like from '../App') ---
const mockData = {
  matches: [
    { id: 1, status: 'upcoming', homeTeam: 'Chelsea', awayTeam: 'Arsenal', date: '2025-10-20 15:00', league: 'EPL', userPrediction: 'Chelsea 2-1 Arsenal' },
    { id: 2, status: 'upcoming', homeTeam: 'Man Utd', awayTeam: 'Liverpool', date: '2025-10-21 17:30', league: 'EPL', userPrediction: null }, // Needs prediction
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

// ===========================================
// --- 1. Component: Button (Simulating import from '../components/Button') ---
// ===========================================
const Button = ({ children, variant, size, className, ...props }) => {
  let baseStyles = "font-medium rounded-full transition duration-150 ease-in-out shadow-md";
  let variantStyles = "";
  let sizeStyles = "";

  switch (variant) {
    case 'primary':
      variantStyles = "bg-blue-600 text-white hover:bg-blue-700";
      break;
    case 'secondary':
      variantStyles = "bg-purple-600 text-white hover:bg-purple-700";
      break;
    case 'accent':
      variantStyles = "bg-yellow-500 text-slate-900 hover:bg-yellow-600";
      break;
    case 'outline':
      variantStyles = "bg-transparent border border-slate-600 text-slate-300 hover:bg-slate-700";
      break;
    default:
      variantStyles = "bg-blue-600 text-white hover:bg-blue-700";
  }

  switch (size) {
    case 'sm':
      sizeStyles = "px-3 py-1.5 text-sm";
      break;
    case 'xs':
      sizeStyles = "px-2 py-1 text-xs";
      break;
    default:
      sizeStyles = "px-5 py-2.5";
  }

  return (
    <button className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`} {...props}>
      {children}
    </button>
  );
};


// ===========================================
// --- 2. Component: StatsCard (Simulating import from '../components/StatsCard') ---
//    Uses the version with the 'trend' prop.
// ===========================================
const StatsCard = ({ title, value, subtitle, icon, trend }) => {
  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-blue-500 transition-colors">
      <div className="flex items-center justify-between mb-2">
        {/* Icon */}
        <span className="text-2xl">{icon}</span>
        
        {/* Trend Indicator */}
        {trend && (
          <span className={`text-sm font-medium flex items-center space-x-1 ${
            trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400'
          }`}>
            {trend === 'up' ? '↗️' : trend === 'down' ? '↘️' : '➡️'}
          </span>
        )}
      </div>
      
      {/* Value */}
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      
      {/* Title (e.g., Total Points) */}
      <div className="text-sm text-slate-400">{title}</div>
      
      {/* Subtitle (e.g., Current season) */}
      {subtitle && (
        <div className="text-xs text-slate-500 mt-1">{subtitle}</div>
      )}
    </div>
  );
};


// ===========================================
// --- 3. Component: MatchCard (Simulating import from '../components/MatchCard') ---
//    Includes the inline prediction form logic.
// ===========================================
const MatchCard = ({ match, showPrediction }) => {
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [isPredicted, setIsPredicted] = useState(!!match.userPrediction);
  const [predictionResult, setPredictionResult] = useState(match.userPrediction);

  const handlePredict = (e) => {
    e.preventDefault();
    const newPrediction = `${homeScore} - ${awayScore}`;
    console.log(`Prediction submitted for ${match.homeTeam} vs ${match.awayTeam}: ${newPrediction}`);
    setPredictionResult(newPrediction);
    setIsPredicted(true);
  };

  const scoreForm = (
    <form onSubmit={handlePredict} className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3">
      {/* Home Score Input */}
      <input 
        type="number" 
        value={homeScore}
        onChange={(e) => setHomeScore(Math.max(0, parseInt(e.target.value) || 0))}
        min="0"
        className="w-full sm:w-16 h-10 p-2 text-center bg-slate-700 text-white rounded-lg border border-slate-600 focus:ring-blue-500 focus:border-blue-500 focus:outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        aria-label="Home team score"
      />
      
      <span className="text-slate-400 font-medium text-lg hidden sm:block">-</span>

      {/* Away Score Input */}
      <input 
        type="number" 
        value={awayScore}
        onChange={(e) => setAwayScore(Math.max(0, parseInt(e.target.value) || 0))}
        min="0"
        className="w-full sm:w-16 h-10 p-2 text-center bg-slate-700 text-white rounded-lg border border-slate-600 focus:ring-blue-500 focus:border-blue-500 focus:outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        aria-label="Away team score"
      />
      
      <Button 
        variant="accent" 
        size="sm" 
        type="submit"
        className="w-full sm:w-auto mt-2 sm:mt-0"
      >
        Predict
      </Button>
    </form>
  );

  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-blue-500 transition-shadow duration-300">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-slate-400 font-medium">{new Date(match.date).toLocaleString()}</span>
        <span className={`text-xs ${PRIMARY_BLUE} bg-slate-700 px-2 py-0.5 rounded-full`}>{match.league}</span>
      </div>
      <div className="flex justify-between items-center mb-3">
        <div className="text-white text-lg font-semibold truncate">{match.homeTeam}</div>
        <div className="text-slate-400 font-medium mx-3">vs</div>
        <div className="text-white text-lg font-semibold truncate">{match.awayTeam}</div>
      </div>
      
      {/* Prediction UI based on status and prediction state */}
      {match.status === 'upcoming' && showPrediction && (
        <div className="mt-3 pt-3 border-t border-slate-700">
          {isPredicted ? (
            <p className="text-sm text-green-400 text-center">Your Prediction: <span className="font-semibold">{predictionResult}</span></p>
          ) : (
            scoreForm
          )}
        </div>
      )}
      {/* Display final score for finished matches (mocked) */}
      {match.status === 'finished' && (
         <div className="mt-3 pt-3 border-t border-slate-700 text-center">
           <p className="text-sm text-red-400">Final Score: <span className="font-semibold">2 - 1</span></p>
         </div>
      )}
    </div>
  );
};


// ===========================================
// --- 4. Main Dashboard Component ---
// ===========================================

const Dashboard = ({ currentUser }) => {
  // Use a default user object for the demo if currentUser is null
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
    <div className="min-h-screen bg-slate-900 py-8 font-['Inter',_sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Welcome back, {user?.name || 'User'}! ⚽
          </h1>
          <p className="text-slate-400 text-lg">
            Ready to make some winning predictions?
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* My Main League Card */}
          <div className="lg:col-span-1">
            <div className={`bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-blue-500 transition-colors`}>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <span className="text-yellow-500">🏆</span> My Main League
              </h2>
              <div className="space-y-3">
                <h3 className={`text-lg font-medium ${PRIMARY_BLUE}`}>{mainLeague.name}</h3>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Your Rank:</span>
                  <span className="text-white font-medium">#{mainLeague.userRank}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Members:</span>
                  <span className="text-white font-medium">{mainLeague.members}</span>
                </div>
                <Link to={`/leagues/${mainLeague.id}`}>
                  <Button variant="primary" size="sm" className="w-full mt-4">
                    View League
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <span className="text-indigo-400">📊</span> Your Stats Summary
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatsCard
                title="Total Points"
                value={user?.points || 0}
                subtitle="Current season"
                icon="🎯"
                trend="up" // Using the new trend prop
              />
              <StatsCard
                title="Accuracy"
                value={`${user?.accuracy || 0}%`}
                subtitle="Prediction rate"
                icon="📈"
                trend="up" // Using the new trend prop
              />
              <StatsCard
                title="Global Rank"
                value={`#${user?.rank || 0}`}
                subtitle="Worldwide"
                icon="🌍"
                trend="down" // Using the new trend prop
              />
              <StatsCard
                title="Predictions"
                value={user?.totalPredictions || 0}
                subtitle="This season"
                icon="⚽"
                trend="flat" // Using the new trend prop
              />
            </div>
          </div>
        </div>

        {/* Upcoming Matches Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                <span className="text-purple-400">🔮</span> Upcoming Matches
              </h2>
              <Link to="/schedule">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {upcomingMatches.map((match) => (
                // This MatchCard is now fully functional with the inline prediction form
                <MatchCard key={match.id} match={match} showPrediction={true} />
              ))}
              {upcomingMatches.length === 0 && (
                <p className="text-slate-400 p-4 bg-slate-800 rounded-xl text-center">No upcoming matches to predict!</p>
              )}
            </div>
          </div>

          {/* Friends Activity Feed */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
              <span className="text-teal-400">👥</span> Friends Activity
            </h2>
            <div className="bg-slate-800 rounded-xl border border-slate-700">
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-700 transition-colors">
                      {/* Avatar initial */}
                      <div className={`w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-medium text-white flex-shrink-0`}>
                        {activity.user.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm truncate">
                          <span className="font-medium">{activity.user}</span> {activity.action}
                        </p>
                        <p className="text-slate-400 text-xs">{activity.time}</p>
                      </div>
                      {activity.points > 0 && (
                        <div className="text-green-400 text-sm font-medium flex-shrink-0">
                          +{activity.points} pts
                        </div>
                      )}
                    </div>
                  ))}
                  {recentActivity.length === 0 && (
                    <p className="text-slate-400 text-center py-4">No recent activity from friends.</p>
                  )}
                </div>
                <div className="mt-6 pt-4 border-t border-slate-700">
                  <Link to="/leagues">
                    <Button variant="outline" size="sm" className="w-full">
                      View All Activity
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/leagues">
              <Button variant="primary" className="w-full">
                🏆 Create New League
              </Button>
            </Link>
            <Link to="/leagues">
              <Button variant="secondary" className="w-full">
                🔗 Join League
              </Button>
            </Link>
            <Link to="/schedule">
              <Button variant="accent" className="w-full">
                📅 View Schedule
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
