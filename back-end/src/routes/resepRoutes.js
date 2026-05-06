import express from "express";
import multer from "multer"; // <-- Import multer
import { ResepController } from "../controllers/resepController.js";
import { verifyToken } from "../middleware/authMiddleware.js"; 

const router = express.Router();

// Konfigurasi Multer untuk menyimpan file di memory (RAM) sementara
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", ResepController.getAll);
router.get("/:id", ResepController.getById);

// Sisipkan upload.single('image') setelah verifikasi token
router.post("/", verifyToken, upload.single('image'), ResepController.create);
router.put("/:id", verifyToken, upload.single('image'), ResepController.update);
router.delete("/:id", verifyToken, ResepController.remove);

export default router;