import { supabase } from "../config/supabaseClient.js";

export const MealPlannerModel = {
  async getAll() {
    const { data, error } = await supabase
     .from("meal_planner")
     .select(`
        id_planner, hari, created_at,
        pengguna ( id_pengguna, username, email )
      `);
    if (error) throw error;
    return data;
  },
  async create(payload) {
    const { data, error } = await supabase.from("meal_planner").insert([payload]).select().single();
    if (error) throw error;
    return data;
  }
};