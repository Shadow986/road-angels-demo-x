import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dvvhowefcurdjqvmyfll.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2dmhvd2VmY3VyZGpxdm15ZmxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNjk2NTgsImV4cCI6MjA5Mzc0NTY1OH0.-0lLQ-f3afw9hhkSDSyrh1xTaVwgtTBoQO2JDwEoMik'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
