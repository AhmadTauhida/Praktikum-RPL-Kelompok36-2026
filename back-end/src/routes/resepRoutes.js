import express from "express";
import { ResepController } from "../controllers/resepController.js";

const router = express.Router();
router.get("/", ResepController.getAll);
router.post("/", ResepController.create);

export default router;