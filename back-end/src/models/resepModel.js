import { supabase } from "../config/supabaseClient.js";

export const ResepModel = {
  async getAll() {
    const { data, error } = await supabase
     .from("resep")
     .select(`*, pengguna (username)`);
    if (error) throw error;
    return data;
  },
  async create(payload) {
    const { data, error } = await supabase.from("resep").insert([payload]).select().single();
    if (error) throw error;
    return data;
  }
};