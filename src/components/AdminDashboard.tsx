import { useState, useEffect, useMemo, FormEvent } from 'react';
import { 
  getAllBookings, 
  fetchBookingsFromSupabase,
  updateBookingStatus, 
  updateBookingNotes, 
  updateBookingDetails,
  calculatePricingForBooking,
  deleteBooking, 
  resetToSampleBookings, 
  exportBookingsToCSV,
  exportKitchenRunSheetCSV,
  formatCateringMainsSummary,
  formatCateringDrinksSummary,
  saveBooking 
} from '../services/bookingStorage';
import { 
  getAllBlockedDates, 
  addBlockedDate, 
  removeBlockedDate, 
  fetchBlockedDatesFromSupabase, 
  UPDATE_BLOCKED_DATES_EVENT,
  isDateBlocked 
} from '../services/blockedDatesStorage';
import { BookingRecord, BookingStatus, BlockedDateRecord } from '../types';
import { PARTY_PACKAGES, FOOD_EXTRAS, formatIsoToPartyDate, getMockAvailability } from '../data';
import { 
  ArrowLeft, Search, Filter, Download, Trash2, Edit3, 
  Phone, Mail, Calendar, Clock, Users, AlertTriangle, 
  CheckCircle2, Clock3, Plus, RefreshCw, 
  Printer, X, ChevronDown, FileSpreadsheet, Utensils,
  CalendarX, Ban, CalendarCheck, Lock, ChefHat, LayoutGrid, 
  ListFilter, Eye, Check, AlertCircle, Sparkles, ChevronRight,
  ShieldCheck, ArrowUpRight, Pencil, Minus, SlidersHorizontal, 
  Calculator, DollarSign
} from 'lucide-react';

interface AdminDashboardProps {
  onBackToSite: () => void;
  onLogout?: () => void;
}

export default function AdminDashboard({ onBackToSite, onLogout }: AdminDashboardProps) {
  // Navigation Workspaces
  const [activeTab, setActiveTab] = useState<'bookings' | 'availability' | 'kitchen'>('bookings');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Bookings state
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPackage, setSelectedPackage] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailTab, setDetailTab] = useState<'overview' | 'catering' | 'contact' | 'notes'>('overview');
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);

  // Edit Booking Modal state & form
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<BookingRecord | null>(null);
  const [editForm, setEditForm] = useState({
    selectedPackageId: 'combo-party',
    kidsCount: 10,
    partyDate: '',
    partyTime: '13:00 - 15:00',
    childName: '',
    childAge: 8,
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    allergiesNote: '',
    staffNotes: '',
    status: 'Confirmed' as BookingStatus,
    selectedExtras: [] as string[],
    isCustomPriceOverride: false,
    customTotal: 0
  });

  // Reactive price recalculation for the editing form
  const editPricing = useMemo(() => {
    const pkg = PARTY_PACKAGES.find(p => p.id === editForm.selectedPackageId) || PARTY_PACKAGES[0];
    const pricePerKid = pkg.pricePerKid;
    const count = Math.max(1, Number(editForm.kidsCount) || 1);
    const baseTotal = pricePerKid * count;

    let extrasTotal = 0;
    const extrasNames: string[] = [];
    editForm.selectedExtras.forEach(extId => {
      if (extId === 'extra-cupcake') {
        extrasTotal += 1.50 * count;
        extrasNames.push('Extra Themed Birthday Cupcake (£1.50/kid)');
      } else if (extId === 'extra-partybags') {
        extrasTotal += 2.50 * count;
        extrasNames.push('Putt Crazy Souvenir Party Bag (£2.50/kid)');
      } else if (extId === 'extra-sweets') {
        extrasTotal += 2.00 * count;
        extrasNames.push('Gourmet Sweet Cones (£2.00/kid)');
      }
    });

    const discountAmount = pkg.id === 'combo-party' ? 11.50 * count : 0;
    const standardTotal = baseTotal + extrasTotal;
    const finalTotal = editForm.isCustomPriceOverride
      ? Number(editForm.customTotal) || 0
      : standardTotal;

    return {
      pkg,
      pricePerKid,
      kidsCount: count,
      baseTotal,
      extrasTotal,
      extrasNames,
      discountAmount,
      standardTotal,
      finalTotal
    };
  }, [editForm.selectedPackageId, editForm.kidsCount, editForm.selectedExtras, editForm.isCustomPriceOverride, editForm.customTotal]);
  
  // Note editing state
  const [noteEditId, setNoteEditId] = useState<string | null>(null);
  const [noteEditText, setNoteEditText] = useState('');
  
  // Notifications & Cloud Sync state
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [supabaseConnected, setSupabaseConnected] = useState<boolean>(true);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState<boolean>(false);

  // Blocked dates state
  const [blockedDates, setBlockedDates] = useState<BlockedDateRecord[]>([]);
  const calendarAvailability = useMemo(() => getMockAvailability(), []);

  // Compute today's date in YYYY-MM-DD
  const todayISO = useMemo(() => {
    const t = new Date();
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
  }, []);

  // Next Saturday shortcut
  const defaultNextSaturdayISO = useMemo(() => {
    const d = new Date();
    const day = d.getDay();
    const diff = (6 - day + 7) % 7 || 7;
    d.setDate(d.getDate() + diff);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }, []);

  // Block form inputs
  const [blockDateInput, setBlockDateInput] = useState<string>(defaultNextSaturdayISO);
  const [blockReasonPreset, setBlockReasonPreset] = useState<string>('Private Event / Corporate Buyout');
  const [blockReasonCustom, setBlockReasonCustom] = useState<string>('');
  const [blockNotes, setBlockNotes] = useState<string>('');
  const [blockStaffName, setBlockStaffName] = useState<string>('Duty Manager');
  const [blockedSearchQuery, setBlockedSearchQuery] = useState<string>('');
  const [calendarMonthFilter, setCalendarMonthFilter] = useState<string>('all');

  // New manual booking form state
  const [newForm, setNewForm] = useState({
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    childName: '',
    childAge: 8,
    selectedPackageId: 'combo-party',
    kidsCount: 12,
    partyDate: '',
    partyTime: '13:00 - 15:00',
    allergiesNote: '',
    staffNotes: '',
    selectedExtras: [] as string[]
  });

  // Data Loading
  const loadData = async (showSyncIndicator = false) => {
    const cached = getAllBookings();
    setBookings(cached);

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

  const loadBlockedDatesData = async () => {
    const cached = getAllBlockedDates();
    setBlockedDates(cached);
    try {
      const live = await fetchBlockedDatesFromSupabase();
      setBlockedDates(live);
    } catch (e) {
      console.warn('Blocked dates fetch issue:', e);
    }
  };

  useEffect(() => {
    loadData(true);
    loadBlockedDatesData();

    const handleUpdate = () => loadData(false);
    const handleBlockedUpdate = () => loadBlockedDatesData();

    window.addEventListener('playgolf_bookings_updated', handleUpdate);
    window.addEventListener(UPDATE_BLOCKED_DATES_EVENT, handleBlockedUpdate);

    return () => {
      window.removeEventListener('playgolf_bookings_updated', handleUpdate);
      window.removeEventListener(UPDATE_BLOCKED_DATES_EVENT, handleBlockedUpdate);
    };
  }, []);

  const showNotify = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Filtered bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      if (selectedStatus !== 'all' && b.status !== selectedStatus) return false;
      if (selectedPackage !== 'all' && b.selectedPackageId !== selectedPackage) return false;
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

  // High-signal KPIs
  const stats = useMemo(() => {
    const totalCount = bookings.length;
    const pendingCount = bookings.filter(b => b.status === 'Pending').length;
    const confirmedCount = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Deposit Paid').length;
    const completedCount = bookings.filter(b => b.status === 'Completed').length;
    const totalPipelineValue = bookings
      .filter(b => b.status !== 'Cancelled')
      .reduce((sum, b) => sum + (b.total || 0), 0);
    const totalKids = bookings
      .filter(b => b.status !== 'Cancelled')
      .reduce((sum, b) => sum + (b.kidsCount || 0), 0);
    const allergiesCount = bookings
      .filter(b => b.status !== 'Cancelled' && b.allergiesNote && b.allergiesNote.toLowerCase() !== 'none' && b.allergiesNote.trim() !== '')
      .length;

    return { totalCount, pendingCount, confirmedCount, completedCount, totalPipelineValue, totalKids, allergiesCount };
  }, [bookings]);

  // Filtered blocked dates
  const filteredBlockedDates = useMemo(() => {
    if (!blockedSearchQuery.trim()) return blockedDates;
    const q = blockedSearchQuery.toLowerCase();
    return blockedDates.filter(b => 
      b.date.toLowerCase().includes(q) ||
      b.reason.toLowerCase().includes(q) ||
      (b.notes && b.notes.toLowerCase().includes(q)) ||
      (b.createdBy && b.createdBy.toLowerCase().includes(q)) ||
      (b.isoDate && b.isoDate.includes(q))
    );
  }, [blockedDates, blockedSearchQuery]);

  // Calendar months for 60-day filter
  const calendarMonths = useMemo(() => {
    const set = new Set<string>();
    calendarAvailability.forEach(d => {
      const parts = d.date.split(' ');
      const m = parts[parts.length - 1];
      if (m) set.add(m);
    });
    return Array.from(set);
  }, [calendarAvailability]);

  // Filtered 60-day days
  const filteredCalendarDays = useMemo(() => {
    if (calendarMonthFilter === 'all') return calendarAvailability;
    return calendarAvailability.filter(d => d.date.endsWith(` ${calendarMonthFilter}`));
  }, [calendarAvailability, calendarMonthFilter]);

  // Handlers for Blocked Dates
  const handleBlockDate = (e: FormEvent) => {
    e.preventDefault();
    if (!blockDateInput) {
      showNotify('Please select a valid date to block.', 'error');
      return;
    }

    const effectiveReason = blockReasonPreset === 'Custom Reason'
      ? (blockReasonCustom.trim() || 'Staff Blackout / Unavailable')
      : blockReasonPreset;

    const formattedDate = formatIsoToPartyDate(blockDateInput);
    addBlockedDate(formattedDate, effectiveReason, blockDateInput, blockStaffName, blockNotes);
    loadBlockedDatesData();
    showNotify(`Date blocked: ${formattedDate} (${effectiveReason})`);

    setBlockNotes('');
    setBlockReasonCustom('');
  };

  const handleUnblockDate = (id: string, dateDisplay: string) => {
    removeBlockedDate(id);
    loadBlockedDatesData();
    showNotify(`Restored availability for ${dateDisplay}`);
  };

  const handleQuickToggleDayFromCalendar = (day: { date: string; isoDate?: string }) => {
    const blocked = blockedDates.find(b => 
      (b.date && b.date.toLowerCase() === day.date.toLowerCase()) ||
      (day.isoDate && b.isoDate === day.isoDate)
    );

    if (blocked) {
      handleUnblockDate(blocked.id, day.date);
    } else {
      if (day.isoDate) setBlockDateInput(day.isoDate);
      const reason = blockReasonPreset === 'Custom Reason' ? (blockReasonCustom.trim() || 'Staff Blackout') : blockReasonPreset;
      addBlockedDate(day.date, reason, day.isoDate, blockStaffName, 'Instant toggle from staff calendar view');
      loadBlockedDatesData();
      showNotify(`Blocked ${day.date} on public planner`);
    }
  };

  // Status & Note Handlers
  const handleStatusChange = (id: string, newStatus: BookingStatus) => {
    updateBookingStatus(id, newStatus);
    loadData();
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking(prev => prev ? { ...prev, status: newStatus } : null);
    }
    showNotify(`Booking #${id} updated to ${newStatus}`);
  };

  const handleSaveNotes = (id: string) => {
    updateBookingNotes(id, noteEditText);
    loadData();
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking(prev => prev ? { ...prev, staffNotes: noteEditText } : null);
    }
    setNoteEditId(null);
    showNotify('Staff notes saved successfully');
  };

  const handleDelete = (id: string) => {
    if (window.confirm(`Permanently remove booking #${id}? This action cannot be undone.`)) {
      deleteBooking(id);
      loadData();
      if (selectedBooking?.id === id) {
        setIsDetailModalOpen(false);
      }
      showNotify(`Booking #${id} deleted`, 'info');
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset database to clean sample parties? Any locally created entries will be re-seeded.')) {
      resetToSampleBookings();
      loadData();
      showNotify('Sample data refreshed');
    }
  };

  const handleExportCSV = (format: 'executive' | 'kitchen' | 'table-only' = 'executive') => {
    exportBookingsToCSV(filteredBookings, {
      format,
      filterDescription: `Playgolf Northwick Park Parties - ${selectedStatus.toUpperCase()} (${filteredBookings.length} records)`
    });
    setIsExportMenuOpen(false);
    showNotify(`CSV export ready (${filteredBookings.length} records)`);
  };

  // Open edit modal for any booking
  const handleOpenEditModal = (booking: BookingRecord) => {
    setEditingBooking(booking);

    const pkg = PARTY_PACKAGES.find(p => p.id === booking.selectedPackageId) || PARTY_PACKAGES[0];
    const count = booking.kidsCount || 10;
    const stdBase = pkg.pricePerKid * count;
    let stdExtras = 0;
    (booking.selectedExtras || []).forEach(extId => {
      if (extId === 'extra-cupcake') stdExtras += 1.50 * count;
      if (extId === 'extra-partybags') stdExtras += 2.50 * count;
      if (extId === 'extra-sweets') stdExtras += 2.00 * count;
    });
    const expectedTotal = stdBase + stdExtras;
    const isCustomPrice = Math.abs((booking.total || 0) - expectedTotal) > 0.05 && (booking.total || 0) > 0;

    setEditForm({
      selectedPackageId: booking.selectedPackageId || 'combo-party',
      kidsCount: count,
      partyDate: booking.partyDate || '',
      partyTime: booking.partyTime || '13:00 - 15:00',
      childName: booking.childName || '',
      childAge: booking.childAge || 8,
      parentName: booking.parentName || '',
      parentPhone: booking.parentPhone || '',
      parentEmail: booking.parentEmail || '',
      allergiesNote: booking.allergiesNote || '',
      staffNotes: booking.staffNotes || '',
      status: booking.status || 'Confirmed',
      selectedExtras: booking.selectedExtras || [],
      isCustomPriceOverride: isCustomPrice,
      customTotal: booking.total || expectedTotal
    });
    setIsEditModalOpen(true);
  };

  // Save changes to booking and recalculate pricing
  const handleSaveEditBooking = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;

    const updated = await updateBookingDetails(editingBooking.id, {
      selectedPackageId: editPricing.pkg.id,
      packageName: editPricing.pkg.name,
      pricePerKid: editPricing.pricePerKid,
      kidsCount: editPricing.kidsCount,
      partyDate: editForm.partyDate,
      partyTime: editForm.partyTime,
      childName: editForm.childName,
      childAge: Number(editForm.childAge) || 8,
      parentName: editForm.parentName,
      parentPhone: editForm.parentPhone,
      parentEmail: editForm.parentEmail,
      allergiesNote: editForm.allergiesNote,
      staffNotes: editForm.staffNotes,
      status: editForm.status,
      selectedExtras: editForm.selectedExtras,
      extrasNames: editPricing.extrasNames,
      baseTotal: editPricing.baseTotal,
      extrasTotal: editPricing.extrasTotal,
      discountAmount: editPricing.discountAmount,
      total: editPricing.finalTotal
    });

    if (updated) {
      setBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
      if (selectedBooking && selectedBooking.id === updated.id) {
        setSelectedBooking(updated);
      }
      setIsEditModalOpen(false);
      showNotify(`Booking #${updated.id} updated: ${updated.kidsCount} kids on ${updated.packageName} (£${updated.total.toFixed(2)})`);
    }
  };

  // Manual booking submission
  const handleCreateManualBooking = (e: FormEvent) => {
    e.preventDefault();
    if (!newForm.parentName || !newForm.partyDate) {
      showNotify('Parent name and party date are required.', 'error');
      return;
    }

    const pkg = PARTY_PACKAGES.find(p => p.id === newForm.selectedPackageId) || PARTY_PACKAGES[0];
    const baseTotal = pkg.pricePerKid * newForm.kidsCount;
    let extrasTotal = 0;
    const extrasNames: string[] = [];

    newForm.selectedExtras.forEach(extId => {
      const ext = FOOD_EXTRAS.find(food => food.id === extId);
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
      childName: newForm.childName || 'Birthday Guest',
      childAge: Number(newForm.childAge) || 8,
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
    showNotify(`Manual booking #${saved.id} created`);

    setNewForm({
      parentName: '',
      parentPhone: '',
      parentEmail: '',
      childName: '',
      childAge: 8,
      selectedPackageId: 'combo-party',
      kidsCount: 12,
      partyDate: '',
      partyTime: '13:00 - 15:00',
      allergiesNote: '',
      staffNotes: '',
      selectedExtras: []
    });
  };

  const getStatusBadgeStyles = (status: BookingStatus) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Deposit Paid':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Completed':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 pb-24 antialiased selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Toast Alert */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-lg border border-slate-700/80 transition-all">
          {notification.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="bg-emerald-950 text-white border-b border-emerald-900/60 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Brand & Context */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-3">
              <button
                onClick={onBackToSite}
                id="btn-admin-back-to-site"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 text-xs font-medium border border-emerald-700/50 transition-colors cursor-pointer"
                title="Return to public customer portal"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-emerald-300" />
                <span>Public Site</span>
              </button>

              <div className="h-4 w-px bg-emerald-800/80" />

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-bold font-display tracking-tight text-white">
                    Playgolf Northwick Park
                  </span>
                  <span className="text-[11px] font-medium text-emerald-300 font-mono">
                    Staff Portal
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Logout / Cloud */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => loadData(true)}
                className="p-1.5 text-emerald-200 hover:text-white rounded-lg bg-emerald-900/60"
                title="Refresh from Supabase"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end flex-wrap">
            
            {/* Supabase status indicator */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-900/50 border border-emerald-800 text-[11px] text-emerald-200 font-mono">
              <span className={`w-2 h-2 rounded-full ${supabaseConnected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span>Supabase Cloud</span>
            </div>

            {/* Sync Button */}
            <button
              onClick={() => {
                loadData(true);
                showNotify('Synced latest bookings with Supabase');
              }}
              id="btn-admin-sync"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 text-xs font-medium rounded-lg border border-emerald-700/50 transition-colors cursor-pointer"
              title="Pull latest live submissions"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-300 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden lg:inline">{isSyncing ? 'Syncing...' : 'Sync'}</span>
            </button>

            {/* Export CSV Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                id="btn-admin-export-csv"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 text-xs font-medium rounded-lg border border-emerald-700/50 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-300" />
                <span>Export CSV</span>
                <ChevronDown className="w-3 h-3 text-emerald-400" />
              </button>

              {isExportMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsExportMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-64 bg-white text-slate-900 rounded-xl border border-slate-200 shadow-xl z-50 py-1.5 divide-y divide-slate-100">
                    <button
                      onClick={() => handleExportCSV('executive')}
                      className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer group"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-slate-900 group-hover:text-emerald-700">
                          Executive Master CSV
                        </div>
                        <div className="text-[10px] text-slate-500">Full 23-column financial & contact records</div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleExportCSV('kitchen')}
                      className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer group"
                    >
                      <Utensils className="w-4 h-4 text-amber-600 shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-slate-900 group-hover:text-amber-700">
                          Kitchen & Catering Run Sheet
                        </div>
                        <div className="text-[10px] text-slate-500">Dish counts, dietary flags & schedules</div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleExportCSV('table-only')}
                      className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer group"
                    >
                      <ChefHat className="w-4 h-4 text-blue-600 shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-700">
                          Raw Data Table CSV
                        </div>
                        <div className="text-[10px] text-slate-500">Clean row-1 headers for Excel Pivot</div>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* New Manual Booking Button */}
            <button
              onClick={() => setIsNewBookingModalOpen(true)}
              id="btn-new-manual-booking"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Booking</span>
            </button>

            {/* Logout / Lock */}
            {onLogout && (
              <button
                onClick={onLogout}
                id="btn-admin-logout"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-emerald-200 hover:text-white rounded-lg hover:bg-emerald-900 transition-colors"
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
        
        {/* Workspace Segmented Navigation */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-1.5 rounded-xl border border-slate-200/90 shadow-xs">
          
          {/* Tabs */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('bookings')}
              id="tab-btn-bookings"
              className={`flex-1 sm:flex-none px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'bookings'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/70'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Party Bookings</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono tabular-nums ${
                activeTab === 'bookings' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {bookings.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('availability')}
              id="tab-btn-blocked-days"
              className={`flex-1 sm:flex-none px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'availability'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/70'
              }`}
            >
              <CalendarX className="w-3.5 h-3.5" />
              <span>Availability & Blackouts</span>
              {blockedDates.length > 0 && (
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono tabular-nums ${
                  activeTab === 'availability' ? 'bg-rose-500 text-white' : 'bg-rose-50 text-rose-700'
                }`}>
                  {blockedDates.length} Blocked
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('kitchen')}
              id="tab-btn-kitchen"
              className={`flex-1 sm:flex-none px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'kitchen'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/70'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Kitchen & Catering</span>
              {stats.allergiesCount > 0 && (
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono tabular-nums ${
                  activeTab === 'kitchen' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-700'
                }`}>
                  {stats.allergiesCount} Dietary
                </span>
              )}
            </button>
          </div>

          {/* Quick Context Info */}
          <div className="flex items-center justify-between sm:justify-end gap-3 px-2 text-xs text-slate-500 font-medium">
            {activeTab === 'bookings' && (
              <div className="flex items-center gap-1.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                    viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Table view"
                >
                  <ListFilter className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                    viewMode === 'cards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Card manifest view"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <span className="hidden lg:inline text-slate-400 font-mono text-[11px]">
              {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>

        </div>

        {/* TAB 1: BOOKINGS MANAGEMENT */}
        {activeTab === 'bookings' && (
          <div className="space-y-5">
            
            {/* KPI Cards Row */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
              
              <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>Total Parties</span>
                  <Users className="w-4 h-4 text-slate-400" />
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-1 font-display tabular-nums">
                  {stats.totalCount}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Recorded bookings</div>
              </div>

              <div 
                onClick={() => setSelectedStatus(selectedStatus === 'Pending' ? 'all' : 'Pending')}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedStatus === 'Pending' 
                    ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-300' 
                    : 'bg-white border-slate-200/90 hover:border-amber-200 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-amber-700 font-semibold">
                  <span>Action Needed</span>
                  <Clock3 className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl font-bold text-amber-900 mt-1 font-display tabular-nums">
                  {stats.pendingCount}
                </div>
                <div className="text-[11px] text-amber-700 mt-0.5">Pending review / calls</div>
              </div>

              <div 
                onClick={() => setSelectedStatus(selectedStatus === 'Confirmed' ? 'all' : 'Confirmed')}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedStatus === 'Confirmed' 
                    ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-300' 
                    : 'bg-white border-slate-200/90 hover:border-emerald-200 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold">
                  <span>Confirmed & Paid</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-2xl font-bold text-emerald-900 mt-1 font-display tabular-nums">
                  {stats.confirmedCount}
                </div>
                <div className="text-[11px] text-emerald-700 mt-0.5">Deposits & slots locked</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>Total Guests</span>
                  <Users className="w-4 h-4 text-slate-400" />
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-1 font-display tabular-nums">
                  {stats.totalKids}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Children attending</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>Pipeline Revenue</span>
                  <span className="font-mono text-emerald-700 font-bold">£</span>
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-1 font-display tabular-nums">
                  £{stats.totalPipelineValue.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Gross party value</div>
              </div>

            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              
              {/* Search Field */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Parent, Child, Phone, Email, Reference ID, or Date..."
                  className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Status and Package filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-600"
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
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-600"
                >
                  <option value="all">All Packages</option>
                  <option value="combo-party">Combo Deal</option>
                  <option value="adventure-golf">Putt Crazy</option>
                  <option value="driving-range">Driving Range</option>
                </select>

                {(searchQuery || selectedStatus !== 'all' || selectedPackage !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedStatus('all');
                      setSelectedPackage('all');
                    }}
                    className="px-2.5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>

            </div>

            {/* Results count indicator */}
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <div className="flex items-center gap-2">
                <span>Showing <strong className="text-slate-900 font-semibold">{filteredBookings.length}</strong> {filteredBookings.length === 1 ? 'party booking' : 'party bookings'}</span>
                {selectedStatus !== 'all' && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-700 font-medium">Status: {selectedStatus}</span>
                  </>
                )}
              </div>
              <button 
                onClick={handleResetData}
                className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors"
              >
                Reset sample data
              </button>
            </div>

            {/* View Mode: Table View */}
            {viewMode === 'table' && (
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
                {filteredBookings.length === 0 ? (
                  <div className="py-16 text-center space-y-2">
                    <Search className="w-8 h-8 text-slate-300 mx-auto" />
                    <div className="text-sm font-semibold text-slate-800">No party bookings found</div>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Try adjusting your search terms or filters to find what you are looking for.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50/90 text-slate-600 font-semibold border-b border-slate-200 text-[11px]">
                          <th className="py-3 px-4">Ref</th>
                          <th className="py-3 px-4">Child & Birthday</th>
                          <th className="py-3 px-4">Parent Contact</th>
                          <th className="py-3 px-4">Party Date & Slot</th>
                          <th className="py-3 px-4">Package</th>
                          <th className="py-3 px-4 text-right">Headcount</th>
                          <th className="py-3 px-4 text-right">Total</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {filteredBookings.map((b) => {
                          const hasAllergies = b.allergiesNote && b.allergiesNote.toLowerCase() !== 'none' && b.allergiesNote.trim() !== '';
                          return (
                            <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                              {/* Ref */}
                              <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-xs">
                                {b.id}
                              </td>

                              {/* Child Name */}
                              <td className="py-3.5 px-4">
                                <span className="font-semibold text-slate-900 block text-xs">
                                  {b.childName || 'Birthday Child'}
                                </span>
                                <span className="text-[11px] text-slate-500">
                                  Age {b.childAge}
                                </span>
                                {hasAllergies && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 mt-0.5">
                                    <AlertTriangle className="w-2.5 h-2.5 text-amber-600" />
                                    Allergy
                                  </span>
                                )}
                              </td>

                              {/* Parent Contact */}
                              <td className="py-3.5 px-4">
                                <span className="font-semibold text-slate-900 block">{b.parentName}</span>
                                <div className="flex flex-col gap-0.5 text-[11px] text-slate-500 font-mono mt-0.5">
                                  {b.parentPhone && (
                                    <a href={`tel:${b.parentPhone}`} className="hover:text-emerald-700 inline-flex items-center gap-1">
                                      <Phone className="w-2.5 h-2.5" />
                                      {b.parentPhone}
                                    </a>
                                  )}
                                  {b.parentEmail && (
                                    <a href={`mailto:${b.parentEmail}`} className="hover:text-emerald-700 inline-flex items-center gap-1 truncate max-w-[150px]">
                                      <Mail className="w-2.5 h-2.5" />
                                      {b.parentEmail}
                                    </a>
                                  )}
                                </div>
                              </td>

                              {/* Party Date & Slot */}
                              <td className="py-3.5 px-4">
                                <div className="font-semibold text-slate-900 flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-emerald-800" />
                                  <span>{b.partyDate}</span>
                                </div>
                                <div className="text-[11px] text-slate-500 font-mono mt-0.5 flex items-center gap-1">
                                  <Clock className="w-2.5 h-2.5 text-slate-400" />
                                  <span>{b.partyTime}</span>
                                </div>
                              </td>

                              {/* Package */}
                              <td className="py-3.5 px-4">
                                <span className="font-semibold text-slate-900 block text-xs">
                                  {b.packageName}
                                </span>
                                {b.selectedExtras && b.selectedExtras.length > 0 && (
                                  <span className="text-[11px] text-emerald-700 font-medium">
                                    +{b.selectedExtras.length} extras
                                  </span>
                                )}
                              </td>

                              {/* Headcount */}
                              <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-800 font-semibold">
                                {b.kidsCount} kids
                              </td>

                              {/* Total */}
                              <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-900 font-bold text-xs">
                                £{b.total ? b.total.toFixed(2) : '0.00'}
                              </td>

                              {/* Status */}
                              <td className="py-3.5 px-4">
                                <select
                                  value={b.status}
                                  onChange={(e) => handleStatusChange(b.id, e.target.value as BookingStatus)}
                                  className={`px-2 py-1 rounded-md text-[11px] font-semibold border cursor-pointer focus:outline-none ${getStatusBadgeStyles(b.status)}`}
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
                                    onClick={() => handleOpenEditModal(b)}
                                    className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-md text-[11px] font-semibold border border-emerald-200 transition-colors cursor-pointer inline-flex items-center gap-1"
                                    title="Edit party deal, kids count & pricing"
                                  >
                                    <Pencil className="w-3 h-3 text-emerald-700" />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedBooking(b);
                                      setDetailTab('overview');
                                      setIsDetailModalOpen(true);
                                    }}
                                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-[11px] font-semibold transition-colors cursor-pointer"
                                  >
                                    View
                                  </button>
                                  <button
                                    onClick={() => handleDelete(b.id)}
                                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                                    title="Delete booking"
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
            )}

            {/* View Mode: Card Grid View */}
            {viewMode === 'cards' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBookings.map((b) => {
                  const hasAllergies = b.allergiesNote && b.allergiesNote.toLowerCase() !== 'none' && b.allergiesNote.trim() !== '';
                  return (
                    <div 
                      key={b.id} 
                      className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs hover:border-slate-300 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-slate-900">{b.id}</span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getStatusBadgeStyles(b.status)}`}>
                              {b.status}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 mt-1">
                            {b.childName} (Turning {b.childAge})
                          </h4>
                        </div>
                        <span className="font-mono font-bold text-sm text-slate-900">
                          £{b.total?.toFixed(2)}
                        </span>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1 text-xs">
                        <div className="flex items-center justify-between text-slate-700">
                          <span className="flex items-center gap-1.5 font-medium">
                            <Calendar className="w-3 h-3 text-emerald-700" />
                            {b.partyDate}
                          </span>
                          <span className="font-mono text-[11px] text-slate-500">{b.partyTime}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600 pt-0.5">
                          <span>{b.packageName}</span>
                          <span className="font-mono font-semibold">{b.kidsCount} Kids</span>
                        </div>
                      </div>

                      {hasAllergies && (
                        <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 flex items-start gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{b.allergiesNote}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                        <div className="text-[11px] text-slate-500">
                          Parent: <strong className="text-slate-800">{b.parentName}</strong>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {b.parentPhone && (
                            <a href={`tel:${b.parentPhone}`} className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md" title="Call">
                              <Phone className="w-3 h-3" />
                            </a>
                          )}
                          <button
                            onClick={() => handleOpenEditModal(b)}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-md text-[11px] font-semibold border border-emerald-200 inline-flex items-center gap-1 cursor-pointer"
                            title="Edit deal, kids count & pricing"
                          >
                            <Pencil className="w-3 h-3 text-emerald-700" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBooking(b);
                              setDetailTab('overview');
                              setIsDetailModalOpen(true);
                            }}
                            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-[11px] font-semibold cursor-pointer"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* TAB 2: AVAILABILITY & BLACKOUTS */}
        {activeTab === 'availability' && (
          <div className="space-y-6">
            
            {/* Context Banner */}
            <div className="bg-emerald-950 text-white p-5 rounded-2xl border border-emerald-900/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-300">
                    Live Booking Protection
                  </span>
                  <span className="text-xs text-emerald-400">· Real-time sync</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold font-display tracking-tight text-white flex items-center gap-2">
                  <CalendarX className="w-5 h-5 text-rose-400" />
                  Party Availability & Blackout Manager
                </h2>
                <p className="text-xs text-emerald-100/80 max-w-2xl leading-relaxed">
                  Block dates when kids parties cannot be held (e.g., club championships, private buyouts, course maintenance). Blocked dates are immediately disabled on the customer booking portal.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="bg-emerald-900/60 border border-emerald-800 p-3 rounded-xl text-center min-w-[100px]">
                  <span className="text-[10px] text-emerald-300 uppercase font-mono block">Blocked Days</span>
                  <span className="text-2xl font-bold text-rose-400 font-display tabular-nums">{blockedDates.length}</span>
                </div>
                <div className="bg-emerald-900/60 border border-emerald-800 p-3 rounded-xl text-center min-w-[100px]">
                  <span className="text-[10px] text-emerald-300 uppercase font-mono block">Weekend Blocks</span>
                  <span className="text-2xl font-bold text-amber-300 font-display tabular-nums">
                    {blockedDates.filter(b => b.date.toLowerCase().includes('saturday') || b.date.toLowerCase().includes('sunday')).length}
                  </span>
                </div>
              </div>
            </div>

            {/* Two-Column Form & Active List */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Block Form */}
              <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                    <Ban className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 font-display">
                      Block a Specific Date
                    </h3>
                    <p className="text-[11px] text-slate-500">Prevent party inquiries on the customer website</p>
                  </div>
                </div>

                <form onSubmit={handleBlockDate} className="space-y-4">
                  
                  {/* Quick Shortcuts */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-600 block">
                      Quick Shortcuts
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          const diff = (6 - d.getDay() + 7) % 7 || 7;
                          d.setDate(d.getDate() + diff);
                          setBlockDateInput(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium rounded-md transition-colors"
                      >
                        Next Saturday
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          const diff = (7 - d.getDay() + 7) % 7 || 7;
                          d.setDate(d.getDate() + diff);
                          setBlockDateInput(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium rounded-md transition-colors"
                      >
                        Next Sunday
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          d.setDate(d.getDate() + 14);
                          setBlockDateInput(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium rounded-md transition-colors"
                      >
                        In 2 Weeks
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          d.setDate(d.getDate() + 30);
                          setBlockDateInput(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium rounded-md transition-colors"
                      >
                        In 1 Month
                      </button>
                    </div>
                  </div>

                  {/* Date Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-800 block">
                      Date to Block *
                    </label>
                    <input
                      type="date"
                      required
                      min={todayISO}
                      value={blockDateInput}
                      onChange={(e) => setBlockDateInput(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                    {blockDateInput && (
                      <div className="text-[11px] font-medium text-emerald-800 bg-emerald-50/80 p-2 rounded-md border border-emerald-100 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>Public Name: <strong className="text-slate-900">{formatIsoToPartyDate(blockDateInput)}</strong></span>
                      </div>
                    )}
                  </div>

                  {/* Reason Presets */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-800 block">
                      Blackout Reason *
                    </label>
                    <select
                      value={blockReasonPreset}
                      onChange={(e) => setBlockReasonPreset(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    >
                      <option value="Private Event / Corporate Buyout">Private Event / Corporate Buyout</option>
                      <option value="Club Championship / Golf Tournament">Club Championship / Golf Tournament</option>
                      <option value="Driving Range & Greens Maintenance">Driving Range & Greens Maintenance</option>
                      <option value="Bank Holiday / Club Festive Closure">Bank Holiday / Club Festive Closure</option>
                      <option value="Fully Booked via Telephone">Fully Booked via Telephone</option>
                      <option value="Custom Reason">Custom Reason...</option>
                    </select>

                    {blockReasonPreset === 'Custom Reason' && (
                      <input
                        type="text"
                        required
                        value={blockReasonCustom}
                        onChange={(e) => setBlockReasonCustom(e.target.value)}
                        placeholder="Enter custom reason..."
                        className="w-full mt-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                      />
                    )}
                  </div>

                  {/* Internal Notes */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-800 block">
                      Staff Notes (Optional)
                    </label>
                    <textarea
                      value={blockNotes}
                      onChange={(e) => setBlockNotes(e.target.value)}
                      rows={2}
                      placeholder="e.g. Bays 1-14 allocated to local league."
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  {/* Staff Author */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-800 block">
                      Staff Member Name
                    </label>
                    <input
                      type="text"
                      value={blockStaffName}
                      onChange={(e) => setBlockStaffName(e.target.value)}
                      placeholder="Duty Manager"
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Block Selected Date</span>
                  </button>
                </form>
              </div>

              {/* Right Column: Active Blocked Dates List */}
              <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                      <span>Currently Blocked Dates</span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-rose-50 text-rose-700">
                        {filteredBlockedDates.length}
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500">Disabled on public booking planner</p>
                  </div>

                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={blockedSearchQuery}
                      onChange={(e) => setBlockedSearchQuery(e.target.value)}
                      placeholder="Filter blocked dates..."
                      className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                {filteredBlockedDates.length === 0 ? (
                  <div className="py-12 text-center space-y-2 bg-slate-50/80 rounded-xl border border-dashed border-slate-200">
                    <CalendarCheck className="w-8 h-8 text-emerald-600 mx-auto" />
                    <div className="text-xs font-semibold text-slate-800">No dates currently blocked</div>
                    <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                      All future days are open for customer party inquiries. Use the form on the left or the calendar below to block specific days.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                    {filteredBlockedDates.map((b) => (
                      <div
                        key={b.id}
                        className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 hover:bg-rose-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-xs text-slate-900 font-display">
                              {b.date}
                            </span>
                            {b.isoDate && (
                              <span className="text-[10px] font-mono text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                                {b.isoDate}
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-medium text-rose-800">
                            {b.reason}
                          </div>
                          {b.notes && (
                            <p className="text-[11px] text-slate-600">
                              Note: {b.notes}
                            </p>
                          )}
                          <div className="text-[10px] text-slate-400 font-mono">
                            Blocked by {b.createdBy || 'Staff'} {b.createdAt ? `· ${new Date(b.createdAt).toLocaleDateString('en-GB')}` : ''}
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleUnblockDate(b.id, b.date)}
                            className="px-2.5 py-1.5 bg-white hover:bg-rose-600 hover:text-white text-rose-700 text-xs font-medium rounded-lg border border-rose-200 hover:border-rose-600 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Unblock</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* 60-Day Visual Availability Matrix */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-800" />
                    <span>60-Day Calendar Quick Overview & Instant Toggle</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Click 'Block' on any upcoming date to immediately close party availability, or 'Unblock' to restore
                  </p>
                </div>

                {/* Month filter buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  <button
                    type="button"
                    onClick={() => setCalendarMonthFilter('all')}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors border ${
                      calendarMonthFilter === 'all'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    All ({calendarAvailability.length})
                  </button>
                  {calendarMonths.map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setCalendarMonthFilter(m)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors border ${
                        calendarMonthFilter === m
                          ? 'bg-emerald-800 text-white border-emerald-800'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Day Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 max-h-[460px] overflow-y-auto p-1">
                {filteredCalendarDays.map((day) => {
                  const blockedInfo = blockedDates.find(b => 
                    (b.date && b.date.toLowerCase() === day.date.toLowerCase()) ||
                    (day.isoDate && b.isoDate === day.isoDate)
                  );
                  const isBlocked = !!blockedInfo;
                  const isWeekend = day.date.toLowerCase().includes('saturday') || day.date.toLowerCase().includes('sunday');

                  return (
                    <div
                      key={day.date}
                      className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all ${
                        isBlocked
                          ? 'bg-rose-50 border-rose-300 text-rose-950'
                          : isWeekend
                            ? 'bg-amber-50/40 border-amber-200/80 hover:border-slate-400'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                          <span>{day.date.split(',')[0].slice(0, 3)}</span>
                          {isWeekend && (
                            <span className="text-[9px] text-amber-800 bg-amber-100 px-1 rounded font-medium">
                              Weekend
                            </span>
                          )}
                        </div>

                        <div className={`text-xs font-bold mt-1 ${isBlocked ? 'line-through text-rose-950' : 'text-slate-900'}`}>
                          {day.date.split(',')[1]}
                        </div>

                        {isBlocked ? (
                          <div className="mt-1 text-[10px] text-rose-700 bg-rose-100/80 px-1.5 py-0.5 rounded truncate" title={blockedInfo.reason}>
                            {blockedInfo.reason}
                          </div>
                        ) : (
                          <div className="mt-1 text-[10px] text-emerald-700 flex items-center gap-1 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>Available</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-100">
                        {isBlocked ? (
                          <button
                            type="button"
                            onClick={() => handleUnblockDate(blockedInfo.id, day.date)}
                            className="w-full py-1 text-[10px] font-semibold text-rose-700 bg-white hover:bg-rose-600 hover:text-white rounded border border-rose-200 transition-colors cursor-pointer"
                          >
                            Unblock
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleQuickToggleDayFromCalendar(day)}
                            className="w-full py-1 text-[10px] font-semibold text-slate-700 bg-slate-50 hover:bg-rose-600 hover:text-white rounded border border-slate-200 transition-colors cursor-pointer"
                          >
                            + Block
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: KITCHEN & CATERING RUN SHEET */}
        {activeTab === 'kitchen' && (
          <div className="space-y-6">
            
            {/* Header / Kitchen actions */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Kitchen Station View
                  </span>
                  <span className="text-xs text-slate-500">Live order prep & allergy manifest</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold font-display tracking-tight text-slate-900 flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-emerald-800" />
                  Kitchen & Catering Party Run Sheet
                </h2>
                <p className="text-xs text-slate-500">
                  Itemized meal orders, allergy safety alerts, and squash jug allocations for active party bookings.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => handleExportCSV('kitchen')}
                  className="px-3 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Kitchen CSV</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Shift Sheet</span>
                </button>
              </div>
            </div>

            {/* Kitchen Schedule List */}
            <div className="space-y-4">
              {bookings
                .filter(b => b.status !== 'Cancelled')
                .map((b) => {
                  const hasAllergies = b.allergiesNote && b.allergiesNote.toLowerCase() !== 'none' && b.allergiesNote.trim() !== '';
                  return (
                    <div 
                      key={b.id} 
                      className={`bg-white rounded-xl border p-5 shadow-xs space-y-4 ${
                        hasAllergies ? 'border-amber-300 ring-1 ring-amber-100' : 'border-slate-200/90'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-bold text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-900">
                            {b.id}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm">
                            {b.childName}'s Birthday Party (Age {b.childAge})
                          </h4>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getStatusBadgeStyles(b.status)}`}>
                            {b.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-600 font-mono">
                          <span className="flex items-center gap-1 font-semibold text-slate-900">
                            <Calendar className="w-3.5 h-3.5 text-emerald-800" />
                            {b.partyDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {b.partyTime}
                          </span>
                          <span className="font-bold text-slate-900">
                            {b.kidsCount} Kids
                          </span>
                        </div>
                      </div>

                      {/* Dietary Warnings Box */}
                      {hasAllergies && (
                        <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl space-y-1">
                          <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>Dietary Restrictions & Allergies</span>
                          </div>
                          <p className="text-xs text-amber-950 font-medium pl-5 leading-relaxed">
                            {b.allergiesNote}
                          </p>
                        </div>
                      )}

                      {/* Meals & Drinks Breakdown */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                          <span className="font-semibold text-slate-700 block text-[11px] uppercase tracking-wider font-mono">
                            Hot Meals Breakdown:
                          </span>
                          <p className="text-slate-900 font-medium leading-relaxed">
                            {formatCateringMainsSummary(b.selectedMains, b.kidsCount)}
                          </p>
                        </div>

                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                          <span className="font-semibold text-slate-700 block text-[11px] uppercase tracking-wider font-mono">
                            Drinks Jugs & Beverages:
                          </span>
                          <p className="text-slate-900 font-medium">
                            {formatCateringDrinksSummary(b.selectedDrinks, b.kidsCount)}
                          </p>
                        </div>
                      </div>

                      {/* Custom Extras & Notes */}
                      {(b.extrasNames?.length > 0 || b.staffNotes) && (
                        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row justify-between gap-2 text-xs text-slate-500">
                          {b.extrasNames && b.extrasNames.length > 0 && (
                            <div>
                              <span className="font-semibold text-slate-700">Extras: </span>
                              <span>{b.extrasNames.join(' · ')}</span>
                            </div>
                          )}
                          {b.staffNotes && (
                            <div className="italic text-slate-600">
                              Coordinator Note: {b.staffNotes}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>

          </div>
        )}

      </main>

      {/* DETAIL MODAL / PARTY RUN SHEET INSPECTOR */}
      {isDetailModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl animate-fade-in overflow-hidden">
            
            {/* Header */}
            <div className="p-5 bg-emerald-950 text-white flex items-center justify-between border-b border-emerald-900">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-300">#{selectedBooking.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusBadgeStyles(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </span>
                  <span className="text-[11px] text-emerald-200/70">
                    Source: {selectedBooking.source === 'web_form' ? 'Customer Online Planner' : 'Staff Manual'}
                  </span>
                </div>
                <h3 className="text-lg font-bold font-display tracking-tight text-white">
                  Party Manifest: {selectedBooking.childName}'s Birthday
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEditModal(selectedBooking)}
                  className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer border border-emerald-700/60 shadow-xs"
                  title="Modify deal, kids count, dates, and pricing"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit Deal & Headcount</span>
                </button>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="p-1.5 text-emerald-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tab navigation inside inspector */}
            <div className="flex items-center border-b border-slate-200 bg-slate-50/80 px-4 text-xs font-semibold text-slate-600 gap-4">
              <button
                onClick={() => setDetailTab('overview')}
                className={`py-3 border-b-2 transition-colors cursor-pointer ${
                  detailTab === 'overview' ? 'border-emerald-700 text-emerald-900' : 'border-transparent hover:text-slate-900'
                }`}
              >
                Overview & Pricing
              </button>
              <button
                onClick={() => setDetailTab('catering')}
                className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  detailTab === 'catering' ? 'border-emerald-700 text-emerald-900' : 'border-transparent hover:text-slate-900'
                }`}
              >
                <span>Catering & Dietary</span>
                {selectedBooking.allergiesNote && selectedBooking.allergiesNote.toLowerCase() !== 'none' && (
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                )}
              </button>
              <button
                onClick={() => setDetailTab('contact')}
                className={`py-3 border-b-2 transition-colors cursor-pointer ${
                  detailTab === 'contact' ? 'border-emerald-700 text-emerald-900' : 'border-transparent hover:text-slate-900'
                }`}
              >
                Parent Contact
              </button>
              <button
                onClick={() => setDetailTab('notes')}
                className={`py-3 border-b-2 transition-colors cursor-pointer ${
                  detailTab === 'notes' ? 'border-emerald-700 text-emerald-900' : 'border-transparent hover:text-slate-900'
                }`}
              >
                Staff Notes
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-800">
              
              {detailTab === 'overview' && (
                <div className="space-y-4">
                  
                  {/* Schedule Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono block">Date</span>
                      <span className="font-bold text-slate-900">{selectedBooking.partyDate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono block">Time Slot</span>
                      <span className="font-bold text-slate-900">{selectedBooking.partyTime}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono block">Attending</span>
                      <span className="font-bold text-slate-900">{selectedBooking.kidsCount} Children</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono block">Turning</span>
                      <span className="font-bold text-slate-900">{selectedBooking.childAge} Years Old</span>
                    </div>
                  </div>

                  {/* Package & Calculation */}
                  <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{selectedBooking.packageName}</h4>
                          <button
                            onClick={() => handleOpenEditModal(selectedBooking)}
                            className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 underline inline-flex items-center gap-1 cursor-pointer"
                            title="Edit party deal, kids count & pricing"
                          >
                            <Pencil className="w-3 h-3" />
                            <span>Edit Deal or Kids</span>
                          </button>
                        </div>
                        <span className="text-slate-500">£{selectedBooking.pricePerKid?.toFixed(2)} per child · {selectedBooking.kidsCount} children</span>
                      </div>
                      <span className="font-mono font-bold text-sm text-slate-900">
                        £{selectedBooking.baseTotal?.toFixed(2)}
                      </span>
                    </div>

                    {selectedBooking.extrasNames && selectedBooking.extrasNames.length > 0 && (
                      <div className="space-y-1.5 pb-2 border-b border-slate-100">
                        <span className="text-[10px] font-mono text-slate-400 uppercase">Selected Add-ons</span>
                        {selectedBooking.extrasNames.map((ext, idx) => (
                          <div key={idx} className="flex justify-between text-slate-700">
                            <span>· {ext}</span>
                          </div>
                        ))}
                        <div className="flex justify-between font-semibold text-slate-900 pt-1">
                          <span>Add-ons Total:</span>
                          <span className="font-mono">£{selectedBooking.extrasTotal?.toFixed(2)}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-1">
                      <span className="font-bold text-slate-900 text-sm">Total Balance:</span>
                      <span className="font-mono font-bold text-lg text-emerald-900">
                        £{selectedBooking.total?.toFixed(2)}
                      </span>
                    </div>
                  </div>

                </div>
              )}

              {detailTab === 'catering' && (
                <div className="space-y-4">
                  {/* Dietary Note */}
                  <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Allergies & Dietary Requirements</span>
                    </div>
                    <p className="text-amber-950 font-medium pl-5">
                      {selectedBooking.allergiesNote || 'None reported by parent.'}
                    </p>
                  </div>

                  {/* Meals */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <span className="font-mono text-[10px] uppercase text-slate-500 font-bold block">
                      Hot Meals Breakdown ({selectedBooking.kidsCount} guests):
                    </span>
                    <p className="font-medium text-slate-900 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                      {formatCateringMainsSummary(selectedBooking.selectedMains, selectedBooking.kidsCount)}
                    </p>
                  </div>

                  {/* Drinks */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <span className="font-mono text-[10px] uppercase text-slate-500 font-bold block">
                      Squash Jugs & Refreshments:
                    </span>
                    <p className="font-medium text-slate-900 bg-white p-3 rounded-lg border border-slate-200">
                      {formatCateringDrinksSummary(selectedBooking.selectedDrinks, selectedBooking.kidsCount)}
                    </p>
                  </div>
                </div>
              )}

              {detailTab === 'contact' && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono block">Primary Parent / Guardian</span>
                      <span className="font-bold text-slate-900 text-sm">{selectedBooking.parentName}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      {selectedBooking.parentPhone && (
                        <a
                          href={`tel:${selectedBooking.parentPhone}`}
                          className="flex-1 px-3 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                          <span>Call {selectedBooking.parentPhone}</span>
                        </a>
                      )}
                      {selectedBooking.parentEmail && (
                        <a
                          href={`mailto:${selectedBooking.parentEmail}?subject=PlayGolf Party Inquiry #${selectedBooking.id}`}
                          className="flex-1 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                          <span>Email Parent</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {detailTab === 'notes' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">Internal Coordinator Log</span>
                    {noteEditId !== selectedBooking.id && (
                      <button
                        onClick={() => {
                          setNoteEditId(selectedBooking.id);
                          setNoteEditText(selectedBooking.staffNotes || '');
                        }}
                        className="text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Note</span>
                      </button>
                    )}
                  </div>

                  {noteEditId === selectedBooking.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={noteEditText}
                        onChange={(e) => setNoteEditText(e.target.value)}
                        rows={4}
                        placeholder="Bay allocations, coach assignment, payment method notes..."
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-600"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setNoteEditId(null)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveNotes(selectedBooking.id)}
                          className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg font-semibold"
                        >
                          Save Notes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 leading-relaxed italic">
                      {selectedBooking.staffNotes || 'No internal notes recorded yet.'}
                    </p>
                  )}
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">Update Status:</span>
                <select
                  value={selectedBooking.status}
                  onChange={(e) => handleStatusChange(selectedBooking.id, e.target.value as BookingStatus)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${getStatusBadgeStyles(selectedBooking.status)}`}
                >
                  <option value="Pending">Pending Review</option>
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
                      customFilename: `Playgolf_Booking_${selectedBooking.id}.csv`
                    });
                    showNotify(`Exported CSV for #${selectedBooking.id}`);
                  }}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>CSV</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Sheet</span>
                </button>
                <button
                  onClick={() => handleOpenEditModal(selectedBooking)}
                  className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  title="Modify deal, kids count, dates, and pricing"
                >
                  <Pencil className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Edit Deal & Headcount</span>
                </button>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* EDIT BOOKING MODAL (MODIFY DEAL, HEADCOUNT, PRICING & DETAILS) */}
      {isEditModalOpen && editingBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <form
            onSubmit={handleSaveEditBooking}
            className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full my-auto max-h-[92vh] flex flex-col shadow-2xl animate-fade-in overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 bg-emerald-950 text-white flex items-center justify-between border-b border-emerald-900 shrink-0">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-300">#{editingBooking.id}</span>
                  <span className="text-[11px] text-emerald-200/80">Staff Booking Editor</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold font-display text-white">
                  Modify Booking Deal & Headcount
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 text-emerald-300 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-800">
              
              {/* SECTION 1: PARTY PACKAGE / DEAL SELECTOR */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                    1. Party Package / Deal *
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Pricing adjusts automatically
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {PARTY_PACKAGES.map((pkg) => {
                    const isSelected = editForm.selectedPackageId === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setEditForm(prev => ({ ...prev, selectedPackageId: pkg.id }))}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-600/30 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-mono font-bold uppercase ${isSelected ? 'text-emerald-800' : 'text-slate-500'}`}>
                              {pkg.id === 'combo-party' ? 'Combo Deal' : pkg.id === 'adventure-golf' ? 'Mini Golf' : 'Range'}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                            )}
                          </div>
                          <div className="font-bold text-slate-900 text-xs mt-1 leading-tight">
                            {pkg.name}
                          </div>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="font-mono font-bold text-sm text-emerald-900">
                            £{pkg.pricePerKid.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-slate-500">/ child</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 2: GUEST HEADCOUNT (NUMBER OF KIDS) */}
              <div className="space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono block">
                      2. Number of Kids (Headcount) *
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Minimum {editPricing.pkg.minKids} kids for {editPricing.pkg.name}
                    </span>
                  </div>

                  {/* Stepper Control */}
                  <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 shadow-xs">
                    <button
                      type="button"
                      onClick={() => setEditForm(prev => ({ ...prev, kidsCount: Math.max(1, (Number(prev.kidsCount) || 1) - 1) }))}
                      className="w-7 h-7 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={editForm.kidsCount}
                      onChange={(e) => setEditForm(prev => ({ ...prev, kidsCount: Number(e.target.value) || 0 }))}
                      className="w-14 text-center font-bold text-base text-slate-900 focus:outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setEditForm(prev => ({ ...prev, kidsCount: (Number(prev.kidsCount) || 0) + 1 }))}
                      className="w-7 h-7 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Quick Count Chips */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[10px] text-slate-400 font-mono uppercase font-semibold">Quick Set:</span>
                  {[6, 8, 10, 12, 14, 16, 18, 20, 24, 30].map(cnt => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setEditForm(prev => ({ ...prev, kidsCount: cnt }))}
                      className={`px-2 py-0.5 rounded-md text-xs font-mono font-medium transition-colors cursor-pointer ${
                        editForm.kidsCount === cnt
                          ? 'bg-emerald-800 text-white font-bold'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cnt}
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION 3: LIVE PRICING RECALCULATION CARD */}
              <div className="bg-emerald-950 text-white p-4 rounded-xl border border-emerald-900 space-y-3 shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-900/80">
                  <div className="flex items-center gap-1.5">
                    <Calculator className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider font-mono text-emerald-200">
                      Live Pricing Recalculation
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-300 font-mono">
                    Auto-computed
                  </span>
                </div>

                {/* Breakdown details */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-emerald-100/90">
                    <span>
                      Package Base ({editPricing.kidsCount} kids × £{editPricing.pricePerKid.toFixed(2)}):
                    </span>
                    <span className="font-mono font-semibold">
                      £{editPricing.baseTotal.toFixed(2)}
                    </span>
                  </div>

                  {editPricing.extrasTotal > 0 && (
                    <div className="flex justify-between items-center text-emerald-100/90">
                      <span>Food Extras & Add-ons:</span>
                      <span className="font-mono font-semibold">
                        +£{editPricing.extrasTotal.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {editPricing.discountAmount > 0 && (
                    <div className="flex justify-between items-center text-emerald-300">
                      <span>Combo Savings Benefit (vs separate):</span>
                      <span className="font-mono font-semibold">
                        -£{editPricing.discountAmount.toFixed(2)} included value
                      </span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-emerald-900/80 flex items-baseline justify-between">
                    <div>
                      <span className="text-sm font-bold text-white block">
                        {editForm.isCustomPriceOverride ? 'Staff Overridden Price:' : 'Calculated Final Balance:'}
                      </span>
                      <span className="text-[10px] text-emerald-300">
                        {editForm.isCustomPriceOverride
                          ? `(Standard rate was £${editPricing.standardTotal.toFixed(2)})`
                          : 'Includes golf activity, hot food & selected refreshments'}
                      </span>
                    </div>
                    <span className="text-2xl font-bold font-display text-emerald-300 font-mono tabular-nums">
                      £{editPricing.finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Manual Price Override Toggle */}
                <div className="pt-2 border-t border-emerald-900/60 flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer text-[11px] text-emerald-200">
                    <input
                      type="checkbox"
                      checked={editForm.isCustomPriceOverride}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setEditForm(prev => ({
                          ...prev,
                          isCustomPriceOverride: checked,
                          customTotal: checked ? (prev.customTotal || editPricing.standardTotal) : editPricing.standardTotal
                        }));
                      }}
                      className="rounded border-emerald-700 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Custom Price Override (Special Quote / Discount)</span>
                  </label>

                  {editForm.isCustomPriceOverride && (
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-emerald-300 text-xs">£</span>
                      <input
                        type="number"
                        step="0.50"
                        min={0}
                        value={editForm.customTotal}
                        onChange={(e) => setEditForm(prev => ({ ...prev, customTotal: Number(e.target.value) || 0 }))}
                        className="w-24 px-2 py-1 bg-emerald-900/90 text-white rounded font-mono font-bold text-xs border border-emerald-700 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 4: FOOD EXTRAS / ADD-ONS */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono block">
                  3. Food Extras & Party Add-ons
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {FOOD_EXTRAS.map(extra => {
                    const isChecked = editForm.selectedExtras.includes(extra.id);
                    let priceText = '+£1.50/kid';
                    if (extra.id === 'extra-partybags') priceText = '+£2.50/kid';
                    if (extra.id === 'extra-sweets') priceText = '+£2.00/kid';

                    return (
                      <label
                        key={extra.id}
                        className={`p-2.5 rounded-lg border flex items-start gap-2 cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-emerald-50/70 border-emerald-400 text-emerald-950'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/80'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setEditForm(prev => {
                              const exists = prev.selectedExtras.includes(extra.id);
                              return {
                                ...prev,
                                selectedExtras: exists
                                  ? prev.selectedExtras.filter(id => id !== extra.id)
                                  : [...prev.selectedExtras, extra.id]
                              };
                            });
                          }}
                          className="mt-0.5 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                        />
                        <div className="text-[11px]">
                          <span className="font-semibold block">{extra.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{priceText}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 5: SCHEDULE & CONTACT INFORMATION */}
              <div className="space-y-3 pt-1">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono block">
                  4. Schedule & Contact Details
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">Party Date *</label>
                    <input
                      type="text"
                      required
                      value={editForm.partyDate}
                      onChange={(e) => setEditForm(prev => ({ ...prev, partyDate: e.target.value }))}
                      placeholder="e.g. Saturday, 28 Nov"
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">Time Slot *</label>
                    <input
                      type="text"
                      required
                      value={editForm.partyTime}
                      onChange={(e) => setEditForm(prev => ({ ...prev, partyTime: e.target.value }))}
                      placeholder="e.g. 13:30 - 15:30"
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">Birthday Child & Age</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editForm.childName}
                        onChange={(e) => setEditForm(prev => ({ ...prev, childName: e.target.value }))}
                        placeholder="Child's Name"
                        className="w-2/3 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />
                      <input
                        type="number"
                        min={4}
                        max={16}
                        value={editForm.childAge}
                        onChange={(e) => setEditForm(prev => ({ ...prev, childAge: Number(e.target.value) || 8 }))}
                        className="w-1/3 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-center font-mono focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">Booking Status</label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value as BookingStatus }))}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-emerald-600"
                    >
                      <option value="Pending">Pending Review</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Deposit Paid">Deposit Paid</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">Parent Name *</label>
                    <input
                      type="text"
                      required
                      value={editForm.parentName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, parentName: e.target.value }))}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">Phone</label>
                    <input
                      type="tel"
                      value={editForm.parentPhone}
                      onChange={(e) => setEditForm(prev => ({ ...prev, parentPhone: e.target.value }))}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">Email</label>
                    <input
                      type="email"
                      value={editForm.parentEmail}
                      onChange={(e) => setEditForm(prev => ({ ...prev, parentEmail: e.target.value }))}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Dietary & Allergy Restrictions</label>
                  <textarea
                    value={editForm.allergiesNote}
                    onChange={(e) => setEditForm(prev => ({ ...prev, allergiesNote: e.target.value }))}
                    rows={2}
                    placeholder="e.g. 1 gluten-free pizza; 1 nut allergy"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Internal Coordinator / Bay Notes</label>
                  <textarea
                    value={editForm.staffNotes}
                    onChange={(e) => setEditForm(prev => ({ ...prev, staffNotes: e.target.value }))}
                    rows={2}
                    placeholder="Bay assignment, deposit payment details, party host notes..."
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
              <div className="text-xs text-slate-600">
                <span>Total: </span>
                <strong className="text-emerald-900 font-bold font-mono text-sm">
                  £{editPricing.finalTotal.toFixed(2)}
                </strong>
                <span className="text-slate-400 text-[11px]"> ({editPricing.kidsCount} kids)</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Changes (£{editPricing.finalTotal.toFixed(2)})</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* NEW MANUAL BOOKING MODAL */}
      {isNewBookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <form 
            onSubmit={handleCreateManualBooking}
            className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl animate-fade-in overflow-hidden"
          >
            <div className="p-5 bg-emerald-950 text-white flex items-center justify-between border-b border-emerald-900">
              <div>
                <h3 className="text-base font-bold font-display text-white">
                  Add Phone or Walk-in Booking
                </h3>
                <p className="text-xs text-emerald-200/80">Record a party booking directly from customer telephone or counter inquiry</p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewBookingModalOpen(false)}
                className="p-1.5 text-emerald-300 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-800">Parent / Guardian Name *</label>
                  <input
                    type="text"
                    required
                    value={newForm.parentName}
                    onChange={(e) => setNewForm({ ...newForm, parentName: e.target.value })}
                    placeholder="e.g. John Smith"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-800">Phone Number</label>
                  <input
                    type="tel"
                    value={newForm.parentPhone}
                    onChange={(e) => setNewForm({ ...newForm, parentPhone: e.target.value })}
                    placeholder="07700 900123"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-800">Email Address</label>
                  <input
                    type="email"
                    value={newForm.parentEmail}
                    onChange={(e) => setNewForm({ ...newForm, parentEmail: e.target.value })}
                    placeholder="parent@example.com"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-800">Birthday Child & Age</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newForm.childName}
                      onChange={(e) => setNewForm({ ...newForm, childName: e.target.value })}
                      placeholder="Child Name"
                      className="w-2/3 p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                    <input
                      type="number"
                      min={5}
                      max={15}
                      value={newForm.childAge}
                      onChange={(e) => setNewForm({ ...newForm, childAge: Number(e.target.value) })}
                      className="w-1/3 p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-800">Package</label>
                  <select
                    value={newForm.selectedPackageId}
                    onChange={(e) => setNewForm({ ...newForm, selectedPackageId: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 font-medium"
                  >
                    {PARTY_PACKAGES.map(pkg => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} (£{pkg.pricePerKid.toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-800">Headcount (Kids)</label>
                  <input
                    type="number"
                    min={6}
                    max={50}
                    value={newForm.kidsCount}
                    onChange={(e) => setNewForm({ ...newForm, kidsCount: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-800">Party Date *</label>
                  <input
                    type="text"
                    required
                    value={newForm.partyDate}
                    onChange={(e) => setNewForm({ ...newForm, partyDate: e.target.value })}
                    placeholder="e.g. Saturday, 28 Nov"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                  />
                  {newForm.partyDate && isDateBlocked(newForm.partyDate).isBlocked && (
                    <div className="text-[10px] text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200 mt-1">
                      Notice: Date is blocked online ({isDateBlocked(newForm.partyDate).record?.reason}). Staff override allowed.
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Party Time Slot</label>
                <input
                  type="text"
                  value={newForm.partyTime}
                  onChange={(e) => setNewForm({ ...newForm, partyTime: e.target.value })}
                  placeholder="e.g. 13:00 - 15:00"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Allergies / Dietary Requirements</label>
                <textarea
                  value={newForm.allergiesNote}
                  onChange={(e) => setNewForm({ ...newForm, allergiesNote: e.target.value })}
                  placeholder="e.g. Gluten-free pizza for 2 children; no nuts."
                  rows={2}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Staff Notes</label>
                <textarea
                  value={newForm.staffNotes}
                  onChange={(e) => setNewForm({ ...newForm, staffNotes: e.target.value })}
                  placeholder="Deposit £50 taken over the phone via card terminal."
                  rows={2}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsNewBookingModalOpen(false)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs transition-colors shadow-xs"
              >
                Save Booking
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
