import React, { useState } from "react";

const LeagueDetailPage = () => {
  const [activeTab, setActiveTab] = useState("leaderboard");

  const leagueInfo = { name: "Premier League Pros", members: 24, createdBy: "You", code: "PLP2024", privacy: "Private", created: "Sept 1, 2024" };
  const leaderboard = [
    { rank: 1, player: "Alice Johnson", points: 1500, accuracy: "72%", trend: "⬆️" },
    { rank: 2, player: "Bob Smith", points: 1450, accuracy: "70%", trend: "⬇️" },
    { rank: 3, player: "Charlie Lee", points: 1400, accuracy: "69%", trend: "⬆️" },
  ];
  const matches = [
    { home: "Man Utd", away: "Chelsea", date: "2024-10-05", status: "Pending" },
    { home: "Liverpool", away: "Man City", date: "2024-10-07", status: "Pending" },
  ];
  const members = [{ name: "Alice Johnson", role: "Member" }, { name: "You", role: "Admin" }]; // shortened for brevity

  return (
    <div className="pt-8 px-0 md:px-6 max-w-7xl mx-auto text-slate-900 dark:text-gray-200">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">{leagueInfo.name}</h1>
          <p className="text-slate-500 dark:text-gray-400 mt-1">{leagueInfo.members} members • Created by {leagueInfo.createdBy}</p>
        </div>
        <div className="bg-slate-200 dark:bg-gray-700 px-4 py-2 rounded-lg font-mono text-sm shadow-sm text-slate-800 dark:text-gray-200">
          Code: {leagueInfo.code}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-gray-700 mb-6 overflow-x-auto">
        {["leaderboard", "matches", "members"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-t-lg font-semibold transition whitespace-nowrap ${
              activeTab === tab
                ? "bg-white border-t border-l border-r border-slate-200 text-teal-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                : "text-slate-500 hover:bg-slate-100 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {activeTab === "leaderboard" && (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Table Card */}
            <div className="md:col-span-2 rounded-xl overflow-hidden border shadow-sm bg-white border-slate-200 dark:bg-gray-800 dark:border-gray-700">
              <div className="px-6 py-4 font-semibold text-lg bg-slate-50 dark:bg-gray-750 border-b border-slate-200 dark:border-gray-700">Leaderboard</div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-gray-700">
                  <thead className="bg-slate-50 dark:bg-gray-700">
                    <tr>
                      {["Rank", "Player", "Points", "Accuracy", "Trend"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-sm text-slate-500 dark:text-gray-300 font-medium uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-gray-700">
                    {leaderboard.map((player) => (
                      <tr key={player.rank} className="hover:bg-slate-50 dark:hover:bg-gray-700/50 transition">
                        <td className="px-4 py-3 font-medium">{player.rank}</td>
                        <td className="px-4 py-3">{player.player}</td>
                        <td className="px-4 py-3 font-bold text-slate-700 dark:text-white">{player.points}</td>
                        <td className="px-4 py-3">{player.accuracy}</td>
                        <td className="px-4 py-3">{player.trend}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sidebar */}
            <div className="rounded-xl p-6 flex flex-col gap-4 border shadow-sm bg-white border-slate-200 dark:bg-gray-800 dark:border-gray-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">League Info</h2>
              <div className="text-sm space-y-2 text-slate-600 dark:text-gray-400">
                <p><span className="font-semibold text-slate-900 dark:text-gray-200">Privacy:</span> {leagueInfo.privacy}</p>
                <p><span className="font-semibold text-slate-900 dark:text-gray-200">Created:</span> {leagueInfo.created}</p>
              </div>
              <div className="mt-4 bg-slate-100 dark:bg-gray-700 rounded-lg p-4 text-center text-slate-500 dark:text-gray-400 text-sm">
                📊 Weekly Performance Chart
              </div>
            </div>
          </div>
        )}

        {/* Matches Tab */}
        {activeTab === "matches" && (
          <div className="grid gap-4">
            {matches.map((match, idx) => (
              <div key={idx} className="rounded-xl p-4 flex justify-between items-center transition shadow-sm bg-white border border-slate-200 dark:bg-gray-800 dark:border-gray-700">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{match.home} vs {match.away}</p>
                  <p className="text-sm text-slate-500 dark:text-gray-400">{match.date}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">{match.status}</span>
              </div>
            ))}
          </div>
        )}

        {/* Members Tab */}
        {activeTab === "members" && (
          <div className="grid md:grid-cols-3 gap-4">
            {members.map((member, idx) => (
              <div key={idx} className="rounded-xl p-4 flex justify-between items-center transition shadow-sm bg-white border border-slate-200 dark:bg-gray-800 dark:border-gray-700">
                <span className="font-medium text-slate-900 dark:text-white">{member.name}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${member.role === "Admin" ? "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300" : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"}`}>{member.role}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeagueDetailPage;