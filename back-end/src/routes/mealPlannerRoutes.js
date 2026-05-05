import express from "express";
import { MealPlannerController } from "../controllers/mealPlannerController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Semua akses ke Meal Planner WAJIB login
router.use(verifyToken);

// Rute ini harus cocok dengan nama fungsi di Controller
router.get("/", MealPlannerController.getMyPlanner);
router.post("/day", MealPlannerController.createDay);
router.post("/recipe", MealPlannerController.addRecipe); // Tadi crash di sini karena addRecipe-nya undefined
router.delete("/recipe/:id_detail", MealPlannerController.removeRecipe);

export default router;