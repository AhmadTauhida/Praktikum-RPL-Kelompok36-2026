import express from "express";
import { PenggunaController } from "../controllers/penggunaController.js";

const router = express.Router();

// Pemetaan akar rute "/" ke instruksi pembacaan massal komprehensif
router.get("/", PenggunaController.getAll);

// RUTE BARU: Pemetaan permohonan registrasi (Injeksi data tersandi)
router.post("/register", PenggunaController.register);

// RUTE BARU: Pemetaan autentikasi sesi (Penerbitan Token)
router.post("/login", PenggunaController.login);

// Penyusunan parameter wildcard penampung ID spesifik (/:id) untuk operasi penghapusan selektif
router.delete("/:id", PenggunaController.remove);

export default router;