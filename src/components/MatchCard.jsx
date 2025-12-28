import React, { useState } from 'react';
import Button, { PRIMARY_BLUE } from './Button';
import API_BASE_URL from '../config';

const MatchCard = ({ match, showPrediction }) => {
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [isPredicted, setIsPredicted] = useState(!!match.userPrediction);
  const [predictionResult, setPredictionResult] = useState(match.userPrediction);

  const handlePredict = async (e) => {
    e.preventDefault();
    
    // 1. Get User
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      alert("Please login to make a prediction!");
      return;
    }

    // 2. Optimistic UI Update (Show success immediately)
    const newPrediction = `${homeScore} - ${awayScore}`;
    setPredictionResult(newPrediction);
    setIsPredicted(true);

    // 3. Send to Backend
    try {
      const response = await fetch('${API_BASE_URL}/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: storedUser.id || storedUser._id, // Handle both ID formats
          matchId: match.id,
          homeTeam: match.homeTeam,
          awayTeam: match.awayTeam,
          homeScore: parseInt(homeScore),
          awayScore: parseInt(awayScore)
        })
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      
      console.log("Prediction saved:", result);

    } catch (err) {
      console.error("Prediction failed:", err);
      alert("Failed to save prediction. Please try again.");
      setIsPredicted(false); // Revert UI on error
    }
  };
  
  const inputClass = "w-full sm:w-16 h-10 p-2 text-center rounded-lg border focus:ring-blue-500 focus:border-blue-500 focus:outline-none appearance-none bg-slate-100 text-slate-900 border-slate-300 dark:bg-slate-700 dark:text-white dark:border-slate-600";

  const scoreForm = (
    <form onSubmit={handlePredict} className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3">
      <input type="number" value={homeScore} onChange={(e) => setHomeScore(Math.max(0, parseInt(e.target.value) || 0))} min="0" className={inputClass} />
      <span className="text-slate-400 font-medium text-lg hidden sm:block">-</span>
      <input type="number" value={awayScore} onChange={(e) => setAwayScore(Math.max(0, parseInt(e.target.value) || 0))} min="0" className={inputClass} />
      <Button variant="accent" size="sm" type="submit" className="w-full sm:w-auto mt-2 sm:mt-0">Predict</Button>
    </form>
  );

  return (
    <div className="
      rounded-xl p-4 border transition-shadow duration-300
      bg-white border-slate-200 shadow-sm
      dark:bg-slate-800 dark:border-slate-700 dark:shadow-none
      hover:border-blue-500 dark:hover:border-blue-500
    ">
      {/* Header: Date & Status */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {new Date(match.date).toLocaleString([], {month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'})}
        </span>
        <span className={`text-xs ${PRIMARY_BLUE} px-2 py-0.5 rounded-full bg-blue-50 dark:bg-slate-700`}>
            {match.league} • {match.displayStatus || match.status}
        </span>
      </div>

      {/* --- TEAM LOGOS AND NAMES SECTION --- */}
      <div className="flex justify-between items-center mb-3">
        
        {/* Home Team: Text Left, Logo Right */}
        <div className="flex items-center justify-end w-1/3 gap-3">
            <span className="text-lg font-semibold truncate text-slate-800 dark:text-white text-right">
                {match.homeTeam}
            </span>
            {/* Added Home Logo */}
            <img 
                src={match.homeLogo} 
                alt={match.homeTeam} 
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                onError={(e) => e.target.style.display = 'none'} // Hides broken images
            />
        </div>
        
        {/* Score / VS Badge */}
        <div className="font-bold mx-2 text-xl text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700 px-4 py-1 rounded-md whitespace-nowrap">
            {match.status === 'upcoming' ? 'vs' : `${match.homeScore} - ${match.awayScore}`}
        </div>
        
        {/* Away Team: Logo Left, Text Right */}
        <div className="flex items-center justify-start w-1/3 gap-3">
            {/* Added Away Logo */}
            <img 
                src={match.awayLogo} 
                alt={match.awayTeam} 
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                onError={(e) => e.target.style.display = 'none'} 
            />
            <span className="text-lg font-semibold truncate text-slate-800 dark:text-white text-left">
                {match.awayTeam}
            </span>
        </div>

      </div>
      
      {/* Prediction Logic */}
      {match.status === 'upcoming' && showPrediction && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
          {isPredicted ? (
            <p className="text-sm text-green-600 dark:text-green-400 text-center">Your Prediction: <span className="font-semibold">{predictionResult}</span></p>
          ) : (
            scoreForm
          )}
        </div>
      )}
      {match.status === 'finished' && (
         <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 text-center">
           <p className="text-sm text-slate-500 dark:text-slate-400">Match Finished</p>
         </div>
      )}
    </div>
  );
};

export default MatchCard;