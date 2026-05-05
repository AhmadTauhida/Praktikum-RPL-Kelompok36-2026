import { supabase } from "../config/supabaseClient.js";

export const ResepModel = {
  async getAll() {
    const { data, error } = await supabase.from("resep").select("*");
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase.from("resep").select("*").eq("id_resep", id).single();
    // Supabase mengembalikan error 'PGRST116' jika tidak ada baris yang ditemukan
    if (error && error.code !== "PGRST116") throw error;
    return data || null;
  },

  // Fungsi tambahan yang akan sangat berguna untuk mengambil resep milik user tertentu
  async getByUserId(id_pengguna) {
    const { data, error } = await supabase.from("resep").select("*").eq("id_pengguna", id_pengguna);
    if (error) throw error;
    return data;
  },

  async create(payload) {
    const { data, error } = await supabase.from("resep").insert([payload]).select().single();
    if (error) throw error;
    return data;
  },

  async update(id, payload) {
    const { data, error } = await supabase.from("resep").update(payload).eq("id_resep", id).select().single();
    if (error) throw error;
    return data;
  },

  async remove(id) {
    const { error } = await supabase.from("resep").delete().eq("id_resep", id);
    if (error) throw error;
    return { message: "Entitas resep berhasil dilikuidasi." };
  }
};