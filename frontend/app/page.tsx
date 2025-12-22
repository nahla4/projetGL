"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const palette = {
  darkBg: "#0b0f0e",
  heroDark: "#121816",
  darkSection: "#111827",
  cardBg: "#ffffff",
  cardMuted: "#fdf7dd",
  primary: "#44b13b",
  primarySoft: "#d1f4c8",
  primaryDeep: "#14532d",
  textMain: "#0f172a",
  textMuted: "#6b7280",
  accentOrange: "#fbbf24",
  accentYellow: "#facc15",
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
  { id: 16, name: "Alger", img: "/wilaya_alger.jpg" },
  { id: 6, name: "Béjaïa", img: "/wilaya_bejaia.jpg" },
  { id: 19, name: "Sétif", img: "/wilaya_setif.jpg" },
  { id: 8, name: "Blida", img: "/wilaya_blida.jpg" },
  { id: 31, name: "Oran", img: "/wilaya_oran.jpg" },
  { id: 33, name: "Ouargla", img: "/wilaya_ouargla.jpg" },
];

const newsCards = [
  {
    id: 1,
    image: "/getyourguide_sample1.jpg",
    type: "EXCURSION",
    title: "Visite de la Casbah d'Alger  Immersion historique",
    subtitle: "3 heures • Coupe-file • Guide francophone",
    rating: 4.7,
    reviews: 82,
    price: 35,
    currency: "da",
    badge: "Nouveau",
  },
  {
    id: 2,
    image: "/getyourguide_sample2.jpg",
    type: "BILLET D'ENTRÉE",
    title: "Palais du Bey de Constantine  Découverte culturelle",
    subtitle: "2 heures • Accès prioritaire • En petit groupe",
    rating: 4.8,
    reviews: 67,
    price: 28,
    currency: "da",
    badge: "Populaire",
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
    currency: "da",
    badge: "Coup de cœur",
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
    currency: "da",
  },
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
    rating: 4.8,
  },
  {
    id: 2,
    name: "Yassine Bessa",
    photo: "/guide_yassine.jpg",
    bio: "Guide saharien, expert circuits 4x4 & culture locale.",
    languages: ["français", "arabe"],
    wilayas: ["Timimoun", "Taghit"],
    certifications: ["Diplôme Guide sahara"],
    rating: 4.9,
  },
  {
    id: 3,
    name: "Leila Ouadah",
    photo: "/guide_leila.jpg",
    bio: "Gastronome, spécialiste circuits gourmands à Tlemcen.",
    languages: ["français", "espagnol"],
    wilayas: ["Tlemcen"],
    certifications: [],
    rating: 4.7,
  },
];

const whyFeatures = [
  {
    title: "Guides locaux certifiés",
    description:
      "Chaque guide DZ‑TourGuide est vérifié et connaît sa région dans les moindres détails.",
    icon: "🧑‍✈️",
  },
  {
    title: "Expériences 100 % sur‑mesure",
    description:
      "Créez votre visite avec le guide : rythme, thématiques et points d’intérêt.",
    icon: "🧭",
  },
  {
    title: "Réservation simple & rapide",
    description:
      "Choisissez une visite, validez, recevez immédiatement la confirmation et les contacts.",
    icon: "⚡",
  },
  {
    title: "Paiements adaptés à l’Algérie",
    description:
      "Carte Dahabia, CIB et autres moyens locaux pour payer en toute confiance.",
    icon: "💳",
  },
  {
    title: "Support client réactif",
    description:
      "Une équipe basée en Algérie pour répondre à vos questions avant et pendant la visite.",
    icon: "📞",
  },
  {
    title: "Avis transparents",
    description:
      "Notes et commentaires publics pour chaque guide et chaque expérience.",
    icon: "⭐",
  },
];

const testimonial = {
  quote:
    "DZ‑TourGuide nous a permis de découvrir Alger autrement, avec un guide passionné qui a adapté la visite à notre famille.",
  author: "Samir & Sarah",
  role: "Voyageurs en famille",
  rating: 5,
};

export default function HomePage() {
  const [selectedWilaya, setSelectedWilaya] = useState<string | null>(null);
  const [currentVideo, setCurrentVideo] = useState(0);

  const handleVideoEnd = () => {
    setCurrentVideo((prev) => (prev + 1) % videoList.length);
  };

  const filteredNews = selectedWilaya
    ? newsCards.filter(
        (n) =>
          n.title.toLowerCase().includes(selectedWilaya.toLowerCase()) ||
          n.subtitle.toLowerCase().includes(selectedWilaya.toLowerCase())
      )
    : newsCards;

  return (
    <main
      className="min-h-screen text-slate-50"
      style={{ backgroundColor: palette.darkBg }}
    >
      {/* HERO avec carrousel vidéo */}
      <section className="relative overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/75 to-black/40" />

        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-24 pt-28 md:pb-28 md:pt-32">
          <div className="flex flex-col gap-10 md:flex-row md:items-center">
            {/* Colonne gauche */}
            <div className="flex-1 space-y-6">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-balance text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl"
              >
                Explorez l’Algérie avec{" "}
                <span
                  className="underline"
                  style={{ textDecorationColor: palette.primary }}
                >
                  votre guide privé
                </span>
                .
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="max-w-xl text-sm text-slate-200 sm:text-base"
              >
                Réservez des visites créées par les guides : Casbah d’Alger,
                circuits sahariens, randonnées en Kabylie, expériences
                gourmandes et bien plus encore.
              </motion.p>
            </div>

            {/* Colonne droite vide pour l’instant */}
            <div className="flex-1" />
          </div>
        </div>
      </section>

      {/* POPULAR TOURS */}
      <section
        id="tours"
        className="bg-slate-50 py-14 text-slate-900 md:py-16"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p
                className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide"
                style={{
                  backgroundColor: palette.primarySoft,
                  color: palette.primaryDeep,
                }}
              >
                Visites populaires
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                Les expériences préférées des voyageurs
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Une sélection de visites guidées notées au‑dessus de 4,5/5
                par la communauté DZ‑TourGuide.
              </p>
            </div>
            <button
              className="inline-flex items-center justify-center rounded-full border px-4 py-2 text-xs font-semibold"
              style={{
                borderColor: palette.primary,
                color: palette.primaryDeep,
              }}
            >
              Voir toutes les visites
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {filteredNews.map((card) => (
              <motion.article
                key={card.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-100"
              >
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="h-full w-full object-cover"
                  />
                  {card.badge && (
                    <span
                      className="absolute left-2 top-2 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-md"
                      style={{ backgroundColor: palette.primary }}
                    >
                      {card.badge}
                    </span>
                  )}
                  <button
                    aria-label="Ajouter aux favoris"
                    className="absolute right-2 top-2 rounded-full bg-white/90 p-1 text-xs shadow"
                    style={{ color: palette.primaryDeep }}
                  >
                    ♥
                  </button>
                </div>
                <div className="flex flex-1 flex-col gap-2 px-4 py-3">
                  <p
                    className="text-[11px] font-semibold uppercase tracking-wide"
                    style={{ color: palette.primaryDeep }}
                  >
                    {card.type}
                  </p>
                  <h3 className="line-clamp-2 text-sm font-bold text-slate-900">
                    {card.title}
                  </h3>
                  <p className="line-clamp-2 text-xs text-slate-500">
                    {card.subtitle}
                  </p>
                  <div className="mt-1 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <span className="text-amber-500">
                        ★ {card.rating.toFixed(1)}
                      </span>
                      <span className="text-slate-500">
                        ({card.reviews})
                      </span>
                    </div>
                    <p
                      className="font-semibold"
                      style={{ color: palette.primaryDeep }}
                    >
                      Dès {card.price}
                      {card.currency}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* DESTINATIONS */}
      <section
        id="destinations"
        className="bg-slate-100 py-14 text-slate-900 md:py-16"
      >
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p
                className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide"
                style={{
                  backgroundColor: palette.primarySoft,
                  color: palette.primaryDeep,
                }}
              >
                Destinations DZ‑TourGuide
              </p>
              <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
                Les villes les plus demandées
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Cliquez sur une wilaya pour filtrer les visites
                correspondantes.
              </p>
            </div>
            <button
              onClick={() => setSelectedWilaya(null)}
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-white"
            >
              Réinitialiser le filtre
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            {wilayas.map((w) => (
              <button
                key={w.id}
                onClick={() =>
                  setSelectedWilaya(
                    selectedWilaya === w.name ? null : w.name
                  )
                }
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md"
                style={
                  selectedWilaya === w.name
                    ? { boxShadow: "0 0 0 2px rgba(68,177,59,1)" }
                    : undefined
                }
              >
                <div className="relative h-28 overflow-hidden">
                  <img
                    src={w.img}
                    alt={w.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                  <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-slate-50">
                    {w.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* WHY DZ‑TOURGUIDE */}
      <section className="bg-white py-14 text-slate-900 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <span
              className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide"
              style={{
                backgroundColor: palette.primarySoft,
                color: palette.primaryDeep,
              }}
            >
              Pourquoi nous choisir
            </span>
            <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
              Pourquoi DZ‑TourGuide est différent
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-500">
              Une plateforme 100 % pensée pour les visites guidées en
              Algérie, avec un modèle qui met les guides locaux au centre.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {whyFeatures.map((feature) => (
              <div
                key={feature.title}
                className="flex gap-3 rounded-2xl bg-slate-50 px-4 py-4 shadow-sm ring-1 ring-slate-100"
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-lg"
                  style={{ backgroundColor: palette.primarySoft }}
                >
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GUIDES */}
      <section
        id="guides"
        className="bg-slate-50 py-14 text-slate-900 md:py-16"
      >
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <span
              className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide"
              style={{
                backgroundColor: palette.primarySoft,
                color: palette.primaryDeep,
              }}
            >
              Nos guides partenaires
            </span>
            <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
              Rencontrez quelques‑uns de nos guides
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-500">
              Chaque guide fixe ses propres visites et partage sa passion
              pour sa région avec vous.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {guides.map((guide) => (
              <motion.a
                key={guide.id}
                href={`/guide/${guide.id}`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-100 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex flex-col items-center bg-emerald-50/40 px-5 pt-6">
                  <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-md">
                    <img
                      src={guide.photo}
                      alt={guide.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p
                    className="mt-2 rounded-full px-3 py-1 text-[11px] font-semibold text-white"
                    style={{ backgroundColor: palette.primary }}
                  >
                    ★ {guide.rating.toFixed(1)} / 5
                  </p>
                </div>
                <div className="flex flex-1 flex-col gap-2 px-5 pb-4 pt-3">
                  <h3 className="text-sm font-bold text-slate-900">
                    {guide.name}
                  </h3>
                  <p className="line-clamp-2 text-xs text-slate-500">
                    {guide.bio}
                  </p>
                  <p
                    className="text-xs font-semibold"
                    style={{ color: palette.primaryDeep }}
                  >
                    Langues : {guide.languages.join(" / ")}
                  </p>
                  <p className="text-xs text-slate-500">
                    Wilaya(s) :{" "}
                    <span className="font-semibold">
                      {guide.wilayas.join(", ")}
                    </span>
                  </p>
                  {guide.certifications.length > 0 && (
                    <p className="text-[11px] text-slate-400">
                      {guide.certifications.join(" • ")}
                    </p>
                  )}
                  <button
                    className="mt-2 inline-flex w-max items-center justify-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide"
                    style={{
                      borderColor: palette.primary,
                      color: palette.primaryDeep,
                    }}
                  >
                    Voir le profil
                  </button>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section
        className="py-14 text-slate-50 md:py-16"
        style={{ backgroundColor: palette.heroDark }}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 md:flex-row md:items-center">
          <div className="flex-1 space-y-4">
            <span
              className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide"
              style={{
                backgroundColor: "rgba(250,191,36,0.2)",
                color: palette.accentOrange,
              }}
            >
              Témoignage
            </span>
            <h2 className="text-2xl font-extrabold sm:text-3xl">
              Les voyageurs parlent de DZ‑TourGuide
            </h2>
            <p className="max-w-md text-sm text-slate-300">
              Les retours de la communauté nous aident à améliorer en
              continu les visites proposées par nos guides.
            </p>
            <div className="mt-4 grid gap-3 text-xs text-slate-200 sm:grid-cols-2">
              <div className="rounded-2xl bg-emerald-900/40 px-3 py-2 ring-1 ring-emerald-500/40">
                <p className="font-semibold">Trustpilot (bientôt)</p>
                <p className="text-emerald-200">5,0 / 5,0</p>
              </div>
              <div className="rounded-2xl bg-emerald-900/40 px-3 py-2 ring-1 ring-emerald-500/40">
                <p className="font-semibold">Avis internes</p>
                <p className="text-emerald-200">4,8 / 5,0</p>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="relative rounded-3xl bg-white p-6 text-slate-900 shadow-[0_20px_60px_rgba(0,0,0,0.75)]">
              <p className="text-sm leading-relaxed text-slate-700">
                “{testimonial.quote}”
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {testimonial.author}
                  </p>
                  <p className="text-xs text-slate-500">
                    {testimonial.role}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: testimonial.rating }).map((_, idx) => (
                    <span key={idx}>★</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PAIEMENT / CTA */}
      <section
        id="reservations"
        className="py-14 md:py-16"
        style={{ backgroundColor: palette.cardMuted, color: palette.textMain }}
      >
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-10 md:grid-cols-[3fr,2fr] md:items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                <span>🧳</span>
                <span>Paiement &amp; sécurité</span>
              </div>

              <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">
                Réservez en toute confiance
              </h2>
              <p className="mt-3 text-sm text-slate-700">
                Paiement sécurisé, confirmation instantanée et assistance
                locale pour toutes vos visites guidées en Algérie.
              </p>

              <ul className="mt-6 grid gap-4 text-sm">
                <li className="flex items-start gap-3">
                  <span className="mt-1 rounded-full bg-white/80 p-2 text-emerald-600">
                    🔒
                  </span>
                  <div>
                    <p className="font-semibold">
                      Paiements sécurisés (Carte Dahabia &amp; options
                      locales)
                    </p>
                    <p className="text-slate-700/80">
                      Données protégées et transactions chiffrées avec les
                      banques algériennes.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 rounded-full bg-white/80 p-2 text-emerald-600">
                    ⚡
                  </span>
                  <div>
                    <p className="font-semibold">
                      Confirmation instantanée des réservations
                    </p>
                    <p className="text-slate-700/80">
                      Recevez votre confirmation et les coordonnées du guide
                      en quelques secondes.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 rounded-full bg-white/80 p-2 text-emerald-600">
                    🧭
                  </span>
                  <div>
                    <p className="font-semibold">
                      Guides évalués par la communauté
                    </p>
                    <p className="text-slate-700/80">
                      Notes et avis vérifiés pour chaque guide et chaque
                      visite.
                    </p>
                  </div>
                </li>
              </ul>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-white shadow-lg"
                  style={{
                    backgroundColor: palette.primary,
                    boxShadow: "0 10px 30px rgba(68,177,59,0.6)",
                  }}
                >
                  Commencer une réservation
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="py-10 text-slate-200"
        style={{ backgroundColor: "#181f1b" }}
      >
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <img
                  src="/logo.jpg"
                  alt="DZ‑TourGuide"
                  className="h-9 w-9 rounded-full border border-emerald-400/60 bg-white object-cover shadow"
                />
                <span className="text-sm font-semibold">
                  DZ
                  <span className="text-emerald-400">‑TourGuide</span>
                </span>
              </div>
              <p className="mt-3 text-xs text-slate-400">
                Plateforme de réservation de guides touristiques locaux en
                Algérie pour des expériences authentiques.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">
                Navigation
              </h3>
              <ul className="mt-3 space-y-1 text-xs text-slate-400">
                <li>
                  <a href="#tours" className="hover:text-emerald-300">
                    Visites guidées
                  </a>
                </li>
                <li>
                  <a
                    href="#destinations"
                    className="hover:text-emerald-300"
                  >
                    Destinations
                  </a>
                </li>
                <li>
                  <a href="#guides" className="hover:text-emerald-300">
                    Nos guides
                  </a>
                </li>
                <li>
                  <a
                    href="#reservations"
                    className="hover:text-emerald-300"
                  >
                    Paiement &amp; FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">
                Contact
              </h3>
              <ul className="mt-3 space-y-1 text-xs text-slate-400">
                <li>Algérie · DZ‑TourGuide</li>
                <li>Tél : +213 (0)7 xx xx xx xx</li>
                <li>Email : contact@dz‑tourguide.dz</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">
                Paiement partenaire
              </h3>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                <span className="rounded bg-white/10 px-2 py-1">
                  Dahabia
                </span>
                <span className="rounded bg-white/10 px-2 py-1">CIB</span>
                <span className="rounded bg-white/10 px-2 py-1">
                  Stripe (international)
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-slate-800 pt-4 text-[11px] text-slate-500 md:flex-row">
            <p>© 2025 DZ‑TourGuide · Tous droits réservés.</p>
            <p>
              Mentions légales · Conditions d’utilisation · Politique de
              confidentialité
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
