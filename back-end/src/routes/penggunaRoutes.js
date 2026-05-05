// routes/penggunaRoutes.js
import express from "express";
import { PenggunaController } from "../controllers/penggunaController.js";

const router = express.Router();

// Public Routes (Bisa diakses tanpa login)
router.post("/register", PenggunaController.register);
router.post("/login", PenggunaController.login);

// Private Routes (Misal untuk admin atau list user)
router.get("/", PenggunaController.getAll);
router.delete("/:id", PenggunaController.remove);

export default router;