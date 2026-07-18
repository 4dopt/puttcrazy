import React from 'react';
import PlaygolfLogo from './PlaygolfLogo';
import PuttCrazyLogo from './PuttCrazyLogo';

// High-fidelity Custom Vector Illustrations for the printed flyer/PDF
const GolfBagSVG = () => (
  <svg viewBox="0 0 120 180" className="w-14 h-24 shrink-0 select-none">
    {/* Golf Clubs */}
    <path d="M45 40 L35 15 C34 12, 40 10, 42 13 L52 40 Z" fill="#94a3b8" stroke="#0f172a" strokeWidth="2.5" />
    <path d="M60 40 L60 10 C60 7, 68 7, 68 10 L68 40 Z" fill="#475569" stroke="#0f172a" strokeWidth="2.5" />
    <path d="M75 40 L85 18 C87 15, 80 12, 78 15 L68 40 Z" fill="#cbd5e1" stroke="#0f172a" strokeWidth="2.5" />
    
    {/* Bag Main Body */}
    <rect x="35" y="40" width="50" height="110" rx="15" fill="#059669" stroke="#0f172a" strokeWidth="3" />
    {/* Strap */}
    <path d="M35 60 C15 70, 15 120, 35 130" fill="none" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" />
    <path d="M35 60 C15 70, 15 120, 35 130" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    
    {/* Pockets */}
    <rect x="45" y="60" width="30" height="40" rx="6" fill="#047857" stroke="#0f172a" strokeWidth="2.5" />
    <rect x="48" y="110" width="24" height="25" rx="4" fill="#047857" stroke="#0f172a" strokeWidth="2.5" />
    
    {/* Text "GOLF" on the bag */}
    <text x="60" y="85" fill="#ffffff" fontSize="10" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1">GOLF</text>
    
    {/* Bottom Base */}
    <ellipse cx="60" cy="150" rx="25" ry="8" fill="#0f172a" />
  </svg>
);

const PuttingGreenSVG = () => (
  <svg viewBox="0 0 200 120" className="w-36 h-22 shrink-0 select-none">
    {/* Green Putting Oval */}
    <ellipse cx="110" cy="75" rx="75" ry="35" fill="#3b82f6" stroke="#0f172a" strokeWidth="3" />
    <ellipse cx="110" cy="75" rx="65" ry="28" fill="#2563eb" />
    
    {/* Hole */}
    <ellipse cx="140" cy="70" rx="8" ry="4" fill="#1e3a8a" />
    
    {/* Flag Pole */}
    <line x1="140" y1="70" x2="140" y2="15" stroke="#0f172a" strokeWidth="3" />
    
    {/* Red Flag */}
    <path d="M140 15 L95 28 L140 40 Z" fill="#ef4444" stroke="#0f172a" strokeWidth="2" strokeLinejoin="round" />
    
    {/* Golf Ball */}
    <circle cx="115" cy="82" r="5" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
    <circle cx="114" cy="81" r="1" fill="#cbd5e1" />
  </svg>
);

const SpaghettiPlateSVG = () => (
  <svg viewBox="0 0 140 140" className="w-16 h-16 shrink-0 select-none">
    {/* Plate */}
    <circle cx="70" cy="70" r="60" fill="#f8fafc" stroke="#0f172a" strokeWidth="3" />
    <circle cx="70" cy="70" r="48" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1" />
    
    {/* Spaghetti Loops */}
    <path d="M40 70 C40 50, 100 50, 100 70 C100 90, 40 90, 40 70 Z" fill="none" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
    <path d="M45 65 C45 45, 95 45, 95 65 C95 85, 45 85, 45 65 Z" fill="none" stroke="#fbbf24" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M50 75 C50 55, 90 55, 90 75 C90 95, 50 95, 50 75 Z" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
    <path d="M35 60 Q 70 30 105 60 Q 110 85 80 105 Q 40 85 35 60" fill="none" stroke="#f59e0b" strokeWidth="3" />
    <path d="M55 55 Q 70 40 85 55" fill="none" stroke="#fbbf24" strokeWidth="3" />
    <path d="M45 80 Q 70 100 95 80" fill="none" stroke="#fbbf24" strokeWidth="2.5" />

    {/* Tomato Sauce / Marinara */}
    <path d="M55 65 C60 55, 80 55, 85 65 C80 80, 60 80, 55 65" fill="#dc2626" opacity="0.9" stroke="#0f172a" strokeWidth="1" />
    <path d="M62 70 C65 62, 75 62, 78 70 C75 78, 65 78, 62 70" fill="#b91c1c" />
    
    {/* Basil Leaf */}
    <path d="M70 55 C65 48, 70 42, 74 46 C74 52, 72 54, 70 55 Z" fill="#16a34a" stroke="#14532d" strokeWidth="1" />
  </svg>
);

const SquashJugSVG = () => (
  <svg viewBox="0 0 140 140" className="w-16 h-16 shrink-0 select-none">
    {/* Tray/Table base */}
    <ellipse cx="70" cy="115" rx="55" ry="15" fill="#d97706" stroke="#451a03" strokeWidth="2.5" />
    <ellipse cx="70" cy="112" rx="48" ry="11" fill="#f59e0b" />

    {/* Lemon Slice 1 (Left) */}
    <circle cx="35" cy="110" r="14" fill="#facc15" stroke="#0f172a" strokeWidth="2" />
    <circle cx="35" cy="110" r="11" fill="#fef08a" />
    <path d="M35 96 L35 124 M21 110 L49 110" stroke="#facc15" strokeWidth="1.5" />

    {/* Lemon Slice 2 (Right) */}
    <circle cx="105" cy="112" r="12" fill="#facc15" stroke="#0f172a" strokeWidth="2" />
    <circle cx="105" cy="112" r="9" fill="#fef08a" />
    
    {/* Glass Jug */}
    {/* Liquid inside */}
    <path d="M55 55 L50 98 C50 105, 90 105, 90 98 L85 55 Z" fill="#eab308" stroke="#0f172a" strokeWidth="2" strokeLinejoin="round" />
    <path d="M55 55 C60 58, 80 58, 85 55" fill="none" stroke="#ca8a04" strokeWidth="1.5" />
    
    {/* Jug outline (Glass) */}
    <path d="M55 45 L50 100 C50 108, 90 108, 90 100 L85 45 Z" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinejoin="round" />
    {/* Spout */}
    <path d="M55 45 L42 45 L50 52" fill="#e0f2fe" stroke="#0f172a" strokeWidth="1.5" strokeLinejoin="round" />
    
    {/* Handle */}
    <path d="M85 52 C98 52, 98 88, 83 90" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
    
    {/* Mint Leaf */}
    <path d="M48 40 C44 36, 48 30, 52 32" fill="#22c55e" stroke="#15803d" strokeWidth="1" />
  </svg>
);

export default function PrintPDFLayout() {
  return (
    <div className="print-only print-container" style={{ width: '800px', height: '1130px', boxSizing: 'border-box' }}>
      <div className="w-full h-full bg-[#fcfcf9] text-slate-900 p-6 flex flex-col justify-between font-sans overflow-hidden border-4 border-slate-950">
        
        {/* TOP HEADER SECTION */}
        <div className="text-center">
          <span className="bg-yellow-400 border-2 border-slate-950 text-slate-950 font-black px-4 py-1 rounded-full uppercase tracking-widest text-[9px] shadow-[2.5px_2.5px_0px_0px_rgba(15,23,42,1)] inline-block rotate-[-1.5deg] mb-1.5">
            🎉 ADVENTURE AWAITS
          </span>
          
          {/* Logo Alignment */}
          <div className="flex items-center justify-center gap-10 my-1">
            <div className="h-9 flex items-center">
              <PlaygolfLogo textColor="text-slate-950" />
            </div>
            <div className="h-10 flex items-center">
              <PuttCrazyLogo className="h-10 w-auto" />
            </div>
          </div>
          
          {/* Main Neobrutalist Title Banner */}
          <div className="bg-slate-950 text-white py-2 px-6 rounded-2xl border-3 border-slate-950 shadow-[4px_4px_0px_0px_rgba(4,120,87,1)] mb-3">
            <h1 className="text-yellow-400 text-base font-black tracking-wider uppercase text-center font-display">
              KIDS PARTY MENU & PACKAGES
            </h1>
          </div>
        </div>

        {/* 1. DRIVING RANGE PARTY CARD (OPTION 01) */}
        <div className="border-4 border-slate-950 rounded-3xl p-3 flex items-center justify-between relative bg-white gap-4 shadow-[5px_5px_0px_0px_rgba(4,120,87,1)]">
          <div className="shrink-0 pl-1.5">
            <GolfBagSVG />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <span className="bg-emerald-700 text-white px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] inline-block">
                Option 01 &bull; DRIVING RANGE PARTY
              </span>
            </div>
            <p className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-wider mt-1 mb-2">
              Ages 5-12 &bull; Min 6 Kids Required
            </p>
            <ul className="space-y-1.5 text-xs text-slate-800 font-bold text-left pl-0.5">
              <li className="flex items-start gap-2">
                <div className="w-4 h-4 bg-yellow-400 border border-slate-950 rounded-full shrink-0 flex items-center justify-center font-black text-[9px] text-slate-950 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">1</div>
                <span className="text-slate-700 font-semibold text-[11px] leading-snug">1 Hour of Golf with unlimited balls on the Driving Range.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-4 h-4 bg-yellow-400 border border-slate-950 rounded-full shrink-0 flex items-center justify-center font-black text-[9px] text-slate-950 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">2</div>
                <span className="text-slate-700 font-semibold text-[11px] leading-snug">1 Meal per Kid (1 Main Dish & 1 Glass of Squash).</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-4 h-4 bg-yellow-400 border border-slate-950 rounded-full shrink-0 flex items-center justify-center font-black text-[9px] text-slate-950 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">3</div>
                <span className="text-slate-700 font-semibold text-[11px] leading-snug">Safety induction & youth golf clubs provided.</span>
              </li>
            </ul>
          </div>

          <div className="shrink-0 pr-1.5">
            <div className="bg-yellow-400 border-3 border-slate-950 text-slate-950 w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] rotate-[3deg]">
              <span className="text-sm font-black leading-none text-emerald-800">£16.50</span>
              <span className="text-[8px] font-black tracking-wider leading-none mt-1">/ KID</span>
            </div>
          </div>
        </div>

        {/* 2. PUTT CRAZY ADVENTURE GOLF PARTY CARD (OPTION 02) */}
        <div className="border-4 border-slate-950 rounded-3xl p-3 flex items-center justify-between relative bg-white gap-4 shadow-[5px_5px_0px_0px_rgba(37,99,235,1)]">
          <div className="shrink-0 pl-1.5">
            <div className="bg-yellow-400 border-3 border-slate-950 text-slate-950 w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] rotate-[-3deg]">
              <span className="text-sm font-black leading-none text-blue-800">£16.50</span>
              <span className="text-[8px] font-black tracking-wider leading-none mt-1">/ KID</span>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <span className="bg-blue-600 text-white px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] inline-block">
                Option 02 &bull; PUTT CRAZY ADVENTURE GOLF PARTY
              </span>
            </div>
            <p className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-wider mt-1 mb-2">
              Ages 5-12 &bull; Min 6 Kids Required
            </p>
            <ul className="space-y-1.5 text-xs text-slate-800 font-bold text-left pl-0.5">
              <li className="flex items-start gap-2">
                <div className="w-4 h-4 bg-yellow-400 border border-slate-950 rounded-full shrink-0 flex items-center justify-center font-black text-[9px] text-slate-950 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">1</div>
                <span className="text-slate-700 font-semibold text-[11px] leading-snug">1 Round of 18 holes mini golf course.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-4 h-4 bg-yellow-400 border border-slate-950 rounded-full shrink-0 flex items-center justify-center font-black text-[9px] text-slate-950 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">2</div>
                <span className="text-slate-700 font-semibold text-[11px] leading-snug">1 Meal per Kid (1 Main Dish & 1 Glass of Squash).</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-4 h-4 bg-yellow-400 border border-slate-950 rounded-full shrink-0 flex items-center justify-center font-black text-[9px] text-slate-950 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">3</div>
                <span className="text-slate-700 font-semibold text-[11px] leading-snug">Aesthetic neon putters, colorful golf balls & cards provided.</span>
              </li>
            </ul>
          </div>

          <div className="shrink-0 pr-1.5">
            <PuttingGreenSVG />
          </div>
        </div>

        {/* ENJOY BOTH OPTIONS COMBO DEAL CARD */}
        <div className="relative bg-yellow-400 border-4 border-slate-950 rounded-3xl p-4 text-slate-950 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] overflow-hidden">
          <div className="text-center mb-3">
            <span className="bg-slate-950 text-white px-3 py-1 rotate-[-1deg] font-black text-[9px] tracking-wider uppercase inline-block shadow-[2px_2px_0px_0px_rgba(250,204,21,1)]">
              🌟 Combo Deal! Best Value Package
            </span>
            <h3 className="text-xs font-black uppercase tracking-tight mt-1.5">
              ENJOY BOTH OPTIONS FOR AN EVEN BETTER DEAL!
            </h3>
            <p className="text-[10px] text-slate-900 font-bold leading-relaxed mt-0.5">
              Combine range practice and unlimited golf ball hitting with our immersive 18-hole crazy mini golf challenge!
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border-2 border-slate-950 p-2.5 rounded-2xl flex items-center justify-between gap-3 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
              <div className="flex-1 pr-1 text-left">
                <span className="block text-[8px] text-emerald-800 font-extrabold uppercase tracking-wider mb-0.5">(Add 18 Holes to Driving Range)</span>
                <span className="block text-[10px] text-slate-900 font-bold leading-snug">
                  ADD Putt Crazy 18 Holes to Driving Range Party
                </span>
              </div>
              <div className="bg-[#dc2626] border-2 border-slate-950 text-white rounded-xl px-2.5 py-1 text-center shrink-0 flex flex-col justify-center min-w-[65px] shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] rotate-[-2deg]">
                <span className="text-[7px] font-black leading-none uppercase">ONLY</span>
                <span className="text-xs font-black leading-none my-0.5">£5</span>
                <span className="text-[7px] font-black leading-none uppercase">PER KID</span>
              </div>
            </div>

            <div className="bg-white border-2 border-slate-950 p-2.5 rounded-2xl flex items-center justify-between gap-3 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
              <div className="flex-1 pr-1 text-left">
                <span className="block text-[8px] text-emerald-800 font-extrabold uppercase tracking-wider mb-0.5">(Add Driving Range to Putt Crazy)</span>
                <span className="block text-[10px] text-slate-900 font-bold leading-snug">
                  ADD Driving Range to Putt Crazy Party
                </span>
              </div>
              <div className="bg-[#dc2626] border-2 border-slate-950 text-white rounded-xl px-2.5 py-1 text-center shrink-0 flex flex-col justify-center min-w-[65px] shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] rotate-[2deg]">
                <span className="text-[7px] font-black leading-none uppercase">ONLY</span>
                <span className="text-xs font-black leading-none my-0.5">£5</span>
                <span className="text-[7px] font-black leading-none uppercase">PER KID</span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOD AND DRINKS OPTIONS CARD */}
        <div className="bg-white border-4 border-slate-950 rounded-3xl p-4 relative shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]">
          
          {/* Subtle Corner Graphic Overlays */}
          <div className="absolute top-2.5 left-2.5 opacity-15">
            <SpaghettiPlateSVG />
          </div>
          <div className="absolute bottom-2.5 right-2.5 opacity-15">
            <SquashJugSVG />
          </div>

          <div className="flex justify-center mb-3">
            <span className="bg-slate-950 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full tracking-wider border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(250,204,21,1)]">
              🍔 KIDS PARTY MENU: FOOD & DRINKS OPTIONS 🥤
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 relative z-10">
            {/* Mains column */}
            <div className="bg-slate-50 p-3 rounded-2xl border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative">
              <div className="text-center mb-2.5">
                <span className="bg-emerald-700 text-white text-[8px] font-black uppercase px-3 py-1 rounded-md tracking-wider border border-slate-950">
                  CHOICE OF MAIN DISH:
                </span>
              </div>
              <ul className="space-y-1 text-[10px] font-extrabold tracking-wide text-left uppercase text-slate-900 pl-1 list-disc list-inside">
                <li>Pasta in Cream Sauce</li>
                <li>Chicken Nuggets with Chips</li>
                <li>Fish Goujons with Chips</li>
                <li>Pasta in Tomato Sauce</li>
                <li>Vegetable Nuggets with Chips</li>
                <li>Margherita Pizza with Two Toppings</li>
              </ul>
            </div>

            {/* Drinks column */}
            <div className="bg-slate-50 p-3 rounded-2xl border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between relative">
              <div>
                <div className="text-center mb-2.5">
                  <span className="bg-blue-600 text-white text-[8px] font-black uppercase px-3 py-1 rounded-md tracking-wider border border-slate-950">
                    CHOICE OF SOFT DRINK:
                  </span>
                </div>
                <ul className="space-y-1.5 text-[10px] font-extrabold tracking-wide text-left uppercase text-slate-900 pl-1 list-disc list-inside">
                  <li>Black Currant Squash</li>
                  <li>Orange Squash</li>
                </ul>
              </div>
              
              {/* Sweet Upgrades */}
              <div className="mt-3 bg-yellow-100 border border-slate-950 rounded-xl p-1.5 text-center shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-[8px] text-slate-900 font-black uppercase tracking-wider block">
                  🍭 Optional Upgrades:
                </span>
                <span className="text-[7.5px] text-slate-600 font-bold uppercase tracking-normal mt-0.5 block">
                  Ice Cream Cup &bull; Sweet Party Cones Available!
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER & BOOKING DETAILS */}
        <div className="text-center pt-1.5">
          {/* Pre-booking banner */}
          <div className="bg-[#f36c05] py-1.5 px-6 rounded-full inline-block mb-1.5 border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-white text-xs font-black tracking-wider uppercase">
            PRE-BOOKING REQUIRED FOR ALL PACKAGES
          </div>
          
          <p className="text-slate-950 text-[9px] font-black tracking-wider uppercase mb-2 font-mono">
            TO RESERVE YOUR KIDS PARTY PLEASE CONTACT US:
          </p>

          {/* Contact Details Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <a 
              href="https://playgolfkidsparty.netlify.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="border-2 border-slate-950 rounded-xl py-1.5 text-[9px] font-black text-slate-950 bg-white flex items-center justify-center gap-1.5 uppercase shadow-[2.5px_2.5px_0px_0px_rgba(15,23,42,1)] hover:bg-slate-50 transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-emerald-700" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10M12 2a15.3 15.3 0 00-4 10 15.3 15.3 0 004 10" />
              </svg>
              <span>playgolfkidsparty.netlify.app</span>
            </a>

            <a 
              href="mailto:enquiries@playgolfnorthwickpark.com" 
              className="border-2 border-slate-950 rounded-xl py-1.5 text-[9px] font-black text-slate-950 bg-white flex items-center justify-center gap-1.5 uppercase shadow-[2.5px_2.5px_0px_0px_rgba(15,23,42,1)] hover:bg-slate-50 transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>enquiries@playgolfnorthwickpark.com</span>
            </a>

            <a 
              href="tel:02088642020" 
              className="border-2 border-slate-950 rounded-xl py-1.5 text-[9px] font-black text-slate-950 bg-white flex items-center justify-center gap-1.5 uppercase shadow-[2.5px_2.5px_0px_0px_rgba(15,23,42,1)] hover:bg-slate-50 transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-red-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
              </svg>
              <span>020 8864 2020</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
