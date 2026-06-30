import { PARTY_PACKAGES, FOOD_MAINS, FOOD_DRINKS, FOOD_EXTRAS } from '../data';
import { Target, Flag, ArrowRight, CheckCircle2, ChevronRight, Gift, Percent, UtensilsCrossed, Star } from 'lucide-react';

interface BrochureViewProps {
  onSelectPackage: (packageId: string) => void;
}

export default function BrochureView({ onSelectPackage }: BrochureViewProps) {
  const drivingRange = PARTY_PACKAGES.find(p => p.id === 'driving-range');
  const adventureGolf = PARTY_PACKAGES.find(p => p.id === 'adventure-golf');
  const comboDeal = PARTY_PACKAGES.find(p => p.id === 'combo-party');

  return (
    <div className="space-y-12">
      {/* Intro section */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <h2 className="text-3xl md:text-4xl font-black font-display text-slate-950 tracking-tight uppercase">
          Kids Party Packages
        </h2>
        <p className="text-slate-600 text-sm font-medium">
          Choose between unlimited range bays, an incredible 18-hole adventure golf quest, or our best-value Ultimate Combo deals.
        </p>
      </div>

      {/* Grid of Packages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        
        {/* Driving Range Party Card */}
        {drivingRange && (
          <div className="group relative bg-white border-4 border-emerald-700 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-[8px_8px_0px_0px_rgba(4,120,87,1)] transition-all duration-300 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(4,120,87,1)]">
            <div>
              <div className="flex justify-between items-start gap-4 mb-4">
                <span className="bg-emerald-700 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                  Option 01
                </span>
                <div className="text-right">
                  <p className="text-3xl font-black font-display text-emerald-800 leading-none">£{drivingRange.pricePerKid.toFixed(2)}</p>
                  <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest mt-0.5">per kid</p>
                </div>
              </div>

              <h3 className="text-2xl md:text-3xl font-black font-display text-slate-950 uppercase tracking-tight mb-2">
                {drivingRange.name}
              </h3>
              
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 font-mono">
                Ages {drivingRange.ageRange} &bull; Min {drivingRange.minKids} Kids Required
              </p>

              <p className="text-slate-600 text-sm leading-relaxed font-medium mb-6">
                {drivingRange.description}
              </p>

              {/* What's Included */}
              <div className="border-t-2 border-dashed border-slate-200 pt-6">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">
                  What's Included:
                </h4>
                <ul className="space-y-3.5">
                  {drivingRange.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-yellow-400 border border-slate-950 rounded-full shrink-0 flex items-center justify-center font-bold text-[10px] text-slate-950 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        {idx + 1}
                      </div>
                      <span className="text-sm text-slate-700 font-medium">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA action bottom */}
            <div className="mt-8 pt-6 border-t-2 border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-black uppercase tracking-wider font-mono">Pre-booking Required</span>
              <button
                id="btn-select-range"
                onClick={() => onSelectPackage('driving-range')}
                className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-display font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl border-2 border-slate-950 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all duration-150 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                Plan Range Party <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Adventure Golf Party Card */}
        {adventureGolf && (
          <div className="group relative bg-white border-4 border-blue-600 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-[8px_8px_0px_0px_rgba(37,99,235,1)] transition-all duration-300 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(37,99,235,1)]">
            <div>
              <div className="flex justify-between items-start gap-4 mb-4">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                  Option 02
                </span>
                <div className="text-right">
                  <p className="text-3xl font-black font-display text-blue-700 leading-none">£{adventureGolf.pricePerKid.toFixed(2)}</p>
                  <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest mt-0.5">per kid</p>
                </div>
              </div>

              <h3 className="text-2xl md:text-3xl font-black font-display text-slate-950 uppercase tracking-tight mb-2">
                {adventureGolf.name}
              </h3>
              
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 font-mono">
                Ages {adventureGolf.ageRange} &bull; Min {adventureGolf.minKids} Kids Required
              </p>

              <p className="text-slate-600 text-sm leading-relaxed font-medium mb-6">
                {adventureGolf.description}
              </p>

              {/* What's Included */}
              <div className="border-t-2 border-dashed border-slate-200 pt-6">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">
                  What's Included:
                </h4>
                <ul className="space-y-3.5">
                  {adventureGolf.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-yellow-400 border border-slate-950 rounded-full shrink-0 flex items-center justify-center font-bold text-[10px] text-slate-950 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        {idx + 1}
                      </div>
                      <span className="text-sm text-slate-700 font-medium">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA action bottom */}
            <div className="mt-8 pt-6 border-t-2 border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-black uppercase tracking-wider font-mono">Pre-booking Required</span>
              <button
                id="btn-select-golf"
                onClick={() => onSelectPackage('adventure-golf')}
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-display font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl border-2 border-slate-950 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all duration-150 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                Plan Putt Party <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Section 3: Food and Drinks Options & Combo Deals */}
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Solid Yellow Neobrutalist Combo Deal Banner */}
        {comboDeal && (
          <div className="relative bg-yellow-400 border-4 border-slate-950 rounded-3xl p-6 md:p-10 text-slate-950 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] overflow-hidden">
            <div className="relative flex flex-col lg:flex-row items-stretch justify-between gap-8">
              
              <div className="space-y-4 max-w-2xl text-left flex-1 flex flex-col justify-center">
                <div className="bg-slate-950 text-white px-4 py-1.5 rotate-[-1.5deg] font-black text-xs tracking-wider uppercase inline-block self-start shadow-[3px_3px_0px_0px_rgba(250,204,21,1)]">
                  🌟 Combo Deal! Best Value Package
                </div>
                
                <h3 className="text-3xl md:text-4xl font-black font-display uppercase tracking-tight">
                  {comboDeal.name}
                </h3>
                
                <p className="text-slate-900 text-sm font-semibold leading-relaxed">
                  Can't decide? Enjoy double the adventure! Combine range practice and unlimited golf ball hitting with our immersive 18-hole crazy mini golf challenge for the ultimate birthday!
                </p>
                
                {/* Specific additions from user prompt */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                  <div className="bg-white border-2 border-slate-950 p-4 rounded-xl shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                    <span className="block text-[11px] text-emerald-800 font-extrabold uppercase tracking-wider mb-1">(Add 18 Holes to Driving Range)</span>
                    <span className="block text-xs text-slate-900 font-bold leading-snug">
                      ADD Putt Crazy 18 Holes to Driving Range Party | <strong className="text-emerald-900 font-black">Only £5 per kid</strong>
                    </span>
                  </div>
                  <div className="bg-white border-2 border-slate-950 p-4 rounded-xl shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                    <span className="block text-[11px] text-emerald-800 font-extrabold uppercase tracking-wider mb-1">(Add Driving Range to Putt Crazy 18 Holes Party)</span>
                    <span className="block text-xs text-slate-900 font-bold leading-snug">
                      ADD Driving Range to Putt Crazy Party | <strong className="text-emerald-900 font-black">Only £5 per kid</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Massive discount visual badge card */}
              <div className="bg-white border-4 border-slate-950 p-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] shrink-0 w-full lg:w-auto min-w-[220px]">
                <p className="text-xs font-black uppercase tracking-widest text-slate-500">Only</p>
                <p className="text-5xl font-black font-display text-emerald-800 tracking-tight my-1">£21.50</p>
                <p className="text-xs font-extrabold text-slate-500 uppercase">per kid total</p>
                <div className="bg-yellow-100 border border-yellow-400 text-slate-900 text-xs font-black px-2.5 py-1 rounded-md mt-3 tracking-wide">
                  🔥 Saves £11.50 per guest!
                </div>
                
                <button
                  id="btn-select-combo"
                  onClick={() => onSelectPackage('combo-party')}
                  className="mt-5 w-full bg-slate-950 hover:bg-slate-900 text-white font-display font-black text-xs uppercase tracking-wider py-3 px-4 rounded-xl border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(250,204,21,1)] transition-all inline-flex items-center justify-center gap-1.5"
                >
                  Configure Combo <ArrowRight className="w-3.5 h-3.5 text-yellow-300" />
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Catering visual grid */}
        <div className="bg-white rounded-3xl border-4 border-slate-950 p-6 md:p-8 space-y-8 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-slate-200 pb-5">
            <div className="space-y-1">
              <h3 className="text-2xl font-black font-display text-slate-950 uppercase tracking-tight flex items-center gap-2">
                <UtensilsCrossed className="w-6 h-6 text-emerald-700" />
                KIDS PARTY MENU: Food & Drinks Options
              </h3>
              <p className="text-slate-600 text-xs font-medium">
                Every customized menu package includes 1 freshly made hot main dish and 1 chilled soft drink per child guest!
              </p>
            </div>
            <span className="text-xs font-black text-slate-900 bg-yellow-400 border-2 border-slate-950 px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] self-start md:self-auto">
              Allergens Handled Safely
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mains column */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
                <span>🍔</span> SELECTABLE MAINS (Choose 1 per kid)
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {FOOD_MAINS.map(main => (
                  <div key={main.id} className="bg-slate-50 p-4 rounded-xl border-2 border-slate-200 flex gap-4 items-start hover:border-slate-400 transition-colors">
                    <span className="text-3xl p-2 bg-white border border-slate-200 rounded-xl shadow-sm shrink-0">{main.emoji}</span>
                    <div className="space-y-0.5 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-slate-950">{main.name}</span>
                        {main.allergens && main.allergens.length > 0 ? (
                          <span className="text-[9px] text-amber-800 font-extrabold px-1.5 py-0.5 bg-amber-100 border border-amber-300 rounded uppercase">
                            Allergens: {main.allergens.join(', ')}
                          </span>
                        ) : (
                          <span className="text-[9px] text-emerald-800 font-extrabold px-1.5 py-0.5 bg-emerald-100 border border-emerald-300 rounded uppercase">
                            Nut-Free
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{main.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Drinks column */}
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5 mb-4">
                  <span>🥤</span> REFRESHING DRINKS (Choose 1 per kid)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FOOD_DRINKS.map(drink => (
                    <div key={drink.id} className="bg-slate-50 p-3 rounded-xl border-2 border-slate-200 flex gap-3 items-center hover:border-slate-300 transition-all">
                      <span className="text-2xl p-1.5 bg-white border border-slate-100 rounded-lg shrink-0">{drink.emoji}</span>
                      <div>
                        <span className="text-xs font-extrabold text-slate-950 block">{drink.name}</span>
                        <span className="text-[9px] text-emerald-800 font-bold bg-emerald-100 px-1.5 py-0.2 rounded uppercase mt-0.5 inline-block">Chilled</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Extra sweet upgrade */}
              {FOOD_EXTRAS.length > 0 && (
                <div className="bg-yellow-50 border-2 border-dashed border-yellow-400 rounded-2xl p-5 space-y-4">
                  <h5 className="text-xs font-black text-slate-900 tracking-wider uppercase flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-amber-600 animate-bounce" />
                    OPTIONAL PARTY UPGRADES (Available on request)
                  </h5>
                  <div className="space-y-3">
                    {FOOD_EXTRAS.map(ext => (
                      <div key={ext.id} className="flex justify-between items-start gap-4 pb-2 border-b border-yellow-200/55 last:border-0 last:pb-0">
                        <div className="text-xs">
                          <span className="font-extrabold text-slate-900">{ext.emoji} {ext.name}</span>
                          <p className="text-[10px] text-slate-600 mt-0.5 leading-relaxed">{ext.description}</p>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 shrink-0">Add-on</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
