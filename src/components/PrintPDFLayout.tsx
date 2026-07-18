import { PARTY_PACKAGES, FOOD_MAINS, FOOD_DRINKS } from '../data';
import PlaygolfLogo from './PlaygolfLogo';
import PuttCrazyLogo from './PuttCrazyLogo';

// SVG Assets to replicate the original flyer exactly
const GolfBagSVG = () => (
  <svg viewBox="0 0 100 120" className="w-20 h-auto filter drop-shadow-[2px_2px_0px_rgba(15,23,42,0.15)]">
    {/* Golf Clubs */}
    <path d="M40 35 L32 12 M50 35 L48 8 M60 35 L68 15" stroke="#475569" strokeWidth="4.5" strokeLinecap="round" />
    <circle cx="32" cy="10" r="7" fill="#64748b" stroke="#0f172a" strokeWidth="2" />
    <circle cx="48" cy="6" r="6" fill="#cbd5e1" stroke="#0f172a" strokeWidth="2" />
    <rect x="63" y="10" width="13" height="7" rx="2.5" fill="#475569" stroke="#0f172a" strokeWidth="2" />

    {/* Main Bag */}
    <rect x="30" y="35" width="40" height="75" rx="10" fill="#0284c7" stroke="#0f172a" strokeWidth="3" />
    <path d="M30 45 C12 55, 12 85, 30 95" fill="none" stroke="#0f172a" strokeWidth="4.5" strokeLinecap="round" />
    <path d="M30 45 C12 55, 12 85, 30 95" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
    <rect x="40" y="55" width="20" height="42" rx="4" fill="#0369a1" stroke="#0f172a" strokeWidth="2" />
    <line x1="30" y1="48" x2="70" y2="48" stroke="#0f172a" strokeWidth="2.5" />
    <line x1="30" y1="95" x2="70" y2="95" stroke="#0f172a" strokeWidth="2.5" />
    <text x="50" y="80" textAnchor="middle" fill="#ffffff" className="font-sans font-black tracking-widest text-[9px]">GOLF</text>
  </svg>
);

const MiniGolfPinSVG = () => (
  <svg viewBox="0 0 120 80" className="w-28 h-auto filter drop-shadow-[2px_2px_0px_rgba(15,23,42,0.15)]">
    {/* Grass green ellipse */}
    <ellipse cx="60" cy="55" rx="55" ry="20" fill="#22c55e" stroke="#0f172a" strokeWidth="2.5" />
    {/* Shadow detail */}
    <ellipse cx="60" cy="58" rx="45" ry="15" fill="#16a34a" opacity="0.4" />
    {/* Hole */}
    <ellipse cx="85" cy="55" rx="7" ry="3.5" fill="#0f172a" />
    {/* Flag Pole */}
    <line x1="85" y1="55" x2="85" y2="15" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
    {/* Red Flag */}
    <path d="M85 15 L52 26 L85 37 Z" fill="#ef4444" stroke="#0f172a" strokeWidth="2.5" strokeLinejoin="round" />
    {/* Golf Ball */}
    <circle cx="45" cy="58" r="4" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
  </svg>
);

const SpaghettiBowlSVG = () => (
  <svg viewBox="0 0 100 100" className="w-20 h-auto filter drop-shadow-[2px_2px_0px_rgba(15,23,42,0.15)]">
    {/* Red ceramic bowl */}
    <ellipse cx="50" cy="65" rx="38" ry="16" fill="#f87171" stroke="#0f172a" strokeWidth="3" />
    <path d="M22 62 L32 78 C38 82, 62 82, 68 78 L78 62" fill="#ef4444" stroke="#0f172a" strokeWidth="3" strokeLinejoin="round" />
    
    {/* Pasta noodles */}
    <ellipse cx="50" cy="53" rx="32" ry="15" fill="#fef08a" stroke="#0f172a" strokeWidth="2" />
    <path d="M25 53 C 32 42, 45 38, 50 48 C 55 36, 68 40, 75 53" fill="none" stroke="#eab308" strokeWidth="3.5" />
    <path d="M28 55 C 34 46, 48 42, 54 50 C 58 41, 66 45, 72 55" fill="none" stroke="#eab308" strokeWidth="2" />
    
    {/* Meatballs / Basil */}
    <circle cx="42" cy="48" r="6" fill="#b91c1c" stroke="#0f172a" strokeWidth="2" />
    <circle cx="58" cy="46" r="5" fill="#b91c1c" stroke="#0f172a" strokeWidth="2" />
    
    {/* Tomato sauce */}
    <path d="M38 48 C42 42, 58 42, 62 48 C64 54, 36 54, 38 48 Z" fill="#dc2626" stroke="#0f172a" strokeWidth="2" />
    <circle cx="48" cy="43" r="3" fill="#15803d" />
  </svg>
);

const SquashJugSVG = () => (
  <svg viewBox="0 0 100 100" className="w-20 h-auto filter drop-shadow-[2px_2px_0px_rgba(15,23,42,0.15)]">
    {/* Handle */}
    <path d="M62 25 C88 25, 88 65, 68 72" fill="none" stroke="#0f172a" strokeWidth="4.5" strokeLinecap="round" />
    <path d="M62 25 C88 25, 88 65, 68 72" fill="none" stroke="#f0f9ff" strokeWidth="2.5" strokeLinecap="round" />

    {/* Glass Jug Outline */}
    <path d="M38 22 L33 33 C25 45, 25 78, 42 88 C58 94, 70 88, 74 76 C78 64, 76 44, 67 33 L62 22 Z" fill="#e0f2fe" stroke="#0f172a" strokeWidth="3" />
    
    {/* Squash Liquid */}
    <path d="M30 48 C25 58, 26 78, 42 86 C58 92, 68 86, 72 74 C75 64, 74 58, 68 48 Z" fill="#facc15" stroke="#0f172a" strokeWidth="2.5" />
    
    {/* Ice cubes & details */}
    <rect x="42" y="55" width="10" height="10" rx="2" fill="#ffffff" opacity="0.4" />
    <rect x="54" y="62" width="8" height="8" rx="2" fill="#ffffff" opacity="0.4" />

    {/* Lemon slice */}
    <circle cx="75" cy="74" r="14" fill="#fde047" stroke="#0f172a" strokeWidth="2" />
    <line x1="75" y1="60" x2="75" y2="88" stroke="#ca8a04" strokeWidth="1.5" />
    <line x1="61" y1="74" x2="89" y2="74" stroke="#ca8a04" strokeWidth="1.5" />
  </svg>
);

export default function PrintPDFLayout() {
  const drivingRange = PARTY_PACKAGES.find(p => p.id === 'driving-range');
  const adventureGolf = PARTY_PACKAGES.find(p => p.id === 'adventure-golf');

  return (
    <div className="print-only print-container p-8 text-slate-900 bg-white border-8 border-double border-slate-200 shadow-2xl rounded-3xl" style={{ width: '794px', minHeight: '1123px', margin: '0 auto', boxSizing: 'border-box' }}>
      
      {/* 1. Header with 'ADVENTURE AWAITS' & Brand Logos */}
      <div className="text-center mb-5 flex flex-col items-center">
        <p className="text-emerald-700 font-black tracking-[0.2em] text-lg uppercase mb-3">
          ADVENTURE AWAITS
        </p>
        
        {/* Double Logos side by side */}
        <div className="flex items-center justify-center gap-10 w-full px-8 pb-4">
          <div className="transform scale-110">
            <PlaygolfLogo textColor="text-slate-950" />
          </div>
          <div className="h-14 border-l-2 border-slate-300"></div>
          <PuttCrazyLogo className="h-16" />
        </div>

        {/* Thick full-width Banner */}
        <div className="w-full bg-teal-800 text-white font-extrabold text-lg py-2.5 px-6 rounded-xl uppercase tracking-widest shadow-md">
          KIDS PARTY MENU & PACKAGES
        </div>
      </div>

      {/* 2. Packages Side-by-Side or Stacked */}
      <div className="space-y-4 mb-6">
        
        {/* Driving Range Party Section */}
        {drivingRange && (
          <div className="relative border-2 border-slate-950 p-4 rounded-2xl bg-white shadow-sm flex items-center justify-between gap-4">
            <div className="flex-1">
              {/* Heading Ribbon with red circular badge on right */}
              <div className="flex items-center justify-between mb-2">
                <span className="bg-orange-500 text-white text-xs font-black uppercase px-4 py-1.5 rounded-lg tracking-wider border border-slate-950 shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                  1. DRIVING RANGE PARTY
                </span>
                {/* Red Circular Badge */}
                <div className="bg-red-600 text-white rounded-full w-14 h-14 flex flex-col items-center justify-center border-2 border-slate-950 shadow-[2px_2px_0px_rgba(0,0,0,1)] transform rotate-6">
                  <span className="text-[10px] font-black leading-none">£16.50</span>
                  <span className="text-[7px] font-bold uppercase leading-none mt-0.5">/ KID</span>
                </div>
              </div>
              
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Only for ages {drivingRange.ageRange}, minimum {drivingRange.minKids} kids required
              </p>
              
              <ul className="text-xs space-y-1 list-none pl-0 text-slate-800 font-bold">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-700 font-extrabold">•</span>
                  <span>1 Hour of Golf with unlimited balls on the Driving Range.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-700 font-extrabold">•</span>
                  <span>1 Meal per Kid (1 Main Dish & 1 Glass of Squash).</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-700 font-extrabold">•</span>
                  <span>Safety induction & youth golf clubs provided.</span>
                </li>
              </ul>
            </div>
            
            <div className="shrink-0 p-1 bg-slate-50 border border-slate-200 rounded-xl">
              <GolfBagSVG />
            </div>
          </div>
        )}

        {/* Putt Crazy Adventure Golf Section */}
        {adventureGolf && (
          <div className="relative border-2 border-slate-950 p-4 rounded-2xl bg-white shadow-sm flex items-center justify-between gap-4">
            <div className="shrink-0 p-1 bg-slate-50 border border-slate-200 rounded-xl">
              <MiniGolfPinSVG />
            </div>

            <div className="flex-1">
              {/* Heading Ribbon with red circular badge on left */}
              <div className="flex items-center justify-between mb-2">
                <span className="bg-orange-500 text-white text-xs font-black uppercase px-4 py-1.5 rounded-lg tracking-wider border border-slate-950 shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                  2. PUTT CRAZY ADVENTURE GOLF PARTY
                </span>
                {/* Red Circular Badge */}
                <div className="bg-red-600 text-white rounded-full w-14 h-14 flex flex-col items-center justify-center border-2 border-slate-950 shadow-[2px_2px_0px_rgba(0,0,0,1)] transform -rotate-3">
                  <span className="text-[10px] font-black leading-none">£16.50</span>
                  <span className="text-[7px] font-bold uppercase leading-none mt-0.5">/ KID</span>
                </div>
              </div>
              
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Minimum {adventureGolf.minKids} kids required, only for ages {adventureGolf.ageRange}
              </p>
              
              <ul className="text-xs space-y-1 list-none pl-0 text-slate-800 font-bold">
                <li className="flex items-start gap-1.5">
                  <span className="text-blue-700 font-extrabold">•</span>
                  <span>1 Round of 18 holes mini golf course.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-blue-700 font-extrabold">•</span>
                  <span>1 Meal per Kid (1 Main Dish & 1 Glass of Squash).</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-blue-700 font-extrabold">•</span>
                  <span>Aesthetic neon putters, colorful golf balls & cards provided.</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Dotted separator line */}
      <div className="border-t-4 border-dashed border-slate-300 my-4"></div>

      {/* 3. Combo Section Deal with Dotted Borders */}
      <div className="border-4 border-dashed border-emerald-600 bg-emerald-50/50 p-4 rounded-2xl mb-5 text-center relative">
        <h3 className="text-sm font-black text-emerald-900 tracking-wider uppercase mb-1">
          ENJOY BOTH OPTIONS FOR AN EVEN BETTER DEAL!
        </h3>
        <p className="text-[11px] text-slate-700 font-extrabold mb-3">
          Combine range practice with crazy putting for the ultimate birthday celebration!
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="border-2 border-slate-950 bg-white p-2.5 rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)] flex items-center justify-between">
            <div className="text-left">
              <h4 className="text-[9px] font-black text-slate-500 uppercase">(Add 18 Holes to Driving Range)</h4>
              <p className="text-[10px] text-slate-900 font-extrabold mt-0.5 leading-tight">
                ADD Putt Crazy 18 Holes to Driving Range Party
              </p>
            </div>
            <span className="bg-red-600 text-white font-black text-[7px] px-2 py-1 rounded border border-slate-950 shrink-0 transform rotate-2">ONLY £5 PER KID</span>
          </div>

          <div className="border-2 border-slate-950 bg-white p-2.5 rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)] flex items-center justify-between">
            <div className="text-left">
              <h4 className="text-[9px] font-black text-slate-500 uppercase">(Add Driving Range to Putt Crazy 18 Holes Party)</h4>
              <p className="text-[10px] text-slate-900 font-extrabold mt-0.5 leading-tight">
                ADD Driving Range to Putt Crazy Party
              </p>
            </div>
            <span className="bg-red-600 text-white font-black text-[7px] px-2 py-1 rounded border border-slate-950 shrink-0 transform -rotate-2">ONLY £5 PER KID</span>
          </div>
        </div>
      </div>

      {/* 4. Food and Drinks Options Container in Dark Teal */}
      <div className="bg-[#0f5a5e] border-2 border-slate-950 rounded-2xl p-4 text-white mb-5 relative overflow-hidden">
        <h3 className="text-center font-black font-display text-base uppercase tracking-widest mb-3">
          FOOD AND DRINKS OPTIONS
        </h3>

        <div className="grid grid-cols-12 gap-2 items-stretch">
          {/* Spaghetti vector on left */}
          <div className="col-span-2 flex items-center justify-center">
            <SpaghettiBowlSVG />
          </div>

          {/* Menu contents */}
          <div className="col-span-8 grid grid-cols-2 gap-4 bg-[#0a474a] p-3.5 rounded-xl border border-[#0d5357]">
            {/* Mains selection list */}
            <div>
              <div className="text-center mb-2">
                <span className="bg-orange-500 text-white text-[9px] font-black uppercase px-3 py-1 rounded-full border border-slate-950">
                  CHOICE OF MAIN DISH:
                </span>
              </div>
              <ul className="text-[10px] space-y-1 list-none pl-0 text-slate-100 font-black">
                {FOOD_MAINS.map(main => (
                  <li key={main.id} className="flex items-start gap-1">
                    <span className="text-emerald-300">•</span>
                    <span className="uppercase">{main.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Drinks selection list */}
            <div>
              <div className="text-center mb-2">
                <span className="bg-orange-500 text-white text-[9px] font-black uppercase px-3 py-1 rounded-full border border-slate-950">
                  CHOICE OF SOFT DRINK:
                </span>
              </div>
              <ul className="text-[10px] space-y-1 list-none pl-0 text-slate-100 font-black">
                {FOOD_DRINKS.map(drink => (
                  <li key={drink.id} className="flex items-start gap-1">
                    <span className="text-emerald-300">•</span>
                    <span className="uppercase">{drink.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Squash jug vector on right */}
          <div className="col-span-2 flex items-center justify-center">
            <SquashJugSVG />
          </div>
        </div>
      </div>

      {/* 5. Bottom Call to Action and Information */}
      <div className="text-center space-y-3">
        {/* Pre-booking pill */}
        <div className="inline-block bg-orange-500 text-white font-black text-xs px-6 py-2 rounded-full uppercase tracking-widest border-2 border-slate-950 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
          PRE-BOOKING REQUIRED FOR ALL PACKAGES
        </div>
        
        <p className="text-xs font-black text-emerald-800 uppercase tracking-wider">
          TO RESERVE YOUR KIDS PARTY PLEASE CONTACT US:
        </p>

        {/* Contact links bar */}
        <div className="grid grid-cols-3 gap-1 pt-1.5 text-[10px] font-black text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-center gap-1">
            <span className="text-xs">🌐</span>
            <span className="underline">https://playgolfkidsparty.netlify.app/</span>
          </div>
          <div className="flex items-center justify-center gap-1 border-x border-slate-300">
            <span className="text-xs">✉️</span>
            <span>ENQUIRIES@PLAYGOLFNORTHWICKPARK.COM</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <span className="text-xs">📞</span>
            <span>020 8864 2020</span>
          </div>
        </div>
      </div>
    </div>
  );
}
