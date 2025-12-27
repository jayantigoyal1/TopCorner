import React, { useState } from "react";

const MyLeaguesPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  // Form state
  const [leagueName, setLeagueName] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState("Private");
  const [joinCode, setJoinCode] = useState("");

  const leagues = [
    { name: "Premier League Masters", members: 12, type: "Public", code: "PLM2024" },
    { name: "La Liga Legends", members: 8, type: "Public", code: "LL2024" },
    { name: "Champions League Elite", members: 15, type: "Private", code: "CLE2024" },
  ];

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    setIsCreateModalOpen(false);
    // Reset and API logic here
  };

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    setIsJoinModalOpen(false);
    // Reset and API logic here
  };

  // Reusable styles for inputs and modals
  const inputClass = "w-full rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-100 border border-slate-300 text-slate-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100";
  const modalBase = "fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm";
  const modalContent = "rounded-xl p-6 w-full max-w-md relative bg-white dark:bg-gray-800 text-slate-900 dark:text-gray-100 shadow-2xl";

  return (
    <div className="pt-8 px-0 md:px-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6 text-slate-900 dark:text-white">My Leagues</h1>

      {/* Action buttons */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <button onClick={() => setIsCreateModalOpen(true)} className="bg-teal-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-teal-600 transition shadow-md">
          Create New League
        </button>
        <button onClick={() => setIsJoinModalOpen(true)} className="font-semibold px-4 py-2 rounded-lg transition border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
          Join League
        </button>
      </div>

      {/* Leagues grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leagues.map((league, idx) => (
          <div
            key={idx}
            className="rounded-xl p-6 flex flex-col gap-4 transition shadow-sm border bg-white border-slate-200 hover:border-teal-500 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-teal-500"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{league.name}</h2>
              <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                  league.type === "Public" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                }`}>
                {league.type}
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-gray-400">
              {league.members} members • Code: <span className="font-mono">{league.code}</span>
            </p>

            <button className="mt-2 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 font-semibold px-4 py-2 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/40 transition">
              View League
            </button>
          </div>
        ))}
      </div>

      {/* Create League Modal */}
      {isCreateModalOpen && (
        <div className={modalBase}>
          <div className={modalContent}>
            <button onClick={() => setIsCreateModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl font-bold">&times;</button>
            <h2 className="text-2xl font-bold mb-4">Create New League</h2>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div><label className="block mb-1 text-sm font-medium">League Name</label><input type="text" value={leagueName} onChange={(e) => setLeagueName(e.target.value)} required className={inputClass} /></div>
              <div><label className="block mb-1 text-sm font-medium">Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} /></div>
              <div>
                <label className="block mb-1 text-sm font-medium">Privacy Setting</label>
                <select value={privacy} onChange={(e) => setPrivacy(e.target.value)} className={inputClass}>
                  <option value="Private">Private (Invite Only)</option>
                  <option value="Public">Public (Anyone can join)</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 text-white font-semibold">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join League Modal */}
      {isJoinModalOpen && (
        <div className={modalBase}>
          <div className={modalContent}>
            <button onClick={() => setIsJoinModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl font-bold">&times;</button>
            <h2 className="text-2xl font-bold mb-4">Join League</h2>
            <form onSubmit={handleJoinSubmit} className="space-y-4">
              <div><label className="block mb-1 text-sm font-medium">6-Digit League Code</label><input type="text" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} maxLength={6} required className={inputClass} /></div>
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