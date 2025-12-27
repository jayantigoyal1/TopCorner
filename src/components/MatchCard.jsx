import React, { useState } from 'react';
import Button, { PRIMARY_BLUE } from './Button';

const MatchCard = ({ match, showPrediction }) => {
  // ... (keep your existing state and handler logic here) ...
  // JUST COPY THE LOGIC FROM THE PREVIOUS STEP INSIDE HERE
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [isPredicted, setIsPredicted] = useState(!!match.userPrediction);
  const [predictionResult, setPredictionResult] = useState(match.userPrediction);

  const handlePredict = (e) => {
    e.preventDefault();
    const newPrediction = `${homeScore} - ${awayScore}`;
    setPredictionResult(newPrediction);
    setIsPredicted(true);
  };
  
  // Update the input classes to look good on white and dark
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
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{new Date(match.date).toLocaleString()}</span>
        <span className={`text-xs ${PRIMARY_BLUE} px-2 py-0.5 rounded-full bg-blue-50 dark:bg-slate-700`}>{match.league}</span>
      </div>
      <div className="flex justify-between items-center mb-3">
        <div className="text-lg font-semibold truncate text-slate-800 dark:text-white">{match.homeTeam}</div>
        <div className="font-medium mx-3 text-slate-400">vs</div>
        <div className="text-lg font-semibold truncate text-slate-800 dark:text-white">{match.awayTeam}</div>
      </div>
      
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
           <p className="text-sm text-red-500 dark:text-red-400">Final Score: <span className="font-semibold">2 - 1</span></p>
         </div>
      )}
    </div>
  );
};

export default MatchCard;