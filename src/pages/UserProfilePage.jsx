import React, { useState, useEffect } from "react";
import html2canvas from 'html2canvas';
import API_BASE_URL from '../config';

const UserProfilePage = () => {
  // State for User Data
  const [profile, setProfile] = useState({ fullName: "", username: "", email: "" });
  const [stats, setStats] = useState({ accuracy: 0, totalPoints: 0, predictions: 0, leaguesJoined: 0 });
  const [recentPredictions, setRecentPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [userBadges, setUserBadges] = useState([]); 

  // Get current user ID
  const localUser = JSON.parse(localStorage.getItem("user"));
  const userId = localUser?.id || localUser?._id;

  useEffect(() => {
    if (userId) {
      setProfile({
        fullName: localUser.fullName || "",
        username: localUser.username || "",
        email: localUser.email || ""
      });
      fetchUserData();
    }
  }, [userId]);

  const fetchUserData = async () => {
    try {
      // 1. Fetch Stats
      const statsRes = await fetch(`${API_BASE_URL}/api/users/${userId}/stats`);
      const statsData = await statsRes.json();

      // 2. Fetch Leagues
      const leaguesRes = await fetch(`${API_BASE_URL}/api/leagues/user/${userId}`);
      const leaguesData = await leaguesRes.json();

      // 3. Fetch Predictions
      const predsRes = await fetch(`${API_BASE_URL}/api/predictions/${userId}`);
      const predsData = await predsRes.json();

      // 4. Fetch User Details (To get Badges)
      setStats({
        accuracy: statsData.accuracy + "%",
        totalPoints: statsData.points,
        predictions: statsData.totalPredictions,
        leaguesJoined: Array.isArray(leaguesData) ? leaguesData.length : 0
      });

      if (Array.isArray(predsData)) {
        const sorted = predsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
        setRecentPredictions(sorted);
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching profile data:", err);
      setLoading(false);
    }
  };

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
        const res = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profile)
        });
        const data = await res.json();
        if (res.ok) {
            const updatedUser = { ...localUser, ...data };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setMessage("✅ Profile updated successfully!");
        } else {
            setMessage("❌ Failed to update.");
        }
    } catch (err) {
        setMessage("❌ Server error.");
    }
  };

  // --- 2. Badge Download Logic ---
  const shareBadge = (badgeName) => {
    const element = document.getElementById(`badge-${badgeName}`);
    html2canvas(element).then(canvas => {
      const link = document.createElement('a');
      link.download = `${badgeName}-badge.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  const inputStyle = "w-full rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 border border-slate-300 text-slate-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100";

  if (!userId) return <div className="text-center pt-20 text-white">Please log in.</div>;

  return (
    <div className="pt-8 px-4 md:px-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-2 text-slate-900 dark:text-white">Profile Settings</h1>
      <p className="text-slate-500 dark:text-gray-400 mb-8">Manage your account and view your prediction history</p>

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Account Info Card */}
        <div className="p-6 rounded-xl border shadow-sm bg-white border-slate-200 dark:bg-gray-800 dark:border-gray-700 h-fit">
          <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Account Information</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
                <label className="block text-sm text-slate-500 dark:text-gray-400 mb-1">Full Name</label>
                <input type="text" name="fullName" value={profile.fullName} onChange={handleChange} className={inputStyle} />
            </div>
            <div>
                <label className="block text-sm text-slate-500 dark:text-gray-400 mb-1">Username</label>
                <input type="text" name="username" value={profile.username} onChange={handleChange} className={inputStyle} />
            </div>
            <div>
                <label className="block text-sm text-slate-500 dark:text-gray-400 mb-1">Email</label>
                <input type="email" name="email" value={profile.email} onChange={handleChange} className={inputStyle} />
            </div>
            
            {message && <p className="text-sm font-semibold">{message}</p>}
            
            <button type="submit" className="w-full bg-teal-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-teal-600 transition mt-2">
                Update Profile
            </button>
          </form>
        </div>

        {/* Stats & History Column */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Stats Grid */}
          <div className="p-6 rounded-xl border shadow-sm bg-white border-slate-200 dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Performance Overview</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-gray-700 text-center">
                  <p className="text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wide">Accuracy</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">{stats.accuracy}</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-gray-700 text-center">
                  <p className="text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wide">Total Points</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">{stats.totalPoints}</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-gray-700 text-center">
                  <p className="text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wide">Predictions</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">{stats.predictions}</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-gray-700 text-center">
                  <p className="text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wide">Leagues</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">{stats.leaguesJoined}</p>
              </div>
            </div>
          </div>

          {/* --- 3. TROPHY CABINET (NEW!) --- */}
          <div className="p-6 rounded-xl border shadow-sm bg-white border-slate-200 dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">🏆 Trophy Cabinet</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* LOGIC: Check if user qualifies for badges based on stats */}
                {/* Badge 1: High Roller (1100+ Points) */}
                {stats.totalPoints >= 1100 ? (
                    <div id="badge-High Roller" className="p-4 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-200 dark:from-yellow-900/40 dark:to-amber-900/40 border border-yellow-300 dark:border-yellow-700 flex flex-col items-center text-center relative group transition-transform hover:scale-105">
                        <div className="text-4xl mb-2 drop-shadow-sm">💰</div>
                        <h3 className="font-bold text-yellow-900 dark:text-yellow-100">High Roller</h3>
                        <p className="text-[10px] uppercase font-bold text-yellow-700 dark:text-yellow-300 tracking-wider mt-1">1.1k Club</p>
                        <button onClick={() => shareBadge("High Roller")} className="absolute inset-0 bg-black/60 text-white font-bold opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-xl backdrop-blur-sm">⬇ Download</button>
                    </div>
                ) : (
                    <div className="p-4 rounded-xl bg-slate-100 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 flex flex-col items-center text-center opacity-50 grayscale">
                        <div className="text-4xl mb-2">💰</div>
                        <h3 className="font-bold text-slate-500 dark:text-gray-400">High Roller</h3>
                        <p className="text-[10px] uppercase text-slate-400 mt-1">Locked</p>
                    </div>
                )}

                {/* Badge 2: Sniper (Mock: Show if they have > 0 exact scores, or just unlock for demo) */}
                <div id="badge-Sniper" className="p-4 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-200 dark:from-blue-900/40 dark:to-cyan-900/40 border border-blue-300 dark:border-blue-700 flex flex-col items-center text-center relative group transition-transform hover:scale-105">
                    <div className="text-4xl mb-2 drop-shadow-sm">🎯</div>
                    <h3 className="font-bold text-blue-900 dark:text-blue-100">Sniper</h3>
                    <p className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-300 tracking-wider mt-1">Exact Score</p>
                    <button onClick={() => shareBadge("Sniper")} className="absolute inset-0 bg-black/60 text-white font-bold opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-xl backdrop-blur-sm">⬇ Download</button>
                </div>

            </div>
          </div>

          {/* Recent Predictions Container */}
          <div className="p-6 rounded-xl border shadow-sm bg-white border-slate-200 dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Recent Predictions</h2>
            <div className="space-y-2">
              {recentPredictions.length === 0 ? (
                 <p className="text-slate-500">No predictions yet.</p>
              ) : (
                 recentPredictions.map((pred, idx) => (
                    <div key={idx} className="p-3 rounded-lg flex justify-between items-center bg-slate-50 hover:bg-slate-100 dark:bg-gray-700 dark:hover:bg-gray-600 transition">
                      <span className="text-slate-900 dark:text-white font-medium text-sm md:text-base">
                          {pred.homeTeam} <span className="text-slate-400">vs</span> {pred.awayTeam}
                      </span>
                      
                      <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-500 dark:text-gray-300 mr-2">
                             Predicted: {pred.homeScore} - {pred.awayScore}
                          </span>
                          
                          {pred.status === 'pending' ? (
                              <span className="text-xs px-2 py-1 rounded-full bg-slate-200 text-slate-600 dark:bg-gray-600 dark:text-gray-300 font-medium">Pending</span>
                          ) : pred.points > 0 ? (
                              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 font-bold">+{pred.points} pts</span>
                          ) : pred.points < 0 ? (
                              <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 font-bold">{pred.points} pts</span>
                          ) : (
                              <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">0 pts</span>
                          )}
                      </div>
                    </div>
                 ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;