import { motion, AnimatePresence } from 'motion/react';
import { 
  X, ShieldCheck, FileText, AlertOctagon, HelpCircle, 
  MapPin, Phone, Mail, Clock, Send, CheckCircle2, Info,
  Compass, ArrowRight, ShieldAlert, FileWarning, HelpCircle as HelpIcon 
} from 'lucide-react';
import { useState, FormEvent } from 'react';

export type PolicyType = 'privacy' | 'terms' | 'cancellation' | 'contact';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab: PolicyType;
}

export default function PolicyModal({ isOpen, onClose, initialTab }: PolicyModalProps) {
  const [activeTab, setActiveTab] = useState<PolicyType>(initialTab);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Sync activeTab when initialTab changes on open
  useState(() => {
    setActiveTab(initialTab);
  });

  // Re-sync when modal opens
  const handleOpenSync = () => {
    setActiveTab(initialTab);
    setSubmitSuccess(false);
    setContactName('');
    setContactEmail('');
    setContactMessage('');
  };

  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    }, 1200);
  };

  const tabs: { id: PolicyType; label: string; icon: any; color: string }[] = [
    { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck, color: 'bg-emerald-400' },
    { id: 'terms', label: 'Terms of Use', icon: FileText, color: 'bg-blue-400' },
    { id: 'cancellation', label: 'Cancellation Policy', icon: AlertOctagon, color: 'bg-rose-400' },
    { id: 'contact', label: 'Contact & Help', icon: HelpCircle, color: 'bg-amber-400' },
  ];

  const faqs = [
    {
      q: "Can I bring my own birthday cake and cupcakes?",
      a: "Yes, absolutely! While all main meals and drinks are provided as part of your party package, you are welcome to bring a birthday cake, cupcakes, and party candles."
    },
    {
      q: "What happens if it rains on our Adventure Golf day?",
      a: "Putt Crazy Adventure Golf is an outdoor activity. In the event of heavy rain or storms, we offer you the choice to reschedule your booking for free, or we can move your group onto our covered, heated driving range bays where we can set up alternative fun challenges."
    },
    {
      q: "How early should we arrive before the scheduled party time?",
      a: "Please arrive 15 minutes prior to your booking slot. This ensures all kids can be gathered, fitted with appropriate clubs, and checked in by our events coordinator so you don't lose any of your active play time!"
    },
    {
      q: "Are we allowed to decorate the dedicated party table?",
      a: "Yes! You are welcome to bring along balloons, themed tablecloths, and table scatters to decorate your reserved party table. We just ask that you refrain from pinning anything to the walls or using micro-glitter/confetti."
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-900/80 backdrop-blur-sm no-print">
          {/* Overlay click */}
          <div className="absolute inset-0" onClick={onClose} />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="bg-white border-4 border-slate-950 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] relative z-10"
          >
            {/* Modal Header */}
            <div className="bg-slate-950 text-white p-5 flex justify-between items-center border-b-4 border-slate-950 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-black font-mono tracking-widest text-slate-400 uppercase">Playgolf Northwick Park</span>
              </div>
              <button
                id="btn-close-policy-modal"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 text-slate-950 border-2 border-slate-950 flex items-center justify-center transition-all shadow-[2px_2px_0px_0px_rgba(250,204,21,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(250,204,21,1)]"
              >
                <X className="w-4 h-4 stroke-[3]" />
              </button>
            </div>

            {/* Inner Content Layout */}
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-0">
              {/* Sidebar Tabs Selector */}
              <div className="bg-slate-50 border-b-4 md:border-b-0 md:border-r-4 border-slate-950 p-4 md:w-64 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible shrink-0 scrollbar-none">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setSubmitSuccess(false);
                      }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-xs font-black uppercase tracking-wider text-left transition-all shrink-0 md:shrink ${
                        isActive
                          ? `${tab.color} text-slate-950 border-slate-950 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]`
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-950'
                      }`}
                    >
                      <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'stroke-[2.5]' : ''}`} />
                      <span className="whitespace-nowrap">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Main Policy Content Area */}
              <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-white min-h-0 space-y-6">
                
                {/* 1. PRIVACY POLICY */}
                {activeTab === 'privacy' && (
                  <div className="space-y-6 animate-fade-in text-slate-800">
                    <div className="flex items-center gap-3 border-b-2 border-slate-100 pb-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 border-2 border-emerald-500 text-emerald-800 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                        <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-slate-950 uppercase tracking-tight font-display">Privacy & GDPR Statement</h4>
                        <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider">Last updated: June 2026</p>
                      </div>
                    </div>

                    <div className="bg-emerald-50/55 border-2 border-dashed border-emerald-400 rounded-2xl p-4 flex gap-3 text-xs leading-relaxed text-emerald-950">
                      <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-extrabold block">Compliance Guarantee</span>
                        We process all customer details strictly in compliance with the **UK GDPR** and **Data Protection Act 2018 (DPA 2018)**. Your information is purely used to coordinate and verify bookings.
                      </div>
                    </div>

                    <div className="space-y-4 text-xs md:text-sm font-semibold leading-relaxed text-slate-700">
                      <div className="space-y-2">
                        <h5 className="font-black text-slate-950 uppercase tracking-tight text-xs md:text-sm">1. What Information We Collect</h5>
                        <p className="text-slate-600 font-medium">
                          When using our interactive party planner, the optional details you input (including your name, email address, telephone number, your child's first name, birthday age, and specific dietary needs or allergen warnings) are processed by this application.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h5 className="font-black text-slate-950 uppercase tracking-tight text-xs md:text-sm">2. How We Use Your Data</h5>
                        <ul className="list-disc pl-5 space-y-1.5 text-slate-600 font-medium">
                          <li>To formulate complete pre-filled enquiry emails directed to our official reservation team.</li>
                          <li>To adjust menu arrangements and cater to specific allergy restrictions specified by you.</li>
                          <li>To contact you to confirm available time slots and finalize payment details.</li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <h5 className="font-black text-slate-950 uppercase tracking-tight text-xs md:text-sm">3. Zero Third-Party Sharing</h5>
                        <p className="text-slate-600 font-medium">
                          We do not share, sell, or rent your personal information to external companies or marketers. All data is processed locally to generate the booking proposal and is only forwarded to playgolf Northwick Park staff when you click 'Send Booking Request'.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h5 className="font-black text-slate-950 uppercase tracking-tight text-xs md:text-sm">4. Your Rights</h5>
                        <p className="text-slate-600 font-medium">
                          You have the full right to access, rectify, or request deletion of any contact details we hold about you. For any inquiries regarding personal data privacy, please contact our data supervisor at <a href="mailto:enquiries@playgolfnorthwickpark.com" className="text-emerald-700 font-bold hover:underline">enquiries@playgolfnorthwickpark.com</a>.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. TERMS OF USE */}
                {activeTab === 'terms' && (
                  <div className="space-y-6 animate-fade-in text-slate-800">
                    <div className="flex items-center gap-3 border-b-2 border-slate-100 pb-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border-2 border-blue-500 text-blue-800 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                        <FileText className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-slate-950 uppercase tracking-tight font-display">Terms of Use & Course Safety</h4>
                        <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider">Playgolf Rules & Regulations</p>
                      </div>
                    </div>

                    <div className="bg-blue-50/55 border-2 border-dashed border-blue-400 rounded-2xl p-4 flex gap-3 text-xs leading-relaxed text-blue-950">
                      <ShieldAlert className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-extrabold block">Mandatory Supervision Required</span>
                        All childrens' activities on our driving range, adventure golf course, and party tables must be supervised by an adult or legal guardian. Running or swinging golf clubs outside designated hitting boxes is strictly forbidden.
                      </div>
                    </div>

                    <div className="space-y-4 text-xs md:text-sm font-semibold leading-relaxed text-slate-700">
                      <div className="space-y-2">
                        <h5 className="font-black text-slate-950 uppercase tracking-tight text-xs md:text-sm">1. Guest Minimums</h5>
                        <p className="text-slate-600 font-medium">
                          All kids party packages (Driving Range Party, Adventure Golf Party, and Combo Packages) require a strict minimum of **6 paying participants** to qualify for the discounted bundle rates, free golf club hire, and reserved party table benefits.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h5 className="font-black text-slate-950 uppercase tracking-tight text-xs md:text-sm">2. Driving Range Safety Protocol</h5>
                        <ul className="list-disc pl-5 space-y-1 text-slate-600 font-medium">
                          <li>Children must remain behind the yellow safety line at all times except for the active player currently standing on the tee mat.</li>
                          <li>Only one child is permitted inside a driving range hitting bay at any given moment.</li>
                          <li>Golf clubs must only be swung towards the open outfield area. No practice swings are allowed behind the bays.</li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <h5 className="font-black text-slate-950 uppercase tracking-tight text-xs md:text-sm">3. Putt Crazy Adventure Golf Etiquette</h5>
                        <p className="text-slate-600 font-medium">
                          To maintain safe play and preserve the premium turf conditions on our 18-Hole Putt Crazy course, please ensure children do not run across mounds, climb on designated rock displays or obstacles, or hit golf balls with excessive force.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h5 className="font-black text-slate-950 uppercase tracking-tight text-xs md:text-sm">4. Equipment & Club Damage</h5>
                        <p className="text-slate-600 font-medium">
                          Standard high-quality children's clubs and low-flight safety balls are provided free of charge for the event. Any deliberate damage or lost clubs due to irresponsible behavior may be billed at £15 per club.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. CANCELLATION POLICY */}
                {activeTab === 'cancellation' && (
                  <div className="space-y-6 animate-fade-in text-slate-800">
                    <div className="flex items-center gap-3 border-b-2 border-slate-100 pb-4">
                      <div className="w-10 h-10 rounded-xl bg-rose-50 border-2 border-rose-500 text-rose-800 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                        <AlertOctagon className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-slate-950 uppercase tracking-tight font-display">Cancellation & Reschedule Policy</h4>
                        <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider">Deposits, Refunds, & Rain Terms</p>
                      </div>
                    </div>

                    <div className="bg-rose-50/55 border-2 border-dashed border-rose-400 rounded-2xl p-4 flex gap-3 text-xs leading-relaxed text-rose-950">
                      <FileWarning className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-extrabold block">Notice Timeline Overview</span>
                        Cancellations must be requested via email or phone. Free date rescheduling is available up to 24 hours before your party. Deposit refunds are subject to our 3-day notice policy below.
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border-2 border-slate-950 rounded-xl p-4 bg-emerald-50 text-slate-950 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-black font-mono uppercase tracking-widest text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">3+ Days Notice</span>
                          <span className="block text-sm font-black uppercase tracking-tight mt-2.5">Full Refund</span>
                        </div>
                        <p className="text-[11px] text-slate-700 mt-2 font-semibold">Cancel your party or reschedule your slot at least 3 days prior to the booking with no penalty and a full deposit refund.</p>
                      </div>

                      <div className="border-2 border-slate-950 rounded-xl p-4 bg-rose-50 text-slate-950 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-black font-mono uppercase tracking-widest text-rose-800 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded">Less than 3 Days Notice</span>
                          <span className="block text-sm font-black uppercase tracking-tight mt-2.5">No Deposit Refund</span>
                        </div>
                        <p className="text-[11px] text-slate-700 mt-2 font-semibold">Deposits are forfeited for cancellations made within 3 days of the booked event, as food, staff, and bay arrangements are pre-finalized.</p>
                      </div>
                    </div>

                    <div className="space-y-4 text-xs md:text-sm font-semibold leading-relaxed text-slate-700 pt-2">
                      <div className="space-y-2">
                        <h5 className="font-black text-slate-950 uppercase tracking-tight text-xs md:text-sm">Weather-Related Disruptions</h5>
                        <p className="text-slate-600 font-medium">
                          Because we are located in London, we are prepared for rainy days! All our driving range bays are completely weather-shielded and fully heated. For outdoor Adventure Golf, we do not cancel bookings due to light drizzle. In the case of severe storms or high-winds, we will contact you on the morning of the party to arrange an immediate free reschedule or substitute the activity with indoor bay games.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h5 className="font-black text-slate-950 uppercase tracking-tight text-xs md:text-sm">Same Day Reductions in Guest Numbers</h5>
                        <p className="text-slate-600 font-medium">
                          Food and range preparation is finalized 3 days before your event. Reductions in headcounts on the actual day of the party cannot be refunded, and the full pre-confirmed balance for catering and reserved bays must be paid.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. CONTACT & HELP */}
                {activeTab === 'contact' && (
                  <div className="space-y-8 animate-fade-in text-slate-800">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-100 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 border-2 border-amber-500 text-amber-800 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                          <HelpCircle className="w-5 h-5 stroke-[2.5]" />
                        </div>
                        <div>
                          <h4 className="text-xl font-black text-slate-950 uppercase tracking-tight font-display">Contact & FAQ Helpdesk</h4>
                          <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider">Playgolf Harrow &bull; Enquiries</p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="border-2 border-slate-950 rounded-xl p-4 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div className="text-xs">
                          <span className="font-black uppercase tracking-wider text-slate-950 block">Our Location</span>
                          <p className="text-slate-500 font-semibold mt-1 leading-relaxed">
                            Playgolf Northwick Park<br/>
                            Watford Rd, Harrow<br/>
                            London, HA1 3GG
                          </p>
                        </div>
                      </div>

                      <div className="border-2 border-slate-950 rounded-xl p-4 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-start gap-3">
                        <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <div className="text-xs">
                          <span className="font-black uppercase tracking-wider text-slate-950 block">Operating Hours</span>
                          <p className="text-slate-500 font-semibold mt-1 leading-relaxed">
                            Mon - Sun: 9:00 AM - 10:00 PM<br/>
                            Parties: 11:00 AM - 7:00 PM<br/>
                            <span className="text-emerald-700 font-extrabold text-[10px]">Open 364 days a year!</span>
                          </p>
                        </div>
                      </div>

                      <div className="border-2 border-slate-950 rounded-xl p-4 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-start gap-3">
                        <Phone className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div className="text-xs">
                          <span className="font-black uppercase tracking-wider text-slate-950 block">Get In Touch</span>
                          <p className="text-slate-500 font-semibold mt-1 leading-relaxed">
                            Tel: <a href="tel:02088642020" className="font-extrabold text-slate-950 hover:underline">020 8864 2020</a><br/>
                            Email: <a href="mailto:enquiries@playgolfnorthwickpark.com" className="font-extrabold text-slate-950 hover:underline">enquiries@playgolf...</a>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Contact Form & Travel Info Split */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
                      {/* Direct Message Form */}
                      <div className="lg:col-span-7 border-2 border-slate-950 rounded-2xl p-5 bg-slate-50/50 space-y-4">
                        <span className="text-xs font-black uppercase text-slate-950 tracking-wider flex items-center gap-1.5">
                          <Send className="w-3.5 h-3.5 text-amber-600" />
                          Send Direct Message
                        </span>

                        {submitSuccess ? (
                          <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-emerald-50 border-2 border-emerald-500 text-emerald-950 p-4 rounded-xl space-y-2 text-xs font-semibold"
                          >
                            <div className="flex items-center gap-2 text-emerald-800">
                              <CheckCircle2 className="w-5 h-5 shrink-0" />
                              <span className="font-black uppercase tracking-wider text-xs">Message Received!</span>
                            </div>
                            <p className="text-slate-700 leading-relaxed">
                              Thank you for contacting Playgolf Northwick Park. Our dedicated children's birthday coordinator has been notified and will call or email you within **24 hours**!
                            </p>
                          </motion.div>
                        ) : (
                          <form onSubmit={handleContactSubmit} className="space-y-3">
                            <div>
                              <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">Your Full Name</label>
                              <input
                                type="text"
                                required
                                value={contactName}
                                onChange={(e) => setContactName(e.target.value)}
                                className="w-full px-3 py-2 border-2 border-slate-950 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-600 bg-white"
                                placeholder="Jane Doe"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">Your Email Address</label>
                              <input
                                type="email"
                                required
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                                className="w-full px-3 py-2 border-2 border-slate-950 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-600 bg-white"
                                placeholder="jane@example.com"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">Your Message or Enquiry</label>
                              <textarea
                                required
                                rows={3}
                                value={contactMessage}
                                onChange={(e) => setContactMessage(e.target.value)}
                                className="w-full px-3 py-2 border-2 border-slate-950 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-600 bg-white resize-none"
                                placeholder="Hi, I am interested in booking an Adventure Golf party for my son's birthday next month..."
                              />
                            </div>
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 text-white border-2 border-slate-950 font-display font-black text-xs uppercase tracking-wider rounded-xl shadow-[3px_3px_0px_0px_rgba(251,191,36,1)] transition-all flex items-center justify-center gap-1.5 disabled:opacity-55"
                            >
                              {isSubmitting ? 'Sending Request...' : 'Submit Message'}
                            </button>
                          </form>
                        )}
                      </div>

                      {/* Travel & Directions */}
                      <div className="lg:col-span-5 space-y-4">
                        <div className="border-2 border-slate-950 rounded-2xl p-4 bg-amber-50/50 space-y-3">
                          <span className="text-xs font-black uppercase text-slate-950 tracking-wider flex items-center gap-1.5">
                            <Compass className="w-3.5 h-3.5 text-blue-600" />
                            How to find us
                          </span>
                          <div className="text-[11px] text-slate-700 font-semibold space-y-2 leading-relaxed">
                            <div className="flex gap-2">
                              <span className="text-blue-600 font-black">🚇 Tube:</span>
                              <p>Northwick Park Station (Metropolitan Line) is just a **5-minute walk** (0.3 miles) from our reception entrance.</p>
                            </div>
                            <div className="flex gap-2">
                              <span className="text-amber-700 font-black">🚗 Car:</span>
                              <p>Located on Watford Rd directly opposite Northwick Park Hospital. **Free customer parking** for over 150 vehicles is available on site.</p>
                            </div>
                          </div>
                        </div>

                        {/* Interactive map representation (Neo style) */}
                        <div className="border-2 border-slate-950 rounded-2xl h-28 bg-slate-100 overflow-hidden relative shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          <div className="absolute inset-0 bg-emerald-50 flex flex-col items-center justify-center p-4 text-center">
                            <span className="text-xl font-bold">⛳</span>
                            <span className="text-[10px] font-black text-slate-950 uppercase tracking-tight mt-1">Playgolf Northwick Park Map</span>
                            <span className="text-[9px] text-slate-500 font-semibold font-mono mt-0.5">Watford Rd, Harrow, HA1 3GG</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* FAQ SECTION */}
                    <div className="border-t-2 border-slate-100 pt-6 space-y-4">
                      <span className="text-xs font-black uppercase text-slate-950 tracking-wider flex items-center gap-1.5">
                        <HelpIcon className="w-3.5 h-3.5 text-emerald-600" />
                        Frequently Asked Questions
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {faqs.map((faq, index) => (
                          <div key={index} className="border-2 border-slate-200 hover:border-slate-300 bg-white rounded-xl p-4 space-y-1.5 transition-all">
                            <h6 className="text-xs font-black text-slate-950 leading-tight">Q: {faq.q}</h6>
                            <p className="text-[10px] md:text-xs text-slate-600 font-semibold leading-relaxed">A: {faq.a}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

              </div>
            </div>

            {/* Modal Footer / Contact callout */}
            <div className="bg-slate-50 border-t-2 border-slate-200 p-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold text-slate-600 shrink-0">
              <span className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-slate-600" />
                Need help with booking? Call us: <strong className="text-slate-900">020 8864 2020</strong>
              </span>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-950 text-white border-2 border-slate-950 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                Got It
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
