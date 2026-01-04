"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import "./page.css"; // إذا لديك css إضافي

const palette = {
  darkBg: "#0b0f0e",
  heroDark: "#121816",
  cardMuted: "#fdf7dd",
  primary: "#44b13b",
  primarySoft: "#d1f4c8",
  primaryDeep: "#14532d",
  textMain: "#0f172a",
  textMuted: "#6b7280",
};

const videoList = [
  "/vecteezy_aerial-view-of-fort-santa-cruz-and-oran-algeria_22242715.mp4",
  "/vecteezy_aerial-view-of-the-royal-mausoleum-of-mauretania-algeria_20304747 (1).mp4",
  "/AdobeStock_585938285_Video_HD_Preview.mp4",
];

export default function HomePage() {
  const [currentVideo, setCurrentVideo] = useState(0);

  const handleVideoEnd = () => {
    setCurrentVideo((prev) => (prev + 1) % videoList.length);
  };

  return (
    <main className="min-h-screen text-slate-50" style={{ backgroundColor: palette.darkBg }}>
      {/* ===== HERO SECTION ===== */}
      <section className="hero relative overflow-hidden">
        <video
          key={currentVideo}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          onEnded={handleVideoEnd}
        >
          <source src={videoList[currentVideo]} />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r text-slate-200 " />

        <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 py-28 text-center md:py-32">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className=" text-slate-200 text-3xl font-extrabold $  sm:text-4xl lg:text-5xl"
          >
            <span className=" text-green-700 text-shadow-green-200  ">
              Explore Algeria with{" "}
            </span>
            <span className=" text-slate-200  underline" style={{ textDecorationColor: palette.primary }}>
              Local Experts
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="max-w-xl mx-auto text-sm text-slate-200 sm:text-base"
          >
            Discover authentic tours, hidden gems, and unforgettable experiences guided by certified locals.
          </motion.p>

          <div className="hero-actions mt-6 flex justify-center gap-4">
            <Link href="/tours" className="btn-primary px-5 py-2 rounded-full text-white font-semibold" style={{ backgroundColor: palette.primary }}>
              Explore Tours
            </Link>
            <Link href="/booking" className="btn-primary px-5 py-2 rounded-full text-white font-semibold" style={{ backgroundColor: palette.primaryDeep }}>
              My Bookings
            </Link>
          </div>
        </div>
      </section>

      {/* ===== POPULAR TOURS ===== */}
      <section className="popular bg-slate-50 py-14 text-slate-900">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-extrabold mb-6">Popular Tours</h2>

          <div className="tour-preview-grid grid gap-6 md:grid-cols-3">
            <div className="tour-preview rounded-2xl overflow-hidden shadow-md bg-white p-4">
              <img src="/images/casbah.jpg" alt="Casbah" className="w-full h-40 object-cover rounded-md" />
              <h4 className="mt-2 font-bold text-slate-900">Casbah Historical Walk</h4>
              <p className="text-sm text-slate-500">Algiers • 4 Hours</p>
              <span className="mt-1 block font-semibold text-slate-800">From 3,500 DZD</span>
            </div>

            <div className="tour-preview rounded-2xl overflow-hidden shadow-md bg-white p-4">
              <img src="/images/sahara.jpg" alt="Sahara" className="w-full h-40 object-cover rounded-md" />
              <h4 className="mt-2 font-bold text-slate-900">Sahara Desert Adventure</h4>
              <p className="text-sm text-slate-500">Djanet • 3 Days</p>
              <span className="mt-1 block font-semibold text-slate-800">From 45,000 DZD</span>
            </div>

            <div className="tour-preview rounded-2xl overflow-hidden shadow-md bg-white p-4">
              <img src="/images/oran.jpg" alt="Oran" className="w-full h-40 object-cover rounded-md" />
              <h4 className="mt-2 font-bold text-slate-900">Hidden Gems of Oran</h4>
              <p className="text-sm text-slate-500">Oran • 4 Hours</p>
              <span className="mt-1 block font-semibold text-slate-800">From 6,000 DZD</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
