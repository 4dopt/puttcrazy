import { PARTY_PACKAGES, FOOD_MAINS, FOOD_DRINKS } from '../data';
import PlaygolfLogo from './PlaygolfLogo';

export default function PrintPDFLayout() {
  const drivingRange = PARTY_PACKAGES.find(p => p.id === 'driving-range');
  const adventureGolf = PARTY_PACKAGES.find(p => p.id === 'adventure-golf');

  return (
    <div className="print-only print-container p-6 text-black bg-white">
      {/* Printable Logo and Header */}
      <div className="text-center border-b-2 border-emerald-800 pb-4 mb-6 flex flex-col items-center">
        <p className="text-emerald-800 font-bold tracking-widest text-xs uppercase">ADVENTURE AWAITS!</p>
        <div className="my-2">
          <PlaygolfLogo className="h-12 w-auto" textColor="text-slate-900" />
        </div>
        <h1 className="text-2xl font-black tracking-tight text-emerald-950 uppercase">PUTT CRAZY</h1>
        <div className="mt-2 bg-emerald-900 text-white font-bold text-xs px-4 py-1 inline-block rounded uppercase tracking-widest">
          KIDS PARTY MENU & PACKAGES
        </div>
      </div>

      <div className="print-grid mb-6">
        {/* Section 1: Driving Range Party */}
        {drivingRange && (
          <div className="print-card border border-slate-300 p-4 rounded-lg bg-slate-50">
            <div className="flex justify-between items-start border-b border-slate-200 pb-2 mb-2">
              <h2 className="text-base font-bold text-emerald-950">1. {drivingRange.name}</h2>
              <span className="text-lg font-extrabold text-emerald-800">£{drivingRange.pricePerKid.toFixed(2)} <span className="text-xs font-normal">/ kid</span></span>
            </div>
            <p className="text-xs font-semibold text-slate-600 mb-2 italic">
              (only for ages {drivingRange.ageRange}, minimum {drivingRange.minKids} kids required)
            </p>
            <ul className="text-xs space-y-1.5 list-disc pl-4 text-slate-800 font-medium">
              <li>1 Hour of Golf with unlimited balls on the Driving Range.</li>
              <li>1 Meal per Kid (1 Main Dish & 1 Soft Drink).</li>
              <li>Safety induction & youth golf clubs provided.</li>
            </ul>
          </div>
        )}

        {/* Section 2: Adventure Golf Party */}
        {adventureGolf && (
          <div className="print-card border border-slate-300 p-4 rounded-lg bg-slate-50">
            <div className="flex justify-between items-start border-b border-slate-200 pb-2 mb-2">
              <h2 className="text-base font-bold text-emerald-950">2. {adventureGolf.name}</h2>
              <span className="text-lg font-extrabold text-emerald-800">£{adventureGolf.pricePerKid.toFixed(2)} <span className="text-xs font-normal">/ kid</span></span>
            </div>
            <p className="text-xs font-semibold text-slate-600 mb-2 italic">
              (Minimum {adventureGolf.minKids} kids required, only for ages {adventureGolf.ageRange})
            </p>
            <ul className="text-xs space-y-1.5 list-disc pl-4 text-slate-800 font-medium">
              <li>1 Round of 18holes mini golf course.</li>
              <li>1 Meal per Kid (1 Main Dish & 1 Soft Drink).</li>
              <li>Aesthetic neon putters, colorful golf balls & cards provided.</li>
            </ul>
          </div>
        )}
      </div>

      {/* Combo Section */}
      <div className="print-card border-2 border-dashed border-emerald-600 bg-emerald-50/40 p-4 rounded-lg mb-6 page-break-inside-avoid">
        <h3 className="text-sm font-bold text-emerald-900 tracking-wider uppercase mb-1 text-center">
          ⚡ ENJOY BOTH OPTIONS FOR AN EVEN BETTER DEAL! ⚡
        </h3>
        <p className="text-xs text-slate-700 text-center mb-3 font-medium">
          Combine range practice with crazy putting for the ultimate birthday celebration!
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-emerald-200/60 bg-white p-3 rounded">
            <h4 className="text-xs font-bold text-emerald-950">(Add 18 Holes to Driving Range)</h4>
            <p className="text-xs text-slate-700 mt-1">
              ADD Putt Crazy 18 Holes to Driving Range Party | <span className="font-bold text-emerald-700">Only £5 per kid</span>
            </p>
          </div>
          <div className="border border-emerald-200/60 bg-white p-3 rounded">
            <h4 className="text-xs font-bold text-emerald-950">(Add Driving Range to Putt Crazy 18 Holes Party)</h4>
            <p className="text-xs text-slate-700 mt-1">
              ADD Driving Range to Putt Crazy Party | <span className="font-bold text-emerald-700">Only £5 per kid</span>
            </p>
          </div>
        </div>
      </div>

      {/* Food and Drinks options details */}
      <div className="print-card border border-slate-300 p-4 rounded-lg mb-6 page-break-inside-avoid bg-slate-50">
        <h3 className="text-sm font-bold text-emerald-950 border-b border-slate-200 pb-1 mb-3 uppercase tracking-wider">
          🍔 Food and Drinks Options
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-bold text-emerald-800 mb-1.5">Choice of Main Dish:</h4>
            <ul className="text-xs space-y-1 list-none pl-0 text-slate-800 font-medium">
              {FOOD_MAINS.map(main => (
                <li key={main.id} className="flex items-start gap-1">
                  <span>{main.emoji}</span>
                  <span>{main.name}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-800 mb-1.5">Choice of Soft Drink:</h4>
            <ul className="text-xs space-y-1 list-none pl-0 text-slate-800 font-medium">
              {FOOD_DRINKS.map(drink => (
                <li key={drink.id} className="flex items-start gap-1">
                  <span>{drink.emoji}</span>
                  <span>{drink.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Booking and Contact Footer */}
      <div className="text-center border-t border-slate-200 pt-4 mt-6 page-break-inside-avoid">
        <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
          ⚠️ Pre-Booking Required for All Packages
        </p>
        <p className="text-xs text-slate-700 leading-relaxed font-semibold">
          To reserve your kids party please contact us:
        </p>
        <div className="mt-2 flex justify-center gap-6 text-sm font-bold text-emerald-900 uppercase tracking-wide">
          <span>📧 Enquiries@playgolfnorthwickpark.com</span>
          <span>📞 020 8864 2020</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-4 italic">
          * Terms & conditions apply. Booking is subject to slot availability. Recommended for ages 5-12.
        </p>
      </div>
    </div>
  );
}
