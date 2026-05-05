import { supabase } from "../config/supabaseClient.js";

export const DetailPlannerModel = {
  // Di dalam detailPlannerModel.js
async getByPlannerId(plannerId) {
  const { data, error } = await supabase
    .from("detail_planner")
    // Tambahkan img_url di dalam kurung resep (...)
    .select(`id_detail, waktu, resep ( id_resep, nama_resep, kalori, protein, bahan, img_url )`) 
    .eq("id_planner", plannerId);
  if (error) throw error;
  return data;
},
  async create(payload) {
    const { data, error } = await supabase.from("detail_planner").insert([payload]).select().single();
    if (error) throw error;
    return data;
  },
  async update (id, payload) {
    const { data, error } = await supabase.from("detail_planner").update(payload).eq("id_detail", id).select().single();
    if (error) throw error;
    return data;
  },
  async delete (id) {
    const { data, error } = await supabase.from("detail_planner").delete().eq("id_detail", id).select().single();
    if (error) throw error;
    return data;
  }
};