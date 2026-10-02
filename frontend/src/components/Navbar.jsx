import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';

export default function Navbar({ currentPage, setCurrentPage, onOpenLogin, userRole }) {
  const [activeSection, setActiveSection] = useState('home');

  // I-track kung anong section ang tinitingnan habang nag-i-scroll
  useEffect(() => {
    if (currentPage !== 'landing') return;

    const handleScroll = () => {
      const aboutEl = document.getElementById('about');
      const featuresEl = document.getElementById('features');

      if (aboutEl) {
        const aboutRect = aboutEl.getBoundingClientRect();
        if (aboutRect.top <= 250 && aboutRect.bottom >= 200) {
          setActiveSection('about');
          return;
        }
      }

      if (featuresEl) {
        const featRect = featuresEl.getBoundingClientRect();
        if (featRect.top <= 250 && featRect.bottom >= 200) {
          setActiveSection('features');
          return;
        }
      }

      if (window.scrollY < 300) {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  const handleNavClick = (sectionId) => {
    if (currentPage !== 'landing') {
      setCurrentPage('landing');
      setTimeout(() => {
        scrollToId(sectionId);
      }, 100);
    } else {
      scrollToId(sectionId);
    }
  };

  const scrollToId = (id) => {
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('home');
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick('home')} 
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <img src={logo} alt="REHAVA Logo" className="h-8 w-auto object-contain" />
          <span className="font-extrabold text-xl tracking-tight text-slate-800">
            REHA<span className="text-pink-600">VA</span>
          </span>
        </div>

        {/* Center Nav Links with Active Indicator */}
        <div className="hidden md:flex items-center gap-1.5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className={`px-3.5 py-1.5 rounded-full transition ${
              currentPage === 'landing' && activeSection === 'home'
                ? 'bg-pink-50 text-pink-600 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Home
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('features')}
            className={`px-3.5 py-1.5 rounded-full transition ${
              currentPage === 'landing' && activeSection === 'features'
                ? 'bg-pink-50 text-pink-600 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Features
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('about')}
            className={`px-3.5 py-1.5 rounded-full transition ${
              currentPage === 'landing' && activeSection === 'about'
                ? 'bg-pink-50 text-pink-600 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            About System
          </button>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          {currentPage === 'dashboard' ? (
            <>
              <span className="text-xs bg-pink-50 text-pink-700 border border-pink-200 px-3 py-1.5 rounded-full font-semibold">
                {userRole || 'Active Clinician'}
              </span>
              <button
                onClick={() => setCurrentPage('landing')}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium ml-2"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onOpenLogin}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3.5 py-2 transition"
              >
                Sign In
              </button>
              <button
                onClick={onOpenLogin}
                className="bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-md shadow-pink-200 transition"
              >
                Get Started
              </button>
            </>
          )}
        </div>

      </nav>
    </header>
  );
}