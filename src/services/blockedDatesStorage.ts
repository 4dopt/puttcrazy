import { BlockedDateRecord } from '../types';
import { supabase } from './supabaseClient';
import { formatIsoToPartyDate } from '../data';

const STORAGE_KEY = 'playgolf_blocked_dates_v1';
export const UPDATE_BLOCKED_DATES_EVENT = 'playgolf_blocked_dates_updated';

// Calculate an upcoming Saturday for initial sample blocked date
function getInitialSampleBlockedDates(): BlockedDateRecord[] {
  const d = new Date();
  // Find a weekend day ~12 days in the future
  d.setDate(d.getDate() + 12);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const isoDate = `${year}-${month}-${day}`;
  const humanDate = formatIsoToPartyDate(isoDate);

  return [
    {
      id: 'BLK-101',
      date: humanDate,
      isoDate: isoDate,
      reason: 'Course Renovation & Private Championship',
      createdAt: new Date().toISOString(),
      createdBy: 'Staff Admin',
      notes: 'Main adventure golf course closed for annual greens maintenance and junior invitational.'
    }
  ];
}

// Read all blocked dates from local storage cache
export function getAllBlockedDates(): BlockedDateRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialSampleBlockedDates();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return getInitialSampleBlockedDates();
  } catch (err) {
    console.error('Failed to load blocked dates from localStorage:', err);
    return getInitialSampleBlockedDates();
  }
}

// Check if a given date string or ISO date is blocked
export function isDateBlocked(dateOrIso: string): { isBlocked: boolean; record?: BlockedDateRecord } {
  if (!dateOrIso) return { isBlocked: false };
  const dates = getAllBlockedDates();
  const normalized = dateOrIso.trim().toLowerCase();

  const record = dates.find(b => {
    if (b.date && b.date.toLowerCase() === normalized) return true;
    if (b.isoDate && b.isoDate.toLowerCase() === normalized) return true;
    // Check if input is formatted date and matches b.date
    if (b.date && normalized.includes(b.date.toLowerCase())) return true;
    return false;
  });

  return {
    isBlocked: !!record,
    record
  };
}

// Add or update a blocked date
export function addBlockedDate(
  dateInput: string,
  reason: string = 'Staff Blocked / Not Available',
  dateISO?: string,
  createdBy: string = 'Staff Admin',
  notes?: string
): BlockedDateRecord {
  const current = getAllBlockedDates();

  // If user passed ISO format (YYYY-MM-DD), compute human date
  let isoDate = dateISO;
  let formattedDate = dateInput;

  if (dateInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
    isoDate = dateInput;
    formattedDate = formatIsoToPartyDate(dateInput);
  } else if (!isoDate && dateInput.includes(',')) {
    // If formatted like "Saturday, 14 Nov", try to leave as is or infer
    formattedDate = dateInput;
  }

  // Check if date is already in blocked list
  const existingIndex = current.findIndex(b => 
    (isoDate && b.isoDate === isoDate) || 
    (b.date.toLowerCase() === formattedDate.toLowerCase())
  );

  const randomNum = Math.floor(100 + Math.random() * 900);
  const newRecord: BlockedDateRecord = {
    id: existingIndex !== -1 ? current[existingIndex].id : `BLK-${randomNum}`,
    date: formattedDate,
    isoDate: isoDate || '',
    reason: reason.trim() || 'Private Event / Unavailable for Parties',
    createdAt: new Date().toISOString(),
    createdBy,
    notes: notes?.trim() || ''
  };

  let updated: BlockedDateRecord[];
  if (existingIndex !== -1) {
    updated = [...current];
    updated[existingIndex] = newRecord;
  } else {
    updated = [newRecord, ...current];
  }

  // Sort by date if isoDate is available
  updated.sort((a, b) => {
    if (a.isoDate && b.isoDate) return a.isoDate.localeCompare(b.isoDate);
    return 0;
  });

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(UPDATE_BLOCKED_DATES_EVENT, { detail: newRecord }));
    }
  } catch (err) {
    console.error('Failed to save blocked date locally:', err);
  }

  // Try saving to Supabase if table exists (non-blocking)
  Promise.resolve(
    supabase.from('blocked_dates').upsert([
      {
        id: newRecord.id,
        date: newRecord.date,
        iso_date: newRecord.isoDate,
        reason: newRecord.reason,
        created_at: newRecord.createdAt,
        created_by: newRecord.createdBy,
        notes: newRecord.notes
      }
    ])
  ).catch(e => {
    console.warn('Optional Supabase blocked_dates save bypassed:', e.message);
  });

  return newRecord;
}

// Remove or unblock a date
export function removeBlockedDate(idOrDate: string): boolean {
  const current = getAllBlockedDates();
  const normalized = idOrDate.trim().toLowerCase();

  const toRemove = current.find(b => 
    b.id.toLowerCase() === normalized || 
    b.date.toLowerCase() === normalized || 
    (b.isoDate && b.isoDate.toLowerCase() === normalized)
  );

  if (!toRemove) return false;

  const filtered = current.filter(b => b.id !== toRemove.id);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(UPDATE_BLOCKED_DATES_EVENT, { detail: { unblockedId: toRemove.id } }));
    }
  } catch (err) {
    console.error('Failed to update localStorage after unblocking:', err);
  }

  // Try deleting from Supabase
  Promise.resolve(
    supabase.from('blocked_dates').delete().eq('id', toRemove.id)
  ).catch(e => {
    console.warn('Optional Supabase blocked_dates delete bypassed:', e.message);
  });

  return true;
}

// Asynchronous fetch from Supabase (syncs with localStorage cache)
export async function fetchBlockedDatesFromSupabase(): Promise<BlockedDateRecord[]> {
  try {
    const { data, error } = await supabase
      .from('blocked_dates')
      .select('*')
      .order('iso_date', { ascending: true });

    if (error) {
      // Table might not exist yet, fallback gracefully to local storage
      return getAllBlockedDates();
    }

    if (data && data.length > 0) {
      const records: BlockedDateRecord[] = data.map((row: any) => ({
        id: row.id,
        date: row.date,
        isoDate: row.iso_date || '',
        reason: row.reason || 'Party Unavailable',
        createdAt: row.created_at || new Date().toISOString(),
        createdBy: row.created_by || 'Staff',
        notes: row.notes || ''
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      return records;
    }

    return getAllBlockedDates();
  } catch (err) {
    console.warn('Network issue reaching Supabase for blocked dates:', err);
    return getAllBlockedDates();
  }
}
