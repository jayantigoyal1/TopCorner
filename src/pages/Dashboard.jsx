import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button, { PRIMARY_BLUE } from '../components/Button';
import StatsCard from '../components/StatsCard';
import MatchCard from '../components/MatchCard';
import API_BASE_URL from '../config';

const Dashboard = () => {
  // State
  const [user, setUser] = useState(null);
  const [matches, setMatches] = useState([]);
  const [leagues, setLeagues] = useState([]); 
  const [featuredLeagues, setFeaturedLeagues] = useState([]);
  const [activity, setActivity] = useState([]); 
  const [stats, setStats] = useState({ rank: '--', totalPredictions: 0, accuracy: 0, points: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // Fire Data Fetches
      fetchLiveMatches();
      fetchUserLeagues(parsedUser.id || parsedUser._id);
      fetchFeaturedLeagues();
      fetchActivity(parsedUser.id || parsedUser._id);
      fetchUserStats(parsedUser.id || parsedUser._id);
    } else {
      setLoading(false); 
    }
  }, []);

  // --- API CALLS ---
  const fetchLiveMatches = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/matches`);
      const data = await response.json();
      if (!data || !Array.isArray(data)) { setMatches([]); return; }

      const formatted = data.map(item => {
        const apiStatus = item.fixture.status.short;
        let appStatus = 'upcoming';
        if (['1H', 'HT', '2H', 'ET', 'P', 'LIVE'].includes(apiStatus)) appStatus = 'live';
        else if (['FT', 'AET', 'PEN'].includes(apiStatus)) appStatus = 'finished';
        
        return {
          id: item.fixture.id,
          status: appStatus, 
          displayStatus: apiStatus, 
          homeTeam: item.teams.home.name,
          homeLogo: item.teams.home.logo,
          awayTeam: item.teams.away.name,
          awayLogo: item.teams.away.logo,
          homeScore: item.goals.home ?? 0,
          awayScore: item.goals.away ?? 0,
          date: item.fixture.date,
          league: item.league.name,
          userPrediction: null 
        };
      });
      setMatches(formatted);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const fetchUserLeagues = async (userId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/leagues/user/${userId}`);
      const data = await res.json();
      if (Array.isArray(data)) setLeagues(data);
    } catch (err) { console.error(err); }
  };

  const fetchFeaturedLeagues = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/leagues/featured`);
      const data = await res.json();
      if (Array.isArray(data)) setFeaturedLeagues(data);
    } catch (err) { console.error(err); }
  };

  const fetchActivity = async (userId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/activity/${userId}`);
      const data = await res.json();
      if (Array.isArray(data)) setActivity(data);
    } catch (err) { console.error(err); }
  };

  const fetchUserStats = async (userId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${userId}/stats`);
      const data = await res.json();
      if (res.ok) setStats(data);
    } catch (err) { console.error(err); }
  };

  const timeAgo = (dateString) => {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="py-8 font-['Inter',_sans-serif] min-h-screen"> 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Welcome back, <span className="font-semibold text-teal-500">{user?.fullName || 'Guest'}</span>! 
              {matches.length > 0 ? ` ⚽ ${matches.length} matches live.` : " No live matches."}
            </p>
          </div>
          <Link to="/schedule">
            <Button variant="primary" className="shadow-lg shadow-teal-500/20">
               + Predict New Match
            </Button>
          </Link>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatsCard title="Total Points" value={stats.points || 0} subtitle="Global Ranking: #" icon="🎯" trend="up" />
          <StatsCard title="Accuracy" value={`${stats.accuracy}%`} subtitle="All time" icon="🔥" trend={stats.accuracy > 50 ? "up" : "flat"} />
          <StatsCard title="Predictions" value={stats.totalPredictions} subtitle="Total Guesses" icon="📝" trend="flat" />
          <StatsCard title="Leagues" value={leagues.length} subtitle="Active Competitions" icon="🏆" trend="flat" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- LEFT COLUMN (Featured & Activity) --- */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* FEATURED LEAGUES (Replaces generic image) */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="text-yellow-500">🌟</span> Featured Leagues
                    </h2>
                    <Link to="/leagues" className="text-sm text-teal-500 hover:text-teal-600 font-medium">View All →</Link>
                </div>
                
                {featuredLeagues.length > 0 ? (
                    <div className="grid md:grid-cols-3 gap-4">
                        {featuredLeagues.map((league, idx) => (
                            <div key={league._id} className={`p-4 rounded-xl border border-slate-100 dark:border-slate-700 flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-md transition-all cursor-pointer bg-gradient-to-br ${idx === 0 ? 'from-purple-500 to-indigo-600 text-white' : idx === 1 ? 'from-blue-500 to-cyan-500 text-white' : 'from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 dark:text-white'}`}>
                                <div className="relative z-10">
                                    <h3 className="font-bold truncate">{league.name}</h3>
                                    <p className={`text-xs ${idx < 2 ? 'text-white/80' : 'text-slate-500 dark:text-slate-300'}`}>{league.memberCount} Members</p>
                                </div>
                                <div className="relative z-10 mt-auto">
                                    <span className={`text-xs font-mono px-2 py-1 rounded ${idx < 2 ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-500'}`}>
                                        Code: {league.code}
                                    </span>
                                </div>
                                {/* Decorative Icon */}
                                <div className="absolute -bottom-4 -right-4 text-6xl opacity-10 rotate-12">🏆</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-600">
                        <p className="text-slate-500 dark:text-slate-400">No leagues created yet. Be the first!</p>
                        <Link to="/leagues">
                            <button className="mt-2 text-sm font-bold text-teal-600 hover:underline">Create a League</button>
                        </Link>
                    </div>
                )}
            </div>

            {/* LIVE MATCHES */}
            <div>
               <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="text-red-500 animate-pulse">●</span> Live Action
                  </h2>
                  <button onClick={fetchLiveMatches} className="text-sm text-slate-500 hover:text-teal-500">↻ Refresh</button>
               </div>
               <div className="space-y-4">
                  {!loading && matches.length === 0 && (
                    <div className="p-8 rounded-2xl text-center bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                      <p className="text-slate-500 dark:text-slate-400 mb-4">No matches live right now.</p>
                      <Link to="/schedule">
                        <Button variant="outline">Check Full Schedule</Button>
                      </Link>
                    </div>
                  )}
                  {matches.map((match) => (
                    <MatchCard key={match.id} match={match} showPrediction={true} />
                  ))}
               </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN (Activity) --- */}
          <div className="space-y-8">
             {/* FRIENDS ACTIVITY */}
             <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                   <span>👥</span> Activity Feed
                </h2>
                <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-700">
                    {activity.length === 0 ? (
                        <p className="text-sm text-slate-500 pl-8">No recent activity.</p>
                    ) : (
                        activity.map((act) => (
                            <div key={act.id} className="relative pl-8 animate-fade-in">
                                <div className="absolute left-2 top-1.5 w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-600 border-2 border-white dark:border-slate-800"></div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-slate-900 dark:text-white">
                                            <span className="font-bold">{act.user}</span> {act.action.replace(act.user, '')}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">{timeAgo(act.time)}</p>
                                    </div>
                                    {act.points > 0 && (
                                        <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
                                            +{act.points}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
             </div>

             {/* QUICK TIPS CARD */}
             <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-teal-500/20">
                <h3 className="font-bold text-lg mb-2">💡 Pro Tip</h3>
                <p className="text-teal-100 text-sm mb-4">
                    Exact score predictions earn you <span className="font-bold text-white">50 points</span>. Risky, but worth it!
                </p>
                <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white/60 w-3/4"></div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;