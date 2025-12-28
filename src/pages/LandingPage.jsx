import React from 'react';
import { Link } from 'react-router-dom';
import stadiumBg from '../assets/stadium.png';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';

function LandingPage() {
  const howItWorks = [
    { icon: '⚽', title: '1. Select Match', desc: 'Browse upcoming games from your favorite leagues.' },
    { icon: '🤝', title: '2. Create or Join League', desc: 'Compete with friends or join a public challenge.' },
    { icon: '🏆', title: '3. Compete & Win', desc: 'Climb the leaderboard and earn bragging rights.' },
  ];

  const featuredIcons = ['🏆', '🏅', '🌟'];

  return (
    <div className="text-slate-900 dark:text-gray-100">
      {}
      {/* Hero Section */}
      <section className="relative h-[700px] flex items-center justify-center text-center overflow-hidden">
        {/* Background Image */}
        <img
          src={stadiumBg}
          alt="Football Stadium"
          className="absolute inset-0 w-full h-full object-cover opacity-70 dark:opacity-40"
        />
        
        {/* Gradient Overlay: Adaptive (Creme for light mode, Slate for dark mode) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#f6f1eb] via-[#f6f1eb]/80 to-transparent dark:from-slate-900 dark:via-slate-900/80"></div>

        {/* Floating 3D spheres */}
        <motion.div
          animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
          className="absolute top-20 left-10 w-28 h-28 bg-teal-500 rounded-full opacity-30 blur-2xl"
        />
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 8 }}
          className="absolute bottom-10 right-20 w-24 h-24 bg-orange-500 rounded-full opacity-30 blur-2xl"
        />

        {/* Hero Text */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 p-6 max-w-3xl"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-sm">
            PREDICT. COMPETE. WIN.
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-xl md:text-2xl text-slate-600 dark:text-gray-300 mb-10 font-medium"
          >
            Challenge friends. Prove your football knowledge.
          </motion.p>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/signup"
              className="mt-4 inline-block px-8 py-4 bg-orange-500 text-white font-bold rounded-xl shadow-lg hover:bg-orange-600 hover:shadow-orange-500/50 transition-all duration-300"
            >
              JOIN NOW
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="py-24 text-center relative">
        <h2 className="text-4xl font-bold mb-14 text-slate-900 dark:text-white">How It Works</h2>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-6">
          {howItWorks.map((step, i) => (
            <Tilt key={i} tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable={true} glareMaxOpacity={0.1}>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="
                  p-10 rounded-2xl shadow-xl border transition-all duration-300
                  bg-white border-slate-200 
                  dark:bg-slate-800 dark:border-slate-700
                "
              >
                <div className="text-6xl mb-6">{step.icon}</div>
                <h3 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">{step.title}</h3>
                <p className="text-slate-600 dark:text-gray-400">{step.desc}</p>
              </motion.div>
            </Tilt>
          ))}
        </div>
      </section>

      {/* Featured Leagues */}
      <section className="py-24 text-center relative bg-white dark:bg-slate-800 transition-colors duration-300">
        <h2 className="text-4xl font-bold mb-12 text-slate-900 dark:text-white">Featured Leagues</h2>
        <div className="container mx-auto flex justify-center space-x-10">
          {featuredIcons.map((icon, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.2, rotateZ: 10 }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="
                w-28 h-28 rounded-full flex items-center justify-center text-4xl shadow-lg cursor-pointer
                bg-slate-100 text-slate-800
                dark:bg-slate-700 dark:text-white
              "
            >
              {icon}
            </motion.div>
          ))}
        </div>
      </section>

      {}
    </div>
  );
}

export default LandingPage;