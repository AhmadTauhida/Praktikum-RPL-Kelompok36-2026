import express from "express";
import { PenggunaController } from "../controllers/penggunaController.js";
import { verifyToken } from "../middleware/authMiddleware.js"; // Pastikan ini ada

const router = express.Router();

router.post("/register", PenggunaController.register);
router.post("/login", PenggunaController.login);

// Protected Routes untuk Profile
router.get("/profile", verifyToken, PenggunaController.getProfile);
router.put("/profile", verifyToken, PenggunaController.updateProfile);
router.get("/", verifyToken, PenggunaController.getAll); // Hanya admin yang bisa akses ini, nanti kita cek di controller

export default router;