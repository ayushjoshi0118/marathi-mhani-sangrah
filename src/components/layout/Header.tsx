'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  Search,
  Sparkles,
  Gamepad2,
  Heart,
  Info,
  Menu,
  X,
  Compass,
  Bookmark,
  Share2,
  ShieldCheck
} from 'lucide-react';
import ThemeToggle from '@/components/layout/ThemeToggle';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState<number>(0);

  // Sync favorites count from localStorage
  useEffect(() => {
    const updateFavs = () => {
      try {
        const saved = localStorage.getItem('marathi_mhani_favorites');
        if (saved) {
          const parsed = JSON.parse(saved);
          setFavoritesCount(Array.isArray(parsed) ? parsed.length : 0);
        } else {
          setFavoritesCount(0);
        }
      } catch (e) {
        setFavoritesCount(0);
      }
    };

    updateFavs();
    window.addEventListener('storage', updateFavs);
    window.addEventListener('favorites-updated', updateFavs);
    return () => {
      window.removeEventListener('storage', updateFavs);
      window.removeEventListener('favorites-updated', updateFavs);
    };
  }, []);

  const navLinks = [
    { href: '/', label: 'मुख्यपृष्ठ', en: 'Home' },
    { href: '/mhani', label: 'सर्व म्हणी', en: 'All 1,000 Proverbs' },
    { href: '/vishay', label: 'विषयानुसार', en: 'Categories' },
    { href: '/aajchi-mhan', label: 'आजची म्हण', en: 'Daily Proverb', badge: 'दररोज' },
    { href: '/khel', label: 'खेळ व चाचणी', en: 'Quiz & Games', highlight: true },
    {
      href: '/aavadtaye-mhani',
      label: 'आवडत्या',
      en: 'Favorites',
      count: favoritesCount,
    },
    { href: '/aamchyavishayi', label: 'आमच्याविषयी', en: 'About' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-ivory-50/95 backdrop-blur-md border-b border-ivory-300 transition-all">
      {/* Top Banner Ribbon */}
      <div className="bg-gradient-to-r from-ink-900 via-ink-800 to-ink-900 text-ivory-100 text-xs py-1.5 px-4 text-center tracking-wide font-devanagari flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-saffron-500 animate-pulse"></span>
        <span>मराठी संस्कृतीचा अनमोल ठेवा, १,००० अस्सल म्हणींचा प्रमाणित डिजिटल संग्रह</span>
        <span className="hidden sm:inline text-antiquegold-300 font-sans">| 1,000 Verified Marathi Proverbs</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Calligraphic Mark */}
          <Link
            href="/"
            className="flex items-center gap-3.5 group focus:outline-none focus:ring-2 focus:ring-saffron-500 rounded-lg p-1"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-saffron-500 to-terracotta-700 flex items-center justify-center text-ivory-50 shadow-manuscript group-hover:scale-105 transition-transform">
              <span className="font-rozha text-2xl font-bold tracking-tight">म्ह</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-rozha text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight leading-none group-hover:text-saffron-600 transition-colors">
                  मराठी म्हणी
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-saffron-100 text-saffron-800 font-bold border border-saffron-300">
                  संग्रह
                </span>
              </div>
              <p className="text-xs text-ink-600 font-sans tracking-tight mt-0.5">
                Marathi Mhani Sangrah — Digital Library of Wisdom
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname === link.href || pathname.startsWith(link.href + '/');

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'text-saffron-700 bg-saffron-50 font-semibold shadow-xs'
                      : 'text-ink-700 hover:text-saffron-600 hover:bg-ivory-200/60'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300 font-bold">
                      {link.badge}
                    </span>
                  )}
                  {link.count !== undefined && link.count > 0 && (
                    <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-rose-600 text-white font-bold">
                      {link.count}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-saffron-600 rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            <Link
              href="/mhani?focus=search"
              aria-label="म्हणी शोधा"
              className="p-2.5 rounded-lg text-ink-700 hover:text-saffron-600 hover:bg-ivory-200 transition-colors focus:outline-none focus:ring-2 focus:ring-saffron-500 flex items-center gap-1.5"
              title="म्हणी शोधा (Search)"
            >
              <Search className="w-5 h-5" />
              <span className="hidden md:inline text-xs font-medium text-ink-600 bg-ivory-200 px-2 py-0.5 rounded border border-ivory-300">
                शोधा
              </span>
            </Link>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-ink-800 hover:bg-ivory-200 focus:outline-none focus:ring-2 focus:ring-saffron-500"
              aria-label="मेनू उघडा"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-ivory-300 bg-ivory-50 px-4 pt-3 pb-6 space-y-2 shadow-manuscript-lg animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname === link.href || pathname.startsWith(link.href + '/');

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-saffron-500 text-white font-semibold'
                    : 'text-ink-800 hover:bg-ivory-200'
                }`}
              >
                <div>
                  <span className="block text-base leading-tight">{link.label}</span>
                  <span className={`text-xs block ${isActive ? 'text-ivory-200' : 'text-ink-500'}`}>
                    {link.en}
                  </span>
                </div>
                {link.count !== undefined && link.count > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold">
                    {link.count}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-ivory-300 flex items-center justify-between text-xs text-ink-600 px-2">
            <div className="flex items-center gap-2">
              <span className="text-xs">पार्श्वभूमी रंग:</span>
              <ThemeToggle showLabel={true} />
            </div>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-saffron-700 hover:underline flex items-center gap-1 font-medium"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>संपादकीय कक्ष</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
