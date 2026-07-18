import { useState } from 'react';
import Header from './components/Header';
import BrochureView from './components/BrochureView';
import InteractivePlanner from './components/InteractivePlanner';
import BookingFooter from './components/BookingFooter';
import PrintPDFLayout from './components/PrintPDFLayout';
import PolicyModal, { PolicyType } from './components/PolicyModal';
import { Target, Flag, CalendarRange, Utensils } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// Helper functions to convert oklch colors to rgb in CSS
// This prevents html2canvas from crashing on modern oklch color values used in Tailwind.
function oklchToRgb(l: number, c: number, h: number, a: number = 1): string {
  const hRad = (h * Math.PI) / 180;
  const a_lab = c * Math.cos(hRad);
  const b_lab = c * Math.sin(hRad);

  const l_lms = l + 0.3963377774 * a_lab + 0.2158037573 * b_lab;
  const m_lms = l - 0.1055613458 * a_lab - 0.0638541728 * b_lab;
  const s_lms = l - 0.0894841775 * a_lab - 1.291485548 * b_lab;

  const l_cube = Math.pow(Math.max(0, l_lms), 3);
  const m_cube = Math.pow(Math.max(0, m_lms), 3);
  const s_cube = Math.pow(Math.max(0, s_lms), 3);

  const r_lin = +4.0767416621 * l_cube - 3.3077115913 * m_cube + 0.2309699292 * s_cube;
  const g_lin = -1.2684380046 * l_cube + 2.6097574011 * m_cube - 0.3413193965 * s_cube;
  const b_lin = -0.0041960863 * l_cube - 0.7034186147 * m_cube + 1.707614701 * s_cube;

  const toSrgb = (val: number): number => {
    const clamped = Math.max(0, Math.min(1, val));
    return clamped <= 0.0031308
      ? clamped * 12.92
      : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
  };

  const r = Math.round(toSrgb(r_lin) * 255);
  const g = Math.round(toSrgb(g_lin) * 255);
  const b = Math.round(toSrgb(b_lin) * 255);

  if (a === 1) {
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
}

function replaceOklchInCss(cssText: string): string {
  return cssText.replace(/oklch\s*\(([^)]+)\)/gi, (match, content) => {
    try {
      const parts = content.trim().split(/[\s,/]+/);
      if (parts.length < 3) return match;

      const lStr = parts[0];
      let l = parseFloat(lStr);
      if (lStr.includes('%')) {
        l = l / 100;
      }

      const cStr = parts[1];
      let c = parseFloat(cStr);
      if (cStr.includes('%')) {
        c = c / 100;
      }

      const hStr = parts[2];
      const h = parseFloat(hStr);

      let a = 1;
      if (parts.length >= 4) {
        const aStr = parts[3];
        a = parseFloat(aStr);
        if (aStr.includes('%')) {
          a = a / 100;
        }
      }

      return oklchToRgb(l, c, h, a);
    } catch (e) {
      console.warn('Failed to parse oklch content:', content, e);
      return match;
    }
  });
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'brochure' | 'planner'>('brochure');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('driving-range');
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [initialPolicyTab, setInitialPolicyTab] = useState<PolicyType>('privacy');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

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

  const handleDownloadPDF = async () => {
    if (isGeneratingPDF) return;
    setIsGeneratingPDF(true);
    // Add the rendering-pdf class to body to make PrintPDFLayout active
    document.body.classList.add('rendering-pdf');

    const tempStyleElements: HTMLStyleElement[] = [];
    const disabledStyleElements: (HTMLStyleElement | HTMLLinkElement)[] = [];

    try {
      const element = document.querySelector('.print-container') as HTMLElement;
      if (!element) {
        throw new Error('Print layout container not found');
      }

      // Convert OKLCH to RGB in all loaded stylesheets temporarily so html2canvas doesn't crash on OKLCH
      const styleElements = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'));
      for (const el of styleElements) {
        try {
          let cssText = '';
          if (el.tagName === 'STYLE') {
            cssText = el.textContent || '';
          } else if (el.tagName === 'LINK') {
            const link = el as HTMLLinkElement;
            const sheet = link.sheet as CSSStyleSheet;
            if (sheet) {
              try {
                cssText = Array.from(sheet.cssRules)
                  .map(rule => rule.cssText)
                  .join('\n');
              } catch (e) {
                // Ignore CORS sheets or sheets with restricted rules
                continue;
              }
            }
          }

          if (cssText.toLowerCase().includes('oklch')) {
            const convertedCss = replaceOklchInCss(cssText);
            
            const tempStyle = document.createElement('style');
            tempStyle.setAttribute('data-temp-sanitized', 'true');
            tempStyle.textContent = convertedCss;
            document.head.appendChild(tempStyle);
            tempStyleElements.push(tempStyle);

            if (el instanceof HTMLStyleElement || el instanceof HTMLLinkElement) {
              el.disabled = true;
              disabledStyleElements.push(el);
            }
          }
        } catch (err) {
          console.error('Error sanitizing stylesheet:', err);
        }
      }

      // Allow a brief delay for any layout layout recalculation
      await new Promise((resolve) => setTimeout(resolve, 350));

      const canvas = await html2canvas(element, {
        scale: 2, // High resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 size width in mm
      const pageHeight = 297; // A4 size height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // If content overflows A4 height, add extra pages
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('playgolf-kids-party-brochure.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to window print
      const originalTitle = document.title;
      document.title = 'playgolf-kids-party-brochure';
      window.print();
      document.title = originalTitle;
    } finally {
      // Restore original stylesheets
      for (const tempStyle of tempStyleElements) {
        if (tempStyle.parentNode) {
          tempStyle.parentNode.removeChild(tempStyle);
        }
      }
      for (const el of disabledStyleElements) {
        el.disabled = false;
      }

      document.body.classList.remove('rendering-pdf');
      setIsGeneratingPDF(false);
    }
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
          onPrint={handleDownloadPDF}
          isGeneratingPDF={isGeneratingPDF}
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
