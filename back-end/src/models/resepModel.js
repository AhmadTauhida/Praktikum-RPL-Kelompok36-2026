import { supabase } from "../config/supabaseClient.js";

export const ResepModel = {
  async getAll() {
    const { data, error } = await supabase
      .from("resep")
      .select(`*, pengguna (username)`);
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("resep")
      .select(`*, pengguna (username)`)
      .eq("id_resep", id)
      .single(); // single() karena kita hanya butuh 1 object, bukan array
    if (error) throw error;
    return data;
  },

  async create(payload) {
    const { data, error } = await supabase
      .from("resep")
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, payload) {
    const { data, error } = await supabase
      .from("resep")
      .update(payload)
      .eq("id_resep", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { data, error } = await supabase
      .from("resep")
      .delete()
      .eq("id_resep", id)
      .select(); // Tambahkan select() jika ingin mengembalikan data yang dihapus
    if (error) throw error;
    return data;
  }
};