import { BookingRecord, BookingStatus } from '../types';
import { supabase } from './supabaseClient';
import { FOOD_MAINS, FOOD_DRINKS, PARTY_PACKAGES, FOOD_EXTRAS } from '../data';

const STORAGE_KEY = 'playgolf_party_bookings_v1';
export const UPDATE_EVENT_NAME = 'playgolf_bookings_updated';

// Fallback seed bookings in case table is empty or offline
const INITIAL_SAMPLE_BOOKINGS: BookingRecord[] = [
  {
    id: 'BK-1084',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    selectedPackageId: 'combo-party',
    packageName: 'Ultimate Range & Putt Combo',
    pricePerKid: 21.50,
    kidsCount: 12,
    partyDate: 'Saturday, 14 Nov',
    partyTime: '13:30 - 15:30',
    parentName: 'Sarah Jenkins',
    parentPhone: '07700 900123',
    parentEmail: 'sarah.jenkins@example.com',
    childName: 'Leo',
    childAge: 8,
    allergiesNote: '1 child has nut allergy; 1 child is lactose intolerant.',
    selectedMains: { 0: 'main-margherita-pizza', 1: 'main-nuggets', 2: 'main-nuggets' },
    selectedDrinks: {},
    selectedExtras: ['extra-cupcake', 'extra-partybags'],
    extrasNames: ['Extra Themed Birthday Cupcake (£1.50/kid)', 'Putt Crazy Souvenir Party Bag (£2.50/kid)'],
    baseTotal: 258.00,
    extrasTotal: 48.00,
    discountAmount: 138.00,
    total: 306.00,
    status: 'Pending',
    staffNotes: 'Called parent to confirm bay allocation in upper range.',
    source: 'web_form'
  },
  {
    id: 'BK-1079',
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    selectedPackageId: 'adventure-golf',
    packageName: 'Putt Crazy Adventure Golf Party',
    pricePerKid: 16.50,
    kidsCount: 10,
    partyDate: 'Sunday, 15 Nov',
    partyTime: '11:00 - 12:30',
    parentName: 'David Patel',
    parentPhone: '07700 900456',
    parentEmail: 'd.patel@example.co.uk',
    childName: 'Aarav',
    childAge: 7,
    allergiesNote: 'No beef or pork. Vegetarian options preferred for 4 children.',
    selectedMains: { 0: 'main-margherita-pizza', 1: 'main-pasta-tomato' },
    selectedDrinks: {},
    selectedExtras: ['extra-sweets'],
    extrasNames: ['Gourmet Sweet Cones (£2.00/kid)'],
    baseTotal: 165.00,
    extrasTotal: 20.00,
    discountAmount: 0,
    total: 185.00,
    status: 'Confirmed',
    staffNotes: 'Deposit of £50 received by phone. Table 4 booked in café area.',
    source: 'web_form'
  },
  {
    id: 'BK-1065',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    selectedPackageId: 'driving-range',
    packageName: 'Driving Range Party',
    pricePerKid: 16.50,
    kidsCount: 8,
    partyDate: 'Saturday, 21 Nov',
    partyTime: '15:00 - 16:30',
    parentName: 'Emma Thompson',
    parentPhone: '07700 900789',
    parentEmail: 'emma.t@example.com',
    childName: 'Oliver',
    childAge: 10,
    allergiesNote: 'None',
    selectedMains: { 0: 'main-nuggets', 1: 'main-fish-goujons' },
    selectedDrinks: {},
    selectedExtras: ['extra-cupcake'],
    extrasNames: ['Extra Themed Birthday Cupcake (£1.50/kid)'],
    baseTotal: 132.00,
    extrasTotal: 12.00,
    discountAmount: 0,
    total: 144.00,
    status: 'Deposit Paid',
    staffNotes: 'Full payment received. Pro instructor assigned to oversee range safety.',
    source: 'web_form'
  }
];

// Map Supabase DB row (snake_case) to BookingRecord (camelCase)
function mapRowToBooking(row: any): BookingRecord {
  return {
    id: row.id,
    createdAt: row.created_at || new Date().toISOString(),
    selectedPackageId: row.selected_package_id || 'combo-party',
    packageName: row.package_name || 'Party Package',
    pricePerKid: Number(row.price_per_kid) || 0,
    kidsCount: Number(row.kids_count) || 6,
    partyDate: row.party_date || '',
    partyTime: row.party_time || '',
    parentName: row.parent_name || '',
    parentPhone: row.parent_phone || '',
    parentEmail: row.parent_email || '',
    childName: row.child_name || '',
    childAge: Number(row.child_age) || 7,
    allergiesNote: row.allergies_note || '',
    selectedMains: row.selected_mains || {},
    selectedDrinks: row.selected_drinks || {},
    selectedExtras: Array.isArray(row.selected_extras) ? row.selected_extras : [],
    extrasNames: Array.isArray(row.extras_names) ? row.extras_names : [],
    baseTotal: Number(row.base_total) || 0,
    extrasTotal: Number(row.extras_total) || 0,
    discountAmount: Number(row.discount_amount) || 0,
    total: Number(row.total) || 0,
    status: (row.status as BookingStatus) || 'Pending',
    staffNotes: row.staff_notes || '',
    source: row.source || 'web_form'
  };
}

// Map BookingRecord (camelCase) to Supabase DB row (snake_case)
function mapBookingToRow(b: BookingRecord) {
  return {
    id: b.id,
    created_at: b.createdAt,
    selected_package_id: b.selectedPackageId,
    package_name: b.packageName,
    price_per_kid: b.pricePerKid,
    kids_count: b.kidsCount,
    party_date: b.partyDate,
    party_time: b.partyTime,
    parent_name: b.parentName,
    parent_phone: b.parentPhone,
    parent_email: b.parentEmail,
    child_name: b.childName,
    child_age: b.childAge,
    allergies_note: b.allergiesNote,
    selected_mains: b.selectedMains,
    selected_drinks: b.selectedDrinks,
    selected_extras: b.selectedExtras,
    extras_names: b.extrasNames,
    base_total: b.baseTotal,
    extras_total: b.extrasTotal,
    discount_amount: b.discountAmount,
    total: b.total,
    status: b.status,
    staff_notes: b.staffNotes,
    source: b.source
  };
}

// Synchronous local storage read for instantaneous initial UI render
export function getAllBookings(): BookingRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_BOOKINGS));
      return INITIAL_SAMPLE_BOOKINGS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_SAMPLE_BOOKINGS;
  } catch (err) {
    console.error('Failed to load bookings from localStorage:', err);
    return INITIAL_SAMPLE_BOOKINGS;
  }
}

// Asynchronous fetch from Supabase (syncs with localStorage cache)
export async function fetchBookingsFromSupabase(): Promise<BookingRecord[]> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase query error (falling back to local cache):', error.message);
      return getAllBookings();
    }

    if (data && data.length > 0) {
      const records = data.map(mapRowToBooking);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      return records;
    } else {
      // If table is newly created and empty, populate with initial sample bookings
      const current = getAllBookings();
      if (current.length > 0) {
        // Asynchronously seed initial samples to Supabase
        const rows = current.map(mapBookingToRow);
        await supabase.from('bookings').upsert(rows);
      }
      return current;
    }
  } catch (err) {
    console.warn('Network issue reaching Supabase, using local cache:', err);
    return getAllBookings();
  }
}

// Save a booking both to Supabase and local cache
export async function saveBookingAsync(
  bookingInput: Omit<BookingRecord, 'id' | 'createdAt' | 'status'> & Partial<Pick<BookingRecord, 'id' | 'createdAt' | 'status'>>
): Promise<BookingRecord> {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const newBooking: BookingRecord = {
    ...bookingInput,
    id: bookingInput.id || `BK-${randomNum}`,
    createdAt: bookingInput.createdAt || new Date().toISOString(),
    status: bookingInput.status || 'Pending',
    source: bookingInput.source || 'web_form'
  };

  // 1. Immediately update local storage so UI is instantaneous
  const current = getAllBookings();
  const updated = [newBooking, ...current.filter(b => b.id !== newBooking.id)];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    if (newBooking.partyDate && newBooking.partyTime) {
      const slotKey = `${newBooking.partyDate}-${newBooking.partyTime}`;
      const savedPartySlots = localStorage.getItem('party_bookings');
      let slotsArr: string[] = [];
      if (savedPartySlots) {
        try {
          slotsArr = JSON.parse(savedPartySlots);
        } catch (_) {}
      }
      if (!slotsArr.includes(slotKey)) {
        slotsArr.push(slotKey);
        localStorage.setItem('party_bookings', JSON.stringify(slotsArr));
      }
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(UPDATE_EVENT_NAME, { detail: newBooking }));
    }
  } catch (err) {
    console.error('Failed to update local booking cache:', err);
  }

  // 2. Persist directly to Supabase cloud
  try {
    const row = mapBookingToRow(newBooking);
    const { error } = await supabase.from('bookings').insert([row]);
    if (error) {
      console.error('Error inserting into Supabase:', error.message);
    } else {
      console.log('Successfully saved booking to Supabase:', newBooking.id);
    }
  } catch (err) {
    console.error('Failed to send booking to Supabase:', err);
  }

  return newBooking;
}

// Synchronous wrapper to preserve existing call signatures while firing Supabase async write
export function saveBooking(
  bookingInput: Omit<BookingRecord, 'id' | 'createdAt' | 'status'> & Partial<Pick<BookingRecord, 'id' | 'createdAt' | 'status'>>
): BookingRecord {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const newBooking: BookingRecord = {
    ...bookingInput,
    id: bookingInput.id || `BK-${randomNum}`,
    createdAt: bookingInput.createdAt || new Date().toISOString(),
    status: bookingInput.status || 'Pending',
    source: bookingInput.source || 'web_form'
  };

  // Save to local cache
  const current = getAllBookings();
  const updated = [newBooking, ...current.filter(b => b.id !== newBooking.id)];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    if (newBooking.partyDate && newBooking.partyTime) {
      const slotKey = `${newBooking.partyDate}-${newBooking.partyTime}`;
      const savedPartySlots = localStorage.getItem('party_bookings');
      let slotsArr: string[] = [];
      if (savedPartySlots) {
        try {
          slotsArr = JSON.parse(savedPartySlots);
        } catch (_) {}
      }
      if (!slotsArr.includes(slotKey)) {
        slotsArr.push(slotKey);
        localStorage.setItem('party_bookings', JSON.stringify(slotsArr));
      }
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(UPDATE_EVENT_NAME, { detail: newBooking }));
    }
  } catch (err) {
    console.error('Local cache error:', err);
  }

  // Fire Supabase async insert
  const row = mapBookingToRow(newBooking);
  Promise.resolve(supabase.from('bookings').insert([row]))
    .then(({ error }) => {
      if (error) console.error('Supabase async save error:', error.message);
      else console.log('Saved to Supabase:', newBooking.id);
    })
    .catch(e => console.error('Supabase network error:', e));

  return newBooking;

}

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<boolean> {
  const current = getAllBookings();
  const idx = current.findIndex(b => b.id === id);
  if (idx !== -1) {
    current[idx] = { ...current[idx], status };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(UPDATE_EVENT_NAME));
    }
  }

  try {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Failed to update status in Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase error updating status:', err);
    return false;
  }
}

export async function updateBookingNotes(id: string, staffNotes: string): Promise<boolean> {
  const current = getAllBookings();
  const idx = current.findIndex(b => b.id === id);
  if (idx !== -1) {
    current[idx] = { ...current[idx], staffNotes };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(UPDATE_EVENT_NAME));
    }
  }

  try {
    const { error } = await supabase
      .from('bookings')
      .update({ staff_notes: staffNotes })
      .eq('id', id);

    if (error) {
      console.error('Failed to update notes in Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase error updating notes:', err);
    return false;
  }
}

// Calculate exact pricing for booking changes (package, kids, extras, manual override)
export function calculatePricingForBooking(
  packageId: string,
  kidsCount: number,
  selectedExtras: string[] = [],
  manualOverridePrice?: number | null
): {
  packageName: string;
  pricePerKid: number;
  baseTotal: number;
  extrasTotal: number;
  extrasNames: string[];
  discountAmount: number;
  total: number;
} {
  const pkg = PARTY_PACKAGES.find(p => p.id === packageId) || PARTY_PACKAGES[0];
  const pricePerKid = pkg.pricePerKid;
  const count = Math.max(1, kidsCount);
  const baseTotal = pricePerKid * count;

  let extrasTotal = 0;
  const extrasNames: string[] = [];

  selectedExtras.forEach(extId => {
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
  const computedTotal = baseTotal + extrasTotal;
  const finalTotal = manualOverridePrice !== undefined && manualOverridePrice !== null && !isNaN(manualOverridePrice) && manualOverridePrice > 0
    ? manualOverridePrice
    : computedTotal;

  return {
    packageName: pkg.name,
    pricePerKid,
    baseTotal,
    extrasTotal,
    extrasNames,
    discountAmount,
    total: finalTotal
  };
}

// Enable staff to update any details of a booking (deal, kids, dates, pricing, contact, etc.)
export async function updateBookingDetails(
  id: string,
  updates: Partial<BookingRecord>
): Promise<BookingRecord | null> {
  const current = getAllBookings();
  const idx = current.findIndex(b => b.id === id);
  if (idx === -1) return null;

  const existing = current[idx];
  
  // If package or kids count or extras changed without manual totals, recalculate pricing automatically
  let calculatedPricing = {};
  const newPackageId = updates.selectedPackageId || existing.selectedPackageId;
  const newKidsCount = updates.kidsCount !== undefined ? updates.kidsCount : existing.kidsCount;
  const newExtras = updates.selectedExtras || existing.selectedExtras || [];

  if (
    updates.total === undefined &&
    (updates.selectedPackageId !== undefined || updates.kidsCount !== undefined || updates.selectedExtras !== undefined)
  ) {
    calculatedPricing = calculatePricingForBooking(newPackageId, newKidsCount, newExtras);
  }

  const updatedBooking: BookingRecord = {
    ...existing,
    ...calculatedPricing,
    ...updates
  };

  current[idx] = updatedBooking;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT_NAME, { detail: updatedBooking }));
  }

  try {
    const row = mapBookingToRow(updatedBooking);
    const { error } = await supabase
      .from('bookings')
      .update(row)
      .eq('id', id);

    if (error) {
      console.warn('Supabase error updating booking details:', error.message);
    } else {
      console.log('Successfully updated booking in Supabase:', id);
    }
  } catch (err) {
    console.warn('Network issue reaching Supabase, local cache updated:', err);
  }

  return updatedBooking;
}

export async function deleteBooking(id: string): Promise<boolean> {
  const current = getAllBookings();
  const filtered = current.filter(b => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT_NAME));
  }

  try {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete booking in Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase delete error:', err);
    return false;
  }
}

export function resetToSampleBookings(): BookingRecord[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_BOOKINGS));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(UPDATE_EVENT_NAME));
    }
    // Also push to Supabase
    const rows = INITIAL_SAMPLE_BOOKINGS.map(mapBookingToRow);
    Promise.resolve(supabase.from('bookings').upsert(rows)).catch(console.error);
    return INITIAL_SAMPLE_BOOKINGS;

  } catch (err) {
    console.error('Failed to reset bookings:', err);
    return INITIAL_SAMPLE_BOOKINGS;
  }
}

// Helper to format cells safely according to RFC 4180
function escapeCSV(val: string | number | undefined | null): string {
  if (val === undefined || val === null) return '""';
  const str = String(val);
  // If already an Excel formula wrapper like ="07700 900123"
  if (str.startsWith('="') && str.endsWith('"')) {
    return str;
  }
  return `"${str.replace(/"/g, '""')}"`;
}

// Preserve UK phone numbers with leading zeroes and prevent Excel from auto-converting to numbers/scientific
function formatPhoneForCSV(phone?: string): string {
  if (!phone || !phone.trim()) return '""';
  const clean = phone.trim().replace(/"/g, '""');
  // Formula trick: ="07700 900123" forces Excel & Sheets to treat as exact text string
  return `"=""${clean}"""`;
}

// Translate food main dish IDs into human-readable kitchen orders
export function formatCateringMainsSummary(mains?: Record<number, string>, kidsCount?: number): string {
  if (!mains || Object.keys(mains).length === 0) {
    return kidsCount 
      ? `Hot meal included (${kidsCount} meals — choices pending confirmation)`
      : 'Hot meal included (choices pending confirmation)';
  }

  const nameMap = new Map<string, string>();
  FOOD_MAINS.forEach(m => nameMap.set(m.id, m.name));

  const tallies: Record<string, number> = {};
  let totalAssigned = 0;

  for (const foodId of Object.values(mains)) {
    if (!foodId) continue;
    const name = nameMap.get(foodId) || foodId;
    tallies[name] = (tallies[name] || 0) + 1;
    totalAssigned++;
  }

  if (totalAssigned === 0) {
    return kidsCount 
      ? `Hot meal included (${kidsCount} meals — choices pending confirmation)`
      : 'Hot meal included (choices pending confirmation)';
  }

  const parts = Object.entries(tallies).map(([name, count]) => `${count}x ${name}`);
  const summary = parts.join('; ');

  if (kidsCount && kidsCount > totalAssigned) {
    return `${summary} (${totalAssigned} of ${kidsCount} selected, ${kidsCount - totalAssigned} pending)`;
  }
  return summary;
}

// Translate drinks IDs into human-readable beverage orders
export function formatCateringDrinksSummary(drinks?: Record<number, string>, kidsCount?: number): string {
  if (!drinks || Object.keys(drinks).length === 0) {
    return 'Complimentary Squash Jugs included (Orange & Blackcurrant)';
  }

  const nameMap = new Map<string, string>();
  FOOD_DRINKS.forEach(d => nameMap.set(d.id, d.name));

  const tallies: Record<string, number> = {};
  let totalAssigned = 0;

  for (const drinkId of Object.values(drinks)) {
    if (!drinkId) continue;
    const name = nameMap.get(drinkId) || drinkId;
    tallies[name] = (tallies[name] || 0) + 1;
    totalAssigned++;
  }

  if (totalAssigned === 0) {
    return 'Complimentary Squash Jugs included (Orange & Blackcurrant)';
  }

  const parts = Object.entries(tallies).map(([name, count]) => `${count}x ${name}`);
  return parts.join('; ');
}

export interface ExportCSVOptions {
  format?: 'executive' | 'table-only' | 'kitchen';
  filterDescription?: string;
  customFilename?: string;
}

// Internal trigger to start browser file download
function triggerBrowserCSVDownload(filename: string, csvContent: string): void {
  // Prepend UTF-8 BOM (\uFEFF) so Microsoft Excel (both Mac & Windows) and Apple Numbers
  // automatically detect UTF-8 encoding and cleanly render £ symbols, accented letters, and special formatting.
  const UTF8_BOM = '\uFEFF';
  const blob = new Blob([UTF8_BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportBookingsToCSV(bookings: BookingRecord[], options: ExportCSVOptions = {}): void {
  const format = options.format || 'executive';
  const filterDesc = options.filterDescription || 'All Database Records';

  const now = new Date();
  const dateStamp = now.toISOString().slice(0, 10);
  const timeStamp = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
  const genDateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const genTimeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  // Calculate aggregates for summary row and header
  const totalKids = bookings.reduce((sum, b) => sum + (b.kidsCount || 0), 0);
  const totalBase = bookings.reduce((sum, b) => {
    const base = (b.baseTotal !== undefined && b.baseTotal !== null) 
      ? b.baseTotal 
      : ((b.pricePerKid || 0) * (b.kidsCount || 0));
    return sum + base;
  }, 0);
  const totalExtras = bookings.reduce((sum, b) => sum + (b.extrasTotal || 0), 0);
  const totalDiscount = bookings.reduce((sum, b) => sum + (b.discountAmount || 0), 0);
  const totalGrand = bookings.reduce((sum, b) => sum + (b.total || 0), 0);

  // --------------------------------------------------------------------------
  // KITCHEN & CATERING RUN SHEET
  // --------------------------------------------------------------------------
  if (format === 'kitchen') {
    const KITCHEN_HEADERS = [
      'Party Date',
      'Party Time Slot',
      'Booking Ref',
      'Status',
      'Package',
      'Headcount (Kids)',
      'Birthday Celebrant & Age',
      'Dietary Requirements & Allergies ALERT',
      'Hot Food Mains Breakdown',
      'Drinks Required',
      'Cake & Extra Sweet Items',
      'Parent Contact',
      'Kitchen Staff Notes'
    ];

    const padKitchenRow = (items: (string | number | undefined | null)[]): string => {
      const row = [...items];
      while (row.length < KITCHEN_HEADERS.length) {
        row.push('');
      }
      return row.map(escapeCSV).join(',');
    };

    const headerBlock = [
      padKitchenRow(['PLAYGOLF NORTHWICK PARK — KITCHEN & CATERING RUN SHEET']),
      padKitchenRow([
        'Generated On:',
        `${genDateStr} at ${genTimeStr}`,
        'Parties Scheduled:',
        bookings.length,
        'Total Meals to Prepare:',
        `${totalKids} Meals`,
        'Facility:',
        'Northwick Park Events Kitchen'
      ]),
      padKitchenRow([
        'Filter Scope:',
        filterDesc,
        'Database Sync:',
        'Supabase Cloud Live Database',
        'Staff Coordinator:',
        'Playgolf Catering Team'
      ]),
      padKitchenRow([''])
    ];

    const kitchenRows = bookings.map(b => {
      const allergiesText = (b.allergiesNote && b.allergiesNote.trim() && b.allergiesNote.toLowerCase() !== 'none')
        ? `⚠️ ALERT: ${b.allergiesNote.trim()}`
        : 'None reported';

      const sweetExtras = (b.extrasNames || []).filter(name => 
        name.toLowerCase().includes('cupcake') || 
        name.toLowerCase().includes('cake') || 
        name.toLowerCase().includes('sweet')
      ).join('; ') || 'None';

      return [
        escapeCSV(b.partyDate || 'TBC'),
        escapeCSV(b.partyTime || 'TBC'),
        escapeCSV(b.id),
        escapeCSV(b.status),
        escapeCSV(b.packageName),
        escapeCSV(b.kidsCount || 0),
        escapeCSV(`${b.childName || 'Child'} (Turning ${b.childAge || 'TBC'})`),
        escapeCSV(allergiesText),
        escapeCSV(formatCateringMainsSummary(b.selectedMains, b.kidsCount)),
        escapeCSV(formatCateringDrinksSummary(b.selectedDrinks, b.kidsCount)),
        escapeCSV(sweetExtras),
        escapeCSV(`${b.parentName || 'Parent'} (${b.parentPhone || 'No phone'})`),
        escapeCSV(b.staffNotes || 'None')
      ].join(',');
    });

    const summaryBlock = [
      padKitchenRow(['']),
      [
        escapeCSV('TOTAL MEALS FOR KITCHEN RUN'),
        '""',
        '""',
        '""',
        '""',
        escapeCSV(totalKids),
        '""',
        '""',
        '""',
        '""',
        '""',
        '""',
        '""'
      ].join(',')
    ];

    const csvContent = [
      ...headerBlock,
      KITCHEN_HEADERS.map(escapeCSV).join(','),
      ...kitchenRows,
      ...summaryBlock
    ].join('\r\n');

    const defaultFilename = `Playgolf_Kitchen_Catering_RunSheet_${dateStamp}_${timeStamp}.csv`;
    triggerBrowserCSVDownload(options.customFilename || defaultFilename, csvContent);
    return;
  }

  // --------------------------------------------------------------------------
  // EXECUTIVE & DATA TABLE MASTER REPORTS
  // --------------------------------------------------------------------------
  const MASTER_HEADERS = [
    'Booking Ref',
    'Status',
    'Created At',
    'Party Date',
    'Party Time Slot',
    'Package Name',
    'Attending Kids',
    'Birthday Child',
    'Age Turning',
    'Parent / Contact Name',
    'Parent Phone',
    'Parent Email',
    'Rate Per Kid (£)',
    'Base Package Subtotal (£)',
    'Add-ons Subtotal (£)',
    'Combo Discount (£)',
    'Grand Total Payable (£)',
    'Dietary & Allergy Alerts',
    'Catering Mains Breakdown',
    'Catering Drinks Summary',
    'Selected Extras & Add-ons',
    'Staff Internal Notes',
    'Booking Source'
  ];

  const padMasterRow = (items: (string | number | undefined | null)[]): string => {
    const row = [...items];
    while (row.length < MASTER_HEADERS.length) {
      row.push('');
    }
    return row.map(escapeCSV).join(',');
  };

  const headerBlock: string[] = [];

  if (format === 'executive') {
    headerBlock.push(
      padMasterRow(['PLAYGOLF NORTHWICK PARK — KIDS BIRTHDAY PARTIES & EVENTS REGISTER']),
      padMasterRow([
        'Report Generated:',
        `${genDateStr} at ${genTimeStr}`,
        'Total Bookings:',
        bookings.length,
        'Attending Children:',
        `${totalKids} Kids`,
        'Gross Pipeline Value:',
        `£${totalGrand.toFixed(2)}`
      ]),
      padMasterRow([
        'Filter Applied:',
        filterDesc,
        'Database Sync:',
        'Supabase Cloud + Local Storage',
        'Currency:',
        'GBP (£ Sterling)',
        'Venue:',
        'Playgolf Northwick Park, Harrow HA0 3TQ'
      ]),
      padMasterRow([''])
    );
  }

  const dataRows = bookings.map(b => {
    const baseSubtotal = (b.baseTotal !== undefined && b.baseTotal !== null) 
      ? b.baseTotal 
      : ((b.pricePerKid || 0) * (b.kidsCount || 0));
    const extrasSubtotal = b.extrasTotal || 0;
    const comboDiscount = b.discountAmount || 0;
    const grandTotal = b.total || (baseSubtotal + extrasSubtotal);

    const formattedCreated = b.createdAt
      ? new Date(b.createdAt).toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      : 'Recent';

    const allergiesText = (b.allergiesNote && b.allergiesNote.trim() && b.allergiesNote.toLowerCase() !== 'none')
      ? `⚠️ ALERT: ${b.allergiesNote.trim()}`
      : 'None reported';

    const extrasText = b.extrasNames && b.extrasNames.length > 0
      ? b.extrasNames.join('; ')
      : 'None';

    const sourceText = b.source === 'web_form' 
      ? 'Website Inquiry Form' 
      : b.source === 'phone_inquiry' 
        ? 'Phone Inquiry' 
        : 'Manual Staff Entry';

    return [
      escapeCSV(b.id),
      escapeCSV(b.status),
      escapeCSV(formattedCreated),
      escapeCSV(b.partyDate || 'TBC'),
      escapeCSV(b.partyTime || 'TBC'),
      escapeCSV(b.packageName || 'Birthday Party Package'),
      escapeCSV(b.kidsCount || 0),
      escapeCSV(b.childName || 'Birthday Child'),
      escapeCSV(b.childAge ? `${b.childAge} years old` : 'TBC'),
      escapeCSV(b.parentName || 'Parent / Guardian'),
      formatPhoneForCSV(b.parentPhone),
      escapeCSV(b.parentEmail || 'N/A'),
      escapeCSV((b.pricePerKid || 0).toFixed(2)),
      escapeCSV(baseSubtotal.toFixed(2)),
      escapeCSV(extrasSubtotal.toFixed(2)),
      escapeCSV(comboDiscount.toFixed(2)),
      escapeCSV(grandTotal.toFixed(2)),
      escapeCSV(allergiesText),
      escapeCSV(formatCateringMainsSummary(b.selectedMains, b.kidsCount)),
      escapeCSV(formatCateringDrinksSummary(b.selectedDrinks, b.kidsCount)),
      escapeCSV(extrasText),
      escapeCSV(b.staffNotes || 'None'),
      escapeCSV(sourceText)
    ].join(',');
  });

  const totalsRow = [
    escapeCSV(`TOTALS (${bookings.length} BOOKINGS)`),
    '""', // Status
    '""', // Created
    '""', // Party Date
    '""', // Party Time
    '""', // Package Name
    escapeCSV(totalKids), // Attending Kids (Col 6)
    '""', // Child
    '""', // Age
    '""', // Parent Name
    '""', // Phone
    '""', // Email
    '""', // Rate Per Kid
    escapeCSV(totalBase.toFixed(2)), // Base Subtotal (Col 13)
    escapeCSV(totalExtras.toFixed(2)), // Extras Subtotal (Col 14)
    escapeCSV(totalDiscount.toFixed(2)), // Combo Discount (Col 15)
    escapeCSV(totalGrand.toFixed(2)), // Grand Total (Col 16)
    '""', // Allergies
    '""', // Mains
    '""', // Drinks
    '""', // Extras
    '""', // Notes
    '""'  // Source
  ].join(',');

  const csvContent = [
    ...headerBlock,
    MASTER_HEADERS.map(escapeCSV).join(','),
    ...dataRows,
    padMasterRow(['']),
    totalsRow
  ].join('\r\n');

  const defaultFilename = format === 'table-only'
    ? `Playgolf_Party_Bookings_Table_${dateStamp}_${timeStamp}.csv`
    : `Playgolf_Party_Bookings_Executive_Report_${dateStamp}_${timeStamp}.csv`;

  triggerBrowserCSVDownload(options.customFilename || defaultFilename, csvContent);
}

export function exportKitchenRunSheetCSV(bookings: BookingRecord[], filterDescription?: string): void {
  exportBookingsToCSV(bookings, { format: 'kitchen', filterDescription });
}
