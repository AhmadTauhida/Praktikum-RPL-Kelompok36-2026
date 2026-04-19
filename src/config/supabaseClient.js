import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
// dotenv.config() mengebor kedalaman hierarki folder untuk memompakan sandi dari berkas.env
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Pelindung Anomali Inisiasi: Sistem akan melakukan terminasi (Crash) jika rahasia gagal diekstraksi
if (!supabaseUrl |
    