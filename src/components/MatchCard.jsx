import React, { useState } from 'react';
import Button, { PRIMARY_BLUE } from './Button';
import API_BASE_URL from '../config';

const MatchCard = ({ match, showPrediction }) => {
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [isPredicted, setIsPredicted] = useState(!!match.userPrediction);
  const [predictionResult, setPredictionResult] = useState(match.userPrediction);
  const [loading, setLoading] = useState(false);

  /* =====================================================
     ✅ CORRECT PREDICTION LOCK LOGIC (TIME-BASED)
     ===================================================== */
  const kickoffTime = new Date(match.date);
  const now = new Date();

  // Optional buffer (lock predictions 5 mins before kickoff)
  const LOCK_BEFORE_MINUTES = 5;
  const lockTime = new Date(
    kickoffTime.getTime() - LOCK_BEFORE_MINUTES * 60 * 1000
  );

  const canPredict = now < lockTime;

  /* ===================================================== */

  const handlePredict = async (e) => {
    e.preventDefault();

    if (!canPredict) {
      alert("Predictions are closed for this match.");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      alert("Please login to make a prediction!");
      return;
    }

    const newPrediction = `${homeScore} - ${awayScore}`;
    setPredictionResult(newPrediction);
    setIsPredicted(true);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: storedUser.id || storedUser._id,
          matchId: match.id,
          homeTeam: match.homeTeam,
          awayTeam: match.awayTeam,
          homeScore: Number(homeScore),
          awayScore: Number(awayScore),
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Prediction failed");

    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to save prediction.");
      setIsPredicted(false);
      setPredictionResult(null);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full sm:w-16 h-10 p-2 text-center rounded-lg border focus:ring-blue-500 focus:border-blue-500 focus:outline-none appearance-none bg-slate-100 text-slate-900 border-slate-300 dark:bg-slate-700 dark:text-white dark:border-slate-600";

  return (
    <div className="
      rounded-xl p-4 border transition-shadow duration-300
      bg-white border-slate-200 shadow-sm
      dark:bg-slate-800 dark:border-slate-700
      hover:border-blue-500 dark:hover:border-blue-500
    ">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {kickoffTime.toLocaleString([], {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
        <span
          className={`text-xs ${PRIMARY_BLUE} px-2 py-0.5 rounded-full bg-blue-50 dark:bg-slate-700`}
        >
          {match.league} • {match.status}
        </span>
      </div>

      {/* Teams */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center justify-end w-1/3 gap-3">
          <span className="text-lg font-semibold truncate text-right text-slate-800 dark:text-white">
            {match.homeTeam}
          </span>
          <img
            src={match.homeLogo}
            alt={match.homeTeam}
            className="w-8 h-8 object-contain"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
        </div>

        <div className="font-bold text-xl px-4 py-1 rounded-md bg-slate-100 dark:bg-slate-700">
          {canPredict ? 'vs' : `${match.homeScore} - ${match.awayScore}`}
        </div>

        <div className="flex items-center justify-start w-1/3 gap-3">
          <img
            src={match.awayLogo}
            alt={match.awayTeam}
            className="w-8 h-8 object-contain"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
          <span className="text-lg font-semibold truncate text-slate-800 dark:text-white">
            {match.awayTeam}
          </span>
        </div>
      </div>

      {/* Prediction Section */}
      {showPrediction && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
          {canPredict ? (
            isPredicted ? (
              <p className="text-sm text-green-600 text-center">
                Your Prediction: <strong>{predictionResult}</strong>
              </p>
            ) : (
              <form
                onSubmit={handlePredict}
                className="flex flex-col sm:flex-row items-center justify-center gap-2"
              >
                <input
                  type="number"
                  min="0"
                  value={homeScore}
                  onChange={(e) =>
                    setHomeScore(Math.max(0, Number(e.target.value)))
                  }
                  className={inputClass}
                />
                <span className="hidden sm:block">-</span>
                <input
                  type="number"
                  min="0"
                  value={awayScore}
                  onChange={(e) =>
                    setAwayScore(Math.max(0, Number(e.target.value)))
                  }
                  className={inputClass}
                />
                <Button type="submit" size="sm" disabled={loading}>
                  {loading ? 'Saving...' : 'Predict'}
                </Button>
              </form>
            )
          ) : (
            <p className="text-sm text-slate-500 text-center italic">
              Predictions closed
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MatchCard;
