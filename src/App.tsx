import { useState } from 'react';
import Header from './components/Header';
import BrochureView from './components/BrochureView';
import InteractivePlanner from './components/InteractivePlanner';
import BookingFooter from './components/BookingFooter';
import PrintPDFLayout from './components/PrintPDFLayout';
import PolicyModal, { PolicyType } from './components/PolicyModal';
import { Target, Flag, CalendarRange, Utensils, X, ExternalLink, Download, CheckCircle2, Printer, Image, FileText } from 'lucide-react';
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
  const [brochureImgUrl, setBrochureImgUrl] = useState<string | null>(null);
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
      setBrochureImgUrl(imgData);
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

      {/* PDF Ready & Mobile Save Options Hub Modal */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto no-print flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl border-4 border-slate-950 p-6 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] animate-fade-in my-8">
            {/* Close Button */}
            <button 
              onClick={() => setIsPdfModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-950 transition-colors bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full border border-slate-300"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col space-y-5">
              <div className="flex items-center gap-3 border-b-2 border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black font-display text-slate-950 uppercase tracking-tight leading-none">
                    Brochure Generated!
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium font-mono uppercase mt-1">
                    Select Your Saved Method Below
                  </p>
                </div>
              </div>

              <p className="text-slate-600 text-xs leading-relaxed font-medium">
                To guarantee compatibility on mobile devices, tablets, and in-app browsers, choose the save method that works best for your device:
              </p>

              {/* Option List */}
              <div className="space-y-3.5">
                
                {/* Method 1: System Print / Native Save as PDF */}
                <div className="p-3.5 bg-emerald-50/50 border-2 border-emerald-500/30 rounded-xl flex items-start gap-3 hover:bg-emerald-50 transition-colors">
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200 shrink-0">
                    <Printer className="w-4 h-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="text-xs font-black uppercase text-slate-950 tracking-wider">
                      Method 1: Native System Print (Recommended for iOS/Android)
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-normal">
                      Triggers the standard device print dialog. You can select <span className="font-bold">"Save to PDF"</span> or send it to your home printer instantly.
                    </p>
                    <button
                      onClick={() => {
                        window.print();
                      }}
                      className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-display font-black text-[10px] uppercase tracking-wider rounded-lg border border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
                    >
                      <Printer className="w-3 h-3" />
                      Open System Print Dialog
                    </button>
                  </div>
                </div>

                {/* Method 2: Direct PDF File */}
                {pdfBlobUrl && (
                  <div className="p-3.5 bg-amber-50/50 border-2 border-amber-500/30 rounded-xl flex items-start gap-3 hover:bg-amber-50 transition-colors">
                    <div className="p-2 bg-amber-100 text-amber-700 rounded-lg border border-amber-200 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="text-xs font-black uppercase text-slate-950 tracking-wider">
                        Method 2: PDF File Download
                      </h4>
                      <p className="text-[11px] text-slate-600 leading-normal">
                        Launches a standard PDF download or opens the file in a new tab.
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <a
                          href={pdfBlobUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-display font-black text-[10px] uppercase tracking-wider rounded-lg border border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View PDF in New Tab
                        </a>
                        <a
                          href={pdfBlobUrl}
                          download="playgolf-kids-party-brochure.pdf"
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-950 font-display font-black text-[10px] uppercase tracking-wider rounded-lg border border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]"
                        >
                          <Download className="w-3 h-3" />
                          Force PDF Download
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Method 3: Long-press image */}
                {brochureImgUrl && (
                  <div className="p-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-slate-200 text-slate-700 rounded-lg border border-slate-300 shrink-0">
                        <Image className="w-4 h-4" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="text-xs font-black uppercase text-slate-950 tracking-wider">
                          Method 3: Save as Image (100% Mobile Bulletproof)
                        </h4>
                        <p className="text-[11px] text-slate-600 leading-normal">
                          For instant saving, tap & hold (long press) the compiled image preview below to save it directly to your device's Camera Roll / Photos app.
                        </p>
                      </div>
                    </div>

                    <div className="relative border-2 border-slate-950 rounded-lg overflow-hidden bg-slate-100 p-2 group">
                      <img 
                        src={brochureImgUrl} 
                        alt="Compiled Playgolf Kids Brochure" 
                        className="max-h-56 w-full object-contain mx-auto rounded bg-white shadow-xs"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-slate-950/80 text-white text-[9px] font-mono text-center py-1 select-none pointer-events-none">
                        👇 LONG-TAP ABOVE TO SAVE TO PHOTOS
                      </div>
                    </div>

                    <a
                      href={brochureImgUrl}
                      download="playgolf-kids-party-brochure.png"
                      className="w-full inline-flex items-center justify-center gap-1 px-3 py-2 bg-slate-950 hover:bg-slate-900 text-white font-display font-black text-[10px] uppercase tracking-wider rounded-lg border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]"
                    >
                      <Download className="w-3 h-3" />
                      Download Brochure as PNG Image
                    </a>
                  </div>
                )}

              </div>

              {/* Close footer */}
              <button
                onClick={() => setIsPdfModalOpen(false)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors border border-slate-200"
              >
                Close Saving Hub
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
