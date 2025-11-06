import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import stadiumBg from '../assets/stadium.png';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt'; // For 3D tilt effect

function LandingPage() {
  const howItWorks = [
    { icon: '⚽', title: '1. Select Match', desc: 'Browse upcoming games from your favorite leagues.' },
    { icon: '🤝', title: '2. Create or Join League', desc: 'Compete with friends or join a public challenge.' },
    { icon: '🏆', title: '3. Compete & Win', desc: 'Climb the leaderboard and earn bragging rights.' },
  ];

  const featuredIcons = ['🏆', '🏅', '🌟'];

  return (
    <div className="min-h-screen bg-dark-bg text-text-light">
      <Navbar isLoggedIn={false} />

      {/* Hero Section */}
      <section className="relative h-[700px] flex items-center justify-center text-center overflow-hidden">
        {/* Background */}
        <img
          src={stadiumBg}
          alt="Football Stadium"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/80 to-transparent"></div>

        {/* Floating 3D spheres / decorative elements */}
        <motion.div
          animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
          className="absolute top-20 left-10 w-28 h-28 bg-teal-500 rounded-full opacity-40"
        />
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 8 }}
          className="absolute bottom-10 right-20 w-24 h-24 bg-orange-500 rounded-full opacity-30"
        />

        {/* Hero Text */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 p-6 max-w-3xl"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-accent-orange to-orange-500 bg-clip-text text-transparent">
            PREDICT. COMPETE. WIN.
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-xl md:text-2xl text-text-gray mb-10"
          >
            Challenge friends. Prove your football knowledge.
          </motion.p>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/signup"
              className="mt-4 inline-block px-8 py-4 bg-accent-orange rounded-xl shadow-lg hover:shadow-orange-500/50 transition-transform duration-300"
            >
              JOIN NOW
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="py-24 text-center relative">
        <h2 className="text-4xl font-bold mb-14">How It Works</h2>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-6">
          {howItWorks.map((step, i) => (
            <Tilt key={i} tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable={true} glareMaxOpacity={0.1}>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-dark-card p-10 rounded-2xl shadow-2xl border border-gray-800 transition-all duration-300"
              >
                <div className="text-6xl mb-6">{step.icon}</div>
                <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                <p className="text-text-gray">{step.desc}</p>
              </motion.div>
            </Tilt>
          ))}
        </div>
      </section>

      {/* Featured Leagues */}
      <section className="py-24 bg-dark-card text-center relative">
        <h2 className="text-4xl font-bold mb-12">Featured Leagues</h2>
        <div className="container mx-auto flex justify-center space-x-10">
          {featuredIcons.map((icon, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.2, rotateZ: 10 }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-28 h-28 rounded-full flex items-center justify-center bg-gray-700 text-4xl shadow-2xl cursor-pointer"
            >
              {icon}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-card py-10 text-center text-text-gray text-sm border-t border-gray-800">
        <div className="container mx-auto">
          <p>&copy; 2023 TopCorner. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <Link to="#" className="hover:text-accent-orange transition">
              About Us
            </Link>
            <Link to="#" className="hover:text-accent-orange transition">
              Contact
            </Link>
            <Link to="#" className="hover:text-accent-orange transition">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
