import express from "express";
import { PenggunaController } from "../controllers/penggunaController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// --- PUBLIC ROUTES ---
router.post("/register", PenggunaController.register);
router.post("/login", PenggunaController.login);

// --- PROTECTED ROUTES (USER & ADMIN) ---
// Rute untuk melihat dan mengedit profil diri sendiri
router.get("/profile", verifyToken, PenggunaController.getProfile);
router.put("/profile", verifyToken, PenggunaController.updateProfile);

// --- ADMIN ONLY ROUTES (USER MANAGEMENT) ---
// Perhatikan penggunaan path yang lebih spesifik agar tidak tertukar dengan profil pribadi
router.get("/admin/users", verifyToken, PenggunaController.getAll);

// Jika kamu menggunakan fungsi 'adminUpdateUser' yang saya sarankan sebelumnya:
// router.put("/admin/users/:id", verifyToken, PenggunaController.adminUpdateUser);

// Rute untuk menghapus user oleh admin
router.delete("/admin/users/:id", verifyToken, PenggunaController.remove);

export default router;