import React, { useState } from "react";

const MyLeaguesPage = () => {
  // State for modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  // Form state
  const [leagueName, setLeagueName] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState("Private");
  const [joinCode, setJoinCode] = useState("");

  // Sample leagues (mock data)
  const leagues = [
    {
      name: "Premier League Masters",
      members: 12,
      type: "Public",
      code: "PLM2024",
    },
    {
      name: "La Liga Legends",
      members: 8,
      type: "Public",
      code: "LL2024",
    },
    {
      name: "Champions League Elite",
      members: 15,
      type: "Private",
      code: "CLE2024",
    },
  ];

  // Handlers for Create League
  const handleCreateClick = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => setIsCreateModalOpen(false);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    console.log("League Created:", { leagueName, description, privacy });
    setIsCreateModalOpen(false);
    setLeagueName("");
    setDescription("");
    setPrivacy("Private");
    // API call for creating league goes here
  };

  // Handlers for Join League
  const handleJoinClick = () => setIsJoinModalOpen(true);
  const handleCloseJoinModal = () => setIsJoinModalOpen(false);

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    if (joinCode.length !== 6 || isNaN(joinCode)) {
      alert("Please enter a valid 6-digit code");
      return;
    }
    console.log("Joined League with code:", joinCode);
    setIsJoinModalOpen(false);
    setJoinCode("");
    // API call for joining league goes here
  };

  return (
    <div className="pt-24 px-6 max-w-7xl mx-auto bg-gray-900 min-h-screen text-gray-200">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-100">My Leagues</h1>

      {/* Action buttons */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <button
          onClick={handleCreateClick}
          className="bg-teal-500 text-gray-900 font-semibold px-4 py-2 rounded-lg hover:bg-teal-400 transition"
        >
          Create New League
        </button>
        <button
          onClick={handleJoinClick}
          className="bg-gray-800 border border-gray-700 text-gray-200 font-semibold px-4 py-2 rounded-lg hover:bg-gray-700 transition"
        >
          Join League
        </button>
      </div>

      {/* Leagues grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leagues.map((league, idx) => (
          <div
            key={idx}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6 flex flex-col gap-4 hover:bg-gray-700 transition"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-100">{league.name}</h2>
              <span
                className={`px-2 py-1 rounded-full text-sm font-semibold ${
                  league.type === "Public"
                    ? "bg-green-800 text-green-300"
                    : "bg-yellow-800 text-yellow-300"
                }`}
              >
                {league.type}
              </span>
            </div>
            <p className="text-gray-400">
              {league.members} members • League Code: {league.code}
            </p>

            <button className="mt-2 bg-teal-500 text-gray-900 font-semibold px-4 py-2 rounded-lg hover:bg-teal-400 transition">
              View League
            </button>
          </div>
        ))}
      </div>

      {/* Create League Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md text-gray-100 relative">
            <button
              onClick={handleCloseCreateModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Create New League</h2>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1">League Name</label>
                <input
                  type="text"
                  value={leagueName}
                  onChange={(e) => setLeagueName(e.target.value)}
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Privacy Setting</label>
                <select
                  value={privacy}
                  onChange={(e) => setPrivacy(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Private">Private (Invite Only)</option>
                  <option value="Public">Public (Anyone can join)</option>
                </select>
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={handleCloseCreateModal}
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 transition text-gray-900 font-semibold"
                >
                  Create League
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join League Modal */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md text-gray-100 relative">
            <button
              onClick={handleCloseJoinModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Join League</h2>
            <form onSubmit={handleJoinSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1">6-Digit League Code</label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  maxLength={6}
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={handleCloseJoinModal}
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 transition text-gray-900 font-semibold"
                >
                  Join League
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLeaguesPage;
