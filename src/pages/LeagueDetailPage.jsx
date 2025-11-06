import React, { useState } from "react";

const LeagueDetailPage = () => {
  const [activeTab, setActiveTab] = useState("leaderboard");

  const leagueInfo = {
    name: "Premier League Pros",
    members: 24,
    createdBy: "You",
    code: "PLP2024",
    privacy: "Private",
    created: "Sept 1, 2024",
  };

  // Sample leaderboard
  const leaderboard = [
    { rank: 1, player: "Alice Johnson", points: 1500, accuracy: "72%", trend: "⬆️" },
    { rank: 2, player: "Bob Smith", points: 1450, accuracy: "70%", trend: "⬇️" },
    { rank: 3, player: "Charlie Lee", points: 1400, accuracy: "69%", trend: "⬆️" },
    { rank: 4, player: "David Kim", points: 1350, accuracy: "68%", trend: "⬇️" },
    { rank: 5, player: "Emma Watson", points: 1320, accuracy: "67%", trend: "⬆️" },
  ];

  // Realistic matches
  const matches = [
    { home: "Manchester United", away: "Chelsea", date: "2024-10-05", status: "Pending" },
    { home: "Barcelona", away: "Real Madrid", date: "2024-10-06", status: "Pending" },
    { home: "Liverpool", away: "Manchester City", date: "2024-10-07", status: "Pending" },
    { home: "Bayern Munich", away: "Borussia Dortmund", date: "2024-10-08", status: "Pending" },
    { home: "Juventus", away: "Inter Milan", date: "2024-10-09", status: "Pending" },
    { home: "Paris Saint-Germain", away: "Lyon", date: "2024-10-10", status: "Pending" },
  ];

  // 24 random member names
  const members = [
    { name: "Alice Johnson", role: "Member" },
    { name: "Bob Smith", role: "Member" },
    { name: "Charlie Lee", role: "Member" },
    { name: "David Kim", role: "Member" },
    { name: "Emma Watson", role: "Member" },
    { name: "Frank Miller", role: "Member" },
    { name: "Grace Hopper", role: "Member" },
    { name: "Hannah Brown", role: "Member" },
    { name: "Ian Wright", role: "Member" },
    { name: "Jack Wilson", role: "Member" },
    { name: "Karen Davis", role: "Member" },
    { name: "Leo Messi", role: "Member" },
    { name: "Mia Clark", role: "Member" },
    { name: "Nina Adams", role: "Member" },
    { name: "Oscar Perez", role: "Member" },
    { name: "Paula Green", role: "Member" },
    { name: "Quincy Jones", role: "Member" },
    { name: "Rachel Scott", role: "Member" },
    { name: "Samuel Lewis", role: "Member" },
    { name: "Tina Turner", role: "Member" },
    { name: "Uma Thurman", role: "Member" },
    { name: "Victor Hugo", role: "Member" },
    { name: "William Blake", role: "Member" },
    { name: "You", role: "Admin" },
  ];

  return (
    <div className="pt-24 px-6 max-w-7xl mx-auto bg-gray-900 min-h-screen text-gray-200">
      {/* League Header */}
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-100">{leagueInfo.name}</h1>
          <p className="text-gray-400 mt-1">
            {leagueInfo.members} members • Created by {leagueInfo.createdBy}
          </p>
        </div>
        <div className="bg-gray-700 px-4 py-2 rounded-lg font-mono text-sm shadow-sm">
          League Code: {leagueInfo.code}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-700 mb-6">
        {["leaderboard", "matches", "members"].map((tab) => (
          <button
            key={tab}
            className={`px-6 py-3 rounded-t-lg font-semibold transition ${
              activeTab === tab
                ? "bg-gray-800 border-t border-l border-r border-gray-700"
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {/* Leaderboard Tab */}
        {activeTab === "leaderboard" && (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Leaderboard Table */}
            <div className="md:col-span-2 bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
              <div className="bg-gray-700 px-6 py-4 font-semibold text-lg">Leaderboard</div>
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm text-gray-300">Rank</th>
                    <th className="px-4 py-3 text-left text-sm text-gray-300">Player</th>
                    <th className="px-4 py-3 text-left text-sm text-gray-300">Points</th>
                    <th className="px-4 py-3 text-left text-sm text-gray-300">Accuracy</th>
                    <th className="px-4 py-3 text-left text-sm text-gray-300">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {leaderboard.map((player) => (
                    <tr key={player.rank} className="hover:bg-gray-700 transition">
                      <td className="px-4 py-3 font-medium">{player.rank}</td>
                      <td className="px-4 py-3">{player.player}</td>
                      <td className="px-4 py-3">{player.points}</td>
                      <td className="px-4 py-3">{player.accuracy}</td>
                      <td className="px-4 py-3">{player.trend}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* League Info Sidebar */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 flex flex-col gap-4">
              <h2 className="text-xl font-bold text-gray-100">League Info</h2>
              <div className="text-gray-400 space-y-1">
                <p><span className="font-semibold text-gray-200">Privacy:</span> {leagueInfo.privacy}</p>
                <p><span className="font-semibold text-gray-200">Created:</span> {leagueInfo.created}</p>
              </div>

              {/* Members preview */}
              <div>
                <h3 className="font-semibold text-gray-200 mb-2">Members</h3>
                <div className="flex -space-x-2">
                  {members.slice(0, 5).map((member, idx) => (
                    <div
                      key={idx}
                      className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-100 border border-gray-600"
                      title={member.name}
                    >
                      {member.name.charAt(0)}
                    </div>
                  ))}
                  {members.length > 5 && (
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-100 border border-gray-600">
                      +{members.length - 5}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 bg-gray-700 rounded-lg p-4 text-center text-gray-400">
                📊 Weekly Performance Chart
              </div>
            </div>
          </div>
        )}

        {/* Matches Tab */}
        {activeTab === "matches" && (
          <div className="grid gap-4">
            {matches.map((match, idx) => (
              <div
                key={idx}
                className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex justify-between items-center hover:bg-gray-700 transition"
              >
                <div>
                  <p className="font-semibold text-gray-100">{match.home} vs {match.away}</p>
                  <p className="text-gray-400">{match.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  match.status === "Pending" ? "bg-yellow-800 text-yellow-300" : "bg-green-800 text-green-300"
                }`}>{match.status}</span>
              </div>
            ))}
          </div>
        )}

        {/* Members Tab */}
        {activeTab === "members" && (
          <div className="grid md:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto">
            {members.map((member, idx) => (
              <div
                key={idx}
                className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex justify-between items-center hover:bg-gray-700 transition"
              >
                <span className="font-medium text-gray-100">{member.name}</span>
                <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
                  member.role === "Admin" ? "bg-teal-800 text-teal-300" : "bg-gray-700 text-gray-400"
                }`}>{member.role}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeagueDetailPage;
