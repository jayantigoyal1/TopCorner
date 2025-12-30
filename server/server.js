require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const authRoute = require('./routes/auth');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// =====================
// DATABASE SCHEMAS
// =====================

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

const leagueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  createdBy: String,
  members: [{ type: String }]
});

const League = mongoose.model('League', leagueSchema);

// =====================
// MIDDLEWARE
// =====================
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoute);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// =====================
// FOOTBALL-DATA CONFIG
// =====================
const footballAPI = axios.create({
  baseURL: 'https://api.football-data.org/v4',
  headers: {
    'X-Auth-Token': process.env.FOOTBALL_DATA_KEY
  }
});

// =====================
// ROUTES
// =====================

app.get('/', (req, res) => {
  res.send('TopCorner Backend (Football-Data.org) Running ⚽');
});

// 1. FETCH TODAY MATCHES
app.get('/api/matches', async (req, res) => {
  const from = new Date();
  from.setDate(from.getDate() - 3); // last 3 days
  const to = new Date(); 

  const fromStr = from.toISOString().split('T')[0];
  const toStr = to.toISOString().split('T')[0];
  const competitions = ['PL', 'PD', 'SA', 'BL1', 'FL1', 'DED'];

  try {
    const responses = await Promise.allSettled(
      competitions.map(code =>
        footballAPI.get(`/competitions/${code}/matches`, {
          params: { dateFrom: fromStr, dateTo: toStr }
        })
      )
    );

    const matches = responses
      .filter(r => r.status === 'fulfilled')
      .flatMap(r => r.value.data.matches || []);

    res.json(matches);
  } catch (err) {
    console.error("Dashboard matches error:", err.message);
    res.json([]);
  }
});

// 2. FETCH SCHEDULE BY DATE
app.get('/api/schedule', async (req, res) => {
  const { date } = req.query;
  if (!date) return res.json([]);
  const competitions = ['PL', 'PD', 'SA', 'BL1', 'FL1', 'DED'];

  try {
    const requests = competitions.map(code =>
      footballAPI.get(`/competitions/${code}/matches`, { params: { dateFrom: date, dateTo: date } })
    );
    const responses = await Promise.allSettled(requests);
    const matches = responses
      .filter(r => r.status === 'fulfilled')
      .flatMap(r => r.value.data.matches || []);

    res.json(matches);
  } catch (err) {
    console.error("Schedule Error:", err.message);
    res.json([]);
  }
});

// 3. SAVE PREDICTION
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
    const prediction = new Prediction({ userId, matchId, homeTeam, awayTeam, homeScore, awayScore });
    await prediction.save();
    res.json({ message: "Prediction saved!", prediction });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// 4. USER PREDICTIONS
app.get('/api/predictions/:userId', async (req, res) => {
  try {
    const predictions = await Prediction.find({ userId: req.params.userId });
    res.json(predictions);
  } catch {
    res.status(500).json({ error: "Failed to fetch predictions" });
  }
});

// 5. CALC POINTS
const getResult = (h, a) => h > a ? 'HOME' : h < a ? 'AWAY' : 'DRAW';

app.post('/api/calc-points', async (req, res) => {
  try {
    const pending = await Prediction.find({ status: 'pending' });
    let updated = 0;

    for (const pred of pending) {
      const response = await footballAPI.get(`/matches/${pred.matchId}`);
      const match = response.data;
      if (match.status !== 'FINISHED') continue;

      const actualHome = match.score.fullTime.home;
      const actualAway = match.score.fullTime.away;
      let points = -5;
      
      if (pred.homeScore === actualHome && pred.awayScore === actualAway) points = 50;
      else if (getResult(pred.homeScore, pred.awayScore) === getResult(actualHome, actualAway)) points = 20;

      pred.points = points;
      pred.status = 'processed';
      await pred.save();

      const user = await User.findById(pred.userId);
      if (user) {
        user.points += points;
        if (points === 50 && !user.badges.includes("Sniper")) user.badges.push("Sniper");
        if (user.points >= 1100 && !user.badges.includes("High Roller")) user.badges.push("High Roller");
        await user.save();
      }
      updated++;
    }
    res.json({ message: `Processed ${updated} predictions` });
  } catch (error) {
    res.status(500).json({ error: "Calculation failed" });
  }
});

// =====================
// LEAGUES (Standard)
// =====================
app.post('/api/leagues/create', async (req, res) => {
  const { userId, name } = req.body;
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  const league = new League({ name, code, createdBy: userId, members: [userId] });
  await league.save();
  res.json(league);
});

app.post('/api/leagues/join', async (req, res) => {
  const { userId, code } = req.body;
  const league = await League.findOne({ code });
  if (!league) return res.status(404).json({ error: "Invalid code" });
  if (!league.members.includes(userId)) {
    league.members.push(userId);
    await league.save();
  }
  res.json({ message: "Joined", league });
});

app.get('/api/leagues/user/:userId', async (req, res) => {
  const leagues = await League.find({ members: req.params.userId });
  res.json(leagues);
});

app.get('/api/leagues/featured', async (req, res) => {
  const leagues = await League.find();
  const top = leagues
    .map(l => ({ ...l.toObject(), memberCount: l.members.length }))
    .sort((a, b) => b.memberCount - a.memberCount)
    .slice(0, 3);
  res.json(top);
});

// *** THIS WAS MISSING - ADDED IT SO LEAGUE PAGE WORKS ***
app.get('/api/leagues/:id', async (req, res) => {
  try {
    const league = await League.findById(req.params.id);
    if (!league) return res.status(404).json({ error: "League not found" });
    const membersData = await User.find({ _id: { $in: league.members } }).select('fullName points'); 
    res.json({ league, members: membersData });
  } catch (error) {
    res.status(500).json({ error: "Failed to load leaderboard" });
  }
});

// =====================
// ACTIVITY & STATS
// =====================
app.get('/api/activity/:userId', async (req, res) => {
  const leagues = await League.find({ members: req.params.userId });
  const friends = new Set();
  leagues.forEach(l => l.members.forEach(m => m !== req.params.userId && friends.add(m)));
  if (friends.size === 0) return res.json([]);

  const preds = await Prediction.find({ userId: { $in: [...friends] } }).sort({ createdAt: -1 }).limit(10);
  const users = await User.find({ _id: { $in: preds.map(p => p.userId) } }, 'fullName');
  const map = Object.fromEntries(users.map(u => [u._id.toString(), u.fullName]));

  res.json(preds.map(p => ({
    id: p._id,
    user: map[p.userId] || "Unknown",
    action: p.points > 0 ? `won ${p.points} pts in ${p.homeTeam} vs ${p.awayTeam}` : `predicted ${p.homeTeam} vs ${p.awayTeam}`,
    time: p.createdAt,
    points: Math.max(p.points, 0)
  })));
});

app.get('/api/users/:userId/stats', async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  const rank = await User.countDocuments({ points: { $gt: user.points } }) + 1;
  const total = await Prediction.countDocuments({ userId: req.params.userId });
  const processed = await Prediction.countDocuments({ userId: req.params.userId, status: 'processed' });
  const correct = await Prediction.countDocuments({ userId: req.params.userId, points: { $gt: 0 } });
  
  res.json({
    rank,
    totalPredictions: total,
    accuracy: processed ? Math.round((correct / processed) * 100) : 0,
    points: user.points
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});