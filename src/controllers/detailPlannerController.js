import { DetailPlannerModel } from "../models/detailPlannerModel.js";

export const DetailPlannerController = {
  async getByPlannerId(req, res) {
    try {
      const rincian = await DetailPlannerModel.getByPlannerId(req.params.plannerId);
      res.status(200).json({ success: true, data: rincian });
    } catch (err) {
      res.status(404).json({ success: false, error: err.message });
    }
  },
  async create(req, res) {
    try {
      const detailBaru = await DetailPlannerModel.create(req.body);
      res.status(201).json({ success: true, data: detailBaru });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
};