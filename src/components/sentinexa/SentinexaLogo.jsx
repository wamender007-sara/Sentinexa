import React from 'react';

export default function SentinexaLogo({ size = 'md', variant = 'light', showSubtitle = true, className = '' }) {
  // Sizes: 'sm' (header/pill), 'md' (standard), 'lg' (hero/pitch)
  const iconSizes = {
    xs: 'w-5 h-5',
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    xs: 'text-xs tracking-wider',
    sm: 'text-sm tracking-wide',
    md: 'text-base tracking-wide',
    lg: 'text-2xl tracking-wider'
  };

  const subSizes = {
    xs: 'text-[7px]',
    sm: 'text-[8px]',
    md: 'text-[9px]',
    lg: 'text-[11px]'
  };

  const isDark = variant === 'dark';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* High-Tech Sentinel Shield / Radar Core SVG Emblem */}
      <div className={`relative ${iconSizes[size] || iconSizes.md} shrink-0 flex items-center justify-center`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm transition-transform hover:scale-105"
        >
          <defs>
            <linearGradient id="sentinexaGradPrimary" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="60%" stopColor="#1D4ED8" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="sentinexaGradAccent" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
            <filter id="sentinexaGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Sentinel Shield / Polygon Base */}
          <path
            d="M24 3L41 10.5V23.5C41 33.8 33.8 42.4 24 45C14.2 42.4 7 33.8 7 23.5V10.5L24 3Z"
            fill="url(#sentinexaGradPrimary)"
          />

          {/* Shield Border Highlight */}
          <path
            d="M24 3L41 10.5V23.5C41 33.8 33.8 42.4 24 45C14.2 42.4 7 33.8 7 23.5V10.5L24 3Z"
            stroke="#60A5FA"
            strokeWidth="1.2"
            strokeOpacity="0.4"
          />

          {/* Inner Hexagonal Mesh / Radar Node */}
          <path
            d="M24 13L33 18.5V29.5L24 35L15 29.5V18.5L24 13Z"
            fill="url(#sentinexaGradAccent)"
            fillOpacity="0.9"
          />

          {/* Central Autonomous Core & Optical Cross */}
          <circle cx="24" cy="24" r="4.5" fill="#FFFFFF" />
          <circle cx="24" cy="24" r="2.5" fill="#10B981" />

          {/* Cross Radar Pins */}
          <line x1="24" y1="8" x2="24" y2="12" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="24" y1="36" x2="24" y2="40" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="10" y1="24" x2="14" y2="24" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="34" y1="24" x2="38" y2="24" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" />
        </svg>

        {/* Live Satellite Activity Pulse */}
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse"></span>
      </div>

      {/* Typography: SENTINEXA Brand Text */}
      <div className="flex flex-col leading-none">
        <div className={`font-black font-sans tracking-tight flex items-baseline ${textSizes[size] || textSizes.md}`}>
          <span className={isDark ? 'text-white' : 'text-slate-900'}>SENTIN</span>
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent ml-0.5">EXA</span>
        </div>

        {showSubtitle && (
          <span className={`font-mono font-bold tracking-widest uppercase mt-0.5 ${subSizes[size] || subSizes.md} ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            CIVIC INTELLIGENCE MESH
          </span>
        )}
      </div>
    </div>
  );
}
