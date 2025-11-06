import React, { useState } from "react";

const UserProfilePage = () => {
  const [profile, setProfile] = useState({
    fullName: "John Doe",
    username: "johndoe",
    email: "john@example.com",
    password: "",
  });

  const stats = {
    accuracy: "68.5%",
    totalPoints: 1250,
    predictions: 45,
    leaguesJoined: 3,
  };

  const recentPredictions = [
    { match: "Barcelona vs Real Madrid", prediction: "Barcelona Win", result: "✅" },
    { match: "Manchester United vs Chelsea", prediction: "Draw", result: "❌" },
    { match: "Liverpool vs Manchester City", prediction: "Liverpool Win", result: "✅" },
    { match: "PSG vs Lyon", prediction: "PSG Win", result: "✅" },
  ];

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Profile updated:", profile);
  };

  return (
    <div className="pt-24 px-6 max-w-7xl mx-auto bg-gray-900 min-h-screen text-gray-200">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-100">Profile Settings</h1>
      <p className="text-gray-400 mb-6">Manage your account and view your prediction history</p>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Account Info Card */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-100">Account Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={profile.fullName}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={profile.username}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">New Password</label>
              <input
                type="password"
                name="password"
                value={profile.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-teal-500 text-gray-900 font-semibold px-4 py-2 rounded-lg hover:bg-teal-400 transition"
            >
              Update Profile
            </button>
          </form>
        </div>

        {/* Stats Overview */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 flex flex-col gap-4">
          <h2 className="text-xl font-bold mb-4 text-gray-100">Performance Overview</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm">Overall Accuracy</p>
              <p className="text-gray-100 font-semibold text-lg">{stats.accuracy}</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm">Total Points</p>
              <p className="text-gray-100 font-semibold text-lg">{stats.totalPoints}</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm">Predictions Made</p>
              <p className="text-gray-100 font-semibold text-lg">{stats.predictions}</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm">Leagues Joined</p>
              <p className="text-gray-100 font-semibold text-lg">{stats.leaguesJoined}</p>
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4 text-center mt-4">
            <p className="text-gray-400">📈 Performance Over Time (Chart coming soon)</p>
          </div>
        </div>

        {/* Recent Predictions */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 flex flex-col gap-4">
          <h2 className="text-xl font-bold mb-4 text-gray-100">Recent Predictions</h2>
          {recentPredictions.length === 0 ? (
            <p className="text-gray-400 text-center">No recent predictions</p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {recentPredictions.map((pred, idx) => (
                <div
                  key={idx}
                  className="bg-gray-700 rounded-lg p-3 flex justify-between items-center hover:bg-gray-600 transition"
                >
                  <span className="text-gray-100">{pred.match}</span>
                  <span className="px-2 py-1 rounded-full text-sm font-semibold bg-gray-800">
                    {pred.prediction} {pred.result}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
