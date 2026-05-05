import { createClient } from '@supabase/supabase-js'

// Gunakan variabel lingkungan (VITE_) agar aman dan mudah diganti
// Pastikan variabel ini sudah ada di file .env kamu
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Inisialisasi client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)