import { useState, useMemo, FormEvent } from 'react';
import { PARTY_PACKAGES, FOOD_MAINS, FOOD_DRINKS, FOOD_EXTRAS, getMockAvailability } from '../data';
import { CalculatorState, BirthdaySlot } from '../types';
import { Calendar, Clock, Users, Coffee, Mail, CheckCircle, AlertCircle, ShoppingBag, Receipt, FileText, ChevronRight, Sparkles } from 'lucide-react';

interface InteractivePlannerProps {
  initialPackageId: string;
  onSetPackage: (id: string) => void;
}

export default function InteractivePlanner({ initialPackageId, onSetPackage }: InteractivePlannerProps) {
  // Available dates list
  const availability = useMemo(() => getMockAvailability(), []);
  
  // Local form/calculator state
  const [state, setState] = useState<CalculatorState>({
    selectedPackageId: initialPackageId,
    kidsCount: initialPackageId === 'driving-range' ? 6 : 10,
    selectedMains: {},
    selectedDrinks: {},
    selectedExtras: [],
    partyDate: availability[1]?.date || '', // Default to second day (usually weekend/tomorrow)
    partyTime: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    childName: '',
    childAge: 7,
    allergiesNote: ''
  });

  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Get active package info
  const selectedPackage = useMemo(() => {
    return PARTY_PACKAGES.find(p => p.id === state.selectedPackageId) || PARTY_PACKAGES[0];
  }, [state.selectedPackageId]);

  // Adjust kids count based on package rules
  const handlePackageChange = (packageId: string) => {
    const pkg = PARTY_PACKAGES.find(p => p.id === packageId);
    if (pkg) {
      onSetPackage(packageId);
      setState(prev => ({
        ...prev,
        selectedPackageId: packageId,
        // Enforce minimum kid count for package
        kidsCount: prev.kidsCount < pkg.minKids ? pkg.minKids : prev.kidsCount
      }));
    }
  };

  const handleKidsCountChange = (count: number) => {
    const val = isNaN(count) ? selectedPackage.minKids : count;
    setState(prev => ({
      ...prev,
      kidsCount: Math.max(selectedPackage.minKids, Math.min(50, val))
    }));
  };

  const handleExtraToggle = (extraId: string) => {
    setState(prev => {
      const exists = prev.selectedExtras.includes(extraId);
      return {
        ...prev,
        selectedExtras: exists
          ? prev.selectedExtras.filter(id => id !== extraId)
          : [...prev.selectedExtras, extraId]
      };
    });
  };

  // Get active slots for the selected date
  const availableSlotsForSelectedDate = useMemo(() => {
    const targetDay = availability.find(d => d.date === state.partyDate);
    return targetDay ? targetDay.slots : [];
  }, [state.partyDate, availability]);

  // Calculations
  const calculations = useMemo(() => {
    const baseRate = selectedPackage.pricePerKid;
    const baseTotal = baseRate * state.kidsCount;
    
    // Extras totals
    let extrasTotal = 0;
    state.selectedExtras.forEach(extraId => {
      if (extraId === 'extra-cupcake') extrasTotal += 1.50 * state.kidsCount;
      if (extraId === 'extra-partybags') extrasTotal += 2.50 * state.kidsCount;
      if (extraId === 'extra-sweets') extrasTotal += 2.00 * state.kidsCount;
    });

    // Combo savings explanation
    const regularDrivingRate = 16.50;
    const regularAdventureRate = 16.50;
    const individualCombinedCost = regularDrivingRate + regularAdventureRate;
    const discountAmount = state.selectedPackageId === 'combo-party' 
      ? (individualCombinedCost - 21.50) * state.kidsCount
      : 0;

    const total = baseTotal + extrasTotal;

    return {
      baseTotal,
      extrasTotal,
      discountAmount,
      total,
      pricePerKidTotal: total / state.kidsCount
    };
  }, [selectedPackage, state.kidsCount, state.selectedExtras, state.selectedPackageId]);

  // Generate mailto: link
  const emailDraft = useMemo(() => {
    const pkgName = selectedPackage.name;
    const extrasNames = state.selectedExtras
      .map(id => FOOD_EXTRAS.find(e => e.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    const subject = encodeURIComponent(`Kids Party Booking Request - ${state.childName}'s Birthday`);
    
    const body = encodeURIComponent(
`Hi Playgolf Northwick Park Team,

I would like to request a Kids Birthday Party booking. Below are the customized details of our party:

--- PARTY CONFIGURATION ---
Package: ${pkgName}
Date: ${state.partyDate || '[Not Selected]'}
Requested Time Slot: ${state.partyTime || '[Not Selected]'}
Number of Children: ${state.kidsCount}
Birthday Child's Name: ${state.childName || '[Not Entered]'} (Turning ${state.childAge} years old)

--- CATERING & ALLERGENS ---
Dietary / Allergy Notes: ${state.allergiesNote || 'None'}

--- UPGRADES / EXTRAS ---
Selected Add-ons: ${extrasNames || 'None'}

--- CONTACT DETAILS ---
Parent Name: ${state.parentName || '[Not Entered]'}
Phone Number: ${state.parentPhone || '[Not Entered]'}
Email: ${state.parentEmail || '[Not Entered]'}

--- ESTIMATED TOTAL ---
Estimated Total Cost: £${calculations.total.toFixed(2)} (Based on pricing of £${selectedPackage.pricePerKid.toFixed(2)} per kid)

Please let me know if this date/time is available and what steps are needed to secure our deposit!

Kind regards,
${state.parentName || 'Parent / Guardian'}`
    );

    return `mailto:enquiries@playgolfnorthwickpark.com?subject=${subject}&body=${body}`;
  }, [state, selectedPackage, calculations]);

  const triggerMockBooking = (e: FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    // Open the email client draft
    window.location.href = emailDraft;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto no-print">
      
      {/* LEFT COLUMN: Input Configuration (Col span 7) */}
      <form onSubmit={triggerMockBooking} className="lg:col-span-7 space-y-8">
        
        {/* Step 1: Package Selection */}
        <div className="bg-white rounded-3xl border-4 border-slate-950 p-6 space-y-5 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-400 text-slate-950 border-2 border-slate-950 font-black text-xs font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">1</span>
            <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight font-display">Attraction Package</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {PARTY_PACKAGES.map(pkg => {
              const isSelected = state.selectedPackageId === pkg.id;
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => handlePackageChange(pkg.id)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between h-36 ${
                    isSelected
                      ? 'border-slate-950 bg-emerald-50 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]'
                      : 'border-slate-300 bg-white hover:border-slate-400 hover:shadow-sm'
                  }`}
                >
                  {pkg.id === 'combo-party' && (
                    <span className="absolute -top-3.5 right-2 bg-yellow-400 text-slate-950 text-[9px] font-black border-2 border-slate-950 px-2 py-0.5 rounded-full uppercase tracking-wider shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                      Best Value!
                    </span>
                  )}
                  <div>
                    <span className="block text-xs font-extrabold text-slate-950 leading-tight uppercase tracking-tight">{pkg.name}</span>
                    <span className="block text-xs text-slate-500 mt-1 font-mono">Min {pkg.minKids} kids required</span>
                  </div>
                  <div className="mt-4">
                    <span className="block text-xl font-black font-display text-emerald-800 leading-none">
                      £{pkg.pricePerKid.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">per guest</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Party Details & Sizing */}
        <div className="bg-white rounded-3xl border-4 border-slate-950 p-6 space-y-5 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-400 text-slate-950 border-2 border-slate-950 font-black text-xs font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">2</span>
            <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight font-display">Party Size & Celebrant</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Kids Count */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-700" />
                No. of Guests
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleKidsCountChange(state.kidsCount - 1)}
                  disabled={state.kidsCount <= selectedPackage.minKids}
                  className="w-10 h-10 border-2 border-slate-950 bg-white hover:bg-slate-50 rounded-lg text-slate-950 font-black text-lg flex items-center justify-center disabled:opacity-30 select-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  -
                </button>
                <input
                  id="input-kids-count"
                  type="number"
                  value={state.kidsCount}
                  onChange={(e) => handleKidsCountChange(parseInt(e.target.value))}
                  min={selectedPackage.minKids}
                  max={50}
                  className="w-16 h-10 border-2 border-slate-950 rounded-lg text-center font-black text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-slate-950 bg-slate-50"
                />
                <button
                  type="button"
                  onClick={() => handleKidsCountChange(state.kidsCount + 1)}
                  disabled={state.kidsCount >= 50}
                  className="w-10 h-10 border-2 border-slate-950 bg-white hover:bg-slate-50 rounded-lg text-slate-950 font-black text-lg flex items-center justify-center disabled:opacity-30 select-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  +
                </button>
              </div>
              <span className="text-[10px] text-emerald-800 font-extrabold uppercase block tracking-wider mt-1.5">
                Min {selectedPackage.minKids} required.
              </span>
            </div>

            {/* Child's Name */}
            <div className="space-y-2">
              <label htmlFor="input-child-name" className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
                Birthday Star's Name
              </label>
              <input
                id="input-child-name"
                type="text"
                required
                value={state.childName}
                onChange={(e) => setState(prev => ({ ...prev, childName: e.target.value }))}
                placeholder="Name"
                className="w-full h-10 px-3 border-2 border-slate-950 rounded-lg text-xs font-extrabold text-slate-800 focus:outline-none focus:bg-amber-50/20 focus:border-emerald-600 bg-slate-50"
              />
            </div>

            {/* Child's Age */}
            <div className="space-y-2">
              <label htmlFor="input-child-age" className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
                Age Turning
              </label>
              <select
                id="input-child-age"
                value={state.childAge}
                onChange={(e) => setState(prev => ({ ...prev, childAge: parseInt(e.target.value) }))}
                className="w-full h-10 px-2 border-2 border-slate-950 rounded-lg text-xs font-extrabold text-slate-800 focus:outline-none focus:border-emerald-600 bg-slate-50"
              >
                {[5, 6, 7, 8, 9, 10, 11, 12].map(age => (
                  <option key={age} value={age}>Turning {age} years old</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Step 3: Date & Birthday Slot Availability */}
        <div className="bg-white rounded-3xl border-4 border-slate-950 p-6 space-y-5 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-400 text-slate-950 border-2 border-slate-950 font-black text-xs font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">3</span>
              <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight font-display">Date & Birthday Time Slots</h3>
            </div>
            <span className="text-[10px] font-black text-slate-900 bg-yellow-400 border-2 border-slate-950 px-3 py-1 rounded-full uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              🟢 Live Availability
            </span>
          </div>

          <div className="space-y-5">
            {/* Quick date picker row */}
            <div className="space-y-2">
              <label htmlFor="select-date" className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-4 h-4 text-emerald-700" />
                Select Birthday Date (Next 14 Days)
              </label>
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 snap-x">
                {availability.map((day) => {
                  const isSelected = state.partyDate === day.date;
                  return (
                    <button
                      key={day.date}
                      type="button"
                      onClick={() => setState(prev => ({ ...prev, partyDate: day.date, partyTime: '' }))}
                      className={`px-4 py-3 rounded-2xl border-2 shrink-0 text-left snap-start transition-all ${
                        isSelected
                          ? 'border-slate-950 bg-yellow-400 text-slate-950 font-black shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]'
                          : 'border-slate-300 bg-white hover:border-slate-400 text-slate-700'
                      }`}
                    >
                      <span className={`block text-[9px] uppercase font-bold tracking-wider ${isSelected ? 'text-slate-800' : 'text-slate-500'}`}>
                        {day.date.split(',')[0]}
                      </span>
                      <span className="block text-xs font-black mt-0.5">
                        {day.date.split(',')[1]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slots grid corresponding to date */}
            <div className="space-y-3">
              <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-4 h-4 text-emerald-700" />
                Available Birthday Slots for <span className="text-emerald-800 font-extrabold">{state.partyDate}</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {availableSlotsForSelectedDate.map((slot) => {
                  const isBooked = slot.status === 'booked';
                  const isSelected = state.partyTime === slot.time;
                  
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={isBooked}
                      onClick={() => setState(prev => ({ ...prev, partyTime: slot.time }))}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${
                        isBooked
                          ? 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed'
                          : isSelected
                            ? 'border-slate-950 bg-emerald-700 text-white font-black shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] scale-[1.02]'
                            : 'bg-white border-slate-300 hover:border-slate-400 text-slate-700 font-semibold'
                      }`}
                    >
                      <span className="block text-xs font-black">{slot.time}</span>
                      
                      {isBooked ? (
                        <span className="block text-[8px] font-mono uppercase font-bold text-slate-400 mt-1">Booked</span>
                      ) : slot.status === 'filling-fast' ? (
                        <span className={`block text-[8px] font-mono uppercase font-bold mt-1 ${isSelected ? 'text-yellow-300' : 'text-amber-600 animate-pulse'}`}>
                          Hurry!
                        </span>
                      ) : (
                        <span className={`block text-[8px] font-mono uppercase font-bold mt-1 ${isSelected ? 'text-emerald-200' : 'text-emerald-600'}`}>
                          Available
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom precise time picker */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold text-slate-950 uppercase tracking-wider block">Or Specify Custom Precise Time</span>
                <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Anytime between 12:00 PM and 9:00 PM</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="time"
                  min="12:00"
                  max="21:00"
                  value={
                    state.partyTime 
                      ? (() => {
                          const matches = state.partyTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
                          if (matches) {
                            let hours = parseInt(matches[1]);
                            const minutes = matches[2];
                            const ampm = matches[3].toUpperCase();
                            if (ampm === 'PM' && hours < 12) hours += 12;
                            if (ampm === 'AM' && hours === 12) hours = 0;
                            return `${String(hours).padStart(2, '0')}:${minutes}`;
                          }
                          return '';
                        })()
                      : ''
                  }
                  onChange={(e) => {
                    const timeVal = e.target.value;
                    if (timeVal) {
                      const [hoursStr, minutesStr] = timeVal.split(':');
                      let hours = parseInt(hoursStr);
                      const minutes = parseInt(minutesStr);
                      
                      // Validate bounds (12:00 to 21:00)
                      if (hours < 12) {
                        hours = 12;
                      } else if (hours > 21 || (hours === 21 && minutes > 0)) {
                        hours = 21;
                      }
                      
                      const ampm = hours >= 12 ? 'PM' : 'AM';
                      let displayHours = hours;
                      if (displayHours > 12) displayHours -= 12;
                      if (displayHours === 0) displayHours = 12;
                      
                      const finalMinutes = String(minutes).padStart(2, '0');
                      const formattedTime = `${String(displayHours).padStart(2, '0')}:${finalMinutes} ${ampm}`;
                      setState(prev => ({ ...prev, partyTime: formattedTime }));
                    }
                  }}
                  className="px-3 py-2 border-2 border-slate-950 rounded-lg text-xs font-black text-slate-950 bg-white focus:outline-none focus:border-emerald-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                />
                
                {state.partyTime && (
                  <div className="bg-emerald-50 text-emerald-800 border-2 border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider">
                    Selected: {state.partyTime}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Step 4: Catering & Allergy Notes */}
        <div className="bg-white rounded-3xl border-4 border-slate-950 p-6 space-y-5 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-400 text-slate-950 border-2 border-slate-950 font-black text-xs font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">4</span>
            <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight font-display">Party Catering & Food Allergens</h3>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50 border-2 border-slate-950 rounded-2xl p-4 flex gap-3.5 items-start">
              <Coffee className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-xs font-extrabold text-slate-950 block uppercase tracking-tight">Catering Details</span>
                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                  Your package guarantees <strong>1 freshly prepped hot main dish and 1 refreshing chilled soft drink</strong> for every child. You do not need to lock in precise menu quantities today—simply indicate custom allergen requests or gluten-free requirements below. Our booking team will help finalize your menu details 3 days before the party.
                </p>
              </div>
            </div>

            {/* Custom dietary input */}
            <div className="space-y-2">
              <label htmlFor="input-allergies" className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
                Food Allergens & Dietary Requirements (Optional)
              </label>
              <textarea
                id="input-allergies"
                rows={2}
                value={state.allergiesNote}
                onChange={(e) => setState(prev => ({ ...prev, allergiesNote: e.target.value }))}
                placeholder="E.g. 2 vegetarian options, gluten-free requests, severe nut allergies..."
                className="w-full p-3 border-2 border-slate-950 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-600 bg-slate-50"
              />
            </div>
          </div>
        </div>

        {/* Step 5: Optional Upgrades */}
        {FOOD_EXTRAS.length > 0 && (
          <div className="bg-white rounded-3xl border-4 border-slate-950 p-6 space-y-5 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-400 text-slate-950 border-2 border-slate-950 font-black text-xs font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">5</span>
              <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight font-display">Optional Party Upgrades</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {FOOD_EXTRAS.map(extra => {
                const isSelected = state.selectedExtras.includes(extra.id);
                let rate = 0;
                if (extra.id === 'extra-cupcake') rate = 1.50;
                if (extra.id === 'extra-partybags') rate = 2.50;
                if (extra.id === 'extra-sweets') rate = 2.00;

                return (
                  <button
                    key={extra.id}
                    type="button"
                    onClick={() => handleExtraToggle(extra.id)}
                    className={`p-4 rounded-2xl border-2 text-left flex flex-col justify-between transition-all h-36 ${
                      isSelected
                        ? 'border-slate-950 bg-emerald-50/50 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <span className="text-2xl block mb-1">{extra.emoji}</span>
                      <span className="block text-xs font-black text-slate-950 leading-tight uppercase tracking-tight">{extra.name}</span>
                      <span className="block text-[10px] text-slate-500 mt-1 leading-snug">{extra.description}</span>
                    </div>
                    <div className="mt-3 flex justify-between items-center w-full pt-2 border-t border-dashed border-slate-100">
                      <span className="text-[11px] font-black text-slate-900">+£{rate.toFixed(2)} <span className="text-[9px] font-normal text-slate-500">/ kid</span></span>
                      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-[8px] font-black ${
                        isSelected ? 'bg-emerald-600 border-slate-950 text-white' : 'border-slate-400 bg-white'
                      }`}>
                        {isSelected && '✓'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 5/6: Parent Contact Info */}
        <div className="bg-white rounded-3xl border-4 border-slate-950 p-6 space-y-5 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-400 text-slate-950 border-2 border-slate-950 font-black text-xs font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {FOOD_EXTRAS.length > 0 ? '6' : '5'}
            </span>
            <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight font-display">Parent / Guardian Contact</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="input-parent-name" className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">Your Full Name</label>
              <input
                id="input-parent-name"
                type="text"
                required
                value={state.parentName}
                onChange={(e) => setState(prev => ({ ...prev, parentName: e.target.value }))}
                placeholder="John Doe"
                className="w-full h-10 px-3 border-2 border-slate-950 rounded-lg text-xs font-semibold focus:outline-none focus:border-emerald-600 bg-slate-50"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="input-parent-phone" className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">Contact Phone</label>
              <input
                id="input-parent-phone"
                type="tel"
                required
                value={state.parentPhone}
                onChange={(e) => setState(prev => ({ ...prev, parentPhone: e.target.value }))}
                placeholder="07123 456789"
                className="w-full h-10 px-3 border-2 border-slate-950 rounded-lg text-xs font-semibold focus:outline-none focus:border-emerald-600 bg-slate-50"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="input-parent-email" className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">Contact Email</label>
              <input
                id="input-parent-email"
                type="email"
                required
                value={state.parentEmail}
                onChange={(e) => setState(prev => ({ ...prev, parentEmail: e.target.value }))}
                placeholder="name@domain.com"
                className="w-full h-10 px-3 border-2 border-slate-950 rounded-lg text-xs font-semibold focus:outline-none focus:border-emerald-600 bg-slate-50"
              />
            </div>
          </div>
        </div>

        {/* Submit Booking Action */}
        <div className="bg-yellow-400 border-4 border-slate-950 rounded-3xl p-6 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-left">
            <h4 className="font-display font-black text-slate-950 text-base uppercase tracking-tight">Ready to send your request?</h4>
            <p className="text-xs text-slate-900 font-semibold leading-relaxed">
              Ready to book a golf party for your kids? Just send us a request and we will get back to you!
            </p>
          </div>
          <button
            id="btn-submit-booking-draft"
            type="submit"
            className="w-full md:w-auto px-6 py-4 bg-slate-950 hover:bg-slate-900 text-white border-2 border-slate-950 font-display font-black text-xs uppercase tracking-wider rounded-xl shadow-[3px_3px_0px_0px_rgba(250,204,21,1)] transition-all inline-flex items-center justify-center gap-1.5 shrink-0"
          >
            📧 Send Booking Request
          </button>
        </div>

      </form>

      {/* RIGHT COLUMN: Live Receipt / Invoice (Col span 5) */}
      <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-6 self-start">
        
        {/* Cost Summary Box with deep emerald shadow for balance */}
        <div className="bg-slate-950 text-white rounded-3xl p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(16,185,129,1)] border-4 border-slate-950 space-y-6">
          <div className="flex justify-between items-center border-b-2 border-slate-800 pb-4">
            <div>
              <span className="text-[10px] uppercase font-black text-yellow-400 tracking-wider font-mono">Estimated Proposal</span>
              <h4 className="text-lg font-black font-display text-white mt-0.5">COST CALCULATOR</h4>
            </div>
            <Receipt className="w-5 h-5 text-yellow-400" />
          </div>

          {/* Details list */}
          <div className="space-y-4 text-xs">
            {/* Package */}
            <div className="flex justify-between items-start">
              <div>
                <span className="font-extrabold text-slate-100 block uppercase tracking-tight">{selectedPackage.name}</span>
                <span className="text-[10px] text-slate-400 font-semibold">£{selectedPackage.pricePerKid.toFixed(2)} &times; {state.kidsCount} guests</span>
              </div>
              <span className="font-extrabold text-slate-100">£{calculations.baseTotal.toFixed(2)}</span>
            </div>

            {/* Extras */}
            {state.selectedExtras.length > 0 && (
              <div className="border-t border-slate-800/80 pt-4 space-y-2.5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block font-mono">Add-ons Selected:</span>
                {state.selectedExtras.map(id => {
                  const ext = FOOD_EXTRAS.find(e => e.id === id);
                  if (!ext) return null;
                  let rate = 0;
                  if (id === 'extra-cupcake') rate = 1.50;
                  if (id === 'extra-partybags') rate = 2.50;
                  if (id === 'extra-sweets') rate = 2.00;
                  const itemTotal = rate * state.kidsCount;

                  return (
                    <div key={id} className="flex justify-between text-slate-300 font-medium">
                      <span>{ext.emoji} {ext.name} (£{rate.toFixed(2)} &times; {state.kidsCount})</span>
                      <span className="font-bold">£{itemTotal.toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Combo Savings highlight */}
            {state.selectedPackageId === 'combo-party' && (
              <div className="bg-emerald-950/70 border-2 border-emerald-500 rounded-2xl p-4 flex gap-3 items-start mt-4">
                <span className="text-xl">🎉</span>
                <div className="space-y-0.5">
                  <span className="text-xs font-black text-emerald-400 block uppercase tracking-tight">Combo Deal Discount Active!</span>
                  <p className="text-[10px] text-emerald-200/95 leading-normal font-semibold">
                    You saved £11.50 per child! Total booking discount of <strong className="text-emerald-300 font-black">£{(11.50 * state.kidsCount).toFixed(2)}</strong> is already calculated above.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Pricing totals */}
          <div className="border-t-2 border-slate-800 pt-5 space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Cost Per Guest:</span>
              <span className="text-sm font-black text-slate-100">£{calculations.pricePerKidTotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-black text-slate-200 uppercase tracking-wider">Estimated Total:</span>
              <div className="text-right">
                <span className="text-4xl font-black font-display text-yellow-300 tracking-tight">£{calculations.total.toFixed(2)}</span>
                <span className="text-[9px] text-slate-500 block font-bold uppercase tracking-widest mt-1">Includes VAT & Equipment</span>
              </div>
            </div>
          </div>

          {/* Warnings or rules based on selection */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 text-[10px] text-slate-400 font-medium">
            <div className="flex items-center gap-1.5 font-black text-slate-200 uppercase tracking-wider">
              <AlertCircle className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
              <span>Important Booking Rules:</span>
            </div>
            <ul className="space-y-1 list-disc pl-4">
              <li>Pre-booking is required for all packages.</li>
              <li>Deposit required to secure the slot date.</li>
              <li>Ages: {selectedPackage.ageRange} only.</li>
              <li>Min required: {selectedPackage.minKids} guests (booked: {state.kidsCount}).</li>
            </ul>
          </div>
        </div>



        {/* Success Alert Banner */}
        {bookingSuccess && (
          <div className="bg-emerald-50 border-4 border-slate-950 text-slate-950 p-5 rounded-3xl flex gap-3.5 items-start shadow-[4px_4px_0px_0px_rgba(16,185,129,1)]">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-black block uppercase tracking-tight text-emerald-900">Email Draft Triggered!</span>
              <p className="text-[11px] text-slate-700 leading-normal font-medium">
                We've compiled your party configuration into an email draft and triggered your device's default mail client. Please hit "Send" in your mail app, or copy the booking proposal preview box if you prefer.
              </p>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
