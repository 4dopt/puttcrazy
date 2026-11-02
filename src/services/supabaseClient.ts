import { createClient } from '@supabase/supabase-js';

// Supabase project credentials
const env = (import.meta as any).env || {};
export const SUPABASE_URL: string = env.VITE_SUPABASE_URL || 'https://oolnbspszqrundiivwfa.supabase.co';
export const SUPABASE_ANON_KEY: string = env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vbG5ic3BzenFydW5kaWl2d2ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM1NDk4NzcsImV4cCI6MjEwOTEyNTg3N30.zYtQRRItfjZlofMfSTvH0_jmTJmRi7iUPxViYXWnyXc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

