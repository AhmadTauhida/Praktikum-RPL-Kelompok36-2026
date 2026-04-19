import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// dotenv.config() mengebor kedalaman hierarki folder untuk memompakan sandi dari bawah
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Pelindung Anomali Inisiasi: Sistem akan melakukan terminasi (Crash) jika rahasia tidak ada
if (!supabaseUrl || !supabaseKey) {
  console.error("Interupsi Fatal: SUPABASE_URL atau SUPABASE_KEY menguap dari peredaran sistem.");
  process.exit(1);
}

// Pengeksporan entitas klien untuk dimanipulasi oleh lapisan Models
export const supabase = createClient(supabaseUrl, supabaseKey);