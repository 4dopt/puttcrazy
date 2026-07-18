import React from 'react';
import PlaygolfLogo from './PlaygolfLogo';
import PuttCrazyLogo from './PuttCrazyLogo';

// High-fidelity Custom Vector Illustrations for the printed flyer/PDF
const GolfBagSVG = () => (
  <svg viewBox="0 0 120 180" className="w-16 h-28 shrink-0 select-none">
    {/* Golf Clubs */}
    <path d="M45 40 L35 15 C34 12, 40 10, 42 13 L52 40 Z" fill="#94a3b8" stroke="#0f172a" strokeWidth="2" />
    <path d="M60 40 L60 10 C60 7, 68 7, 68 10 L68 40 Z" fill="#475569" stroke="#0f172a" strokeWidth="2" />
    <path d="M75 40 L85 18 C87 15, 80 12, 78 15 L68 40 Z" fill="#cbd5e1" stroke="#0f172a" strokeWidth="2" />
    
    {/* Bag Main Body */}
    <rect x="35" y="40" width="50" height="110" rx="15" fill="#2563eb" stroke="#0f172a" strokeWidth="3" />
    {/* Strap */}
    <path d="M35 60 C15 70, 15 120, 35 130" fill="none" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" />
    <path d="M35 60 C15 70, 15 120, 35 130" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    
    {/* Pockets */}
    <rect x="45" y="60" width="30" height="40" rx="6" fill="#1d4ed8" stroke="#0f172a" strokeWidth="2.5" />
    <rect x="48" y="110" width="24" height="25" rx="4" fill="#1d4ed8" stroke="#0f172a" strokeWidth="2.5" />
    
    {/* Text "GOLF" on the bag */}
    <text x="60" y="85" fill="#ffffff" fontSize="11" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1">GOLF</text>
    
    {/* Bottom Base */}
    <ellipse cx="60" cy="150" rx="25" ry="8" fill="#0f172a" />
  </svg>
);

const PuttingGreenSVG = () => (
  <svg viewBox="0 0 200 120" className="w-40 h-24 shrink-0 select-none">
    {/* Green Putting Oval */}
    <ellipse cx="110" cy="75" rx="75" ry="35" fill="#4ade80" stroke="#16a34a" strokeWidth="3" />
    <ellipse cx="110" cy="75" rx="65" ry="28" fill="#22c55e" />
    
    {/* Hole */}
    <ellipse cx="140" cy="70" rx="8" ry="4" fill="#14532d" />
    
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
  <svg viewBox="0 0 140 140" className="w-24 h-24 shrink-0 select-none">
    {/* Plate */}
    <circle cx="70" cy="70" r="60" fill="#f8fafc" stroke="#334155" strokeWidth="4" />
    <circle cx="70" cy="70" r="48" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
    
    {/* Spaghetti Loops */}
    <path d="M40 70 C40 50, 100 50, 100 70 C100 90, 40 90, 40 70 Z" fill="none" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
    <path d="M45 65 C45 45, 95 45, 95 65 C95 85, 45 85, 45 65 Z" fill="none" stroke="#fbbf24" strokeWidth="4.5" strokeLinecap="round" />
    <path d="M50 75 C50 55, 90 55, 90 75 C90 95, 50 95, 50 75 Z" fill="none" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
    <path d="M35 60 Q 70 30 105 60 Q 110 85 80 105 Q 40 85 35 60" fill="none" stroke="#f59e0b" strokeWidth="3.5" />
    <path d="M55 55 Q 70 40 85 55" fill="none" stroke="#fbbf24" strokeWidth="3.5" />
    <path d="M45 80 Q 70 100 95 80" fill="none" stroke="#fbbf24" strokeWidth="3" />

    {/* Tomato Sauce / Marinara */}
    <path d="M55 65 C60 55, 80 55, 85 65 C80 80, 60 80, 55 65" fill="#dc2626" opacity="0.9" />
    <path d="M62 70 C65 62, 75 62, 78 70 C75 78, 65 78, 62 70" fill="#b91c1c" />
    
    {/* Basil Leaf */}
    <path d="M70 55 C65 48, 70 42, 74 46 C74 52, 72 54, 70 55 Z" fill="#16a34a" stroke="#14532d" strokeWidth="1" />
  </svg>
);

const SquashJugSVG = () => (
  <svg viewBox="0 0 140 140" className="w-24 h-24 shrink-0 select-none">
    {/* Tray/Table base */}
    <ellipse cx="70" cy="115" rx="55" ry="15" fill="#d97706" stroke="#451a03" strokeWidth="3" />
    <ellipse cx="70" cy="112" rx="48" ry="11" fill="#f59e0b" />

    {/* Lemon Slice 1 (Left) */}
    <circle cx="35" cy="110" r="14" fill="#facc15" stroke="#0f172a" strokeWidth="2" />
    <circle cx="35" cy="110" r="11" fill="#fef08a" />
    <path d="M35 96 L35 124 M21 110 L49 110 M25 100 L45 120 M25 120 L45 100" stroke="#facc15" strokeWidth="1.5" />

    {/* Lemon Slice 2 (Right) */}
    <circle cx="105" cy="112" r="12" fill="#facc15" stroke="#0f172a" strokeWidth="2" />
    <circle cx="105" cy="112" r="9" fill="#fef08a" />
    
    {/* Glass Jug */}
    {/* Liquid inside */}
    <path d="M55 55 L50 98 C50 105, 90 105, 90 98 L85 55 Z" fill="#eab308" stroke="#0f172a" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M55 55 C60 58, 80 58, 85 55" fill="none" stroke="#ca8a04" strokeWidth="2" />
    
    {/* Jug outline (Glass) */}
    <path d="M55 45 L50 100 C50 108, 90 108, 90 100 L85 45 Z" fill="none" stroke="#0f172a" strokeWidth="3" strokeLinejoin="round" />
    {/* Spout */}
    <path d="M55 45 L42 45 L50 52" fill="#e0f2fe" stroke="#0f172a" strokeWidth="2" strokeLinejoin="round" />
    
    {/* Handle */}
    <path d="M85 52 C98 52, 98 88, 83 90" fill="none" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
    
    {/* Mint Leaf */}
    <path d="M48 40 C44 36, 48 30, 52 32" fill="#22c55e" stroke="#15803d" strokeWidth="1" />
  </svg>
);

export default function PrintPDFLayout() {
  return (
    <div className="print-only print-container" style={{ width: '800px', height: '1130px', boxSizing: 'border-box' }}>
      <div className="w-full h-full bg-white text-slate-900 p-6 flex flex-col justify-between font-sans overflow-hidden">
        
        {/* top text header */}
        <div className="text-center">
          <p className="text-[#15803d] font-black tracking-[0.25em] text-[11px] uppercase mb-2">
            ADVENTURE AWAITS
          </p>
          
          {/* logo section */}
          <div className="flex items-center justify-center gap-10 mb-3">
            <div className="h-10 flex items-center">
              <PlaygolfLogo textColor="text-slate-950" />
            </div>
            <div className="h-12 flex items-center">
              <PuttCrazyLogo className="h-12 w-auto" />
            </div>
          </div>
          
          {/* Main banner */}
          <div className="bg-[#0e5a5e] py-2 px-6 rounded-md mb-4">
            <h1 className="text-white text-xl font-black tracking-wider uppercase text-center">
              KIDS PARTY MENU & PACKAGES
            </h1>
          </div>
        </div>

        {/* 1. DRIVING RANGE PARTY */}
        <div className="border border-slate-300 rounded-xl p-3 flex items-center justify-between relative bg-white gap-4">
          <div className="shrink-0 pl-2">
            <GolfBagSVG />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <div className="bg-[#f36c05] text-white px-4 py-1 rounded-full font-black text-xs uppercase tracking-wider">
                1. DRIVING RANGE PARTY
              </div>
            </div>
            <p className="text-[10px] text-slate-600 font-bold mb-2 uppercase tracking-wide">
              Only for ages 5-12, minimum 6 kids required
            </p>
            <ul className="space-y-1 text-xs text-slate-800 font-extrabold text-left pl-1">
              <li className="flex items-start gap-2">
                <span className="text-[#f36c05] font-black">•</span>
                <span>1 Hour of Golf with unlimited balls on the Driving Range.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#f36c05] font-black">•</span>
                <span>1 Meal per Kid (1 Main Dish & 1 Glass of Squash).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#f36c05] font-black">•</span>
                <span>Safety induction & youth golf clubs provided.</span>
              </li>
            </ul>
          </div>

          <div className="shrink-0 pr-2">
            <div className="bg-[#dc2626] text-white w-16 h-16 rounded-full flex flex-col items-center justify-center border-2 border-white shadow-md">
              <span className="text-sm font-black leading-none">£16.50</span>
              <span className="text-[8px] font-bold tracking-wider leading-none mt-1">/ KID</span>
            </div>
          </div>
        </div>

        {/* 2. PUTT CRAZY ADVENTURE GOLF PARTY */}
        <div className="border border-slate-300 rounded-xl p-3 flex items-center justify-between relative bg-white gap-4">
          <div className="shrink-0 pl-2">
            <div className="bg-[#dc2626] text-white w-16 h-16 rounded-full flex flex-col items-center justify-center border-2 border-white shadow-md">
              <span className="text-sm font-black leading-none">£16.50</span>
              <span className="text-[8px] font-bold tracking-wider leading-none mt-1">/ KID</span>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <div className="bg-[#f36c05] text-white px-4 py-1 rounded-full font-black text-xs uppercase tracking-wider">
                2. PUTT CRAZY ADVENTURE GOLF PARTY
              </div>
            </div>
            <p className="text-[10px] text-slate-600 font-bold mb-2 uppercase tracking-wide">
              Minimum 6 kids required, only for ages 5-12
            </p>
            <ul className="space-y-1 text-xs text-slate-800 font-extrabold text-left pl-1">
              <li className="flex items-start gap-2">
                <span className="text-[#f36c05] font-black">•</span>
                <span>1 Round of 18 holes mini golf course.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#f36c05] font-black">•</span>
                <span>1 Meal per Kid (1 Main Dish & 1 Glass of Squash).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#f36c05] font-black">•</span>
                <span>Aesthetic neon putters, colorful golf balls & cards provided.</span>
              </li>
            </ul>
          </div>

          <div className="shrink-0 pr-2">
            <PuttingGreenSVG />
          </div>
        </div>

        {/* ENJOY BOTH OPTIONS COMBO DEAL */}
        <div className="bg-[#0e5a5e] text-white p-4 rounded-xl border-y-[6px] border-dotted border-white/40">
          <h3 className="text-center font-black text-sm uppercase tracking-wider mb-0.5">
            ENJOY BOTH OPTIONS FOR AN EVEN BETTER DEAL!
          </h3>
          <p className="text-center text-[10px] text-teal-100 font-bold mb-3 uppercase tracking-wide">
            Combine range practice with crazy putting for the ultimate birthday celebration!
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white text-slate-900 rounded-lg p-2.5 flex items-center justify-between border border-slate-200">
              <div className="flex-1 pr-2">
                <p className="text-[8px] text-slate-500 font-extrabold leading-tight uppercase">(Add 18 Holes to Driving Range)</p>
                <p className="text-[10px] font-black text-slate-950 uppercase leading-tight mt-0.5">ADD Putt Crazy 18 Holes to Driving Range Party</p>
              </div>
              <div className="bg-[#dc2626] text-white rounded-lg px-2 py-1.5 text-center shrink-0 flex flex-col justify-center min-w-[70px]">
                <span className="text-[7px] font-bold leading-none block uppercase">ONLY</span>
                <span className="text-xs font-black leading-none block my-0.5">£5</span>
                <span className="text-[7px] font-bold leading-none block uppercase">PER KID</span>
              </div>
            </div>

            <div className="bg-white text-slate-900 rounded-lg p-2.5 flex items-center justify-between border border-slate-200">
              <div className="flex-1 pr-2">
                <p className="text-[8px] text-slate-500 font-extrabold leading-tight uppercase">(Add Driving Range to Putt Crazy)</p>
                <p className="text-[10px] font-black text-slate-950 uppercase leading-tight mt-0.5">ADD Driving Range to Putt Crazy Party</p>
              </div>
              <div className="bg-[#dc2626] text-white rounded-lg px-2 py-1.5 text-center shrink-0 flex flex-col justify-center min-w-[70px]">
                <span className="text-[7px] font-bold leading-none block uppercase">ONLY</span>
                <span className="text-xs font-black leading-none block my-0.5">£5</span>
                <span className="text-[7px] font-bold leading-none block uppercase">PER KID</span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOD AND DRINKS OPTIONS */}
        <div className="bg-[#0e5a5e] text-white p-4 rounded-2xl relative">
          
          {/* Illustrations nested nicely */}
          <div className="absolute top-2 left-2 opacity-25">
            <SpaghettiPlateSVG />
          </div>
          <div className="absolute bottom-2 right-2 opacity-25">
            <SquashJugSVG />
          </div>

          <h3 className="text-center font-black text-sm uppercase tracking-widest text-[#a5f3fc] mb-3">
            FOOD AND DRINKS OPTIONS
          </h3>
          
          <div className="grid grid-cols-2 gap-6 relative z-10">
            {/* Mains column */}
            <div className="bg-[#073c3f]/80 p-3 rounded-xl border border-teal-700/50">
              <div className="text-center mb-2">
                <span className="bg-[#f36c05] text-white text-[9px] font-black uppercase px-3 py-0.5 rounded-full tracking-wider">
                  CHOICE OF MAIN DISH:
                </span>
              </div>
              <ul className="space-y-1.5 text-[10px] font-extrabold tracking-wide text-left uppercase text-white pl-1 list-disc list-inside">
                <li>Pasta in Cream Sauce</li>
                <li>Chicken Nuggets with Chips</li>
                <li>Fish Goujons with Chips</li>
                <li>Pasta in Tomato Sauce</li>
                <li>Vegetables Nuggets with Chips</li>
                <li>Margherita Pizza with Two Toppings</li>
              </ul>
            </div>

            {/* Drinks column */}
            <div className="bg-[#073c3f]/80 p-3 rounded-xl border border-teal-700/50 flex flex-col justify-between">
              <div>
                <div className="text-center mb-2">
                  <span className="bg-[#f36c05] text-white text-[9px] font-black uppercase px-3 py-0.5 rounded-full tracking-wider">
                    CHOICE OF SOFT DRINK:
                  </span>
                </div>
                <ul className="space-y-1.5 text-[10px] font-extrabold tracking-wide text-left uppercase text-white pl-1 list-disc list-inside">
                  <li>Black Currant Squash</li>
                  <li>Orange Squash</li>
                </ul>
              </div>
              
              {/* Extra note inside */}
              <div className="mt-4 text-[8px] text-teal-200/80 font-bold text-center uppercase tracking-wide">
                Freshly prepared daily &bull; Allergens handled safely on request
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="text-center pt-2">
          {/* Pre-booking banner */}
          <div className="bg-[#f36c05] py-2 px-8 rounded-full inline-block mb-3 border-2 border-white shadow-sm">
            <span className="text-white text-xs font-black tracking-wider uppercase">
              PRE-BOOKING REQUIRED FOR ALL PACKAGES
            </span>
          </div>
          
          <p className="text-[#0e5a5e] text-[10px] font-black tracking-wider uppercase mb-3">
            TO RESERVE YOUR KIDS PARTY PLEASE CONTACT US:
          </p>

          {/* Contact Details Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <a 
              href="https://playgolfkidsparty.netlify.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="border border-slate-300 rounded-lg py-2 text-[10px] font-extrabold text-slate-800 bg-slate-50 flex items-center justify-center gap-1.5 uppercase hover:bg-slate-100 transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-[#0e5a5e]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10M12 2a15.3 15.3 0 00-4 10 15.3 15.3 0 004 10" />
              </svg>
              <span>https://playgolfkidsparty.netlify.app/</span>
            </a>

            <a 
              href="mailto:enquiries@playgolfnorthwickpark.com" 
              className="border border-slate-300 rounded-lg py-2 text-[10px] font-extrabold text-slate-800 bg-slate-50 flex items-center justify-center gap-1.5 uppercase hover:bg-slate-100 transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-[#0e5a5e]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>enquiries@playgolfnorthwickpark.com</span>
            </a>

            <a 
              href="tel:02088642020" 
              className="border border-slate-300 rounded-lg py-2 text-[10px] font-extrabold text-slate-800 bg-slate-50 flex items-center justify-center gap-1.5 uppercase hover:bg-slate-100 transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-[#0e5a5e]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
