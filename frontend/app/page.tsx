'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Updated palette for light blue theme
const palette = {
  lightBlue: '#9aecdeff',
  veryLightBlue: '#c2e1faff',
  softBlue: '#2196F3',
  blueAccent: '#1dc275ff',
  white: '#FFFFFF',
  gray: '#757575',
  lightGray: '#E0E0E0',
  accent: '#1ba599ff',
  green: '#10b981',
  orange: '#f59e0b',
  beige: '#d4a574',
  violet: '#8c3b97'
};

const videoList = [
  "/vecteezy_aerial-view-of-fort-santa-cruz-and-oran-algeria_22242715.mp4",
  "/vecteezy_aerial-view-of-the-royal-mausoleum-of-mauretania-algeria_20304747 (1).mp4",
  "/AdobeStock_585938285_Video_HD_Preview.mp4",
  "/AdobeStock_872553448_Video_HD_Preview.mp4",
  "/AdobeStock_584509740_Video_HD_Preview.mp4",
  "/AdobeStock_584555577_Video_HD_Preview.mp4",
  "/vecteezy_aerial-view-of-the-authentic-ancient-taghit-in-the-sahara_21846706.mp4",
];

const wilayas = [
  { id: 16, name: 'Alger', img: '/wilaya_alger.jpg' },
  { id: 6, name: 'Béjaïa', img: '/wilaya_bejaia.jpg' },
  { id: 19, name: 'Sétif', img: '/wilaya_setif.jpg' },
  { id: 8, name: 'Blida', img: '/wilaya_blida.jpg' },
  { id: 31, name: 'Oran', img: '/wilaya_oran.jpg' },
  { id: 33, name: 'Ouargla', img: '/wilaya_ouargla.jpg' },
];

const newsCards = [
  {
    id: 1,
    image: "/getyourguide_sample1.jpg",
    type: "EXCURSION",
    title: "Visite de la Casbah d'Alger – Immersion historique",
    subtitle: "3 heures • Coupe-file • Guide francophone",
    rating: 4.7,
    reviews: 82,
    price: 35,
    currency: "€",
    badge: "Nouveau",
    badgeColor: palette.blueAccent,
  },
  {
    id: 2,
    image: "/getyourguide_sample2.jpg",
    type: "BILLET D'ENTRÉE",
    title: "Palais du Bey de Constantine – Découverte culturelle",
    subtitle: "2 heures • Accès prioritaire • En petit groupe",
    rating: 4.8,
    reviews: 67,
    price: 28,
    currency: "€",
    badge: "Populaire",
    badgeColor: palette.softBlue,
  },
  {
    id: 3,
    image: "/getyourguide_sample3.jpg",
    type: "VISITE GUIDÉE",
    title: "Sahara – Excursion d'un jour à Timimoun et Taghit",
    subtitle: "8 heures • Circuit 4x4 • Guide local",
    rating: 4.9,
    reviews: 123,
    price: 95,
    currency: "€",
    badge: "Coup de cœur",
    badgeColor: palette.orange,
  },
  {
    id: 4,
    image: "/getyourguide_sample4.jpg",
    type: "VISITE GASTRONOMIQUE",
    title: "Flâneries gourmandes à Tlemcen",
    subtitle: "4 heures • Dégustation incluse • Véritable immersion",
    rating: 4.6,
    reviews: 54,
    price: 49,
    currency: "€"
  }
];

const guides = [
  {
    id: 1,
    name: "Nadia Selmi",
    photo: "/guide_nadia.jpg",
    bio: "Spécialiste patrimoine Casbah, passionnée par l'histoire d'Alger.",
    languages: ["français", "anglais"],
    wilayas: ["Alger"],
    certifications: ["Certifiée Ministère du Tourisme"],
    rating: 4.8
  },
  {
    id: 2,
    name: "Yassine Bessa",
    photo: "/guide_yassine.jpg",
    bio: "Guide saharien, expert circuits 4x4 & culture locale.",
    languages: ["français", "arabe"],
    wilayas: ["Timimoun", "Taghit"],
    certifications: ["Diplôme Guide sahara"],
    rating: 4.9
  },
  {
    id: 3,
    name: "Leila Ouadah",
    photo: "/guide_leila.jpg",
    bio: "Gastronome, spécialiste circuits gourmands à Tlemcen.",
    languages: ["français", "espagnol"],
    wilayas: ["Tlemcen"],
    certifications: [],
    rating: 4.7
  }
];

const dashboardStats = [
  {
    icon: "🧑‍🏫",
    label: "Guides disponibles",
    value: 58,
    color: palette.blueAccent
  },
  {
    icon: "😊",
    label: "Clients satisfaits",
    value: 312,
    color: palette.softBlue
  },
  {
    icon: "🧭",
    label: "Visites réalisées",
    value: 704,
    color: palette.accent
  }
];

const AnimatedTyping = ({ texts, typingSpeed = 120, delaySpeed = 1600, color = palette.blueAccent }) => {
  const [currentText, setCurrentText] = useState('');
  const [fullTextIndex, setFullTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    let timer;
    if (!isDeleting && charIndex <= texts[fullTextIndex].length) {
      timer = setTimeout(() => {
        setCurrentText(texts[fullTextIndex].substring(0, charIndex));
        setCharIndex(charIndex + 1);
      }, typingSpeed);
    } else if (isDeleting && charIndex >= 0) {
      timer = setTimeout(() => {
        setCurrentText(texts[fullTextIndex].substring(0, charIndex));
        setCharIndex(charIndex - 1);
      }, typingSpeed / 2);
    } else if (!isDeleting && charIndex > texts[fullTextIndex].length) {
      timer = setTimeout(() => setIsDeleting(true), delaySpeed);
    } else if (isDeleting && charIndex < 0) {
      setIsDeleting(false);
      setFullTextIndex((fullTextIndex + 1) % texts.length);
      setCharIndex(0);
    }
    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, texts, fullTextIndex, typingSpeed, delaySpeed]);

  return (
    <span style={{ color }}>
      {currentText}
      <span style={{ borderRight: `2px solid ${color}`, marginLeft: 2 }} />
    </span>
  );
};

export default function HomePage() {
  const [searchCity, setSearchCity] = useState('');
  const [selectedWilaya, setSelectedWilaya] = useState(null);
  const [videoIndex, setVideoIndex] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    // Light blue gradient background - single section
    document.body.style.background = 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #90d2f9ff 100%)';
    document.body.style.backgroundSize = '400% 400%';
    document.body.style.transition = 'background 0.33s';
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      body {
        animation: gradientShift 15s ease infinite;
      }
    `;
    document.head.appendChild(style);
  }, []);

  const handleVideoEnded = () => {
    setVideoIndex((prev) => (prev + 1) % videoList.length);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [videoIndex]);

  const filteredNews = selectedWilaya
    ? newsCards.filter(n =>
      n.title.toLowerCase().includes(selectedWilaya ? selectedWilaya.toLowerCase() : '') ||
      n.subtitle.toLowerCase().includes(selectedWilaya ? selectedWilaya.toLowerCase() : '')
    )
    : newsCards;

  return (
    <div style={{
      minHeight: '100vh',
      margin: 0,
      padding: 0,
      color: palette.gray,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif, system-ui",
      transition: 'color 0.33s, background 0.33s',
      backgroundColor: palette.veryLightBlue
    }}>
      {/* HERO SECTION */}
      <section style={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        marginBottom: "0",
        padding: 0,
        border: "none"
      }}>
        <video
          key={videoList[videoIndex]}
          ref={videoRef}
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnded}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
            zIndex: 0,
            filter: "brightness(0.75)"
          }}
          src={videoList[videoIndex]}
        />
        <div style={{
          position: "relative",
          zIndex: 2,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center"
        }}>
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              fontSize: "clamp(1rem, 2vw, 1.3rem)",
              fontWeight: 500,
              marginBottom: "1rem",
              color: palette.white,
              textShadow: `0 2px 16px #000`,
              letterSpacing: "0.05em"
            }}
          >
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1.04 }}
            transition={{ duration: 1.15 }}
            style={{
              fontSize: "clamp(2rem, 6vw, 3.2rem)",
              fontWeight: 800,
              marginBottom: "1.3rem",
              letterSpacing: "-.04em",
              color: palette.white,
              textShadow: `0 5px 38px #000`,
              lineHeight: "1.10",
              maxWidth: '95vw',
              position: "relative",
            }}
          >
            <AnimatedTyping
              texts={[
                "Découvrez l'Algérie authentique.",
                "Explorez les merveilles d'Alger.",
                "Vivez une expérience unique.",
                "Partez à l'aventure avec nos guides."
              ]}
              color={palette.white}
            />
          </motion.h1>
          
          {/* Search Bar - Changed button to white with light blue */}
          <motion.form
            role="search"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1.03 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            style={{
              width: "92vw",
              maxWidth: 520,
              background: palette.white,
              padding: "0.50rem 1.2rem",
              borderRadius: 16,
              boxShadow: `0 2px 14px rgba(0,0,0,0.14)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              border: `2px solid ${palette.lightBlue}`,
              marginBottom: "2.3rem"
            }}
            onSubmit={e => { e.preventDefault(); }}
          >
            <input
              type="text"
              aria-label="Recherche des villes, tours"
              placeholder="Recherchez une ville, un lieu ou un tour"
              value={searchCity}
              onChange={e => setSearchCity(e.target.value)}
              style={{
                outline: "none",
                border: "none",
                width: "83%",
                fontSize: "1.1rem",
                fontWeight: "500",
                padding: "10px 0",
                borderRadius: 8,
                color: palette.blueAccent,
                background: "none",
                textAlign: "center",
                transition: 'color 0.27s'
              }}
            />
            <motion.button
              whileHover={{ 
                scale: 1.10, 
                backgroundColor: palette.veryLightBlue, 
                color: palette.blueAccent,
                borderColor: palette.softBlue
              }}
              transition={{ type: "spring", stiffness: 310, damping: 16 }}
              type="submit"
              style={{
                background: palette.white,
                color: palette.blueAccent,
                border: `1px solid ${palette.lightBlue}`,
                borderRadius: 8,
                padding: "10px 25px",
                fontWeight: 700,
                fontSize: "1.08rem",
                cursor: "pointer",
                boxShadow: `0 2px 13px ${palette.lightBlue}33`,
                transition: "all 0.23s"
              }}
            >
              Recherche
            </motion.button>
          </motion.form>
        </div>
      </section>

      {/* Combined Content Section - All content in one light section */}
      <section style={{
        backgroundColor: palette.veryLightBlue,
        padding: "4rem 2rem 2rem 2rem",
        minHeight: "100vh"
      }}>
        {/* Actualités */}
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            color: palette.blueAccent,
            fontWeight: 900,
            fontSize: "1.8rem",
            marginBottom: "2rem",
            marginLeft: "7vw",
            letterSpacing: "-0.03em"
          }}
        >
          Actualités
        </motion.h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.6rem",
          maxWidth: 1000,
          margin: "0 auto 3rem auto"
        }}>
          {filteredNews.map((card, idx) =>
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1.03 }}
              whileHover={{ y: -8, scale: 1.07, boxShadow: `0 6px 28px ${palette.blueAccent}33` }}
              transition={{ duration: 0.6, delay: idx * 0.10 }}
              viewport={{ once: true }}
              style={{
                background: palette.white,
                borderRadius: 17,
                boxShadow: `0 1px 7px rgba(33, 150, 243, 0.15)`,
                overflow: "hidden",
                minHeight: 255,
                border: `1.6px solid ${palette.lightBlue}40`,
                position: "relative",
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ position: "relative", height: 86, width: "100%", overflow: "hidden" }}>
                <img
                  src={card.image}
                  alt={card.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                {card.badge &&
                  <span style={{
                    position: "absolute",
                    top: 9,
                    left: 9,
                    background: card.badgeColor,
                    color: palette.white,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 21,
                    fontSize: ".88rem",
                    boxShadow: `0 2px 8px ${card.badgeColor}44`
                  }}>{card.badge}</span>
                }
                <button
                  aria-label="Ajouter aux favoris"
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    background: palette.lightBlue + "F2",
                    border: "none",
                    borderRadius: "50%",
                    padding: "4px 7px",
                    cursor: "pointer",
                    fontSize: "1rem"
                  }}>
                  <span style={{ color: palette.blueAccent }}>♥</span>
                </button>
              </div>
              <div style={{
                padding: "0.7rem 1rem 0.7rem 1rem",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}>
                <div style={{ fontWeight: 800, fontSize: ".8rem", color: palette.blueAccent, marginBottom: 2 }}>
                  {card.type}
                </div>
                <div style={{
                  fontWeight: 700,
                  fontSize: ".97rem",
                  marginBottom: 3,
                  color: palette.blueAccent,
                  letterSpacing: "-.01em"
                }}>
                  {card.title}
                </div>
                <div style={{
                  fontSize: ".91rem",
                  color: palette.softBlue,
                  marginBottom: 5
                }}>
                  {card.subtitle}
                </div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  fontWeight: 700,
                  color: palette.gray
                }}>
                  <span style={{ fontSize: ".93rem", marginRight: 7, color: palette.orange }}>★ {card.rating}</span>
                  <span style={{ fontSize: ".89rem", fontWeight: 900, color: palette.gray, marginRight: 7 }}>
                    <b>{card.reviews}</b>
                  </span>
                  <span style={{ color: palette.beige, fontWeight: 700, fontSize: ".89rem" }}>personnes</span>
                </div>
                <div style={{
                  marginTop: 4,
                  color: card.badgeColor || palette.blueAccent,
                  fontSize: ".99rem",
                  fontWeight: 700
                }}>
                  À partir de {card.price}{card.currency}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Destinations - Updated buttons to white/light blue */}
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.62 }}
          style={{
            color: palette.blueAccent,
            fontWeight: 900,
            fontSize: "1.6rem",
            marginBottom: "1rem",
            marginLeft: "7vw",
            letterSpacing: "-0.03em"
          }}
        >
          Destinations
        </motion.h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "1.3rem 2rem",
          maxWidth: 850,
          margin: "0 auto 3rem auto"
        }}>
          {wilayas.map((wilaya, idx) => (
            <motion.button
              key={wilaya.id}
              whileHover={{ scale: 1.07, boxShadow: `0 5px 15px ${palette.lightBlue}44` }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 370, damping: 16 }}
              onClick={() => setSelectedWilaya(wilaya.name)}
              style={{
                background: palette.white,
                border: `2px solid ${selectedWilaya === wilaya.name ? palette.blueAccent : palette.lightBlue}`,
                borderRadius: 14,
                padding: "0.9rem 0.9rem 0.4rem 0.9rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: ".7rem",
                cursor: "pointer",
                boxShadow: `0 2px 7px ${palette.lightGray}40`
              }}
            >
              <img
                src={wilaya.img}
                alt={wilaya.name}
                style={{
                  width: 60, height: 56,
                  objectFit: "cover",
                  borderRadius: 12,
                  marginBottom: 5,
                  boxShadow: `0 1px 6px ${palette.lightGray}30`
                }}
              />
              <div style={{
                color: palette.blueAccent,
                fontWeight: 800,
                fontSize: "1rem",
                marginTop: 2
              }}>
                {wilaya.name}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Notre équipe */}
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.59 }}
          style={{
            color: palette.softBlue,
            fontWeight: 900,
            fontSize: "1.6rem",
            marginBottom: "1rem",
            marginLeft: "7vw",
            letterSpacing: "-0.03em"
          }}
        >
          Notre équipe
        </motion.h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: "1.5rem",
          maxWidth: 900,
          margin: "0 auto 3rem auto"
        }}>
          {guides.map((guide, idx) => (
            <motion.a
              key={guide.id}
              href={`/guide/${guide.id}`}
              whileHover={{ y: -8, scale: 1.022, boxShadow: `0 6px 14px ${palette.blueAccent}33` }}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.62, delay: idx * 0.09 }}
              style={{
                background: palette.white,
                borderRadius: 14,
                boxShadow: `0 2px 6px ${palette.lightGray}30`,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                border: `1.4px solid ${palette.lightBlue}60`,
                textDecoration: "none",
                color: palette.gray,
                minHeight: 210
              }}
            >
              <div style={{
                position: "relative",
                height: 74,
                width: "100%",
                overflow: "hidden"
              }}>
                <img
                  src={guide.photo}
                  alt={`Photo guide ${guide.name}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderTopLeftRadius: 14,
                    borderTopRightRadius: 14
                  }}
                />
                <span style={{
                  position: "absolute",
                  top: 6,
                  left: 5,
                  background: palette.blueAccent,
                  color: palette.white,
                  fontWeight: 700,
                  padding: "2px 10px",
                  borderRadius: 13,
                  fontSize: ".87rem"
                }}>
                  {guide.rating} ★
                </span>
              </div>
              <div style={{
                padding: "0.7rem 1rem .7rem 1rem",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "0.27rem"
              }}>
                <div style={{ fontWeight: 800, fontSize: "1rem", color: palette.blueAccent }}>{guide.name}</div>
                <div style={{
                  color: palette.gray,
                  fontSize: ".91rem",
                  fontWeight: 600,
                  marginBottom: 4
                }}>
                  {guide.bio}
                </div>
                <div style={{
                  fontWeight: 700,
                  fontSize: ".91rem",
                  color: palette.softBlue
                }}>
                  {[...guide.languages].join(" / ")}
                </div>
                <div style={{
                  color: palette.gray,
                  fontWeight: 700,
                  fontSize: ".91rem"
                }}>
                  Wilaya(s)&nbsp;: <b>{[...guide.wilayas].join(", ")}</b>
                </div>
                {guide.certifications.length > 0 && (
                  <div style={{ color: "#999", fontWeight: 600, fontSize: ".86rem" }}>
                    {guide.certifications.join(" • ")}
                  </div>
                )}
                <motion.button
                  whileHover={{ 
                    scale: 1.07, 
                    backgroundColor: palette.lightBlue, 
                    color: palette.blueAccent,
                    borderColor: palette.softBlue
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 16 }}
                  type="button"
                  style={{
                    marginTop: 7,
                    backgroundColor: palette.white,
                    color: palette.blueAccent,
                    border: `1px solid ${palette.lightBlue}`,
                    borderRadius: 7,
                    padding: "7px 12px",
                    fontWeight: 700,
                    fontSize: ".95rem",
                    cursor: "pointer",
                    alignSelf: "flex-start",
                    boxShadow: `0 1px 5px ${palette.lightGray}30`,
                    transition: "all 0.21s"
                  }}
                  tabIndex={-1}
                >
                  Voir profil
                </motion.button>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Dashboard Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          maxWidth: 800,
          margin: "0 auto 4rem auto",
          gap: "1.3rem"
        }}>
          {dashboardStats.map((stat, idx) => (
            <motion.div
              whileHover={{ y: -5, scale: 1.07 }}
              transition={{ type: "spring", stiffness: 420, damping: 19 }}
              key={stat.label}
              style={{
                background: palette.white,
                borderRadius: 11,
                boxShadow: `0 1px 9px ${stat.color}33`,
                padding: "1rem 0 0.7rem 0",
                textAlign: "center",
                border: `2px solid ${stat.color}`,
                display: "flex", flexDirection: "column",
                alignItems: "center",
                minHeight: 65
              }}>
              <div style={{
                fontSize: "1.8rem", marginBottom: 2, marginTop: -4
              }}>{stat.icon}</div>
              <div style={{
                fontWeight: 900,
                color: stat.color,
                fontSize: '1.2rem',
                letterSpacing: "-0.5px"
              }}>{stat.value}</div>
              <div style={{
                color: palette.gray,
                fontWeight: 600,
                fontSize: ".95rem"
              }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Carte Dahabia Section */}
        <div style={{
          backgroundColor: palette.veryLightBlue,
          padding: "4rem 2rem",
          position: "relative",
          overflow: "hidden",
          borderRadius: "20px",
          margin: "2rem auto",
          maxWidth: "1200px",
          boxShadow: `0 10px 40px ${palette.lightBlue}30`
        }}>
          {/* Animated background elements */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute",
              top: "-50px",
              right: "-50px",
              width: "300px",
              height: "300px",
              background: `radial-gradient(circle, ${palette.lightBlue}44 0%, transparent 70%)`,
              borderRadius: "50%",
              zIndex: 0
            }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute",
              bottom: "-80px",
              left: "-80px",
              width: "400px",
              height: "400px",
              background: `radial-gradient(circle, ${palette.blueAccent}33 0%, transparent 70%)`,
              borderRadius: "50%",
              zIndex: 0
            }}
          />
          <div style={{ position: "relative", zIndex: 2, maxWidth: "1000px", margin: "0 auto" }}>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{
                color: palette.blueAccent,
                fontWeight: 900,
                fontSize: "2.2rem",
                marginBottom: "1rem",
                textAlign: "center",
                letterSpacing: "-0.03em",
                textShadow: "0 3px 10px rgba(0,0,0,0.1)"
              }}
            >
              💳 Payez en Toute Sécurité avec Carte Dahabia
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              style={{
                color: palette.gray,
                fontSize: "1.1rem",
                textAlign: "center",
                marginBottom: "3rem",
                maxWidth: "600px",
                margin: "0 auto 3rem auto"
              }}
            >
              La plateforme de paiement algérienne de confiance, rapide et sécurisée
            </motion.p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "2rem",
              marginBottom: "3rem"
            }}>
              {/* Card 1 - Sécurisé */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ y: -15, scale: 1.05 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{
                  background: palette.white,
                  borderRadius: 16,
                  padding: "2rem",
                  boxShadow: `0 10px 40px ${palette.lightGray}30`,
                  textAlign: "center",
                  border: `3px solid ${palette.lightBlue}`,
                  position: "relative"
                }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ fontSize: "3rem", marginBottom: "1rem" }}
                >
                  🔒
                </motion.div>
                <h3 style={{ color: palette.blueAccent, fontWeight: 900, fontSize: "1.4rem", marginBottom: "0.7rem" }}>
                  Sécurisé
                </h3>
                <p style={{ color: palette.gray, fontWeight: 600, fontSize: "0.95rem", lineHeight: "1.6" }}>
                  • Données protégées • 
                </p>
              </motion.div>

              {/* Card 2 - Instantané */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ y: -15, scale: 1.05 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                style={{
                  background: palette.white,
                  borderRadius: 16,
                  padding: "2rem",
                  boxShadow: `0 10px 40px ${palette.lightGray}30`,
                  textAlign: "center",
                  border: `3px solid ${palette.lightBlue}`,
                  position: "relative"
                }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ fontSize: "3rem", marginBottom: "1rem" }}
                >
                  ⚡
                </motion.div>
                <h3 style={{ color: palette.blueAccent, fontWeight: 900, fontSize: "1.4rem", marginBottom: "0.7rem" }}>
                  Instantané
                </h3>
                <p style={{ color: palette.gray, fontWeight: 600, fontSize: "0.95rem", lineHeight: "1.6" }}>
                  Confirmation immédiate • Sans frais cachés • Transactions rapides
                </p>
              </motion.div>
            </div>

            {/* CTA Button - Updated to white/light blue */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              style={{ textAlign: "center" }}
            >
          
            </motion.div>

            {/* Floating animated cards background */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{
                position: "absolute",
                top: "20%",
                left: "5%",
                fontSize: "4rem",
                opacity: 0.15,
                zIndex: 1
              }}
            >
              💳
            </motion.div>
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
              style={{
                position: "absolute",
                bottom: "10%",
                right: "5%",
                fontSize: "4rem",
                opacity: 0.15,
                zIndex: 1
              }}
            >
              💳
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: palette.white,
        color: palette.gray,
        padding: "3rem 2rem 2rem 2rem",
        marginTop: "0",
        borderTop: `3px solid ${palette.lightBlue}`,
        boxShadow: `0 -5px 20px ${palette.lightGray}30`
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "2rem",
          marginBottom: "2rem"
        }}>
          {/* Column 1: À propos */}
          <div>
            <h3 style={{ color: palette.blueAccent, fontWeight: 900, marginBottom: "1rem", fontSize: "1.1rem" }}>
              À Propos
            </h3>
            <p style={{ color: palette.gray, fontSize: "0.95rem", lineHeight: "1.6", fontWeight: 500 }}>
              DZ-TourGuide connecte les voyageurs avec les meilleurs guides locaux d'Algérie pour des expériences authentiques et inoubliables.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h3 style={{ color: palette.softBlue, fontWeight: 900, marginBottom: "1rem", fontSize: "1.1rem" }}>
              Navigation
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li style={{ marginBottom: "0.7rem" }}>
                <a href="/" style={{ color: palette.gray, textDecoration: "none", fontSize: "0.95rem", fontWeight: 600, transition: "color 0.3s" }}>Accueil</a>
              </li>
              <li style={{ marginBottom: "0.7rem" }}>
                <a href="/#tours" style={{ color: palette.gray, textDecoration: "none", fontSize: "0.95rem", fontWeight: 600 }}>Nos Tours</a>
              </li>
              <li style={{ marginBottom: "0.7rem" }}>
                <a href="/#guides" style={{ color: palette.gray, textDecoration: "none", fontSize: "0.95rem", fontWeight: 600 }}>Nos Guides</a>
              </li>
              <li style={{ marginBottom: "0.7rem" }}>
                <a href="/#reservations" style={{ color: palette.gray, textDecoration: "none", fontSize: "0.95rem", fontWeight: 600 }}>Réservations</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h3 style={{ color: palette.accent, fontWeight: 900, marginBottom: "1rem", fontSize: "1.1rem" }}>
              Support
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li style={{ marginBottom: "0.7rem" }}>
                <a href="/#faq" style={{ color: palette.gray, textDecoration: "none", fontSize: "0.95rem", fontWeight: 600 }}>FAQ</a>
              </li>
              <li style={{ marginBottom: "0.7rem" }}>
                <a href="/#contact" style={{ color: palette.gray, textDecoration: "none", fontSize: "0.95rem", fontWeight: 600 }}>Contact</a>
              </li>
              <li style={{ marginBottom: "0.7rem" }}>
                <a href="/#help" style={{ color: palette.gray, textDecoration: "none", fontSize: "0.95rem", fontWeight: 600 }}>Centre d'aide</a>
              </li>
            </ul>
          </div>

          {/* Column 4: Légal */}
          <div>
            <h3 style={{ color: palette.blueAccent, fontWeight: 900, marginBottom: "1rem", fontSize: "1.1rem" }}>
              Légal
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li style={{ marginBottom: "0.7rem" }}>
                <a href="/#conditions" style={{ color: palette.gray, textDecoration: "none", fontSize: "0.95rem", fontWeight: 600 }}>Conditions d'utilisation</a>
              </li>
              <li style={{ marginBottom: "0.7rem" }}>
                <a href="/#privacy" style={{ color: palette.gray, textDecoration: "none", fontSize: "0.95rem", fontWeight: 600 }}>Politique de confidentialité</a>
              </li>
              <li style={{ marginBottom: "0.7rem" }}>
                <a href="/#cookies" style={{ color: palette.gray, textDecoration: "none", fontSize: "0.95rem", fontWeight: 600 }}>Gestion des cookies</a>
              </li>
            </ul>
          </div>

          {/* Column 5: Réseaux Sociaux */}
          <div>
            <h3 style={{ color: palette.softBlue, fontWeight: 900, marginBottom: "1rem", fontSize: "1.1rem" }}>
              Nous Suivre
            </h3>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <a href="#" style={{ fontSize: "1.3rem", textDecoration: "none", color: palette.blueAccent }}>🔵 Facebook</a>
              <a href="#" style={{ fontSize: "1.3rem", textDecoration: "none", color: palette.blueAccent }}>📱 Instagram</a>
              <a href="#" style={{ fontSize: "1.3rem", textDecoration: "none", color: palette.blueAccent }}>🐦 Twitter</a>
            </div>
          </div>
        </div>

        <hr style={{ borderColor: palette.lightBlue, marginBottom: "1.5rem" }} />

        {/* Bottom footer */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          textAlign: "center"
        }}>
          <div style={{ fontSize: ".9rem", color: palette.gray, fontWeight: 600 }}>
            &copy; 2025 DZ-TourGuide. Tous droits réservés. • Algérie
          </div>
          <div style={{ fontSize: ".9rem", color: palette.softBlue, fontWeight: 600 }}>
            Partenaires: ONAT • Offices de Tourisme Locaux
          </div>
        </div>
      </footer>

      {/* Responsive tweaks */}
      <style jsx global>{`
        @media (max-width: 900px) {
          section, footer { padding-left: 1vw !important; padding-right: 1vw !important; }
          h2 { margin-left: 0 !important; }
        }
        @media (max-width: 650px) {
          form { min-width: 92vw !important; max-width: 100vw !important; }
          .footer, section { font-size: 0.92rem; }
        }
        @media (max-width: 500px) {
          .footer, section { font-size: 0.86rem; }
        }
      `}</style>
    </div>
  );
}
