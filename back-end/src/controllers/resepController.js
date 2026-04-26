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
  async create(req, res) {
    try {
      const resepBaru = await ResepModel.create(req.body);
      res.status(201).json({ success: true, data: resepBaru });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
};