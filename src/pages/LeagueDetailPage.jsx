import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const LeagueDetailPage = () => {
  const { id } = useParams(); // Get League ID from URL
  const [league, setLeague] = useState(null);
  const [members, setMembers] = useState([]);
  const [predictions, setPredictions] = useState([]); // <--- NEW STATE
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("leaderboard");

  // Get Logged In User
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id || user?._id;

  // Fetch League Data & User Predictions
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // 1. Fetch League Details
        const leagueRes = await fetch(`http://localhost:5000/api/leagues/${id}`);
        const leagueData = await leagueRes.json();
        
        if (leagueRes.ok) {
          setLeague(leagueData.league);
          // Sort members by points (Highest first)
          const sortedMembers = leagueData.members.sort((a, b) => b.points - a.points);
          setMembers(sortedMembers);
        } else {
          console.error("League not found");
        }

        // 2. Fetch User Predictions (If logged in)
        if (userId) {
          const predRes = await fetch(`http://localhost:5000/api/predictions/${userId}`);
          const predData = await predRes.json();
          if (predRes.ok) {
            setPredictions(predData);
          }
        }

      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id, userId]);

  if (loading) return <div className="text-center pt-20 text-slate-500">Loading league details...</div>;
  if (!league) return <div className="text-center pt-20 text-red-500">League not found.</div>;

  return (
    <div className="pt-8 px-4 md:px-6 max-w-7xl mx-auto text-slate-900 dark:text-gray-200">
      {/* --- HEADER --- */}
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">{league.name}</h1>
          <p className="text-slate-500 dark:text-gray-400 mt-1">
            {members.length} members • Created by Admin
          </p>
        </div>
        <div className="flex flex-col items-end">
           <span className="text-xs text-slate-500 mb-1">Invite Code</span>
           <div className="bg-teal-100 dark:bg-teal-900/30 px-4 py-2 rounded-lg font-mono text-lg font-bold tracking-widest text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-700 select-all">
             {league.code}
           </div>
        </div>
      </div>

      {/* --- TABS --- */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-gray-700 mb-6 overflow-x-auto">
        {["leaderboard", "members", "my predictions"].map((tab) => (
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

      {/* --- CONTENT --- */}
      <div>
        {/* TAB: LEADERBOARD */}
        {activeTab === "leaderboard" && (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Table Card */}
            <div className="md:col-span-2 rounded-xl overflow-hidden border shadow-sm bg-white border-slate-200 dark:bg-gray-800 dark:border-gray-700">
              <div className="px-6 py-4 font-semibold text-lg bg-slate-50 dark:bg-gray-750 border-b border-slate-200 dark:border-gray-700 flex justify-between items-center">
                <span>🏆 Standings</span>
                <span className="text-xs font-normal text-slate-500">Updated Live</span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-gray-700">
                  <thead className="bg-slate-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-gray-300 uppercase tracking-wider">Rank</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-gray-300 uppercase tracking-wider">Player</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-gray-300 uppercase tracking-wider">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-gray-700">
                    {members.map((member, index) => (
                      <tr key={member._id} className="hover:bg-slate-50 dark:hover:bg-gray-700/50 transition">
                        <td className="px-4 py-4 whitespace-nowrap font-medium text-slate-500 dark:text-gray-400">
                           #{index + 1}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap font-semibold text-slate-900 dark:text-white">
                           {member.fullName}
                           {index === 0 && " 👑"}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap font-bold text-teal-600 dark:text-teal-400">
                           {member.points} pts
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
                
                {/* 1. ADMIN ACTION: SYNC SCORES */}
                <div className="bg-slate-900 text-white p-4 rounded-xl shadow-lg border border-slate-700">
                    <h3 className="font-bold text-sm mb-2">⚙️ Admin Zone</h3>
                    <button 
                        onClick={async () => {
                            const btn = document.getElementById('sync-btn');
                            btn.innerText = "Processing...";
                            await fetch('http://localhost:5000/api/calc-points', { method: 'POST' });
                            alert("Scores Updated! Refreshing page...");
                            window.location.reload();
                        }}
                        id="sync-btn"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-lg text-xs transition"
                    >
                        🔄 Sync & Calculate Points
                    </button>
                    <p className="text-[10px] text-slate-400 mt-2 text-center">Click this after matches finish to update leaderboard.</p>
                </div>

                {/* 2. LEAGUE DETAILS */}
                <div className="rounded-xl p-6 border shadow-sm bg-white border-slate-200 dark:bg-gray-800 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">League Details</h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-500 dark:text-gray-400">Total Members</span>
                            <span className="font-medium">{members.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500 dark:text-gray-400">Status</span>
                            <span className="font-medium text-green-600">Active</span>
                        </div>
                    </div>
                </div>

                {/* 3. SCORING RULES (New!) */}
                <div className="rounded-xl p-6 border shadow-sm bg-white border-slate-200 dark:bg-gray-800 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">📜 Point System</h2>
                    <ul className="space-y-3 text-sm">
                        <li className="flex justify-between items-center">
                            <span className="flex items-center gap-2">🎯 <span className="text-slate-600 dark:text-gray-300">Exact Score</span></span>
                            <span className="font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded">+50 pts</span>
                        </li>
                        <li className="flex justify-between items-center">
                            <span className="flex items-center gap-2">✅ <span className="text-slate-600 dark:text-gray-300">Correct Result</span></span>
                            <span className="font-bold text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded">+20 pts</span>
                        </li>
                        <li className="flex justify-between items-center">
                            <span className="flex items-center gap-2">⚠️ <span className="text-slate-600 dark:text-gray-300">Wrong Result</span></span>
                            <span className="font-bold text-red-600 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded">-5 pts</span>
                        </li>
                    </ul>
                    <p className="text-xs text-slate-400 mt-4 italic">
                        *Points are updated automatically when the Admin syncs the match data.
                    </p>
                </div>

                {/* 4. INVITE CARD */}
                <div className="rounded-xl p-6 bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-lg">
                    <h3 className="font-bold text-lg mb-2">Invite Friends!</h3>
                    <p className="text-teal-100 text-sm mb-4">Share code to add rivals.</p>
                    <div className="bg-white/20 p-2 rounded text-center font-mono font-bold select-all cursor-pointer">
                        {league.code}
                    </div>
                </div>
            </div>
          </div>
        )}

        {/* TAB: MEMBERS LIST */}
        {activeTab === "members" && (
          <div className="grid md:grid-cols-3 gap-4">
            {members.map((member) => (
              <div key={member._id} className="rounded-xl p-4 flex items-center gap-4 shadow-sm bg-white border border-slate-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                    {member.fullName.charAt(0)}
                </div>
                <div>
                    <p className="font-medium text-slate-900 dark:text-white">{member.fullName}</p>
                    <p className="text-xs text-slate-500">{member.points} points</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB: MY PREDICTIONS (Updated!) */}
        {activeTab === "my predictions" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-xl border border-slate-200 dark:border-gray-700">
               <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">My Prediction History</h3>
                  <p className="text-slate-500 text-sm">Predictions made for global matches count towards this league.</p>
               </div>
               <Link to="/schedule">
                <button className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-lg transition text-sm">
                    + Predict More Matches
                </button>
              </Link>
            </div>

            {predictions.length > 0 ? (
               <div className="grid md:grid-cols-2 gap-4">
                  {predictions.map((pred) => (
                    <div key={pred._id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-slate-200 dark:border-gray-700 flex justify-between items-center shadow-sm">
                       <div className="flex-1 text-right">
                          <span className="font-bold text-slate-800 dark:text-white text-lg">{pred.homeTeam}</span>
                       </div>
                       
                       <div className="mx-4 text-center">
                          <div className="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-md font-mono text-xl font-bold text-teal-600 dark:text-teal-400">
                             {pred.homeScore} - {pred.awayScore}
                          </div>
                          <div className="text-[10px] uppercase text-slate-400 mt-1 font-semibold">{pred.status}</div>
                       </div>
                       
                       <div className="flex-1 text-left">
                          <span className="font-bold text-slate-800 dark:text-white text-lg">{pred.awayTeam}</span>
                       </div>
                    </div>
                  ))}
               </div>
            ) : (
               <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                  <p className="text-slate-500 dark:text-slate-400">You haven't made any predictions yet.</p>
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeagueDetailPage;