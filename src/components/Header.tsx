import { Sparkles, Trophy, Flag, Trees } from 'lucide-react';
import PlaygolfLogo from './PlaygolfLogo';

interface HeaderProps {
  activeTab: 'brochure' | 'planner';
  setActiveTab: (tab: 'brochure' | 'planner') => void;
  onPrint: () => void;
}

export default function Header({ activeTab, setActiveTab, onPrint }: HeaderProps) {
  return (
    <header className="relative bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white py-12 px-6 md:px-12 border-b-8 border-yellow-400 no-print">
      {/* Decorative clean geometric grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-30"></div>

      <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Left/Main Brand section */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-yellow-400 text-slate-900 border-2 border-slate-900 px-4 py-1.5 rounded-full text-xs font-black tracking-[0.2em] uppercase font-mono shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <Sparkles className="w-3.5 h-3.5 fill-slate-900" />
            <span>Adventure Awaits!</span>
          </div>

          {/* High Fidelity Playgolf Brand Logo */}
          <div className="pt-1.5 pb-0.5">
            <PlaygolfLogo className="h-14 md:h-16 w-auto" textColor="text-white" />
          </div>

          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-black font-display italic tracking-tight text-white leading-none drop-shadow">
              PUTT CRAZY
            </h1>
            <div className="text-lg md:text-xl font-bold text-yellow-300 font-display">
              The Ultimate Birthday Adventure
            </div>
          </div>

          <p className="max-w-xl text-emerald-50 text-xs md:text-sm font-sans font-medium leading-relaxed opacity-95 pt-1">
            The ultimate premium birthday celebration! Experience high-energy driving range targets, 18 holes of winding neon-lit adventure golf, and freshly prepared party meals.
          </p>
        </div>

        {/* Right Tab controls & print button styled in Geometric Balance style */}
        <div className="flex flex-col gap-4 w-full md:w-auto shrink-0">
          <div className="bg-emerald-800/80 p-2.5 rounded-2xl border-2 border-slate-900 flex flex-col sm:flex-row gap-2.5 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
            <button
              id="nav-brochure"
              onClick={() => setActiveTab('brochure')}
              className={`px-5 py-3 rounded-xl font-display font-black text-xs uppercase tracking-wider transition-all duration-200 border-2 ${
                activeTab === 'brochure'
                  ? 'bg-yellow-400 text-slate-950 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] scale-[1.02]'
                  : 'bg-emerald-900/60 hover:bg-emerald-950 text-white border-transparent'
              }`}
            >
              📖 Package Details
            </button>
            
            <button
              id="nav-planner"
              onClick={() => setActiveTab('planner')}
              className={`px-5 py-3 rounded-xl font-display font-black text-xs uppercase tracking-wider transition-all duration-200 border-2 ${
                activeTab === 'planner'
                  ? 'bg-yellow-400 text-slate-950 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] scale-[1.02]'
                  : 'bg-emerald-900/60 hover:bg-emerald-950 text-white border-transparent'
              }`}
            >
              ⚡ Live Party Planner
            </button>
          </div>

          <button
            id="btn-print-brochure"
            onClick={onPrint}
            className="w-full px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border-2 border-slate-950 font-display font-black text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(250,204,21,1)]"
          >
            🖨️ PDF / Print Brochure
          </button>
        </div>

      </div>
    </header>
  );
}
