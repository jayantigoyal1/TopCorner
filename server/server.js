require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const authRoute = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Prediction Schema ---
const predictionSchema = new mongoose.Schema({
  userId: String,      // User's ID
  matchId: Number,     // API Match ID
  homeTeam: String,
  awayTeam: String,
  homeScore: Number,   // User's prediction
  awayScore: Number,   // User's prediction
  points: { type: Number, default: 0 }, 
  status: { type: String, default: 'pending' } 
});
const Prediction = mongoose.model('Prediction', predictionSchema);

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

// 2. Fetch Schedule (FIXED HEADER & SEASON)
// GET matches for a specific date (YYYY-MM-DD)
app.get('/api/schedule', async (req, res) => {
  const date = req.query.date; 
  
  if (!date) return res.status(400).json({ error: "Date is required" });

  console.log(`📅 Fetching schedule for: ${date}...`); // DEBUG LOG

  try {
    const response = await axios.get('https://v3.football.api-sports.io/fixtures', {
      headers: { 
        'x-apisports-key': process.env.FOOTBALL_API_KEY 
      },
      params: { 
        date: date, 
        // season: 2025, // <--- COMMENTED OUT! Let the date decide the season.
      }
    });

    const matches = response.data.response;
    console.log(`✅ Found ${matches.length} matches for ${date}`); // DEBUG LOG

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
    // Check if user already predicted this match
    const existing = await Prediction.findOne({ userId, matchId });
    if (existing) {
      existing.homeScore = homeScore;
      existing.awayScore = awayScore;
      await existing.save();
      return res.json({ message: "Prediction updated!", prediction: existing });
    }

    // Create new prediction
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

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});