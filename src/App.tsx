import { useState } from 'react';
import Header from './components/Header';
import BrochureView from './components/BrochureView';
import InteractivePlanner from './components/InteractivePlanner';
import BookingFooter from './components/BookingFooter';
import PrintPDFLayout from './components/PrintPDFLayout';
import PolicyModal, { PolicyType } from './components/PolicyModal';
import { Target, Flag, CalendarRange, Utensils, X, ExternalLink, Download, CheckCircle2 } from 'lucide-react';
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

function oklabToRgb(l: number, a_lab: number, b_lab: number, a: number = 1): string {
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

function replaceOklabInCss(cssText: string): string {
  return cssText.replace(/oklab\s*\(([^)]+)\)/gi, (match, content) => {
    try {
      const parts = content.trim().split(/[\s,/]+/);
      if (parts.length < 3) return match;

      const lStr = parts[0];
      let l = parseFloat(lStr);
      if (lStr.includes('%')) {
        l = l / 100;
      }

      const aStr = parts[1];
      let aVal = parseFloat(aStr);
      if (aStr.includes('%')) {
        aVal = (aVal / 100) * 0.4;
      }

      const bStr = parts[2];
      let bVal = parseFloat(bStr);
      if (bStr.includes('%')) {
        bVal = (bVal / 100) * 0.4;
      }

      let alpha = 1;
      if (parts.length >= 4) {
        const aStr = parts[3];
        alpha = parseFloat(aStr);
        if (aStr.includes('%')) {
          alpha = alpha / 100;
        }
      }

      return oklabToRgb(l, aVal, bVal, alpha);
    } catch (e) {
      console.warn('Failed to parse oklab content:', content, e);
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
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

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
    
    // Revoke old blob URL to prevent memory leaks
    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl);
      setPdfBlobUrl(null);
    }

    // Add the rendering-pdf class to body to make PrintPDFLayout active
    document.body.classList.add('rendering-pdf');

    const tempStyleElements: HTMLStyleElement[] = [];
    const detachedElements: { element: Element; parent: ParentNode; nextSibling: Node | null }[] = [];

    try {
      const element = document.querySelector('.print-container') as HTMLElement;
      if (!element) {
        throw new Error('Print layout container not found');
      }

      // Convert OKLCH and OKLAB to RGB/RGBA in all loaded stylesheets temporarily so html2canvas doesn't crash on OKLCH
      const styleElements = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'));
      for (const el of styleElements) {
        if (el.hasAttribute('data-temp-sanitized')) {
          continue;
        }

        try {
          let cssText = '';
          let isAccessible = false;

          if (el.tagName === 'STYLE') {
            cssText = el.textContent || '';
            isAccessible = true;
          } else if (el.tagName === 'LINK') {
            const link = el as HTMLLinkElement;
            const sheet = link.sheet as CSSStyleSheet;
            if (sheet) {
              try {
                cssText = Array.from(sheet.cssRules)
                  .map(rule => rule.cssText)
                  .join('\n');
                isAccessible = true;
              } catch (e) {
                // Ignore CORS sheets or sheets with restricted rules (e.g. cross-origin CDNs)
                isAccessible = false;
              }
            }
          }

          // If stylesheet is accessible, we sanitize it and inject a converted version
          if (isAccessible && cssText) {
            let convertedCss = replaceOklchInCss(cssText);
            convertedCss = replaceOklabInCss(convertedCss);
            
            const tempStyle = document.createElement('style');
            tempStyle.setAttribute('data-temp-sanitized', 'true');
            tempStyle.textContent = convertedCss;
            document.head.appendChild(tempStyle);
            tempStyleElements.push(tempStyle);
          }

          // Always detach the original element from the DOM (whether accessible or not)
          // so html2canvas doesn't find or try to fetch/parse the unsanitized original stylesheet.
          const parent = el.parentNode;
          if (parent) {
            detachedElements.push({
              element: el,
              parent,
              nextSibling: el.nextSibling,
            });
            parent.removeChild(el);
          }
        } catch (err) {
          console.error('Error handling style element:', err);
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

      // Produce a blob for extreme compatibility across both iOS, Android, and desktop
      const pdfBlob = pdf.output('blob');
      const blobURL = URL.createObjectURL(pdfBlob);
      setPdfBlobUrl(blobURL);
      setIsPdfModalOpen(true);

      const isMobile = /iPad|iPhone|iPod|Android/i.test(navigator.userAgent) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
      const isInIframe = window.self !== window.top;

      if (isMobile && !isInIframe) {
        // Automatically try to open in a new tab, which triggers native preview in mobile Safari / Chrome
        window.open(blobURL, '_blank');
      } else {
        // Otherwise attempt traditional programmatic file download
        pdf.save('playgolf-kids-party-brochure.pdf');
      }
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
      
      // Restore original stylesheets to their exact previous spots in reverse order
      for (let i = detachedElements.length - 1; i >= 0; i--) {
        const { element, parent, nextSibling } = detachedElements[i];
        try {
          if (nextSibling && nextSibling.parentNode === parent) {
            parent.insertBefore(element, nextSibling);
          } else {
            parent.appendChild(element);
          }
        } catch (err) {
          console.error('Error restoring style element:', err);
          document.head.appendChild(element);
        }
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

      {/* PDF Ready / Fallback Download Modal for High Compatibility */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto no-print flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl border-4 border-slate-950 p-6 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] animate-fade-in">
            {/* Close Button */}
            <button 
              onClick={() => setIsPdfModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-950 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black font-display text-slate-950 uppercase tracking-tight">
                  PDF Brochure Ready!
                </h3>
                <p className="text-xs text-slate-500 font-medium font-mono uppercase">
                  Playgolf Kids Party Packages
                </p>
              </div>

              <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-medium">
                Your high-fidelity printable party brochure has been compiled successfully. If the file did not download automatically, please use the button below to view or save it.
              </p>

              {/* Action Buttons */}
              <div className="w-full space-y-2 pt-2">
                {pdfBlobUrl && (
                  <a
                    href={pdfBlobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-display font-black text-xs uppercase tracking-wider rounded-xl border-2 border-slate-950 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:scale-102 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View / Save PDF (New Tab)</span>
                  </a>
                )}

                {pdfBlobUrl && (
                  <a
                    href={pdfBlobUrl}
                    download="playgolf-kids-party-brochure.pdf"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-950 font-display font-black text-xs uppercase tracking-wider rounded-xl border-2 border-slate-950 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download File Directly</span>
                  </a>
                )}

                <button
                  onClick={() => setIsPdfModalOpen(false)}
                  className="w-full px-5 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-wider"
                >
                  Dismiss
                </button>
              </div>

              {/* Tips */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-left w-full">
                <p className="text-[10px] font-black text-slate-800 uppercase tracking-wider mb-1">
                  💡 Mobile Devices Tip:
                </p>
                <p className="text-[10px] text-slate-500 font-medium leading-normal">
                  Tap <span className="font-bold">"View / Save PDF"</span>. Once the PDF loads in your browser tab, use your browser's <span className="font-bold">Share</span> button and choose <span className="font-bold">"Save to Files"</span>, <span className="font-bold">"Print"</span>, or copy/share via messaging.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
