import { createClient } from '@supabase/supabase-js'

// Try to get from env, if not, use the strings directly
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://iswujfklzqvyescfahmf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlzd3VqZmtsenF2eWVzY2ZhaG1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzM4ODcsImV4cCI6MjA4OTkwOTg4N30.7hPZJvf2b1UJEjAsLjUtVNde3whuxJ0Vp18ARe8wpOQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);