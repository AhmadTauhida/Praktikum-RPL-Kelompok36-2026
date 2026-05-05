import express from "express";
import { ResepController } from "../controllers/resepController.js";
import { verifyToken } from "../middleware/authMiddleware.js"; 

const router = express.Router();

// Rute PUBLIK: Siapapun (termasuk Guest di Landing page) bisa melihat daftar resep
router.get("/", ResepController.getAll);
router.get("/:id", ResepController.getById);

// Rute PRIVAT: Hanya user/admin yang login yang bisa mengubah data
router.post("/", verifyToken, ResepController.create);
router.put("/:id", verifyToken, ResepController.update);
router.delete("/:id", verifyToken, ResepController.remove);

export default router;