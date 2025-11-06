import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

import Navbar from './components/Navbar';  // make sure path matches your folder

import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import MyLeaguesPage from './pages/MyLeaguesPage';
import LeagueDetailPage from './pages/LeagueDetailPage';
import FullSchedulePage from './pages/FullSchedulePage';
import UserProfilePage from './pages/UserProfilePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

function App() {
  return (
    <Router>
      <Navbar />
      <main className="pt-16"> {/* pushes content below fixed navbar */}
        <Routes>
          <Route path="/" element={<Layout><LandingPage /></Layout>} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/leagues" element={<Layout><MyLeaguesPage /></Layout>} />
          <Route path="/leagues/:id" element={<Layout><LeagueDetailPage /></Layout>} />
          <Route path="/schedule" element={<Layout><FullSchedulePage /></Layout>} />
          <Route path="/profile" element={<Layout><UserProfilePage /></Layout>} />
          <Route path="/login" element={<Layout><LoginPage /></Layout>} />
          <Route path="/signup" element={<Layout><SignupPage /></Layout>} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;

