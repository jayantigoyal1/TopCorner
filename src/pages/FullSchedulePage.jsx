import React, { useState } from "react";

const FullSchedulePage = () => {
  const [competitionFilter, setCompetitionFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const competitions = ["Premier League", "La Liga", "Bundesliga", "Ligue 1", "Serie A"];
  const matches = [
    { home: "Man Utd", away: "Chelsea", competition: "Premier League", date: "2024-10-05", status: "Pending" },
    { home: "Barcelona", away: "Real Madrid", competition: "La Liga", date: "2024-10-07", status: "Pending" },
  ];

  const filteredMatches = matches.filter(
    (match) =>
      (competitionFilter === "" || match.competition === competitionFilter) &&
      (match.home.toLowerCase().includes(searchTerm.toLowerCase()) || match.away.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Shared input style
  const inputStyle = "bg-white border border-slate-300 text-slate-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100";

  return (
    <div className="pt-8 px-0 md:px-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6 text-slate-900 dark:text-white">Full Schedule</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <select className={inputStyle} value={competitionFilter} onChange={(e) => setCompetitionFilter(e.target.value)}>
          <option value="">All Competitions</option>
          {competitions.map((comp) => <option key={comp} value={comp}>{comp}</option>)}
        </select>
        <input type="text" placeholder="Search teams..." className={`${inputStyle} flex-1`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      {/* Matches Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMatches.length === 0 && <p className="text-slate-500 dark:text-gray-400 col-span-full text-center mt-8">No matches found.</p>}

        {filteredMatches.map((match, idx) => (
          <div key={idx} className="rounded-xl p-5 flex flex-col gap-3 transition shadow-sm border bg-white border-slate-200 hover:border-teal-500 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-teal-500">
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg text-slate-900 dark:text-white">{match.home}</span>
              <span className="text-slate-400 font-medium text-sm">VS</span>
              <span className="font-bold text-lg text-slate-900 dark:text-white">{match.away}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-500 dark:text-gray-400 border-t border-slate-100 dark:border-gray-700 pt-3">
              <span>{match.competition}</span>
              <span>{match.date}</span>
            </div>
            <div className="self-start mt-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              {match.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FullSchedulePage;