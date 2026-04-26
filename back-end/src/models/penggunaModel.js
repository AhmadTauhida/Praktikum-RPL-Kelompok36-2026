import { supabase } from "../config/supabaseClient.js";

export const PenggunaModel = {
  async getAll() {
    const { data, error } = await supabase.from("pengguna").select("*");
    if (error) throw error;
    return data;
  },
  async getById(id) {
    const { data, error } = await supabase.from("pengguna").select("*").eq("id_pengguna", id).single();
    if (error) throw error;
    return data;
  },
  async create(payload) {
    const { data, error } = await supabase.from("pengguna").insert([payload]).select().single();
    if (error) throw error;
    return data;
  },
  async remove(id) {
    // Proses penghapusan murni dari tabel pengguna, memicu efek kaskade turunan database (ON DELETE CASCADE)
    const { error } = await supabase.from("pengguna").delete().eq("id_pengguna", id);
    if (error) throw error;
    return { message: "Entitas pengguna & sel data terelasi berhasil dilikuidasi." };
  }
};