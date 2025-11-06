import React, { useState } from "react";

const FullSchedulePage = () => {
  const [competitionFilter, setCompetitionFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const competitions = ["Premier League", "La Liga", "Bundesliga", "Ligue 1", "Serie A"];

  // Sample matches
  const matches = [
    { home: "Manchester United", away: "Chelsea", competition: "Premier League", date: "2024-10-05", status: "Pending" },
    { home: "Liverpool", away: "Manchester City", competition: "Premier League", date: "2024-10-06", status: "Pending" },
    { home: "Barcelona", away: "Real Madrid", competition: "La Liga", date: "2024-10-07", status: "Pending" },
    { home: "Atletico Madrid", away: "Sevilla", competition: "La Liga", date: "2024-10-08", status: "Pending" },
    { home: "Bayern Munich", away: "Borussia Dortmund", competition: "Bundesliga", date: "2024-10-09", status: "Pending" },
    { home: "PSG", away: "Lyon", competition: "Ligue 1", date: "2024-10-10", status: "Pending" },
    { home: "Juventus", away: "Inter Milan", competition: "Serie A", date: "2024-10-11", status: "Pending" },
    { home: "AC Milan", away: "Napoli", competition: "Serie A", date: "2024-10-12", status: "Pending" },
  ];

  // Filter matches based on competition and search
  const filteredMatches = matches.filter(
    (match) =>
      (competitionFilter === "" || match.competition === competitionFilter) &&
      (match.home.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.away.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="pt-24 px-6 max-w-7xl mx-auto bg-gray-900 min-h-screen text-gray-200">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-100">Full Schedule</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <select
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
          value={competitionFilter}
          onChange={(e) => setCompetitionFilter(e.target.value)}
        >
          <option value="">All Competitions</option>
          {competitions.map((comp) => (
            <option key={comp} value={comp}>{comp}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search teams..."
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Matches Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMatches.length === 0 && (
          <p className="text-gray-400 col-span-full text-center mt-8">No matches found.</p>
        )}

        {filteredMatches.map((match, idx) => (
          <div
            key={idx}
            className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex flex-col gap-2 hover:bg-gray-700 transition"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-100">{match.home}</span>
              <span className="text-gray-400">vs</span>
              <span className="font-semibold text-gray-100">{match.away}</span>
            </div>
            <div className="text-sm text-gray-400 flex justify-between items-center">
              <span>{match.competition}</span>
              <span>{match.date}</span>
            </div>
            <div
              className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                match.status === "Pending"
                  ? "bg-blue-800 text-blue-300"
                  : "bg-green-800 text-green-300"
              }`}
            >
              {match.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FullSchedulePage;
