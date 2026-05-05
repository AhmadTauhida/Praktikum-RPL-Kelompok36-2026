import { supabase } from "../config/supabaseClient.js";

export const MealPlannerModel = {
  // 1. Ambil Planner + Detail + Data Resep khusus untuk user yang login
  async getByUser(id_pengguna) {
    const { data, error } = await supabase
      .from("meal_planner")
      .select(`
        id_planner, 
        hari, 
        detail_planner (
          id_detail, 
          waktu, 
          resep (
            id_resep, 
            nama_resep, 
            kalori, 
            protein, 
            img_url
          )
        )
      `)
      .eq("id_pengguna", id_pengguna);
      
    if (error) throw error;
    return data;
  },

  // 2. Buat kerangka Hari (Senin-Minggu)
  async createDay(payload) {
    const { data, error } = await supabase.from("meal_planner").insert([payload]).select().single();
    if (error) throw error;
    return data;
  },

  // ==========================================
  // FUNGSI BARU UNTUK DETAIL PLANNER (RESEP)
  // ==========================================

  // 3. Tambah resep ke slot waktu tertentu (Breakfast/Lunch/Dinner)
  async addRecipeToSlot(payload) {
    const { data, error } = await supabase.from("detail_planner").insert([payload]).select().single();
    if (error) throw error;
    return data;
  },

  // 4. Hapus resep dari slot waktu tertentu
  async removeRecipeFromSlot(id_detail) {
    const { data, error } = await supabase.from("detail_planner").delete().eq("id_detail", id_detail).select().single();
    if (error) throw error;
    return data;
  }
};