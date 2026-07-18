import React from 'react';
import { PARTY_PACKAGES, FOOD_MAINS, FOOD_DRINKS } from '../data';
import PlaygolfLogo from './PlaygolfLogo';
import PuttCrazyLogo from './PuttCrazyLogo';

// High-fidelity Custom Vector Illustrations for the printed flyer/PDF
const GolfBagSVG = () => (
  <svg viewBox="0 0 100 100" className="w-14 h-14 text-emerald-800" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="35" y="30" width="30" height="55" rx="10" fill="#047857" stroke="#0f172a" strokeWidth="2.5" />
    <path d="M45 30V15C45 13 47 11 50 11C53 11 55 13 55 15V30" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
    <rect x="40" y="45" width="20" height="25" rx="5" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
    <path d="M30 40H35" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
    <path d="M30 70H35" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
    <path d="M30 40V70" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="50" cy="20" r="4" fill="#ef4444" stroke="#0f172a" strokeWidth="1.5" />
    <circle cx="58" cy="22" r="3.5" fill="#3b82f6" stroke="#0f172a" strokeWidth="1.5" />
    <circle cx="42" cy="22" r="3" fill="#eab308" stroke="#0f172a" strokeWidth="1.5" />
  </svg>
);

const MiniGolfPinSVG = () => (
  <svg viewBox="0 0 100 100" className="w-14 h-14 text-blue-600" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 85 C 30 78, 55 88, 85 82" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
    <path d="M12 80 L 88 80 L 88 88 L 12 88 Z" fill="#22c55e" stroke="#0f172a" strokeWidth="2" />
    <line x1="55" y1="15" x2="55" y2="80" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
    <path d="M55 15 L 22 28 L 55 41 Z" fill="#ef4444" stroke="#0f172a" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="70" cy="74" r="5" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
  </svg>
);

const SpaghettiBowlSVG = () => (
  <svg viewBox="0 0 100 100" className="w-14 h-14 text-orange-500" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 50 C 20 75, 80 75, 80 50 Z" fill="#f8fafc" stroke="#0f172a" strokeWidth="2.5" strokeLinejoin="round" />
    <rect x="15" y="45" width="70" height="6" rx="3" fill="#cbd5e1" stroke="#0f172a" strokeWidth="2" />
    <path d="M30 45 Q 35 35 40 45 Q 45 35 50 45 Q 55 35 60 45 Q 65 35 70 45" stroke="#f59e0b" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    <path d="M35 45 Q 42 38 48 45 Q 54 38 60 45" stroke="#f59e0b" strokeWidth="3" fill="none" strokeLinecap="round" />
    <circle cx="42" cy="36" r="6" fill="#dc2626" stroke="#0f172a" strokeWidth="1.5" />
    <circle cx="58" cy="37" r="5.5" fill="#dc2626" stroke="#0f172a" strokeWidth="1.5" />
    <path d="M38 45 C 45 42, 55 42, 62 45" stroke="#dc2626" strokeWidth="2.5" fill="none" strokeLinecap="round" />
  </svg>
);

const SquashJugSVG = () => (
  <svg viewBox="0 0 100 100" className="w-14 h-14 text-yellow-500" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M35 30 L 28 80 C 28 85, 72 85, 72 80 L 65 30 Z" fill="#e0f2fe" stroke="#0f172a" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M31 52 L 29 80 C 29 83, 71 83, 71 80 L 69 52 Z" fill="#f97316" stroke="#0f172a" strokeWidth="1" strokeLinejoin="round" />
    <path d="M65 40 C 78 40, 78 70, 63 70" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M35 30 L 23 33 L 34 38" fill="#e0f2fe" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
    <path d="M42 22 C 45 22, 45 30, 42 30 C 39 30, 39 22, 42 22 Z" fill="#ef4444" stroke="#0f172a" strokeWidth="1.5" />
  </svg>
);

export default function PrintPDFLayout() {
  const drivingRange = PARTY_PACKAGES.find(p => p.id === 'driving-range');
  const adventureGolf = PARTY_PACKAGES.find(p => p.id === 'adventure-golf');
  const comboDeal = PARTY_PACKAGES.find(p => p.id === 'combo-party');

  return (
    <div className="print-only print-container max-w-4xl mx-auto p-8 bg-white text-slate-900 border-[6px] border-slate-950 rounded-[2.5rem] my-6 relative shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] overflow-hidden">
      
      {/* Absolute Decorative Corner Accents */}
      <div className="absolute top-0 left-0 w-16 h-16 border-b-[4px] border-r-[4px] border-slate-950 bg-yellow-400 rotate-[-45deg] translate-x-[-32px] translate-y-[-32px]" />
      <div className="absolute top-0 right-0 w-16 h-16 border-b-[4px] border-l-[4px] border-slate-950 bg-emerald-400 rotate-[45deg] translate-x-[32px] translate-y-[-32px]" />

      {/* Brand Dual Logo Header */}
      <div className="flex items-center justify-between pb-6 border-b-4 border-slate-950 mb-8 px-4">
        <div className="flex-1 flex justify-center py-2 bg-slate-900 border-2 border-slate-950 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] pr-3">
          <PlaygolfLogo textColor="text-white" />
        </div>
        
        {/* Decorative Divider with Star */}
        <div className="flex flex-col items-center px-6">
          <span className="text-xl text-yellow-500 font-black animate-pulse">★</span>
          <div className="h-10 w-0.5 bg-dashed bg-slate-400 border-l-2 border-dashed border-slate-950" />
          <span className="text-xs font-black tracking-widest text-slate-500 uppercase">KIDS</span>
        </div>

        <div className="flex-1 flex justify-center py-2 border-2 border-slate-950 rounded-2xl bg-sky-50 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
          <PuttCrazyLogo className="h-16 w-auto" />
        </div>
      </div>

      {/* Document Sub-Header Banner */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black font-display text-slate-950 tracking-tight uppercase mb-1">
          KIDS BIRTHDAY PARTY BROCHURE
        </h1>
        <p className="text-emerald-700 font-extrabold tracking-[0.2em] text-xs uppercase font-mono">
          PRE-BOOKING PACKAGES & OFFICIAL CATERING RATES
        </p>
        <div className="inline-block mt-3 bg-emerald-700 text-white border-2 border-slate-950 px-6 py-1.5 rounded-full font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          🎈 GOLF, PUTT & DELICIOUS PARTY GRUB!
        </div>
      </div>

      {/* Section 1: Main Party Packages */}
      <div className="space-y-6 mb-8">
        <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-950 pb-1 flex items-center gap-2">
          <span className="bg-slate-950 text-white w-5 h-5 rounded-md flex items-center justify-center font-mono text-[10px]">1</span>
          PARTY ATTRACTIONS & PRICING OPTIONS
        </h2>

        <div className="grid grid-cols-2 gap-6">
          {/* Option 01 Card */}
          {drivingRange && (
            <div className="border-[3px] border-emerald-700 p-5 rounded-3xl bg-emerald-50/20 relative overflow-hidden flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(4,120,87,1)]">
              {/* Cute corner vector icon */}
              <div className="absolute top-2 right-2 opacity-15">
                <GolfBagSVG />
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-emerald-700 text-white font-extrabold text-[9px] uppercase px-3 py-1 rounded-full tracking-wider border border-slate-950 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                    Option 01
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-emerald-800 font-display">
                      £{drivingRange.pricePerKid.toFixed(2)}
                    </span>
                    <span className="text-[9px] text-slate-500 block font-extrabold tracking-wider uppercase">PER GUEST</span>
                  </div>
                </div>

                <h3 className="text-base font-black text-slate-950 uppercase mb-2 leading-tight">
                  {drivingRange.name}
                </h3>
                
                <p className="text-[10px] text-slate-500 font-extrabold mb-4 font-mono uppercase tracking-wider bg-white border border-slate-200 px-2.5 py-1 rounded-md inline-block">
                  Ages {drivingRange.ageRange} &bull; Min {drivingRange.minKids} Kids
                </p>

                <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                  {drivingRange.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-emerald-700 font-black shrink-0 text-sm leading-none">&bull;</span>
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Option 02 Card */}
          {adventureGolf && (
            <div className="border-[3px] border-blue-600 p-5 rounded-3xl bg-blue-50/20 relative overflow-hidden flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(37,99,235,1)]">
              {/* Cute corner vector icon */}
              <div className="absolute top-2 right-2 opacity-15">
                <MiniGolfPinSVG />
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-blue-600 text-white font-extrabold text-[9px] uppercase px-3 py-1 rounded-full tracking-wider border border-slate-950 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                    Option 02
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-blue-700 font-display">
                      £{adventureGolf.pricePerKid.toFixed(2)}
                    </span>
                    <span className="text-[9px] text-slate-500 block font-extrabold tracking-wider uppercase">PER GUEST</span>
                  </div>
                </div>

                <h3 className="text-base font-black text-slate-950 uppercase mb-2 leading-tight">
                  {adventureGolf.name}
                </h3>

                <p className="text-[10px] text-slate-500 font-extrabold mb-4 font-mono uppercase tracking-wider bg-white border border-slate-200 px-2.5 py-1 rounded-md inline-block">
                  Ages {adventureGolf.ageRange} &bull; Min {adventureGolf.minKids} Kids
                </p>

                <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                  {adventureGolf.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-blue-600 font-black shrink-0 text-sm leading-none">&bull;</span>
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Highlight Combo Package Box */}
        {comboDeal && (
          <div className="border-4 border-slate-950 bg-yellow-400 p-5 rounded-[1.75rem] text-slate-950 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] relative overflow-hidden">
            <div className="absolute right-[-20px] bottom-[-20px] w-24 h-24 bg-yellow-300 rounded-full opacity-40 blur-md" />
            
            <div className="flex items-center justify-between gap-4 border-b-2 border-slate-950/20 pb-3 mb-3">
              <span className="bg-slate-950 text-white font-black text-[9px] uppercase px-4 py-1 rounded-full tracking-wider shadow-[2px_2px_0px_0px_rgba(250,204,21,1)]">
                ⭐ ULTIMATE COMBO DEAL (BEST VALUE)
              </span>
              <div className="bg-white border-2 border-slate-950 px-3 py-1 rounded-lg text-xs font-black uppercase text-emerald-800">
                Saves £11.50 per child!
              </div>
            </div>

            <h3 className="text-lg font-black uppercase tracking-tight mb-1 flex items-center gap-2">
              {comboDeal.name}
            </h3>
            
            <p className="text-xs font-semibold leading-relaxed mb-4 max-w-3xl">
              Can't choose? Play both! Enjoy <strong className="font-extrabold">1 Hour on the Driving Range</strong> (unlimited range balls) plus <strong className="font-extrabold">18-holes of Putt Crazy Adventure Golf</strong>. Includes complete kids meal and drinks for just <strong className="text-emerald-900 font-black text-sm">£5 extra per child guest</strong>!
            </p>

            <div className="flex items-center gap-3 bg-white border-2 border-slate-950 p-3 rounded-2xl max-w-md shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider leading-none">Combo Ticket Rate:</span>
              <span className="text-3xl font-black text-emerald-800 leading-none">£{comboDeal.pricePerKid.toFixed(2)}</span>
              <span className="text-[10px] font-extrabold text-slate-500 uppercase leading-none">per child total</span>
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Catering & Food Options */}
      <div className="space-y-4 pt-6 border-t-[3px] border-slate-950 mb-8">
        <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-950 pb-1 flex items-center gap-2">
          <span className="bg-slate-950 text-white w-5 h-5 rounded-md flex items-center justify-center font-mono text-[10px]">2</span>
          KIDS PARTY CATERING MENU (INCLUDED)
        </h2>
        
        <p className="text-slate-600 text-xs font-bold leading-relaxed mb-4">
          All bookings include 1 hot freshly prepared main course dish and 1 glass of refreshing blackcurrant or orange squash for each child guest. Allergy and dietary modifications are available on request.
        </p>

        {/* Catering Master Dashboard Container */}
        <div className="bg-[#0f5a5e] text-white p-6 rounded-[2rem] border-[3px] border-slate-950 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] relative">
          
          <div className="grid grid-cols-2 gap-8">
            {/* Column 1: Selectable Hot Mains */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-black text-yellow-300 uppercase tracking-widest border-b border-teal-600/60 pb-1.5 flex items-center gap-2">
                <SpaghettiBowlSVG />
                HOT MAINS (CHOOSE 1 PER KID)
              </h4>
              <ul className="space-y-3.5">
                {FOOD_MAINS.map(main => (
                  <li key={main.id} className="text-xs">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="font-extrabold text-white text-xs uppercase">{main.emoji} {main.name}</span>
                      {main.allergens && main.allergens.length > 0 && (
                        <span className="text-[8px] text-amber-900 font-black bg-amber-200 border border-amber-400 px-1.5 py-0.2 rounded uppercase">
                          {main.allergens.join(', ')}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-teal-100 leading-snug font-medium">
                      {main.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Squash Selection & Policy Rules */}
            <div className="space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <h4 className="text-[11px] font-black text-yellow-300 uppercase tracking-widest border-b border-teal-600/60 pb-1.5 flex items-center gap-2">
                  <SquashJugSVG />
                  INCLUDED REFRESHING DRINK
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {FOOD_DRINKS.map(drink => (
                    <div key={drink.id} className="bg-[#0b484c] border border-teal-700 p-2.5 rounded-xl flex items-center gap-2.5">
                      <span className="text-xl shrink-0">{drink.emoji}</span>
                      <span className="text-[10px] font-extrabold uppercase text-white leading-tight">{drink.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Policy Quick Box on the Flyer */}
              <div className="bg-[#0b484c] border border-teal-700 rounded-2xl p-4 space-y-2 text-[10px] text-teal-50 font-medium">
                <p className="font-black text-yellow-300 uppercase tracking-wider mb-1">CANCELLATION & GENERAL RULES:</p>
                <p className="flex items-start gap-1.5 leading-snug">
                  <span className="text-yellow-400 font-black">&bull;</span>
                  <span>Minimum booking of 6 kids required.</span>
                </p>
                <p className="flex items-start gap-1.5 leading-snug">
                  <span className="text-yellow-400 font-black">&bull;</span>
                  <span>Full refunds on cancellations with &gt; 14 days notice.</span>
                </p>
                <p className="flex items-start gap-1.5 leading-snug">
                  <span className="text-yellow-400 font-black">&bull;</span>
                  <span>Confirm guest headcount and meals up to 48 hours before.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Contact Details Section */}
      <div className="mt-8 pt-6 border-t-[3px] border-slate-950 text-center space-y-4">
        <p className="text-[10px] font-black text-emerald-800 uppercase tracking-[0.2em]">
          ADVANCED BOOKING REQUIRED &bull; TO BOOK AN EXQUISITE BIRTHDAY EXPERIENCE:
        </p>
        
        <div className="grid grid-cols-3 gap-3 text-[10px] font-black uppercase text-slate-900">
          <div className="bg-slate-50 border-2 border-slate-950 rounded-xl py-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-1.5">
            <span>🌐</span> PLAYGOLFKIDSPARTY.NETLIFY.APP
          </div>
          <div className="bg-slate-50 border-2 border-slate-950 rounded-xl py-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-1.5">
            <span>✉️</span> ENQUIRIES@PLAYGOLFNORTHWICKPARK.COM
          </div>
          <div className="bg-slate-50 border-2 border-slate-950 rounded-xl py-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-1.5">
            <span>📞</span> 020 8864 2020
          </div>
        </div>
        
        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest pt-2">
          PLAYGOLF NORTHWICK PARK &bull; HARROW ROAD, HA3 0NY &bull; ALL RIGHTS RESERVED
        </p>
      </div>

    </div>
  );
}
