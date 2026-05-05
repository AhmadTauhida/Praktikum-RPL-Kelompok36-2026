// Di dalam detailPlannerRoutes.js
import express from "express";
import { DetailPlannerController } from "../controllers/detailPlannerController.js";
import { verifyToken } from "../middleware/authMiddleware.js"; // <-- Import middleware

const router = express.Router();

// Wajibkan token untuk semua aksi agar hanya pemilik akun yang bisa modifikasi
router.use(verifyToken); 

router.get("/:plannerId", DetailPlannerController.getByPlannerId);
router.post("/", DetailPlannerController.create);
router.put("/:id", DetailPlannerController.update);
router.delete("/:id", DetailPlannerController.delete);

export default router;