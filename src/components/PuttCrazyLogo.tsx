import React from 'react';

interface PuttCrazyLogoProps {
  className?: string;
}

export default function PuttCrazyLogo({ className = 'h-14 w-auto' }: PuttCrazyLogoProps) {
  return (
    <div className={`inline-flex items-center justify-center select-none ${className}`} id="putt-crazy-logo">
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto filter drop-shadow-[2px_2px_0px_rgba(15,23,42,1)]"
      >
        {/* Outer Circular border */}
        <circle cx="60" cy="60" r="54" fill="#0369a1" stroke="#0f172a" strokeWidth="4" />
        <circle cx="60" cy="60" r="48" fill="#bae6fd" />

        {/* Wavy Golf Green Hill */}
        <path
          d="M12 75 C 30 65, 50 85, 80 65 C 95 55, 105 70, 108 75 L 108 108 L 12 108 Z"
          fill="#22c55e"
          stroke="#0f172a"
          strokeWidth="2"
        />

        {/* Green Accent Shadow */}
        <path
          d="M40 78 C 55 82, 70 70, 80 65 L 108 65 L 108 75 C 105 70, 95 55, 80 65 C 50 85, 30 65, 12 75 L 12 78 Z"
          fill="#15803d"
          opacity="0.3"
        />

        {/* Golf Hole Flag */}
        <line x1="85" y1="35" x2="85" y2="70" stroke="#0f172a" strokeWidth="2" />
        <path d="M85 35 L 70 42 L 85 49 Z" fill="#ef4444" stroke="#0f172a" strokeWidth="1.5" />
        <circle cx="85" cy="70" r="3" fill="#0f172a" />
        <circle cx="78" cy="68" r="2.5" fill="#ffffff" stroke="#0f172a" strokeWidth="0.75" />

        {/* "PUTT" Text */}
        <text
          x="60"
          y="32"
          textAnchor="middle"
          fill="#ffffff"
          stroke="#0f172a"
          strokeWidth="3"
          paintOrder="stroke"
          className="font-sans font-black tracking-wider uppercase"
          style={{ fontSize: '15px' }}
        >
          PUTT
        </text>

        {/* "CRAZY" Text */}
        <text
          x="60"
          y="56"
          textAnchor="middle"
          fill="#eab308"
          stroke="#0f172a"
          strokeWidth="4"
          paintOrder="stroke"
          className="font-sans font-black tracking-tight uppercase italic"
          style={{ fontSize: '24px' }}
        >
          CRAZY
        </text>

        {/* "adventure golf" Text */}
        <rect x="18" y="82" width="84" height="11" rx="3" fill="#facc15" stroke="#0f172a" strokeWidth="1.5" />
        <text
          x="60"
          y="90"
          textAnchor="middle"
          fill="#0f172a"
          className="font-sans font-extrabold uppercase tracking-widest"
          style={{ fontSize: '7px' }}
        >
          ADVENTURE GOLF
        </text>

        {/* "@Northwick park" Text */}
        <text
          x="60"
          y="103"
          textAnchor="middle"
          fill="#ffffff"
          stroke="#0f172a"
          strokeWidth="2"
          paintOrder="stroke"
          className="font-mono font-bold uppercase tracking-wider"
          style={{ fontSize: '6.5px' }}
        >
          @Northwick Park
        </text>
      </svg>
    </div>
  );
}
