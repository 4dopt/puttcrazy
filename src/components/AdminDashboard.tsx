import { useState, useEffect, useMemo, FormEvent } from 'react';
import { 
  getAllBookings, 
  fetchBookingsFromSupabase,
  updateBookingStatus, 
  updateBookingNotes, 
  deleteBooking, 
  resetToSampleBookings, 
  exportBookingsToCSV,
  exportKitchenRunSheetCSV,
  formatCateringMainsSummary,
  formatCateringDrinksSummary,
  saveBooking 
} from '../services/bookingStorage';
import { BookingRecord, BookingStatus } from '../types';
import { PARTY_PACKAGES, FOOD_EXTRAS } from '../data';
import { 
  ArrowLeft, Search, Filter, Download, Trash2, Edit3, 
  Phone, Mail, Calendar, Clock, Users, AlertTriangle, 
  CheckCircle2, Clock3, DollarSign, Plus, RefreshCw, 
  Printer, X, ShieldCheck, ChevronRight, MessageSquare, Info,
  Cloud, Database, Lock, ChevronDown, FileSpreadsheet, Utensils, Coffee
} from 'lucide-react';


interface AdminDashboardProps {
  onBackToSite: () => void;
  onLogout?: () => void;
}



export default function AdminDashboard({ onBackToSite, onLogout }: AdminDashboardProps) {

  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPackage, setSelectedPackage] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [noteEditId, setNoteEditId] = useState<string | null>(null);
  const [noteEditText, setNoteEditText] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [supabaseConnected, setSupabaseConnected] = useState<boolean>(true);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState<boolean>(false);

  // New manual booking form state
  const [newForm, setNewForm] = useState({
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    childName: '',
    childAge: 7,
    selectedPackageId: 'combo-party',
    kidsCount: 10,
    partyDate: '',
    partyTime: '13:00 - 15:00',
    allergiesNote: '',
    staffNotes: '',
    selectedExtras: [] as string[]
  });

  const loadData = async (showSyncIndicator = false) => {
    // 1. Instant local render
    const cached = getAllBookings();
    setBookings(cached);

    // 2. Fetch live from Supabase
    if (showSyncIndicator) setIsSyncing(true);
    try {
      const live = await fetchBookingsFromSupabase();
      setBookings(live);
      setSupabaseConnected(true);
    } catch (e) {
      console.warn('Supabase fetch issue:', e);
      setSupabaseConnected(false);
    } finally {
      if (showSyncIndicator) setIsSyncing(false);
    }
  };

  useEffect(() => {
    loadData(true);

    // Listen for updates from web form submissions in other tabs or components
    const handleUpdate = () => {
      loadData(false);
    };
    window.addEventListener('playgolf_bookings_updated', handleUpdate);
    return () => {
      window.removeEventListener('playgolf_bookings_updated', handleUpdate);
    };
  }, []);


  const showNotify = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Filtered and searched bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      // Status filter
      if (selectedStatus !== 'all' && b.status !== selectedStatus) {
        return false;
      }
      // Package filter
      if (selectedPackage !== 'all' && b.selectedPackageId !== selectedPackage) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesRef = b.id?.toLowerCase().includes(query);
        const matchesChild = b.childName?.toLowerCase().includes(query);
        const matchesParent = b.parentName?.toLowerCase().includes(query);
        const matchesEmail = b.parentEmail?.toLowerCase().includes(query);
        const matchesPhone = b.parentPhone?.toLowerCase().includes(query);
        const matchesDate = b.partyDate?.toLowerCase().includes(query);

        return matchesRef || matchesChild || matchesParent || matchesEmail || matchesPhone || matchesDate;
      }
      return true;
    });
  }, [bookings, selectedStatus, selectedPackage, searchQuery]);

  // Aggregate stats
  const stats = useMemo(() => {
    const totalCount = bookings.length;
    const pendingCount = bookings.filter(b => b.status === 'Pending').length;
    const confirmedCount = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Deposit Paid').length;
    const totalPipelineValue = bookings
      .filter(b => b.status !== 'Cancelled')
      .reduce((sum, b) => sum + (b.total || 0), 0);
    const totalKids = bookings
      .filter(b => b.status !== 'Cancelled')
      .reduce((sum, b) => sum + (b.kidsCount || 0), 0);

    return { totalCount, pendingCount, confirmedCount, totalPipelineValue, totalKids };
  }, [bookings]);

  const handleStatusChange = (id: string, newStatus: BookingStatus) => {
    updateBookingStatus(id, newStatus);
    loadData();
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking(prev => prev ? { ...prev, status: newStatus } : null);
    }
    showNotify(`Booking ${id} updated to ${newStatus}`);
  };

  const handleSaveNotes = (id: string) => {
    updateBookingNotes(id, noteEditText);
    loadData();
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking(prev => prev ? { ...prev, staffNotes: noteEditText } : null);
    }
    setNoteEditId(null);
    showNotify('Staff notes saved');
  };

  const handleDelete = (id: string) => {
    if (window.confirm(`Are you sure you want to permanently delete booking inquiry ${id}?`)) {
      deleteBooking(id);
      loadData();
      if (selectedBooking?.id === id) {
        setIsDetailModalOpen(false);
      }
      showNotify(`Booking ${id} deleted`, 'info');
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset database to default sample party bookings? Any newly created bookings will be replaced.')) {
      resetToSampleBookings();
      loadData();
      showNotify('Database reset to sample bookings');
    }
  };

  const getFilterDescription = () => {
    const parts: string[] = [];
    if (selectedStatus !== 'all') parts.push(`Status: ${selectedStatus}`);
    if (selectedPackage !== 'all') {
      const pkg = PARTY_PACKAGES.find(p => p.id === selectedPackage);
      parts.push(`Package: ${pkg ? pkg.name : selectedPackage}`);
    }
    if (searchQuery.trim()) parts.push(`Search: "${searchQuery.trim()}"`);
    return parts.length ? parts.join(' | ') : 'All Current Bookings';
  };

  const handleExportCSV = (format: 'executive' | 'kitchen' | 'table-only' = 'executive') => {
    const filterDesc = getFilterDescription();
    exportBookingsToCSV(filteredBookings, {
      format,
      filterDescription: `${filterDesc} (${filteredBookings.length} records)`
    });
    setIsExportMenuOpen(false);

    if (format === 'kitchen') {
      showNotify(`Exported Kitchen Run Sheet (${filteredBookings.length} parties)`);
    } else if (format === 'table-only') {
      showNotify(`Exported Table-Only CSV (${filteredBookings.length} records)`);
    } else {
      showNotify(`Exported Executive Master CSV (${filteredBookings.length} bookings)`);
    }
  };

  const handleCreateManualBooking = (e: FormEvent) => {
    e.preventDefault();
    if (!newForm.parentName || !newForm.partyDate) {
      alert('Please fill in parent name and party date.');
      return;
    }

    const pkg = PARTY_PACKAGES.find(p => p.id === newForm.selectedPackageId) || PARTY_PACKAGES[0];
    const baseTotal = pkg.pricePerKid * newForm.kidsCount;
    let extrasTotal = 0;
    const extrasNames: string[] = [];

    newForm.selectedExtras.forEach(extId => {
      const ext = FOOD_EXTRAS.find(e => e.id === extId);
      if (ext) {
        extrasNames.push(ext.name);
        if (extId === 'extra-cupcake') extrasTotal += 1.50 * newForm.kidsCount;
        if (extId === 'extra-partybags') extrasTotal += 2.50 * newForm.kidsCount;
        if (extId === 'extra-sweets') extrasTotal += 2.00 * newForm.kidsCount;
      }
    });

    const total = baseTotal + extrasTotal;

    const saved = saveBooking({
      selectedPackageId: pkg.id,
      packageName: pkg.name,
      pricePerKid: pkg.pricePerKid,
      kidsCount: newForm.kidsCount,
      partyDate: newForm.partyDate,
      partyTime: newForm.partyTime,
      parentName: newForm.parentName,
      parentPhone: newForm.parentPhone,
      parentEmail: newForm.parentEmail,
      childName: newForm.childName || 'Birthday Child',
      childAge: Number(newForm.childAge) || 7,
      allergiesNote: newForm.allergiesNote || 'None',
      selectedMains: {},
      selectedDrinks: {},
      selectedExtras: newForm.selectedExtras,
      extrasNames,
      baseTotal,
      extrasTotal,
      discountAmount: pkg.id === 'combo-party' ? 11.50 * newForm.kidsCount : 0,
      total,
      status: 'Confirmed',
      staffNotes: newForm.staffNotes,
      source: 'manual'
    });

    loadData();
    setIsNewBookingModalOpen(false);
    showNotify(`Manual booking #${saved.id} created successfully!`);
    
    // Reset form
    setNewForm({
      parentName: '',
      parentPhone: '',
      parentEmail: '',
      childName: '',
      childAge: 7,
      selectedPackageId: 'combo-party',
      kidsCount: 10,
      partyDate: '',
      partyTime: '13:00 - 15:00',
      allergiesNote: '',
      staffNotes: '',
      selectedExtras: []
    });
  };

  const getStatusBadgeClass = (status: BookingStatus) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Deposit Paid':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Completed':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-20 antialiased font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border-2 border-slate-700 flex items-center gap-2.5 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Admin Top Header Bar */}
      <header className="bg-slate-950 text-white border-b-4 border-emerald-500 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToSite}
              id="btn-admin-back-to-site"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-black uppercase tracking-wider text-slate-200 transition-colors border border-slate-700 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Public Website
            </button>
            <div className="h-5 w-px bg-slate-800 hidden sm:block" />
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-600 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider text-white">
                  Staff Backend
                </span>
                <h1 className="text-base sm:text-lg font-black font-display tracking-tight text-white uppercase">
                  Playgolf Party Manager
                </h1>
              </div>
              <p className="text-[11px] text-slate-400">
                Form Submissions, Slot Bookings & Catering Registry
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {/* Live Cloud Status Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-mono font-bold text-slate-300">
              <span className={`w-2 h-2 rounded-full ${supabaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <Cloud className="w-3 h-3 text-emerald-400" />
              <span>Supabase Cloud</span>
            </div>

            <button
              onClick={() => {
                loadData(true);
                showNotify('Synced latest bookings with Supabase');
              }}
              id="btn-admin-sync"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition-colors cursor-pointer"
              title="Sync with Supabase"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">{isSyncing ? 'Syncing...' : 'Sync Cloud'}</span>
            </button>

            <button
              onClick={() => setIsNewBookingModalOpen(true)}
              id="btn-new-manual-booking"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-yellow-400 hover:bg-yellow-300 text-slate-950 text-xs font-black rounded-lg border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wider transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Manual Booking
            </button>
            {/* Export CSV Button with Quick Options Dropdown */}
            <div className="relative">
              <div className="inline-flex rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-2 border-slate-950 overflow-hidden bg-white">
                <button
                  onClick={() => handleExportCSV('executive')}
                  id="btn-admin-export-csv"
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-900 text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                  title="Download Executive Master CSV Report"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Export CSV</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-bold">
                    {filteredBookings.length}
                  </span>
                </button>
                <button
                  onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                  id="btn-admin-export-menu"
                  className="px-1.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border-l border-slate-300 transition-colors cursor-pointer flex items-center justify-center"
                  title="Choose export format"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Dropdown Menu */}
              {isExportMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsExportMenuOpen(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl border-2 border-slate-950 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50 py-2 divide-y divide-slate-100">
                    <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                      Select Report Format
                    </div>
                    
                    <button
                      onClick={() => handleExportCSV('executive')}
                      className="w-full px-3.5 py-2.5 text-left hover:bg-slate-50 flex items-start gap-2.5 transition-colors cursor-pointer group"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs font-black text-slate-900 group-hover:text-emerald-700">
                          Executive Master Report (.csv)
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
                          All 23 columns, UTF-8 pound symbols, full financials, and executive summary totals.
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleExportCSV('kitchen')}
                      className="w-full px-3.5 py-2.5 text-left hover:bg-slate-50 flex items-start gap-2.5 transition-colors cursor-pointer group"
                    >
                      <Utensils className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs font-black text-slate-900 group-hover:text-amber-700">
                          Kitchen & Catering Run Sheet (.csv)
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
                          Dish counts, dietary allergy flags, drink jugs, and party schedules for chefs.
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleExportCSV('table-only')}
                      className="w-full px-3.5 py-2.5 text-left hover:bg-slate-50 flex items-start gap-2.5 transition-colors cursor-pointer group"
                    >
                      <Database className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs font-black text-slate-900 group-hover:text-blue-700">
                          Direct Data Table (.csv)
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
                          Row-1 headers only. Optimized for Excel Pivot Tables, Google Sheets, or DB import.
                        </div>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>
            <button
              onClick={handleResetData}
              id="btn-admin-reset-sample"
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg border border-slate-700 transition-colors"
              title="Reset Sample Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                id="btn-admin-logout"
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-950/80 hover:bg-rose-900 text-rose-300 hover:text-white text-xs font-bold rounded-lg border border-rose-800/80 transition-colors cursor-pointer"
                title="Lock portal"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lock</span>
              </button>
            )}
          </div>


        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        
        {/* KPI Statistics Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 sm:gap-4">
          <div className="bg-white border-2 border-slate-950 rounded-2xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">
              Total Inquiries
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-950 font-display mt-1">
              {stats.totalCount}
            </div>
            <span className="text-[10px] text-slate-500 font-medium">All recorded party leads</span>
          </div>

          <div className="bg-amber-50 border-2 border-slate-950 rounded-2xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 font-mono flex items-center gap-1">
              <Clock3 className="w-3 h-3" />
              Pending Review
            </span>
            <div className="text-2xl sm:text-3xl font-black text-amber-900 font-display mt-1">
              {stats.pendingCount}
            </div>
            <span className="text-[10px] text-amber-700 font-medium">Requires staff callback</span>
          </div>

          <div className="bg-emerald-50 border-2 border-slate-950 rounded-2xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 font-mono flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Confirmed / Paid
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-900 font-display mt-1">
              {stats.confirmedCount}
            </div>
            <span className="text-[10px] text-emerald-700 font-medium">Deposits locked in</span>
          </div>

          <div className="bg-white border-2 border-slate-950 rounded-2xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              Pipeline Value
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-950 font-display mt-1">
              £{stats.totalPipelineValue.toFixed(0)}
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Gross booking revenue</span>
          </div>

          <div className="bg-white border-2 border-slate-950 rounded-2xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] col-span-2 md:col-span-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1">
              <Users className="w-3 h-3" />
              Total Kids
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-950 font-display mt-1">
              {stats.totalKids}
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Guests to cater for</span>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="bg-white border-2 border-slate-950 rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
          <div className="flex flex-col md:flex-row gap-3.5 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Parent, Child, Phone, Email, Ref ID or Date..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-slate-950 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-slate-50 border-2 border-slate-300 rounded-xl text-xs font-extrabold text-slate-800 focus:outline-none focus:border-slate-950"
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending Review</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Deposit Paid">Deposit Paid</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <select
                value={selectedPackage}
                onChange={(e) => setSelectedPackage(e.target.value)}
                className="px-3 py-2 bg-slate-50 border-2 border-slate-300 rounded-xl text-xs font-extrabold text-slate-800 focus:outline-none focus:border-slate-950"
              >
                <option value="all">All Packages</option>
                <option value="driving-range">Driving Range</option>
                <option value="adventure-golf">Putt Crazy</option>
                <option value="combo-party">Combo Deal</option>
              </select>
            </div>
          </div>

          {/* Quick pills */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono overflow-x-auto pb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Showing:</span>
            <span className="font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
              {filteredBookings.length} {filteredBookings.length === 1 ? 'booking' : 'bookings'}
            </span>
            {searchQuery && (
              <span className="bg-yellow-100 text-yellow-900 px-2 py-0.5 rounded text-[10px] font-bold">
                Query: "{searchQuery}"
              </span>
            )}
            {selectedStatus !== 'all' && (
              <span className="bg-blue-100 text-blue-900 px-2 py-0.5 rounded text-[10px] font-bold">
                Status: {selectedStatus}
              </span>
            )}
          </div>
        </div>

        {/* Bookings Table / List */}
        <div className="bg-white border-2 border-slate-950 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          {filteredBookings.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 uppercase">No bookings match your criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                Try adjusting your search terms, status filters, or submit a test form in the public planner.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950 text-white font-mono uppercase text-[10px] tracking-wider border-b-2 border-slate-950">
                    <th className="py-3.5 px-4 font-black">Ref / Date Created</th>
                    <th className="py-3.5 px-4 font-black">Child & Birthday</th>
                    <th className="py-3.5 px-4 font-black">Parent & Contact</th>
                    <th className="py-3.5 px-4 font-black">Party Date & Slot</th>
                    <th className="py-3.5 px-4 font-black">Package & Guests</th>
                    <th className="py-3.5 px-4 font-black">Total</th>
                    <th className="py-3.5 px-4 font-black">Status</th>
                    <th className="py-3.5 px-4 font-black text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                  {filteredBookings.map((b) => {
                    const hasAllergies = b.allergiesNote && b.allergiesNote.toLowerCase() !== 'none' && b.allergiesNote.trim() !== '';
                    return (
                      <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Ref & Source */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-black text-slate-950 text-xs">{b.id}</span>
                            {b.source === 'web_form' ? (
                              <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                                Web Form
                              </span>
                            ) : (
                              <span className="bg-slate-100 text-slate-700 text-[9px] font-bold px-1.5 py-0.5 rounded border border-slate-300">
                                Staff Manual
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 block font-mono mt-0.5">
                            {b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-GB') : 'Recent'}
                          </span>
                        </td>

                        {/* Child & Age */}
                        <td className="py-3.5 px-4">
                          <span className="font-extrabold text-slate-950 block text-xs">
                            {b.childName || 'Birthday Kid'}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Turning {b.childAge} years old
                          </span>
                          {hasAllergies && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded mt-1">
                              <AlertTriangle className="w-2.5 h-2.5 text-amber-600" />
                              Allergy Note
                            </span>
                          )}
                        </td>

                        {/* Parent & Contact */}
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 block">{b.parentName || 'Parent'}</span>
                          <div className="flex flex-col gap-0.5 text-[11px] text-slate-500 font-mono mt-0.5">
                            {b.parentPhone && (
                              <a href={`tel:${b.parentPhone}`} className="hover:text-emerald-700 inline-flex items-center gap-1">
                                <Phone className="w-2.5 h-2.5" />
                                {b.parentPhone}
                              </a>
                            )}
                            {b.parentEmail && (
                              <a href={`mailto:${b.parentEmail}`} className="hover:text-emerald-700 inline-flex items-center gap-1 truncate max-w-[140px]">
                                <Mail className="w-2.5 h-2.5" />
                                {b.parentEmail}
                              </a>
                            )}
                          </div>
                        </td>

                        {/* Party Date & Slot */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1 font-bold text-slate-900">
                            <Calendar className="w-3 h-3 text-emerald-700 shrink-0" />
                            <span>{b.partyDate || 'TBD'}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-slate-600 font-mono mt-0.5">
                            <Clock className="w-2.5 h-2.5 text-slate-400" />
                            <span>{b.partyTime || 'Flexible'}</span>
                          </div>
                        </td>

                        {/* Package & Headcount */}
                        <td className="py-3.5 px-4">
                          <span className="font-extrabold text-slate-950 block text-xs">
                            {b.packageName}
                          </span>
                          <span className="text-[11px] text-slate-600 font-medium">
                            {b.kidsCount} Kids (£{b.pricePerKid?.toFixed(2)}/ea)
                          </span>
                          {b.selectedExtras && b.selectedExtras.length > 0 && (
                            <span className="text-[10px] text-emerald-700 block font-semibold mt-0.5">
                              +{b.selectedExtras.length} Add-on(s)
                            </span>
                          )}
                        </td>

                        {/* Total Cost */}
                        <td className="py-3.5 px-4">
                          <span className="font-black text-slate-950 font-display text-sm">
                            £{b.total ? b.total.toFixed(2) : '0.00'}
                          </span>
                          {b.discountAmount > 0 && (
                            <span className="text-[9px] text-emerald-600 block font-bold">
                              Saved £{b.discountAmount.toFixed(0)}
                            </span>
                          )}
                        </td>

                        {/* Status selector */}
                        <td className="py-3.5 px-4">
                          <select
                            value={b.status}
                            onChange={(e) => handleStatusChange(b.id, e.target.value as BookingStatus)}
                            className={`px-2 py-1 rounded-md text-[11px] font-black uppercase tracking-wider border cursor-pointer focus:outline-none ${getStatusBadgeClass(b.status)}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Deposit Paid">Deposit Paid</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        {/* Action buttons */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedBooking(b);
                                setIsDetailModalOpen(true);
                              }}
                              className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                              title="View full party manifest"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => handleDelete(b.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                              title="Delete booking inquiry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>

      {/* DETAIL MODAL / PARTY RUN SHEET */}
      {isDetailModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-4 border-slate-950 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-fade-in overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 bg-slate-950 text-white flex items-center justify-between border-b-2 border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-yellow-400">{selectedBooking.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${getStatusBadgeClass(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </span>
                </div>
                <h3 className="text-lg font-black font-display uppercase tracking-tight text-white mt-1">
                  Party Run Sheet: {selectedBooking.childName}'s Birthday
                </h3>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-800">
              
              {/* Top Summary Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border-2 border-slate-200">
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 font-mono block">Date</span>
                  <span className="font-extrabold text-slate-950">{selectedBooking.partyDate}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 font-mono block">Slot Time</span>
                  <span className="font-extrabold text-slate-950">{selectedBooking.partyTime}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 font-mono block">Headcount</span>
                  <span className="font-extrabold text-slate-950">{selectedBooking.kidsCount} Children</span>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 font-mono block">Birthday Child</span>
                  <span className="font-extrabold text-slate-950">{selectedBooking.childName} (Age {selectedBooking.childAge})</span>
                </div>
              </div>

              {/* Package & Attraction Overview */}
              <div className="space-y-2 border-b border-slate-200 pb-4">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">Attraction Package</span>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-slate-950">{selectedBooking.packageName}</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">£{selectedBooking.pricePerKid?.toFixed(2)} per child</p>
                  </div>
                  <span className="text-base font-black text-slate-950 font-display">
                    £{selectedBooking.baseTotal?.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Dietary & Allergies */}
              <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 space-y-1.5">
                <div className="flex items-center gap-1.5 text-amber-900 font-black uppercase tracking-wider text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Dietary Requirements & Allergy Log</span>
                </div>
                <p className="text-xs text-amber-950 font-semibold leading-relaxed">
                  {selectedBooking.allergiesNote || 'None specified by parent.'}
                </p>
              </div>

              {/* Catering & Kitchen Orders */}
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center justify-between text-emerald-950 font-black uppercase tracking-wider text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Catering & Kitchen Orders</span>
                  </div>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-mono font-bold">
                    {selectedBooking.kidsCount} Guests
                  </span>
                </div>
                <div className="space-y-2 pt-1 text-xs">
                  <div>
                    <span className="font-bold text-emerald-900 block text-[10px] uppercase font-mono tracking-wider">
                      Hot Main Meals Breakdown:
                    </span>
                    <p className="font-semibold text-slate-900 mt-0.5 bg-white p-2.5 rounded-lg border border-emerald-200 leading-relaxed">
                      {formatCateringMainsSummary(selectedBooking.selectedMains, selectedBooking.kidsCount)}
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-emerald-900 block text-[10px] uppercase font-mono tracking-wider">
                      Party Squash & Beverages:
                    </span>
                    <p className="font-semibold text-slate-900 mt-0.5 bg-white p-2 rounded-lg border border-emerald-200">
                      {formatCateringDrinksSummary(selectedBooking.selectedDrinks, selectedBooking.kidsCount)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Add-ons & Extras */}
              {selectedBooking.extrasNames && selectedBooking.extrasNames.length > 0 && (
                <div className="space-y-2 border-b border-slate-200 pb-4">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">Custom Extras</span>
                  <ul className="space-y-1.5">
                    {selectedBooking.extrasNames.map((ext, idx) => (
                      <li key={idx} className="flex justify-between items-center text-slate-700">
                        <span className="font-semibold">✨ {ext}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between font-bold text-slate-900 pt-1 text-xs">
                    <span>Extras Total:</span>
                    <span>£{selectedBooking.extrasTotal?.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Contact Card */}
              <div className="space-y-2 border-b border-slate-200 pb-4">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">Parent / Guardian Contact</span>
                <div className="flex flex-col sm:flex-row justify-between gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div>
                    <span className="font-black text-slate-950 block text-xs">{selectedBooking.parentName}</span>
                    <span className="text-[11px] text-slate-500 font-mono">{selectedBooking.parentEmail || 'No email provided'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedBooking.parentPhone && (
                      <a
                        href={`tel:${selectedBooking.parentPhone}`}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        Call
                      </a>
                    )}
                    {selectedBooking.parentEmail && (
                      <a
                        href={`mailto:${selectedBooking.parentEmail}?subject=Regarding your Playgolf Birthday Booking #${selectedBooking.id}`}
                        className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-white rounded-lg font-bold text-xs flex items-center gap-1"
                      >
                        <Mail className="w-3 h-3" />
                        Email
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Total Balance */}
              <div className="bg-slate-950 text-white p-4 rounded-2xl flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-yellow-400 font-black uppercase tracking-wider font-mono">Final Booking Total</span>
                  <p className="text-[11px] text-slate-400">Includes all attractions, meals, and extras</p>
                </div>
                <span className="text-2xl font-black font-display text-yellow-400">
                  £{selectedBooking.total?.toFixed(2)}
                </span>
              </div>

              {/* Staff Notes Box */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    Internal Staff Notes
                  </span>
                  {noteEditId !== selectedBooking.id && (
                    <button
                      onClick={() => {
                        setNoteEditId(selectedBooking.id);
                        setNoteEditText(selectedBooking.staffNotes || '');
                      }}
                      className="text-emerald-700 hover:text-emerald-800 text-[11px] font-bold inline-flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      Edit Notes
                    </button>
                  )}
                </div>

                {noteEditId === selectedBooking.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={noteEditText}
                      onChange={(e) => setNoteEditText(e.target.value)}
                      rows={3}
                      placeholder="Add internal notes about bay allocation, cake storage, or coordinator follow-ups..."
                      className="w-full p-2.5 bg-slate-50 border-2 border-slate-300 rounded-xl text-xs focus:outline-none focus:border-slate-950"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setNoteEditId(null)}
                        className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveNotes(selectedBooking.id)}
                        className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                      >
                        Save Note
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-700 italic">
                    {selectedBooking.staffNotes || 'No internal notes added yet.'}
                  </p>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">Status:</span>
                <select
                  value={selectedBooking.status}
                  onChange={(e) => handleStatusChange(selectedBooking.id, e.target.value as BookingStatus)}
                  className={`px-2 py-1 rounded text-xs font-black uppercase tracking-wider border cursor-pointer ${getStatusBadgeClass(selectedBooking.status)}`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Deposit Paid">Deposit Paid</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    exportBookingsToCSV([selectedBooking], {
                      format: 'executive',
                      filterDescription: `Single Booking Manifest: #${selectedBooking.id} (${selectedBooking.childName})`,
                      customFilename: `Playgolf_Booking_${selectedBooking.id}_Party_Manifest.csv`
                    });
                    showNotify(`Exported CSV manifest for booking #${selectedBooking.id}`);
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  title="Download single booking CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>Print Sheet</span>
                </button>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-1.5 bg-slate-950 hover:bg-slate-800 text-white rounded-lg font-black text-xs uppercase tracking-wider cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* NEW MANUAL BOOKING MODAL */}
      {isNewBookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <form 
            onSubmit={handleCreateManualBooking}
            className="bg-white rounded-3xl border-4 border-slate-950 max-w-xl w-full max-h-[90vh] flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-fade-in overflow-hidden"
          >
            <div className="p-5 bg-slate-950 text-white flex items-center justify-between border-b-2 border-slate-800">
              <div>
                <h3 className="text-lg font-black font-display uppercase tracking-tight text-white">
                  Add Phone / Offline Booking
                </h3>
                <p className="text-xs text-slate-400">Record an inquiry taken via telephone or counter walk-in</p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewBookingModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-extrabold text-slate-900 uppercase text-[10px]">Parent / Guardian Name *</label>
                  <input
                    type="text"
                    required
                    value={newForm.parentName}
                    onChange={(e) => setNewForm({ ...newForm, parentName: e.target.value })}
                    placeholder="e.g. John Smith"
                    className="w-full p-2.5 bg-slate-50 border-2 border-slate-300 rounded-xl focus:border-slate-950 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-extrabold text-slate-900 uppercase text-[10px]">Phone Number</label>
                  <input
                    type="tel"
                    value={newForm.parentPhone}
                    onChange={(e) => setNewForm({ ...newForm, parentPhone: e.target.value })}
                    placeholder="e.g. 07700 900123"
                    className="w-full p-2.5 bg-slate-50 border-2 border-slate-300 rounded-xl focus:border-slate-950 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-extrabold text-slate-900 uppercase text-[10px]">Email Address</label>
                  <input
                    type="email"
                    value={newForm.parentEmail}
                    onChange={(e) => setNewForm({ ...newForm, parentEmail: e.target.value })}
                    placeholder="parent@example.com"
                    className="w-full p-2.5 bg-slate-50 border-2 border-slate-300 rounded-xl focus:border-slate-950 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-extrabold text-slate-900 uppercase text-[10px]">Birthday Child Name & Age</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newForm.childName}
                      onChange={(e) => setNewForm({ ...newForm, childName: e.target.value })}
                      placeholder="Child Name"
                      className="w-2/3 p-2.5 bg-slate-50 border-2 border-slate-300 rounded-xl focus:border-slate-950 focus:outline-none"
                    />
                    <input
                      type="number"
                      min={5}
                      max={15}
                      value={newForm.childAge}
                      onChange={(e) => setNewForm({ ...newForm, childAge: Number(e.target.value) })}
                      className="w-1/3 p-2.5 bg-slate-50 border-2 border-slate-300 rounded-xl focus:border-slate-950 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-extrabold text-slate-900 uppercase text-[10px]">Party Package</label>
                  <select
                    value={newForm.selectedPackageId}
                    onChange={(e) => setNewForm({ ...newForm, selectedPackageId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border-2 border-slate-300 rounded-xl focus:border-slate-950 focus:outline-none font-bold"
                  >
                    {PARTY_PACKAGES.map(pkg => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} (£{pkg.pricePerKid.toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-extrabold text-slate-900 uppercase text-[10px]">Guest Count (Kids)</label>
                  <input
                    type="number"
                    min={6}
                    max={50}
                    value={newForm.kidsCount}
                    onChange={(e) => setNewForm({ ...newForm, kidsCount: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border-2 border-slate-300 rounded-xl focus:border-slate-950 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-extrabold text-slate-900 uppercase text-[10px]">Party Date *</label>
                  <input
                    type="text"
                    required
                    value={newForm.partyDate}
                    onChange={(e) => setNewForm({ ...newForm, partyDate: e.target.value })}
                    placeholder="e.g. Saturday, 28 Nov"
                    className="w-full p-2.5 bg-slate-50 border-2 border-slate-300 rounded-xl focus:border-slate-950 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-slate-900 uppercase text-[10px]">Time Slot</label>
                <input
                  type="text"
                  value={newForm.partyTime}
                  onChange={(e) => setNewForm({ ...newForm, partyTime: e.target.value })}
                  placeholder="e.g. 13:30 - 15:30"
                  className="w-full p-2.5 bg-slate-50 border-2 border-slate-300 rounded-xl focus:border-slate-950 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-slate-900 uppercase text-[10px]">Allergies / Special Requests</label>
                <textarea
                  value={newForm.allergiesNote}
                  onChange={(e) => setNewForm({ ...newForm, allergiesNote: e.target.value })}
                  placeholder="e.g. Gluten free option for 2 kids"
                  rows={2}
                  className="w-full p-2.5 bg-slate-50 border-2 border-slate-300 rounded-xl focus:border-slate-950 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-slate-900 uppercase text-[10px]">Staff Note</label>
                <textarea
                  value={newForm.staffNotes}
                  onChange={(e) => setNewForm({ ...newForm, staffNotes: e.target.value })}
                  placeholder="e.g. Deposit paid £50 via PDQ terminal"
                  rows={2}
                  className="w-full p-2.5 bg-slate-50 border-2 border-slate-300 rounded-xl focus:border-slate-950 focus:outline-none"
                />
              </div>

            </div>

            <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsNewBookingModalOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-yellow-400 hover:bg-yellow-300 text-slate-950 rounded-xl font-black text-xs uppercase tracking-wider border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                Save Manual Booking
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
