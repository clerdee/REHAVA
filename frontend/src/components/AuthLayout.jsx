import React from 'react';

export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-slate-50">
      
      {/* 1. Precision Grid Pattern (SVG Tile) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid-pattern" width="36" height="36" patternUnits="userSpaceOnUse">
            <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#e2e8f0" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      </svg>

      {/* 2. Top-Left Vibrant Ambient Orb */}
      <div 
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(244,63,94,0.25) 0%, rgba(251,113,133,0.1) 50%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* 3. Bottom-Right Ambient Orb */}
      <div 
        className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, rgba(244,63,94,0.08) 50%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* 4. Kinematic Biomechanical Waveform SVG Backdrop */}
      <div className="absolute bottom-0 left-0 right-0 w-full pointer-events-none leading-none">
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-44 sm:h-64 object-cover opacity-70"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="gaitFlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25" />
              <stop offset="35%" stopColor="#fb7185" stopOpacity="0.35" />
              <stop offset="70%" stopColor="#ec4899" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#fda4af" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <path
            fill="url(#gaitFlow)"
            d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,144C672,139,768,181,864,197.3C960,213,1056,203,1152,176C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* 5. Center Form Container */}
      <div className="relative z-10 w-full flex justify-center items-center">
        {children}
      </div>
    </div>
  );
}