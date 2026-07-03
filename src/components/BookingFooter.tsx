import { Mail, Phone, CalendarRange, Clock, ShieldCheck, AlertCircle } from 'lucide-react';

interface BookingFooterProps {
  onOpenPolicy: (type: 'privacy' | 'terms' | 'cancellation' | 'contact') => void;
}

export default function BookingFooter({ onOpenPolicy }: BookingFooterProps) {
  return (
    <footer className="mt-16 bg-slate-950 text-white py-14 px-4 border-t-8 border-slate-950 relative overflow-hidden no-print">
      {/* Visual background textures */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff04_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-40"></div>
      
      <div className="max-w-4xl mx-auto relative space-y-12 text-center">
        
        {/* Important terms list - High contrast neobrutalist box */}
        <div className="bg-white border-4 border-slate-950 rounded-3xl p-6 md:p-8 space-y-4 max-w-3xl mx-auto text-left shadow-[6px_6px_0px_0px_rgba(250,204,21,1)] text-slate-950">
          <h4 className="text-sm font-black font-display text-slate-950 tracking-wider uppercase flex items-center gap-2 border-b-2 border-slate-950 pb-2">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
            Kids Birthday Party Booking Terms
          </h4>
          <ul className="text-xs text-slate-800 space-y-3 list-disc pl-5 font-semibold leading-relaxed">
            <li><strong className="text-slate-950">Pre-booking is strictly required</strong> for all kids party packages to guarantee tee times, reserved range bays, and dedicated party tables.</li>
            <li>Packages are recommended for children aged <strong className="text-slate-950">5 to 12 years old</strong>. Adults/guardians must supervise the party.</li>
            <li>A minimum of <strong className="text-slate-950">6 kids</strong> is required for all kids party packages (Driving Range, Adventure Golf, and Combo Parties).</li>
            <li>Final headcount, allergy notifications, and customized meal selections must be confirmed <strong className="text-slate-950">at least 3 days prior</strong> to the scheduled party date.</li>
            <li>Catering is prepared fresh on the day of the party. All main meals are served hot with crispy skinny fries and a choice of soft drink.</li>
          </ul>
        </div>

        {/* Call to Action Reservation Section */}
        <div className="space-y-4 pt-4">
          <h3 className="text-2xl md:text-3xl font-black font-display text-white tracking-tight uppercase">
            Ready to Secure Your Birthday Slot?
          </h3>
          <p className="text-sm text-slate-300 max-w-xl mx-auto font-medium">
            Get in touch with our event coordinators at Northwick Park today to check availability, discuss custom requirements, or request a visit.
          </p>
        </div>

        {/* Contact Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto text-slate-950">
          {/* Email Action */}
          <a
            id="link-email-enquiry"
            href="mailto:Enquiries@playgolfnorthwickpark.com?subject=Kids Party Booking Enquiry"
            className="group flex flex-col items-center justify-center p-6 bg-white hover:bg-slate-50 border-4 border-slate-950 rounded-2xl shadow-[4px_4px_0px_0px_rgba(251,191,36,1)] transition-all duration-200"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 border-2 border-slate-950 group-hover:scale-110 transition-transform">
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-extrabold">Email Event Team</span>
            <span className="text-sm font-black text-slate-950 mt-1 break-all group-hover:text-emerald-700 transition-colors">
              Enquiries@playgolfnorthwickpark.com
            </span>
          </a>

          {/* Phone Action */}
          <a
            id="link-phone-enquiry"
            href="tel:02088642020"
            className="group flex flex-col items-center justify-center p-6 bg-white hover:bg-slate-50 border-4 border-slate-950 rounded-2xl shadow-[4px_4px_0px_0px_rgba(16,185,129,1)] transition-all duration-200"
          >
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mb-3 border-2 border-slate-950 group-hover:scale-110 transition-transform">
              <Phone className="w-5 h-5" />
            </div>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-extrabold">Call Booking Hotline</span>
            <span className="text-sm font-black text-slate-950 mt-1 group-hover:text-amber-600 transition-colors">
              020 8864 2020
            </span>
          </a>
        </div>

        {/* Policy Links bar */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] md:text-xs font-black uppercase tracking-wider text-slate-400 border-t border-slate-800 pt-8 mt-4">
          <button
            onClick={() => onOpenPolicy('privacy')}
            className="hover:text-emerald-400 transition-colors cursor-pointer"
          >
            🔒 Privacy Policy
          </button>
          <span className="text-slate-800 hidden sm:inline">&bull;</span>
          <button
            onClick={() => onOpenPolicy('terms')}
            className="hover:text-blue-400 transition-colors cursor-pointer"
          >
            📋 Terms of Use
          </button>
          <span className="text-slate-800 hidden sm:inline">&bull;</span>
          <button
            onClick={() => onOpenPolicy('cancellation')}
            className="hover:text-rose-400 transition-colors cursor-pointer"
          >
            ⚠️ Cancellation Policy
          </button>
          <span className="text-slate-800 hidden sm:inline">&bull;</span>
          <button
            onClick={() => onOpenPolicy('contact')}
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            📞 Contact Us & FAQ
          </button>
        </div>

        {/* Copyright and address details */}
        <div className="text-[11px] text-slate-500 space-y-1 font-medium">
          <p>playgolf Northwick Park &bull; 280 Watford Rd, Harrow HA1 3GG</p>
          <p>&copy; {new Date().getFullYear()} playgolf Northwick Park. All rights reserved. Putt Crazy Adventure Golf is a registered trademark.</p>
        </div>

      </div>
    </footer>
  );
}
