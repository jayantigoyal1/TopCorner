import React, { useState } from "react";

const UserProfilePage = () => {
  const [profile, setProfile] = useState({ fullName: "John Doe", username: "johndoe", email: "john@example.com", password: "" });
  const stats = { accuracy: "68.5%", totalPoints: 1250, predictions: 45, leaguesJoined: 3 };
  const recentPredictions = [{ match: "Barca vs Real", prediction: "Barca Win", result: "✅" }];

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const inputStyle = "w-full rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 border border-slate-300 text-slate-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100";

  return (
    <div className="pt-8 px-0 md:px-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-2 text-slate-900 dark:text-white">Profile Settings</h1>
      <p className="text-slate-500 dark:text-gray-400 mb-8">Manage your account and view your prediction history</p>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Account Info Card */}
        <div className="p-6 rounded-xl border shadow-sm bg-white border-slate-200 dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Account Information</h2>
          <form className="space-y-4">
            <div><label className="block text-sm text-slate-500 dark:text-gray-400 mb-1">Full Name</label><input type="text" name="fullName" value={profile.fullName} onChange={handleChange} className={inputStyle} /></div>
            <div><label className="block text-sm text-slate-500 dark:text-gray-400 mb-1">Username</label><input type="text" name="username" value={profile.username} onChange={handleChange} className={inputStyle} /></div>
            <div><label className="block text-sm text-slate-500 dark:text-gray-400 mb-1">Email</label><input type="email" name="email" value={profile.email} onChange={handleChange} className={inputStyle} /></div>
            <button className="w-full bg-teal-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-teal-600 transition mt-2">Update Profile</button>
          </form>
        </div>

        {/* Stats & History */}
        <div className="md:col-span-2 space-y-6">
          {/* Stats Grid */}
          <div className="p-6 rounded-xl border shadow-sm bg-white border-slate-200 dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Performance Overview</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Object.entries(stats).map(([key, val]) => (
                <div key={key} className="p-4 rounded-lg bg-slate-50 dark:bg-gray-700 text-center">
                  <p className="text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wide">{key.replace(/([A-Z])/g, ' $1')}</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">{val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Predictions */}
          <div className="p-6 rounded-xl border shadow-sm bg-white border-slate-200 dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Recent Predictions</h2>
            <div className="space-y-2">
              {recentPredictions.map((pred, idx) => (
                <div key={idx} className="p-3 rounded-lg flex justify-between items-center bg-slate-50 hover:bg-slate-100 dark:bg-gray-700 dark:hover:bg-gray-600 transition">
                  <span className="text-slate-900 dark:text-white font-medium">{pred.match}</span>
                  <span className="text-sm px-3 py-1 rounded-full bg-white border border-slate-200 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200">
                    {pred.prediction} {pred.result}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;