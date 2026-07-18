import { PARTY_PACKAGES, FOOD_MAINS, FOOD_DRINKS } from '../data';

export default function PrintPDFLayout() {
  const drivingRange = PARTY_PACKAGES.find(p => p.id === 'driving-range');
  const adventureGolf = PARTY_PACKAGES.find(p => p.id === 'adventure-golf');
  const comboDeal = PARTY_PACKAGES.find(p => p.id === 'combo-party');

  return (
    <div className="print-only print-container max-w-4xl mx-auto p-10 bg-white text-slate-900 border-4 border-slate-900 rounded-3xl my-8">
      {/* Brand Header */}
      <div className="text-center pb-6 border-b-2 border-slate-900">
        <h1 className="text-3xl font-black font-display text-slate-950 tracking-tight uppercase mb-1">
          Playgolf Northwick Park
        </h1>
        <p className="text-emerald-700 font-extrabold tracking-widest text-xs uppercase mb-4">
          Kids Birthday Party Brochure
        </p>
        <div className="inline-block bg-yellow-400 text-slate-950 border-2 border-slate-950 px-5 py-1.5 rounded-full font-black text-xs uppercase tracking-wider">
          Adventure Awaits!
        </div>
      </div>

      {/* Main Party Packages */}
      <div className="py-8 space-y-8">
        <h2 className="text-lg font-black uppercase tracking-wider text-slate-950 border-b-2 border-dashed border-slate-300 pb-2">
          1. Party Packages & Pricing
        </h2>

        <div className="grid grid-cols-2 gap-6">
          {/* Option 1: Driving Range */}
          {drivingRange && (
            <div className="border-2 border-slate-900 p-5 rounded-2xl bg-slate-50 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-slate-900 text-white font-extrabold text-[10px] uppercase px-3 py-1 rounded-full tracking-wider">
                    Option 01
                  </span>
                  <span className="text-xl font-black text-emerald-800">
                    £{drivingRange.pricePerKid.toFixed(2)} <span className="text-[10px] text-slate-500 font-extrabold">/ KID</span>
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-950 uppercase mb-2">
                  {drivingRange.name}
                </h3>
                <p className="text-[11px] text-slate-600 font-bold mb-4 font-mono uppercase tracking-wider">
                  Ages {drivingRange.ageRange} &bull; Min {drivingRange.minKids} Kids
                </p>
                <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                  {drivingRange.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-700 font-black shrink-0">&bull;</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Option 2: Adventure Golf */}
          {adventureGolf && (
            <div className="border-2 border-slate-900 p-5 rounded-2xl bg-slate-50 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-slate-900 text-white font-extrabold text-[10px] uppercase px-3 py-1 rounded-full tracking-wider">
                    Option 02
                  </span>
                  <span className="text-xl font-black text-emerald-800">
                    £{adventureGolf.pricePerKid.toFixed(2)} <span className="text-[10px] text-slate-500 font-extrabold">/ KID</span>
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-950 uppercase mb-2">
                  {adventureGolf.name}
                </h3>
                <p className="text-[11px] text-slate-600 font-bold mb-4 font-mono uppercase tracking-wider">
                  Ages {adventureGolf.ageRange} &bull; Min {adventureGolf.minKids} Kids
                </p>
                <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                  {adventureGolf.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-600 font-black shrink-0">&bull;</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Combo Option */}
        {comboDeal && (
          <div className="border-4 border-dashed border-emerald-700 bg-emerald-50/50 p-6 rounded-2xl text-center">
            <span className="bg-emerald-700 text-white font-black text-[10px] uppercase px-4 py-1.5 rounded-full tracking-wider">
              ⭐ Double The Fun: Ultimate Combo Party Deal
            </span>
            <h3 className="text-xl font-black text-slate-950 uppercase tracking-tight mt-3 mb-1">
              {comboDeal.name}
            </h3>
            <p className="text-slate-700 text-xs font-semibold max-w-2xl mx-auto mb-4 leading-relaxed">
              Combine 1 Hour of Driving Range Practice (unlimited range balls) with a full round of 18-holes Putt Crazy Adventure Golf for just <strong className="text-emerald-900 font-black">£5 extra per child</strong>! Saves £11.50 per guest.
            </p>
            <div className="inline-flex items-center gap-3 bg-white border-2 border-slate-900 px-5 py-2.5 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-xs text-slate-500 font-black uppercase">Ultimate Value:</span>
              <span className="text-2xl font-black text-emerald-800">£{comboDeal.pricePerKid.toFixed(2)}</span>
              <span className="text-xs font-extrabold text-slate-500 uppercase">per child total</span>
            </div>
          </div>
        )}
      </div>

      {/* Food and Drinks Section */}
      <div className="py-6 border-t-2 border-dashed border-slate-300">
        <h2 className="text-lg font-black uppercase tracking-wider text-slate-950 pb-2 mb-4">
          2. Kids Party Catering Menu
        </h2>
        <p className="text-slate-600 text-xs font-semibold mb-6 leading-relaxed">
          Every custom package includes 1 freshly made hot main dish and 1 glass of squash per child guest. Allergens are handled safely.
        </p>

        <div className="grid grid-cols-2 gap-8">
          {/* Mains Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-950 uppercase tracking-widest border-b border-slate-300 pb-1 flex items-center gap-1.5">
              <span>🍕</span> SELECTABLE MAINS (Choose 1 per kid)
            </h4>
            <ul className="space-y-3.5">
              {FOOD_MAINS.map(main => (
                <li key={main.id} className="text-xs">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="font-extrabold text-slate-950 uppercase">{main.emoji} {main.name}</span>
                    {main.allergens && main.allergens.length > 0 && (
                      <span className="text-[9px] text-amber-900 font-extrabold bg-amber-100 border border-amber-200 px-1.5 py-0.2 rounded uppercase">
                        {main.allergens.join(', ')}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    {main.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Drinks & Booking Details Column */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-950 uppercase tracking-widest border-b border-slate-300 pb-1 flex items-center gap-1.5">
                <span>🥤</span> REFRESHING SQUASH (Included)
              </h4>
              <ul className="space-y-2 text-xs font-extrabold text-slate-800">
                {FOOD_DRINKS.map(drink => (
                  <li key={drink.id} className="flex items-center gap-2">
                    <span>{drink.emoji}</span>
                    <span className="uppercase">{drink.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Print out details / terms */}
            <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 space-y-2 text-[11px] text-slate-600 font-medium">
              <p className="font-black text-slate-900 uppercase tracking-wider mb-1">CANCELLATION & POLICY TERMS:</p>
              <p>&bull; Bookings require a minimum of 6 children.</p>
              <p>&bull; Cancellations with more than 14 days notice receive a full refund.</p>
              <p>&bull; Changes to guest count are permitted up to 48 hours in advance.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Contact */}
      <div className="mt-8 pt-6 border-t-2 border-slate-900 text-center space-y-3">
        <p className="text-xs font-extrabold text-emerald-800 uppercase tracking-widest">
          PRE-BOOKING REQUIRED &bull; TO BOOK YOUR PARTY PLEASE CONTACT US:
        </p>
        <div className="grid grid-cols-3 gap-2 text-[10px] font-black uppercase text-slate-900">
          <div className="bg-slate-50 border border-slate-200 rounded-lg py-2">
            🌐 PLAYGOLFKIDSPARTY.NETLIFY.APP
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg py-2">
            ✉️ ENQUIRIES@PLAYGOLFNORTHWICKPARK.COM
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg py-2">
            📞 020 8864 2020
          </div>
        </div>
      </div>
    </div>
  );
}
