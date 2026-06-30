import { useState } from 'react';
import Header from './components/Header';
import BrochureView from './components/BrochureView';
import InteractivePlanner from './components/InteractivePlanner';
import BookingFooter from './components/BookingFooter';
import PrintPDFLayout from './components/PrintPDFLayout';
import PolicyModal, { PolicyType } from './components/PolicyModal';
import { Target, Flag, CircleDollarSign, CalendarRange, Utensils, HelpCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'brochure' | 'planner'>('brochure');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('driving-range');
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [initialPolicyTab, setInitialPolicyTab] = useState<PolicyType>('privacy');

  const handleOpenPolicy = (type: PolicyType) => {
    setInitialPolicyTab(type);
    setIsPolicyModalOpen(true);
  };

  const handleTabChange = (tab: 'brochure' | 'planner') => {
    setActiveTab(tab);
    setTimeout(() => {
      const targetId = tab === 'brochure' ? 'packages-section' : 'planner-section';
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleSelectPackageFromBrochure = (packageId: string) => {
    setSelectedPackageId(packageId);
    setActiveTab('planner');
    setTimeout(() => {
      const el = document.getElementById('planner-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#fbfcfb] text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-950 antialiased">
      
      {/* 1. Print-Only Layer (Pre-formatted high contrast layout for physical paper/PDF download) */}
      <PrintPDFLayout />
  
      {/* 2. Interactive Web Layer (Hidden during print) */}
      <div className="no-print pb-16">
        
        {/* Header with quick navigation */}
        <Header 
          activeTab={activeTab} 
          setActiveTab={handleTabChange} 
          onPrint={handlePrint}
        />

        {/* Feature quick-links bar */}
        <div className="bg-slate-50 border-b-4 border-slate-950 py-4 px-4">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-3.5 text-xs font-black text-slate-950 font-mono uppercase tracking-wider">
            <span className="flex items-center gap-1.5 bg-white border-2 border-slate-950 px-3 py-1 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Target className="w-4 h-4 text-emerald-700" />
              1 Hour Driving Range
            </span>
            <span className="flex items-center gap-1.5 bg-white border-2 border-slate-950 px-3 py-1 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Flag className="w-4 h-4 text-blue-600" />
              18-Hole Putt Crazy
            </span>
            <span className="flex items-center gap-1.5 bg-white border-2 border-slate-950 px-3 py-1 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Utensils className="w-4 h-4 text-emerald-700" />
              Meals & Drinks Included
            </span>
            <span className="flex items-center gap-1.5 bg-white border-2 border-slate-950 px-3 py-1 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <CalendarRange className="w-4 h-4 text-slate-950" />
              Pre-Booking Required
            </span>
          </div>
        </div>

        {/* Main interactive stage */}
        <main className="max-w-6xl mx-auto px-4 md:px-6 pt-10 md:pt-14">
          
          {activeTab === 'brochure' ? (
            /* Brochure Page */
            <div className="animate-fade-in" id="packages-section">
              <BrochureView onSelectPackage={handleSelectPackageFromBrochure} />
            </div>
          ) : (
            /* Planner Page */
            <div className="animate-fade-in" id="planner-section">
              <div className="text-center max-w-xl mx-auto space-y-3 mb-10">
                <h2 className="text-3xl md:text-4xl font-black font-display text-slate-950 tracking-tight uppercase">
                  Interactive Party Planner
                </h2>
                <p className="text-slate-600 text-sm font-medium">
                  Configure guests, check date slot status, customize allergies, calculate exact package costs, and instantly compile a formal booking inquiry.
                </p>
              </div>

              <InteractivePlanner 
                initialPackageId={selectedPackageId} 
                onSetPackage={setSelectedPackageId}
              />
            </div>
          )}

        </main>

        {/* Booking footer */}
        <BookingFooter onOpenPolicy={handleOpenPolicy} />

        {/* Floating Quick Planner Trigger (Visible on Brochure screen) */}
        {activeTab === 'brochure' && (
          <div className="fixed bottom-6 right-6 z-40 hidden md:block animate-pulse hover:animate-none">
            <button
              id="btn-floating-planner"
              onClick={() => handleTabChange('planner')}
              className="bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-display font-black text-xs uppercase tracking-wider px-6 py-4 rounded-full border-2 border-slate-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 hover:scale-105 transition-all"
            >
              ⚡ Instant Price Calculator & Slots
            </button>
          </div>
        )}

      </div>

      <PolicyModal 
        isOpen={isPolicyModalOpen} 
        onClose={() => setIsPolicyModalOpen(false)} 
        initialTab={initialPolicyTab} 
      />

    </div>
  );
}
