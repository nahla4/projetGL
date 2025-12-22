'use client';

import { useState } from 'react';
import {
  FaUserCircle,
  FaBell,
  FaMoon,
  FaSun,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const mainLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/booking', label: 'Réservations' }, // matches /app/booking/page.tsx
  { href: '/favoris', label: 'Favoris' },
  { href: '/destinations', label: 'Destinations' },
  { href: '/contact', label: 'Contact' },
];

export default function Navigation() {
  const [profileMenu, setProfileMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const pathname = usePathname();

  const toggleTheme = () => setDarkMode((v) => !v);

  return (
    <>
      {/* Transparent fixed wrapper */}
      <header className="pointer-events-none fixed inset-x-0 top-4 z-40 flex justify-center px-4">
        {/* Capsule nav */}
        <nav className="pointer-events-auto flex w-full max-w-6xl items-center justify-between rounded-full bg-slate-900/60 px-5 py-2 text-sm text-slate-50 shadow-[0_18px_45px_rgba(0,0,0,0.45)] backdrop-blur-md border border-white/10">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-base font-semibold tracking-tight"
          >
            <img
              src="/logo.jpg"
              alt="DZ‑TourGuide"
              className="h-9 w-9 rounded-full border border-emerald-400/60 bg-white object-cover shadow"
            />
            <span className="hidden sm:inline">
              DZ
              <span className="text-emerald-400">‑TourGuide</span>
            </span>
          </Link>

          {/* Desktop center links */}
          <div className="hidden flex-1 items-center justify-center gap-1 md:flex">
            {mainLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition
                  hover:bg-white/10 hover:text-white ${
                    active ? 'bg-white/15 text-emerald-200' : 'text-slate-200'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right icons + CTA (desktop) */}
          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-slate-100 hover:bg-white/15"
              onClick={() => setProfileMenu((v) => !v)}
            >
              <FaUserCircle className="text-lg" />
            </button>

            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-slate-100 hover:bg-white/15"
            >
              <FaBell className="text-[0.95rem]" />
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-slate-100 hover:bg-white/15"
            >
              {darkMode ? (
                <FaSun className="text-amber-300" />
              ) : (
                <FaMoon className="text-slate-200" />
              )}
            </button>

            {/* CTA -> booking page */}
            <Link
              href="/booking"
              className="ml-1 inline-flex items-center rounded-full bg-emerald-500 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-400"
            >
              Réserver un guide
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-slate-100 hover:bg-white/15 md:hidden"
            onClick={() => setMobileMenu((v) => !v)}
            aria-label="Basculer le menu"
          >
            {mobileMenu ? <FaTimes /> : <FaBars />}
          </button>
        </nav>
      </header>

      {/* Profile dropdown (desktop) */}
      {profileMenu && (
        <div className="fixed right-[calc(50%-3rem)] top-20 z-40 hidden w-56 -translate-x-1/2 rounded-2xl border border-slate-800/80 bg-slate-900/95 p-4 text-sm text-slate-100 shadow-2xl md:block">
          {/* Link to auth pages */}
          <Link
            href="/auth/login"
            className="block rounded-md px-2 py-2 font-semibold text-slate-50 hover:bg-white/10"
            onClick={() => setProfileMenu(false)}
          >
            Se connecter
          </Link>
          <Link
            href="/auth/register"
            className="mt-1 block rounded-md px-2 py-2 font-semibold text-slate-50 hover:bg-white/10"
            onClick={() => setProfileMenu(false)}
          >
            S&apos;inscrire
          </Link>

          <button className="mt-1 flex w-full items-center rounded-md px-2 py-2 text-left hover:bg-white/10">
            <FaBell className="mr-2" /> Notifications
          </button>

          <div className="mt-2 flex items-center justify-between rounded-md px-2 py-2 hover:bg-white/5">
            <span>Apparence</span>
            <button
              onClick={toggleTheme}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40"
            >
              {darkMode ? (
                <FaSun className="text-amber-300" />
              ) : (
                <FaMoon className="text-slate-100" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Mobile overlay menu */}
      {mobileMenu && (
        <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden">
          <div className="absolute right-0 top-16 w-72 rounded-l-3xl bg-slate-950/95 p-5 text-slate-50 shadow-2xl ring-1 ring-slate-800">
            <div className="space-y-2 text-sm">
              {mainLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block rounded-xl px-4 py-2 font-semibold transition ${
                      active
                        ? 'bg-emerald-600 text-white'
                        : 'hover:bg-white/10'
                    }`}
                    onClick={() => setMobileMenu(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <hr className="my-3 border-slate-700" />

              <Link
                href="/auth/login"
                className="block rounded-xl px-4 py-2 font-semibold hover:bg-white/10"
                onClick={() => setMobileMenu(false)}
              >
                Se connecter
              </Link>
              <Link
                href="/auth/register"
                className="block rounded-xl px-4 py-2 font-semibold hover:bg-white/10"
                onClick={() => setMobileMenu(false)}
              >
                S&apos;inscrire
              </Link>

              <button className="flex w-full items-center rounded-xl px-4 py-2 text-left hover:bg-white/10">
                <FaBell className="mr-2" /> Notifications
              </button>

              <div className="mt-2 flex items-center justify-between rounded-xl px-4 py-2 hover:bg-white/5">
                <span className="text-sm font-semibold">Apparence</span>
                <button
                  onClick={() => {
                    toggleTheme();
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40"
                >
                  {darkMode ? (
                    <FaSun className="text-amber-300" />
                  ) : (
                    <FaMoon className="text-slate-100" />
                  )}
                </button>
              </div>

              <Link
                href="/booking"
                className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow shadow-emerald-500/40 hover:bg-emerald-400"
                onClick={() => setMobileMenu(false)}
              >
                Réserver un guide
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
