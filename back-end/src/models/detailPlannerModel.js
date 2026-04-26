import { supabase } from "../config/supabaseClient.js";

export const DetailPlannerModel = {
  async getByPlannerId(plannerId) {
    const { data, error } = await supabase
     .from("detail_planner")
     .select(`id_detail, waktu, resep ( id_resep, nama_resep, kalori, protein, bahan )`)
     .eq("id_planner", plannerId);
    if (error) throw error;
    return data;
  },
  async create(payload) {
    const { data, error } = await supabase.from("detail_planner").insert([payload]).select().single();
    if (error) throw error;
    return data;
  }
};