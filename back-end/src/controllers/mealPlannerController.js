import { MealPlannerModel } from "../models/mealPlannerModel.js";

export const MealPlannerController = {
  async getAll(req, res) {
    try {
      const planner = await MealPlannerModel.getAll();
      res.status(200).json({ success: true, data: planner });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },
  async create(req, res) {
    try {
      const plannerBaru = await MealPlannerModel.create(req.body);
      res.status(201).json({ success: true, data: plannerBaru });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
};