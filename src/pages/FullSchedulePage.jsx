import React, { useState, useEffect } from 'react';
import MatchCard from '../components/MatchCard';
import Button from '../components/Button';
import API_BASE_URL from '../config';

const FullSchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState('All');

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchData(selectedDate);
    // eslint-disable-next-line
  }, [selectedDate]);

  const fetchData = async (date) => {
    setLoading(true);
    setMatches([]);

    try {
      const [scheduleRes, predictionsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/schedule?date=${date}`),
        user
          ? fetch(`${API_BASE_URL}/api/predictions/${user.id || user._id}`)
          : Promise.resolve({ json: () => [] })
      ]);

      const scheduleData = await scheduleRes.json();
      const predictionsData = await predictionsRes.json();

      if (!Array.isArray(scheduleData)) {
        setMatches([]);
        return;
      }

      const formatted = scheduleData.map(item => {
        const myPrediction = Array.isArray(predictionsData)
          ? predictionsData.find(p => Number(p.matchId) === item.id)
          : null;

        let status = 'upcoming';
        if (item.status === 'FINISHED') status = 'finished';
        else if (item.status === 'LIVE') status = 'live';

        return {
          id: item.id,
          status,
          displayStatus: item.status,

          homeTeam: item.homeTeam.name,
          homeLogo: item.homeTeam.crest,
          awayTeam: item.awayTeam.name,
          awayLogo: item.awayTeam.crest,

          homeScore: item.score?.fullTime?.home ?? 0,
          awayScore: item.score?.fullTime?.away ?? 0,

          date: item.utcDate,
          league: item.competition.name,
          leagueLogo: item.competition.emblem,

          userPrediction: myPrediction
            ? `${myPrediction.homeScore} - ${myPrediction.awayScore}`
            : null
        };
      });

      setMatches(formatted);
    } catch (error) {
      console.error("Schedule fetch failed:", error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const changeDate = (days) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  // ⭐ Priority leagues
  const priorityLeagues = [
    "UEFA Champions League",
    "Premier League",
    "La Liga",
    "Bundesliga",
    "Serie A",
    "Ligue 1",
    "UEFA Europa League",
    "Major League Soccer",
    "Saudi Pro League",
    "Brasileirão Série A",
    "Eredivisie"
  ];

  const sortLeagues = (a, b) => {
    if (a === 'All') return -1;
    if (b === 'All') return 1;

    const indexA = priorityLeagues.indexOf(a);
    const indexB = priorityLeagues.indexOf(b);

    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;

    return a.localeCompare(b);
  };

  const uniqueLeagues = ['All', ...new Set(matches.map(m => m.league))].sort(sortLeagues);

  const filteredMatches =
    selectedLeague === 'All'
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
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Match Schedule
        </h1>

        {matches.length > 0 && (
          <select
            value={selectedLeague}
            onChange={(e) => setSelectedLeague(e.target.value)}
            className="p-2 rounded-lg border border-slate-300 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none max-w-[220px]"
          >
            {uniqueLeagues.map(league => (
              <option key={league} value={league}>
                {priorityLeagues.includes(league) ? `★ ${league}` : league}
              </option>
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
            className="bg-slate-100 dark:bg-slate-700 rounded-md px-3 py-1 font-semibold text-slate-900 dark:text-white"
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
          Object.keys(groupedMatches).sort(sortLeagues).map(leagueName => (
            <div key={leagueName}>
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-3 border-l-4 border-blue-500 pl-3 flex items-center gap-2">
                {leagueName}
                {priorityLeagues.includes(leagueName) && (
                  <span className="text-yellow-500 text-sm">★</span>
                )}
              </h3>

              <div className="space-y-4">
                {groupedMatches[leagueName].map(match => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    showPrediction={true}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400">
              No matches found for this date.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FullSchedulePage;
