import express from "express";
import { MealPlannerController } from "../controllers/mealPlannerController.js";

const router = express.Router();
router.get("/", MealPlannerController.getAll);
router.post("/", MealPlannerController.create);

export default router;