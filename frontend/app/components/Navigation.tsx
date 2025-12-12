'use client';

import { useState } from "react";
import {
  FaHome,
  FaShoppingBasket,
  FaHeart,
  FaEnvelope,
  FaUserCircle,
  FaBell,
  FaMoon,
  FaSun,
  FaBars,
  FaTimes
} from "react-icons/fa";

// Helper function for icon color
const getIconColor = (darkMode: boolean) => darkMode ? "#fff" : "#4A6B8A";

export default function Navigation() {
  const [profileMenu, setProfileMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  // Shared button style
  const navBtnStyle = (hover: boolean) => ({
    color: getIconColor(darkMode),
    textDecoration: "none",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontWeight: 600,
    fontSize: "1.05rem",
    padding: "0.45rem 1rem",
    borderRadius: "12px",
    background: hover ? "rgba(74,107,138,0.14)" : "none",
    transition: "background 0.18s, color 0.18s, transform 0.2s",
    position: "relative",
    cursor: "pointer",
  });

  // Icon-only hover for main nav buttons
  const [hoverTab, setHoverTab] = useState("");

  return (
    <>
      <nav
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.25rem 1.2rem",
          background: darkMode ? "#233558" : "rgba(255,255,255,0.92)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 2px 18px rgba(80,120,150,0.09)",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1200,
          borderBottom: `1px solid ${darkMode ? "#3A5378" : "#E5E5E5"}`,
          transition: "all 0.3s",
          minHeight: "54px"
        }}
      >
        {/* Logo only */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img
            src="/logo.jpg"
            alt="DZ-TourGuide Logo"
            style={{
              height: 38,
              borderRadius: 7,
              background: "#FFF",
              boxShadow: "0 2px 8px rgba(0,0,0,0.07)"
            }}
          />
        </a>
        
        {/* Desktop nav */}
        <div
          className="desktop-nav"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.7 rem"
          }}
        >
          {/* Accueil */}
          <a
            href="/"
            style={navBtnStyle(hoverTab === "home")}
            onMouseEnter={() => setHoverTab("home")}
            onMouseLeave={() => setHoverTab("")}
          >
            <FaHome size={22} />
            <span style={{ marginTop: 3 }}>{/*[translate:Accueil]*/}Accueil</span>
          </a>
          {/* Réservation */}
          <a
            href="/reservations"
            style={navBtnStyle(hoverTab === "reservation")}
            onMouseEnter={() => setHoverTab("reservation")}
            onMouseLeave={() => setHoverTab("")}
          >
            <FaShoppingBasket size={22} />
            <span style={{ marginTop: 3 }}>Réservation</span>
          </a>
          {/* Favoris */}
          <a
            href="/favoris"
            style={navBtnStyle(hoverTab === "favoris")}
            onMouseEnter={() => setHoverTab("favoris")}
            onMouseLeave={() => setHoverTab("")}
          >
            <FaHeart size={22} />
            <span style={{ marginTop: 3 }}>Favoris</span>
          </a>
          {/* Message */}
          <a
            href="/contact"
            style={navBtnStyle(hoverTab === "contact")}
            onMouseEnter={() => setHoverTab("contact")}
            onMouseLeave={() => setHoverTab("")}
          >
            <FaEnvelope size={22} />
            <span style={{ marginTop: 3 }}>Message</span>
          </a>

          {/* Profil dropdown */}
          <div
            style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}
            onMouseLeave={() => setProfileMenu(false)}
          >
            <button
              style={{
                ...navBtnStyle(hoverTab === "profil"),
                background: hoverTab === "profil" ? "rgba(74,107,138,0.14)" : "none",
                border: "none",
                cursor: "pointer",
                padding: "0.45rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: 54
              }}
              onMouseEnter={() => setHoverTab("profil")}
              onMouseLeave={() => setHoverTab("")}
              onClick={() => setProfileMenu(!profileMenu)}
            >
              <FaUserCircle size={24} />
              <span style={{ marginTop: 2, display: "block" }}>Profil</span>
            </button>
            {profileMenu && (
              <div
                style={{
                  position: "absolute",
                  top: 44,
                  right: -10,
                  background: darkMode ? "#233558" : "#FFF",
                  borderRadius: 16,
                  boxShadow: "0 12px 32px rgba(80,120,150,0.18)",
                  padding: '1.2rem 1.8rem',
                  minWidth: 210,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.2rem',
                  alignItems: "flex-start",
                  border: `1px solid ${darkMode ? "#3A5378" : "#E5E5E5"}`,
                  animation: "fadeIn 0.2s ease-out",
                }}
              >
                <a href="/login" style={{
                  color: getIconColor(darkMode),
                  fontWeight: 700,
                  textDecoration: 'none',
                  padding: "0.3rem 0",
                  fontSize: "1rem"
                }}
                onMouseEnter={e => e.target.style.color = "#7FC8A9"}
                onMouseLeave={e => e.target.style.color = getIconColor(darkMode)}
                >S'inscrire / Se connecter</a>
                <button style={{
                  background: 'none',
                  border: 'none',
                  color: getIconColor(darkMode),
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  padding: "0.3rem 0",
                  fontSize: "1rem"
                }}
                onMouseEnter={e => e.target.style.color = "#7FC8A9"}
                onMouseLeave={e => e.target.style.color = getIconColor(darkMode)}
                >
                  <FaBell size={19} style={{ marginRight: 10 }} /> Notifications
                </button>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: "0.3rem 0"
                }}>
                  <span style={{
                    color: getIconColor(darkMode), fontWeight: 600,
                    fontSize: "1rem"
                  }}>Apparence:</span>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: "0.3rem",
                      borderRadius: "50%",
                      transition: "background 0.2s"
                    }}
                  >
                    {darkMode ? <FaSun size={19} color="#F9B872" /> : <FaMoon size={19} color={getIconColor(darkMode)} />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Burger menu mobile */}
        <button
          className="mobile-nav-toggle"
          style={{
            display: "none",
            background: "none",
            border: "none",
            fontSize: "2rem",
            color: getIconColor(darkMode),
            cursor: "pointer",
            padding: "0.4rem",
            borderRadius: "8px",
            transition: "background 0.2s"
          }}
          onClick={() => setMobileMenu(!mobileMenu)}
          aria-label="Ouvrir le menu"
        >
          {mobileMenu ? <FaTimes /> : <FaBars />}
        </button>

        {/* Mobile menu */}
        <div
          className="mobile-nav"
          style={{
            display: mobileMenu ? "flex" : "none",
            flexDirection: "column",
            position: "fixed",
            top: 54,
            right: 0,
            width: "260px",
            height: "calc(100vh - 54px)",
            background: darkMode ? "#233558" : "#FFF",
            boxShadow: "-4px 0 18px rgba(80,120,150,0.12)",
            zIndex: 1250,
            borderLeft: `1px solid ${darkMode ? "#3A5378" : "#E5E5E5"}`,
            animation: "slideIn 0.3s ease-out"
          }}
        >
          {/* Les boutons identiques, personnalisés pour le mobile */}
          {[
            { href: "/", label: "Accueil", icon: <FaHome size={22} /> },
            { href: "/reservations", label: "Réservation", icon: <FaShoppingBasket size={22} /> },
            { href: "/favoris", label: "Favoris", icon: <FaHeart size={22} /> },
            { href: "/contact", label: "Message", icon: <FaEnvelope size={22} /> },
          ].map(tab => (
            <a
              key={tab.label}
              href={tab.href}
              style={{
                color: getIconColor(darkMode),
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "1.09rem",
                padding: "1.05rem 1.4rem",
                display: "flex",
                alignItems: "center",
                borderBottom: `1px solid ${darkMode ? "#3A5378" : "#E5E5E5"}`,
                gap: '1rem',
                transition: "background 0.2s",
                cursor: "pointer",
                borderRadius: "8px",
                margin: "0.12rem 0",
              }}
              onClick={() => setMobileMenu(false)}
              onMouseEnter={e => e.target.style.background = darkMode ? "rgba(255,255,255,0.09)" : "rgba(74,107,138,0.14)"}
              onMouseLeave={e => e.target.style.background = "none"}
            >
              {tab.icon} {tab.label}
            </a>
          ))}
          <button
            style={{
              color: getIconColor(darkMode),
              background: "none",
              border: "none",
              fontWeight: 600,
              fontSize: "1.09rem",
              padding: "1.05rem 1.4rem",
              display: "flex",
              alignItems: "center",
              borderBottom: `1px solid ${darkMode ? "#3A5378" : "#E5E5E5"}`,
              gap: '1rem',
              transition: "background 0.2s",
              cursor: "pointer",
              borderRadius: "8px",
              margin: "0.12rem 0",
            }}
            onClick={() => {
              setProfileMenu(!profileMenu);
              setMobileMenu(false);
            }}
            onMouseEnter={e => e.target.style.background = darkMode ? "rgba(255,255,255,0.09)" : "rgba(74,107,138,0.14)"}
            onMouseLeave={e => e.target.style.background = "none"}
          >
            <FaUserCircle size={22} style={{ marginRight: 10 }} /> Profil
          </button>
          <div style={{
            display: profileMenu ? "flex" : "none",
            flexDirection: "column",
            padding: "1rem",
            borderTop: `1px solid ${darkMode ? "#3A5378" : "#E5E5E5"}`,
            marginTop: "1rem"
          }}>
            <a href="/login" style={{
              color: getIconColor(darkMode),
              fontWeight: 700,
              textDecoration: 'none',
              fontSize: "1rem"
            }}
            >S'inscrire / Se connecter</a>
            <button style={{
              background: 'none',
              border: 'none',
              color: getIconColor(darkMode),
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              fontSize: "1rem"
            }}>
              <FaBell size={20} style={{ marginRight: 8 }} /> Notifications
            </button>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: "1rem"
            }}>
              Apparence:
              <button
                onClick={() => setDarkMode(!darkMode)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: "0.3rem",
                  borderRadius: "50%",
                }}
              >
                {darkMode ? <FaSun size={19} color="#F9B872" /> : <FaMoon size={19} color={getIconColor(darkMode)} />}
              </button>
            </div>
          </div>
        </div>
      </nav>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @media (max-width: 860px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-toggle { display: block !important; }
        }
        @media (min-width: 861px) {
          .mobile-nav { display: none !important; }
          .mobile-nav-toggle { display: none !important; }
          .desktop-nav { display: flex !important; }
        }
      `}</style>
    </>
  );
}
