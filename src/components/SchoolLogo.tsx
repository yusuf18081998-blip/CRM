import React from 'react';

interface SchoolLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  glow?: boolean;
}

export const SchoolLogo: React.FC<SchoolLogoProps> = ({
  size = 'sm',
  className = '',
  glow = true,
}) => {
  // Dimension mappings
  const dimensionClass = {
    xs: 'w-4 h-4',       // 16px (Toast mini header)
    sm: 'w-6 h-6',       // 24px
    md: 'w-8 h-8',       // 32px (Permission modal / dialogs)
    lg: 'w-10 h-10',     // 40px
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${dimensionClass} ${className}`}
      title="45-Maktab Sun'iy Intellekt OS Logotipi"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full ${glow ? 'drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]' : ''}`}
      >
        <defs>
          <linearGradient id="schoolLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f2fe" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id="shieldBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#050814" />
            <stop offset="100%" stopColor="#0a152d" />
          </linearGradient>
        </defs>

        {/* Outer Shield / Cyber Hexagon */}
        <polygon
          points="50,4 90,22 90,70 50,96 10,70 10,22"
          fill="url(#shieldBg)"
          stroke="url(#schoolLogoGrad)"
          strokeWidth="6"
          strokeLinejoin="round"
        />

        {/* Inner circuit corner sparks */}
        <line x1="24" y1="26" x2="32" y2="34" stroke="#00f2fe" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
        <line x1="76" y1="26" x2="68" y2="34" stroke="#00f2fe" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
        <circle cx="50" cy="14" r="2.5" fill="#38bdf8" />

        {/* Futuristic Bold "45" Typography */}
        <g fill="#00f2fe" stroke="#00f2fe" strokeWidth="0.5">
          {/* '4' */}
          <path d="M43 32 v 22 h 6 v 7 h -6 v 10 h -8 v -10 h -14 v -6 l 14 -23 h 8 z M29 54 h 6 v -13 l -6 13 z" />
          {/* '5' */}
          <path d="M55 32 h 18 v 7 h -11 v 8 c 2 -1 4 -2 7 -2 c 7 0 12 5 12 13 c 0 9 -5 14 -13 14 c -6 0 -10 -3 -12 -8 l 6 -3 c 1 3 3 4 6 4 c 3 0 6 -2 6 -7 c 0 -4 -3 -7 -6 -7 c -3 0 -5 2 -6 4 h -6 v -27 z" />
        </g>

        {/* Bottom AI Pill */}
        <rect x="34" y="80" width="32" height="10" rx="3" fill="#060c1d" stroke="#06b6d4" strokeWidth="1.5" />
        <text
          x="50"
          y="87.5"
          fontFamily="'Orbitron', monospace, sans-serif"
          fontSize="6.5"
          fontWeight="900"
          fill="#ffffff"
          textAnchor="middle"
          letterSpacing="1"
        >
          AI
        </text>
      </svg>
    </div>
  );
};
