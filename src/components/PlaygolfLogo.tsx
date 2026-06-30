import React from 'react';

interface PlaygolfLogoProps {
  className?: string; // Kept for compatibility
  textColor?: string; // e.g. "text-white" or "text-slate-900"
}

export default function PlaygolfLogo({ textColor = 'text-white' }: PlaygolfLogoProps) {
  return (
    <div className={`flex flex-col items-center md:items-start select-none ${textColor}`} id="playgolf-logo">
      {/* "playgolf" styling matching the image: italicized, bold, tight-tracking */}
      <div className="flex items-baseline font-sans tracking-tighter leading-none">
        <span className="text-4xl md:text-5xl font-extrabold italic lowercase">play</span>
        <span className="text-4xl md:text-5xl font-black italic lowercase text-orange-500">golf</span>
      </div>
      
      {/* "Northwick Park" placed directly under "playgolf" with wide letter spacing */}
      <span className="text-[11px] md:text-xs font-black uppercase tracking-[0.25em] mt-1 opacity-90 pl-0.5 font-mono">
        Northwick Park
      </span>
    </div>
  );
}

