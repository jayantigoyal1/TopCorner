require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const authRoute = require('./routes/auth');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Prediction Schema ---
const predictionSchema = new mongoose.Schema({
  userId: String,
  matchId: Number,
  homeTeam: String,
  awayTeam: String,
  homeScore: Number,
  awayScore: Number,
  points: { type: Number, default: 0 }, 
  status: { type: String, default: 'pending' } 
}, { timestamps: true });
const Prediction = mongoose.model('Prediction', predictionSchema);

// League Schema
const leagueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  createdBy: String,
  members: [{ type: String }]
});
const League = mongoose.model('League', leagueSchema);

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoute);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- Routes ---

app.get('/', (req, res) => {
  res.send('TopCorner Backend is Running ⚽');
});

// 1. Fetch Live Matches
app.get('/api/matches', async (req, res) => {
  try {
    const response = await axios.get('https://v3.football.api-sports.io/fixtures', {
      params: { live: 'all' }, 
      headers: {
        'x-apisports-key': process.env.FOOTBALL_API_KEY 
      }
    });
    res.json(response.data.response);
  } catch (error) {
    console.error("Error fetching live matches:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

// 2. Fetch Schedule
app.get('/api/schedule', async (req, res) => {
  const date = req.query.date; 
  
  if (!date) return res.status(400).json({ error: "Date is required" });

  console.log(`📅 Fetching schedule for: ${date}...`);

  try {
    const response = await axios.get('https://v3.football.api-sports.io/fixtures', {
      headers: { 
        'x-apisports-key': process.env.FOOTBALL_API_KEY 
      },
      params: { 
        date: date, 
      }
    });

    const matches = response.data.response;
    console.log(`✅ Found ${matches.length} matches for ${date}`);

    res.json(matches);
  } catch (error) {
    console.error("❌ Error fetching schedule:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to fetch schedule" });
  }
});

// 3. Save Prediction
app.post('/api/predict', async (req, res) => {
  const { userId, matchId, homeTeam, awayTeam, homeScore, awayScore } = req.body;

  try {
    const existing = await Prediction.findOne({ userId, matchId });
    if (existing) {
      existing.homeScore = homeScore;
      existing.awayScore = awayScore;
      await existing.save();
      return res.json({ message: "Prediction updated!", prediction: existing });
    }

    const newPrediction = new Prediction({
      userId, matchId, homeTeam, awayTeam, homeScore, awayScore
    });
    await newPrediction.save();
    
    res.json({ message: "Prediction saved!", prediction: newPrediction });
  } catch (error) {
    console.error("Error saving prediction:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET all predictions for a specific user
app.get('/api/predictions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const predictions = await Prediction.find({ userId });
    res.json(predictions);
  } catch (error) {
    console.error("Error fetching predictions:", error);
    res.status(500).json({ error: "Failed to fetch predictions" });
  }
});

// --- LEAGUE ROUTES ---
// 1. Create a League
app.post('/api/leagues/create', async (req, res) => {
  const { userId, name } = req.body;
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();

  try {
    const newLeague = new League({
      name,
      code,
      createdBy: userId,
      members: [userId] 
    });
    await newLeague.save();
    res.json(newLeague);
  } catch (error) {
    res.status(500).json({ error: "Failed to create league" });
  }
});

// 2. Join a League
app.post('/api/leagues/join', async (req, res) => {
  const { userId, code } = req.body;

  try {
    const league = await League.findOne({ code });
    if (!league) return res.status(404).json({ error: "Invalid League Code" });

    if (league.members.includes(userId)) {
      return res.status(400).json({ error: "You are already in this league" });
    }

    league.members.push(userId);
    await league.save();
    res.json({ message: "Joined successfully!", league });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// 3. Get "My Leagues"
app.get('/api/leagues/user/:userId', async (req, res) => {
  try {
    const leagues = await League.find({ members: req.params.userId });
    res.json(leagues);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch leagues" });
  }
});

// Get Featured Leagues
app.get('/api/leagues/featured', async (req, res) => {
  try {
    const allLeagues = await League.find();
    
    // Sort by member count (Highest first) and take top 3
    const topLeagues = allLeagues
      .map(league => ({
        ...league.toObject(),
        memberCount: league.members ? league.members.length : 0
      }))
      .sort((a, b) => b.memberCount - a.memberCount)
      .slice(0, 3);

    res.json(topLeagues);
  } catch (error) {
    console.error("Featured Leagues Error:", error);
    res.status(500).json({ error: "Failed to fetch featured leagues" });
  }
});

// 4. Get League Details (Leaderboard)
app.get('/api/leagues/:id', async (req, res) => {
  try {
    const league = await League.findById(req.params.id);
    if (!league) return res.status(404).json({ error: "League not found" });

    const membersData = await User.find({ _id: { $in: league.members } })
                                  .select('fullName points'); 

    res.json({ league, members: membersData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load leaderboard" });
  }
});

// --- POINT CALCULATION ENGINE ---

// Helper: Determine result
const getResult = (home, away) => {
  if (home > away) return 'HOME_WIN';
  if (away > home) return 'AWAY_WIN';
  return 'DRAW';
};

// 5. CALCULATE & SYNC POINTS
app.post('/api/calc-points', async (req, res) => {
  try {
    console.log("🔄 Starting Calculation...");
    
    // 1. Fetch pending predictions
    const pendingPredictions = await Prediction.find({ status: 'pending' });
    
    if (pendingPredictions.length === 0) {
      console.log("No pending predictions found.");
      return res.json({ message: "No pending predictions to process." });
    }

    let updatedCount = 0;

    // 2. Loop through each prediction
    for (const pred of pendingPredictions) {
      console.log(`Checking prediction for match: ${pred.matchId}`);

      const response = await axios.get('https://v3.football.api-sports.io/fixtures', {
        headers: { 'x-apisports-key': process.env.FOOTBALL_API_KEY },
        params: { id: pred.matchId }
      });
      
      const matchData = response.data.response[0];
      const status = matchData.fixture.status.short;
      
      console.log(`   - Match Status: ${status}`);

      // Only calculate if match is FINISHED
      if (['FT', 'AET', 'PEN'].includes(status)) {
        
        const actualHome = matchData.goals.home;
        const actualAway = matchData.goals.away;
        let pointsEarned = 0;

        // A. Exact Score (+50)
        if (pred.homeScore === actualHome && pred.awayScore === actualAway) {
          pointsEarned = 50;
        } 
        // B. Correct Result (+20)
        else if (getResult(pred.homeScore, pred.awayScore) === getResult(actualHome, actualAway)) {
          pointsEarned = 20;
        } 
        // C. Wrong Result (-5 Deduction)
        else {
          pointsEarned = -5;
        }
        
        console.log(`   - Points Earned: ${pointsEarned}`);

        // 4. Update Prediction Status
        pred.points = pointsEarned;
        pred.status = 'processed'; 
        await pred.save();

        // --- 5. BADGE & POINTS LOGIC ---
        const userToUpdate = await User.findById(pred.userId);

        if (userToUpdate) {
            // A. Update Points
            userToUpdate.points += pointsEarned;

            // B. Badge 1: "Sniper" (Predict Exact Score)
            // Logic: If they earned 50 pts and don't have the badge yet
            if (pointsEarned === 50 && !userToUpdate.badges.includes("Sniper")) {
                userToUpdate.badges.push("Sniper");
                console.log(`🏅 Awarded 'Sniper' badge to ${userToUpdate.fullName}`);
            }

            // C. Badge 2: "High Roller" (Reach 1100 Points)
            // Logic: If total points crossed 1100
            if (userToUpdate.points >= 1100 && !userToUpdate.badges.includes("High Roller")) {
                userToUpdate.badges.push("High Roller");
                console.log(`🏅 Awarded 'High Roller' badge to ${userToUpdate.fullName}`);
            }

            // D. Save Changes (Points + Badges)
            await userToUpdate.save();
        }
        
        updatedCount++;
      }
    }

    console.log(`✅ Finished. Updated ${updatedCount} predictions.`);
    res.json({ message: `Scores updated! Processed ${updatedCount} matches.` });

  } catch (error) {
    console.error("Calculation Error:", error);
    res.status(500).json({ error: "Failed to calculate scores" });
  }
});

// --- ACTIVITY FEED ENGINE ---
app.get('/api/activity/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Find all leagues this user is in
    const leagues = await League.find({ members: userId });
    
    // 2. Collect all friend IDs (everyone in those leagues, excluding self)
    const friendIds = new Set();
    leagues.forEach(l => {
        l.members.forEach(m => {
            if (m !== userId) friendIds.add(m);
        });
    });
    const uniqueFriends = Array.from(friendIds);

    if (uniqueFriends.length === 0) return res.json([]);

    // 3. Get recent predictions from these friends (Last 10)
    const recentPreds = await Prediction.find({ userId: { $in: uniqueFriends } })
                                        .sort({ createdAt: -1 }) // Newest first
                                        .limit(10);
    
    // 4. Get User Names for these predictions
    const distinctUserIds = [...new Set(recentPreds.map(p => p.userId))];
    const users = await User.find({ _id: { $in: distinctUserIds } }, 'fullName');
    
    // Create a quick lookup map: { "USER_ID": "John Doe" }
    const userMap = {};
    users.forEach(u => userMap[u._id.toString()] = u.fullName);

    // 5. Format the feed
    const activityFeed = recentPreds.map(pred => {
        const userName = userMap[pred.userId] || "Unknown User";
        let actionText = "";
        let isWin = false;
        
        if (pred.status === 'processed' && pred.points > 0) {
            actionText = `won ${pred.points} pts in ${pred.homeTeam} vs ${pred.awayTeam}`;
            isWin = true;
        } else {
            actionText = `predicted ${pred.homeTeam} vs ${pred.awayTeam}`;
        }

        return {
            id: pred._id,
            user: userName,
            action: actionText,
            time: pred.createdAt,
            points: isWin ? pred.points : 0
        };
    });

    res.json(activityFeed);

  } catch (error) {
    console.error("Activity Error:", error);
    res.status(500).json({ error: "Failed to fetch activity" });
  }
});

// --- USER STATS ENGINE (Rank & Counts) ---
app.get('/api/users/:userId/stats', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // 1. Get current user's points
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // 2. Calculate Global Rank
    const betterPlayers = await User.countDocuments({ points: { $gt: user.points } });
    const rank = betterPlayers + 1; 

    // 3. Count Total Predictions
    const totalPredictions = await Prediction.countDocuments({ userId });

    // 4. Calculate Accuracy
    const processed = await Prediction.countDocuments({ userId, status: 'processed' });
    const correct = await Prediction.countDocuments({ userId, points: { $gt: 0 } });
    const accuracy = processed > 0 ? Math.round((correct / processed) * 100) : 0;

    res.json({
      rank,
      totalPredictions,
      accuracy,
      points: user.points
    });

  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// --- UPDATE PROFILE ---
app.put('/api/users/:id', async (req, res) => {
  try {
    const { fullName, username, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      { fullName, username, email }, 
      { new: true } 
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});