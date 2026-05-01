import { ResepModel } from "../models/resepModel.js";

export const ResepController = {
  async getAll(req, res) {
    try {
      const resep = await ResepModel.getAll();
      res.status(200).json({ success: true, data: resep });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const id = req.params.id; // Mengambil ID dari URL
      const resep = await ResepModel.getById(id);
      res.status(200).json({ success: true, data: resep });
    } catch (err) {
      // Jika error karena data tidak ditemukan, supabase akan throw error PGN...
      res.status(404).json({ success: false, error: err.message });
    }
  },

  async create(req, res) {
    try {
      const resepBaru = await ResepModel.create(req.body);
      res.status(201).json({ success: true, data: resepBaru });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  async update(req, res) {
    try {
      const id = req.params.id;
      const resepUpdate = await ResepModel.update(id, req.body);
      res.status(200).json({ success: true, data: resepUpdate });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const id = req.params.id;
      await ResepModel.delete(id);
      res.status(200).json({ success: true, message: "Resep berhasil dihapus" });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
};