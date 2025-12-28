import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import API_BASE_URL from '../config';

const MyLeaguesPage = () => {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  // Form inputs
  const [leagueName, setLeagueName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState(null);

  // Get User from LocalStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id || user?._id;

  // 1. LOAD MY LEAGUES
  useEffect(() => {
    if (userId) fetchLeagues();
  }, [userId]);

  const fetchLeagues = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/leagues/user/${userId}`);
      const data = await res.json();
      setLeagues(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load leagues", err);
      setLoading(false);
    }
  };

  // 2. CREATE NEW LEAGUE
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return alert("Please login first");

    try {
      const res = await fetch('${API_BASE_URL}/api/leagues/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, name: leagueName })
      });
      
      const newLeague = await res.json();
      if (res.ok) {
        setLeagues([...leagues, newLeague]); // Add to list instantly
        setIsCreateModalOpen(false);
        setLeagueName(""); // Reset form
      } else {
        alert("Failed to create league");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 3. JOIN EXISTING LEAGUE
  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch('${API_BASE_URL}/api/leagues/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, code: joinCode.toUpperCase() }) // Force uppercase
      });

      const data = await res.json();
      
      if (res.ok) {
        // Refresh list to show the new league
        fetchLeagues();
        setIsJoinModalOpen(false);
        setJoinCode("");
      } else {
        setError(data.error); // Show error like "Invalid Code"
      }
    } catch (err) {
      setError("Server error. Try again.");
    }
  };

  // Styles
  const inputClass = "w-full rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-100 border border-slate-300 text-slate-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100";
  const modalBase = "fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm";
  const modalContent = "rounded-xl p-6 w-full max-w-md relative bg-white dark:bg-gray-800 text-slate-900 dark:text-gray-100 shadow-2xl";

  if (!user) return <div className="text-center pt-20 text-white">Please login to view leagues.</div>;

  return (
    <div className="pt-8 px-4 md:px-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6 text-slate-900 dark:text-white">My Leagues</h1>

      {/* Action buttons */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <button onClick={() => setIsCreateModalOpen(true)} className="bg-teal-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-teal-600 transition shadow-md">
          + Create New League
        </button>
        <button onClick={() => setIsJoinModalOpen(true)} className="font-semibold px-4 py-2 rounded-lg transition border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
          Join with Code
        </button>
      </div>

      {/* Leagues grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
           <p className="text-slate-500">Loading leagues...</p>
        ) : leagues.length === 0 ? (
           <p className="text-slate-500 col-span-3 text-center py-10 border border-dashed rounded-lg border-slate-600">
             You haven't joined any leagues yet. Create one or ask a friend for a code!
           </p>
        ) : (
           leagues.map((league) => (
            <div key={league._id} className="rounded-xl p-6 flex flex-col gap-4 transition shadow-sm border bg-white border-slate-200 hover:border-teal-500 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-teal-500">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{league.name}</h2>
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  Active
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-gray-400">
                {league.members.length} members • Code: <span className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded text-slate-800 dark:text-white select-all">{league.code}</span>
              </p>

              <Link to={`/leagues/${league._id}`}>
                <button className="w-full mt-2 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 font-semibold px-4 py-2 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/40 transition">
                  View Leaderboard
                </button>
              </Link>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className={modalBase}>
          <div className={modalContent}>
            <button onClick={() => setIsCreateModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl font-bold">&times;</button>
            <h2 className="text-2xl font-bold mb-4">Create New League</h2>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                 <label className="block mb-1 text-sm font-medium">League Name</label>
                 <input type="text" value={leagueName} onChange={(e) => setLeagueName(e.target.value)} required className={inputClass} placeholder="e.g. Office Rivals 2025" />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 text-white font-semibold">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Modal */}
      {isJoinModalOpen && (
        <div className={modalBase}>
          <div className={modalContent}>
            <button onClick={() => setIsJoinModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl font-bold">&times;</button>
            <h2 className="text-2xl font-bold mb-4">Join League</h2>
            <form onSubmit={handleJoinSubmit} className="space-y-4">
              <div>
                 <label className="block mb-1 text-sm font-medium">6-Digit League Code</label>
                 <input type="text" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} maxLength={6} required className={inputClass} placeholder="e.g. XY12AB" />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsJoinModalOpen(false)} className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold">Join</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLeaguesPage;