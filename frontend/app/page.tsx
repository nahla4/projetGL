"use client";

import { motion } from "framer-motion";

const vehicleAnimations = {
  airplane: {
    x: [0, 300, 600, 900],
    y: [0, -50, 30, 0],
    rotate: [0, 15, -15, 0],
    transition: { duration: 15, repeat: Infinity, ease: "easeInOut" }
  },
  car: {
    x: [0, 400],
    transition: { duration: 6, repeat: Infinity, repeatType: "reverse", ease: "linear" }
  },
  bus: {
    y: [0, -25, 0],
    transition: { duration: 7, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
  },
  boat: {
    x: [0, 350],
    y: [0, -15, 0],
    transition: { duration: 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
  }
};

const historicalAnimations = {
  pyramid: {
    scale: [1, 1.1, 1],
    rotate: [0, 5, -5, 0],
    transition: { duration: 8, repeat: Infinity, ease: "easeInOut" }
  },
  mosque: {
    y: [0, -10, 0],
    transition: { duration: 6, repeat: Infinity, repeatType: "reverse" }
  },
  ruins: {
    opacity: [0.8, 1, 0.8],
    transition: { duration: 5, repeat: Infinity, ease: "easeInOut" }
  }
};

export default function CreativeHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-green-600 font-sans text-white overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-40 right-20 w-24 h-24 bg-green-300/20 rounded-full blur-lg"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
        />
      </div>

      {/* Header */}
      <header className="flex justify-between items-center px-10 py-6 bg-black/20 backdrop-blur-md fixed w-full top-0 z-50 shadow-lg">
        <motion.h1
          className="text-4xl font-black tracking-tight select-none cursor-default bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-yellow-300">DZ</span>-TourGuide
        </motion.h1>
        <nav className="space-x-8 text-lg font-medium">
          {["Accueil", "Guides", "Tours", "Contact"].map((item, index) => (
            <motion.a
              key={item}
              href="#"
              className="hover:text-yellow-300 transition-colors relative"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              {item}
              <motion.div
                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-300"
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          ))}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 flex flex-col items-center justify-center text-center px-4 md:px-16 min-h-[60vh]">
        <motion.h1
          className="text-6xl md:text-7xl font-black max-w-5xl leading-tight mb-8 bg-gradient-to-r from-white via-blue-100 to-green-200 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 80, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          Découvrez l'Algérie <br />
          <span className="text-yellow-300">Authentique & Moderne</span>
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl max-w-3xl mb-12 text-blue-100 font-light"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Explorez les trésors cachés avec des guides locaux passionnés et vivez des aventures inoubliables
        </motion.p>

        {/* Enhanced Search Bar */}
        <motion.div
          className="relative w-full max-w-2xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <input
            type="search"
            placeholder="🔍 Rechercher tours, wilayas, expériences..."
            className="w-full px-8 py-5 rounded-full shadow-2xl text-green-900 text-xl font-medium placeholder-green-600 outline-none border-2 border-white/20 bg-white/90 backdrop-blur-sm focus:bg-white focus:border-yellow-300 transition-all"
          />
          <motion.button
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explorer
          </motion.button>
        </motion.div>
      </section>

      {/* Animated Scene with Vehicles and Historical Elements */}
      <section className="relative h-[500px] mt-20 max-w-full mx-auto px-10 overflow-hidden">
        {/* Sky Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-300/30 to-transparent" />

        {/* Airplane */}
        <motion.div
          className="absolute top-16 left-0 z-10"
          animate={vehicleAnimations.airplane}
        >
          <svg width="80" height="60" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 24 L62 8 L50 26 L62 44 Z" fill="#ffffff" stroke="#2563eb" strokeWidth="2"/>
            <circle cx="6" cy="24" r="4" fill="#2563eb"/>
            <path d="M8 20 L12 28 M8 28 L12 20" stroke="#2563eb" strokeWidth="1"/>
          </svg>
        </motion.div>

        {/* Car */}
        <motion.div
          className="absolute bottom-20 left-0 z-20"
          animate={vehicleAnimations.car}
        >
          <svg width="120" height="60" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="20" width="80" height="30" rx="8" ry="8" fill="#16a34a" stroke="#15803d" strokeWidth="2"/>
            <circle cx="40" cy="50" r="10" fill="#15803d"/>
            <circle cx="80" cy="50" r="10" fill="#15803d"/>
            <rect x="25" y="25" width="15" height="20" rx="2" ry="2" fill="#22c55e"/>
            <rect x="45" y="25" width="15" height="20" rx="2" ry="2" fill="#22c55e"/>
            <rect x="65" y="25" width="15" height="20" rx="2" ry="2" fill="#22c55e"/>
          </svg>
        </motion.div>

        {/* Bus */}
        <motion.div
          className="absolute bottom-40 right-0 z-20"
          animate={vehicleAnimations.bus}
        >
          <svg width="160" height="70" viewBox="0 0 160 70" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="20" width="140" height="35" rx="6" ry="6" fill="#dc2626" stroke="#b91c1c" strokeWidth="2"/>
            <circle cx="30" cy="55" r="8" fill="#b91c1c"/>
            <circle cx="130" cy="55" r="8" fill="#b91c1c"/>
            <rect x="15" y="25" width="20" height="25" rx="2" ry="2" fill="#ef4444"/>
            <rect x="40" y="25" width="20" height="25" rx="2" ry="2" fill="#ef4444"/>
            <rect x="65" y="25" width="20" height="25" rx="2" ry="2" fill="#ef4444"/>
            <rect x="90" y="25" width="20" height="25" rx="2" ry="2" fill="#ef4444"/>
            <rect x="115" y="25" width="20" height="25" rx="2" ry="2" fill="#ef4444"/>
          </svg>
        </motion.div>

        {/* Boat */}
        <motion.div
          className="absolute bottom-10 right-0 z-20"
          animate={vehicleAnimations.boat}
        >
          <svg width="140" height="60" viewBox="0 0 140 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 35 L135 45 L125 25 L15 20 Z" fill="#1e40af" stroke="#1e3a8a" strokeWidth="2"/>
            <rect x="50" y="10" width="12" height="25" rx="2" ry="2" fill="#3b82f6"/>
            <path d="M55 35 L65 35" stroke="#1e3a8a" strokeWidth="3"/>
            <circle cx="60" cy="40" r="3" fill="#1e3a8a"/>
          </svg>
        </motion.div>

        {/* Historical Elements */}
        {/* Pyramid */}
        <motion.div
          className="absolute top-32 left-1/4 z-10"
          animate={historicalAnimations.pyramid}
        >
          <svg width="100" height="80" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="50,10 90,70 10,70" fill="#f59e0b" stroke="#d97706" strokeWidth="2"/>
            <rect x="40" y="70" width="20" height="10" fill="#d97706"/>
          </svg>
        </motion.div>

        {/* Mosque */}
        <motion.div
          className="absolute top-40 right-1/4 z-10"
          animate={historicalAnimations.mosque}
        >
          <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="40" width="80" height="50" rx="5" ry="5" fill="#10b981" stroke="#059669" strokeWidth="2"/>
            <polygon points="60,15 75,40 45,40" fill="#10b981"/>
            <circle cx="60" cy="25" r="8" fill="#059669"/>
            <rect x="50" y="90" width="20" height="10" fill="#059669"/>
            <rect x="35" y="50" width="15" height="30" rx="2" ry="2" fill="#34d399"/>
            <rect x="70" y="50" width="15" height="30" rx="2" ry="2" fill="#34d399"/>
          </svg>
        </motion.div>

        {/* Ancient Ruins */}
        <motion.div
          className="absolute bottom-32 left-1/2 -translate-x-1/2 z-10"
          animate={historicalAnimations.ruins}
        >
          <svg width="150" height="80" viewBox="0 0 150 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="50" width="40" height="25" rx="3" ry="3" fill="#a855f7" stroke="#9333ea" strokeWidth="2"/>
            <rect x="70" y="40" width="35" height="35" rx="3" ry="3" fill="#a855f7" stroke="#9333ea" strokeWidth="2"/>
            <rect x="115" y="55" width="25" height="20" rx="3" ry="3" fill="#a855f7" stroke="#9333ea" strokeWidth="2"/>
            <polygon points="75,15 95,40 55,40" fill="#a855f7" stroke="#9333ea" strokeWidth="2"/>
          </svg>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-8 mx-auto max-w-7xl px-8 py-20 text-green-900">
        {[
          { icon: "🏆", title: "Guides Experts", desc: "Certifiés et passionnés" },
          { icon: "🗺️", title: "Tours Uniques", desc: "Expériences authentiques" },
          { icon: "⚡", title: "Réservation Instantanée", desc: "Simple et rapide" },
          { icon: "💬", title: "Support 24/7", desc: "Toujours à votre écoute" },
        ].map(({ icon, title, desc }, index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 20px 40px rgba(5, 150, 105, 0.3)",
              background: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)"
            }}
            className="bg-white/90 backdrop-blur-sm rounded-3xl px-6 py-10 flex flex-col items-center justify-center cursor-pointer select-none shadow-xl transition-all border border-white/20"
          >
            <motion.span
              className="text-7xl mb-4"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              {icon}
            </motion.span>
            <h3 className="text-2xl font-bold mb-2 text-center">{title}</h3>
            <p className="text-green-700 text-center font-medium">{desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-green-900 to-blue-900 text-white text-center py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">Prêt à explorer l'Algérie ?</h3>
          <p className="text-green-200 mb-6">Rejoignez des milliers de voyageurs satisfaits</p>
          <motion.button
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-3 rounded-full font-bold text-lg shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Commencer l'aventure
          </motion.button>
          <p className="mt-6 text-sm text-green-300">© 2025 DZ-TourGuide - Découvrez l'Algérie autrement</p>
        </div>
      </footer>
    </div>
  );
}
