import express from "express";
import { PenggunaController } from "../controllers/penggunaController.js";

const router = express.Router();

// Pemetaan akar rute "/" ke instruksi pembacaan massal komprehensif
router.get("/", PenggunaController.getAll);
// Pemetaan permohonan injeksi formasi struktur data pengguna
router.post("/", PenggunaController.create);
// Penyusunan parameter wildcard penampung ID spesifik (/:id) untuk operasi penghapusan selektif
router.delete("/:id", PenggunaController.remove);

export default router;