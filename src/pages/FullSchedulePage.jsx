import React, { useState, useEffect } from 'react';
import MatchCard from '../components/MatchCard';
import Button from '../components/Button';
import API_BASE_URL from '../config';

const FullSchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState('All'); 

  // 1. Get Logged In User
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchData(selectedDate);
  }, [selectedDate]);

  const fetchData = async (date) => {
    setLoading(true);
    setMatches([]); 

    try {
      // 2. Fetch Schedule AND User Predictions in parallel
      const [scheduleRes, predictionsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/schedule?date=${date}`),
        user ? fetch(`${API_BASE_URL}/api/predictions/${user.id || user._id}`) : Promise.resolve({ json: () => [] })
      ]);

      const scheduleData = await scheduleRes.json();
      const predictionsData = await predictionsRes.json();

      if (Array.isArray(scheduleData)) {
        // 3. The MERGE Logic
        const formatted = scheduleData.map(item => {
          // Check if user has a prediction for this specific match ID
          const myPrediction = Array.isArray(predictionsData) 
            ? predictionsData.find(p => p.matchId === item.fixture.id)
            : null;

          return {
            id: item.fixture.id,
            status: item.fixture.status.short === 'NS' ? 'upcoming' : 
                    ['FT', 'AET', 'PEN'].includes(item.fixture.status.short) ? 'finished' : 'live',
            displayStatus: item.fixture.status.short,
            
            homeTeam: item.teams.home.name,
            homeLogo: item.teams.home.logo,
            awayTeam: item.teams.away.name,
            awayLogo: item.teams.away.logo,
            
            homeScore: item.goals.home ?? 0,
            awayScore: item.goals.away ?? 0,
            date: item.fixture.date,
            league: item.league.name,
            leagueLogo: item.league.logo,
            
            // 4. Inject the prediction result (This makes the card turn green!)
            userPrediction: myPrediction 
              ? `${myPrediction.homeScore} - ${myPrediction.awayScore}` 
              : null
          };
        });
        setMatches(formatted);
      } else {
        setMatches([]);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const changeDate = (days) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const uniqueLeagues = ['All', ...new Set(matches.map(m => m.league))].sort();

  const filteredMatches = selectedLeague === 'All' 
    ? matches 
    : matches.filter(m => m.league === selectedLeague);

  const groupedMatches = filteredMatches.reduce((acc, match) => {
    if (!acc[match.league]) acc[match.league] = [];
    acc[match.league].push(match);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Match Schedule</h1>
        
        {matches.length > 0 && (
          <select 
            value={selectedLeague} 
            onChange={(e) => setSelectedLeague(e.target.value)}
            className="p-2 rounded-lg border border-slate-300 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {uniqueLeagues.map(league => (
              <option key={league} value={league}>{league}</option>
            ))}
          </select>
        )}
      </div>

      <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm mb-8 border border-slate-200 dark:border-slate-700">
        <Button variant="outline" onClick={() => changeDate(-1)}>← Prev Day</Button>
        <div className="text-center">
          <label className="block text-xs text-slate-500 mb-1">Selected Date</label>
          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-slate-100 dark:bg-slate-700 border-none rounded-md px-3 py-1 font-semibold text-slate-900 dark:text-white"
          />
        </div>
        <Button variant="outline" onClick={() => changeDate(1)}>Next Day →</Button>
      </div>

      <div className="space-y-8">
        {loading ? (
           <div className="text-center py-10">
             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
             <p className="text-slate-500">Loading matches...</p>
           </div>
        ) : matches.length > 0 ? (
           Object.keys(groupedMatches).map(leagueName => (
             <div key={leagueName} className="animate-fade-in">
               <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-3 border-l-4 border-blue-500 pl-3">
                 {leagueName}
               </h3>
               <div className="space-y-4">
                 {groupedMatches[leagueName].map(match => (
                   <MatchCard key={match.id} match={match} showPrediction={true} />
                 ))}
               </div>
             </div>
           ))
        ) : (
           <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
             <p className="text-slate-500 dark:text-slate-400">No matches found for this date.</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default FullSchedulePage;