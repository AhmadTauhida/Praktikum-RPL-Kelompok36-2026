import express from "express";
import { ResepController } from "../controllers/resepController.js";

const router = express.Router();

router.get("/", ResepController.getAll);
router.post("/", ResepController.create);

// Routes baru dengan parameter ID
router.get("/:id", ResepController.getById);
router.put("/:id", ResepController.update); // Bisa juga pakai patch
router.delete("/:id", ResepController.delete);

export default router;