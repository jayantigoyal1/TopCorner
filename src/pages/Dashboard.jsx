import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button, { PRIMARY_BLUE } from '../components/Button';
import StatsCard from '../components/StatsCard';
import MatchCard from '../components/MatchCard';

const Dashboard = () => {
  // 1. Get User from Local Storage (Logged in state)
  const [user, setUser] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load User
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Load Real Matches
    fetchLiveMatches();
  }, []);

  const fetchLiveMatches = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/matches');
      const data = await response.json();

      // Check if the API returned an error or empty array
      if (!data || !Array.isArray(data)) {
         console.error("API returned invalid data:", data);
         setMatches([]);
         setLoading(false);
         return;
      }

      const formattedMatches = data.map(item => {
        // --- STATUS TRANSLATION LOGIC ---
        const apiStatus = item.fixture.status.short; // e.g., 'NS', '1H', 'FT'
        let appStatus = 'upcoming'; // Default

        // If game is live (1st Half, 2nd Half, Halftime, Extra Time, Penalties)
        if (['1H', 'HT', '2H', 'ET', 'P', 'LIVE'].includes(apiStatus)) {
          appStatus = 'live';
        } 
        // If game is finished
        else if (['FT', 'AET', 'PEN'].includes(apiStatus)) {
          appStatus = 'finished';
        }
        
        return {
          id: item.fixture.id,
          status: appStatus, 
          displayStatus: apiStatus, 
          
          // --- TEAM INFO (Fixed to include logos) ---
          homeTeam: item.teams.home.name,
          homeLogo: item.teams.home.logo, // <--- ADDED THIS
          
          awayTeam: item.teams.away.name,
          awayLogo: item.teams.away.logo, // <--- ADDED THIS

          homeScore: item.goals.home ?? 0,
          awayScore: item.goals.away ?? 0,
          date: item.fixture.date,
          league: item.league.name,
          userPrediction: null 
        };
      });

      setMatches(formattedMatches);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching matches:", err);
      setError("Failed to load live scores.");
      setLoading(false);
    }
  };

  // Mock data for things we haven't built APIs for yet (Leagues/Activity)
  const mainLeague = { id: 'L1', name: 'The Premier League Predictors', userRank: 3, members: 45 };
  const recentActivity = [
    { id: 1, user: 'JaneDoe', action: 'predicted Chelsea 1-1 Arsenal', time: '5 mins ago', points: 0 },
    { id: 2, user: 'AlexF', action: 'won 10 points in the La Liga match', time: '1 hour ago', points: 10 },
  ];

  return (
    <div className="py-8 font-['Inter',_sans-serif]"> 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-slate-900 dark:text-white">
            Welcome back, {user?.fullName || 'Guest'}! ⚽
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {matches.length > 0 ? `There are ${matches.length} matches happening right now!` : "No live matches at the moment."}
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
              <StatsCard title="Total Points" value={user?.points || 0} subtitle="Current season" icon="🎯" trend="up" />
              <StatsCard title="Accuracy" value="0%" subtitle="Prediction rate" icon="📈" trend="flat" />
              <StatsCard title="Global Rank" value="#--" subtitle="Worldwide" icon="🌍" trend="flat" />
              <StatsCard title="Predictions" value="0" subtitle="This season" icon="⚽" trend="flat" />
            </div>
          </div>
        </div>

        {/* Live Matches Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold flex items-center space-x-2 text-slate-900 dark:text-white">
                <span className="text-red-500 animate-pulse">●</span> <span>Live Action</span>
              </h2>
              <button onClick={fetchLiveMatches} className="text-sm text-blue-500 hover:underline">
                Refresh
              </button>
            </div>
            
            <div className="space-y-4">
              {loading && <p className="text-slate-500 dark:text-slate-400">Loading live scores...</p>}
              
              {!loading && matches.length === 0 && (
                <div className="p-6 rounded-xl text-center bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                  <p className="text-slate-500 dark:text-slate-400 mb-2">No matches are live right now.</p>
                  <Link to="/schedule">
                    <Button variant="outline" size="sm">Check Schedule</Button>
                  </Link>
                </div>
              )}

              {matches.map((match) => (
                <MatchCard key={match.id} match={match} showPrediction={true} />
              ))}
            </div>
          </div>

          {/* Activity Feed */}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;