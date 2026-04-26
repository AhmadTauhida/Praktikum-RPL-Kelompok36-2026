import express from "express";
import { DetailPlannerController } from "../controllers/detailPlannerController.js";

const router = express.Router();
router.get("/:plannerId", DetailPlannerController.getByPlannerId);
router.post("/", DetailPlannerController.create);

export default router;