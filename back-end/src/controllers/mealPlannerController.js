import { MealPlannerModel } from "../models/mealPlannerModel.js";
import { supabase } from "../config/supabaseClient.js"; 

export const MealPlannerController = {
  
  // 1. Ambil jadwal, jika kosong langsung buatkan 7 hari
  async getMyPlanner(req, res) {
    try {
      const id_pengguna = req.user.id; 
      let planner = await MealPlannerModel.getByUser(id_pengguna);

      if (!planner || planner.length === 0) {
        console.log(`Jadwal kosong untuk user ${id_pengguna}. Melakukan auto-generate 7 hari...`);
        
        const hariSeminggu = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        
        const plannerPayload = hariSeminggu.map(hari => ({
          id_pengguna: id_pengguna,
          hari: hari,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));

        const { error: insertError } = await supabase.from('meal_planner').insert(plannerPayload);
        if (insertError) throw insertError;

        planner = await MealPlannerModel.getByUser(id_pengguna);
      }

      res.status(200).json({ success: true, data: planner });
      
    } catch (err) {
      console.error("Error di getMyPlanner:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  },

  // 2. Buat Hari (Opsional, tapi biarkan saja)
  async createDay(req, res) {
    try {
      const payload = { ...req.body, id_pengguna: req.user.id };
      const plannerBaru = await MealPlannerModel.createDay(payload);
      res.status(201).json({ success: true, data: plannerBaru });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  // 3. Tambah Resep ke Slot (INI YANG KEMUNGKINAN BIKIN CRASH TADI)
  async addRecipe(req, res) {
    try {
      const { id_planner, id_resep, waktu } = req.body;
      if (!id_planner || !id_resep || !waktu) {
        return res.status(400).json({ success: false, error: "id_planner, id_resep, dan waktu wajib diisi." });
      }

      const detailBaru = await MealPlannerModel.addRecipeToSlot({ id_planner, id_resep, waktu });
      res.status(201).json({ success: true, data: detailBaru });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  // 4. Hapus Resep dari Slot
  async removeRecipe(req, res) {
    try {
      const detailDeleted = await MealPlannerModel.removeRecipeFromSlot(req.params.id_detail);
      res.status(200).json({ success: true, data: detailDeleted });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
};