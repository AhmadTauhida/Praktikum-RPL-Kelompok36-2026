import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // <-- TAMBAHKAN INI

// 1. Proses penyerapan ekstensi utilitas rute sistem terdesentralisasi
import penggunaRoutes from "./routes/penggunaRoutes.js";
import mealPlannerRoutes from "./routes/mealPlannerRoutes.js";
import resepRoutes from "./routes/resepRoutes.js";
import detailPlannerRoutes from "./routes/detailPlannerRoutes.js"; // <-- TAMBAHKAN .js

// 2. Operasi penggalian kunci rahasia dari relung .env untuk proses otorisasi komputasi
dotenv.config();
const app = express();

// 3. Aktivasi fasilitator piranti lunak lapisan perantara (Middleware) Global
app.use(cors()); // <-- WAJIB: Agar Vue.js (port 5173) bisa akses Express (port 3000)
app.use(express.json());

// 4. Proses merakit struktur dan registrasi sub-modul pemetaan matriks tautan URL sistem
app.use("/api/pengguna", penggunaRoutes);
app.use("/api/meal-planner", mealPlannerRoutes);
app.use("/api/resep", resepRoutes);
app.use("/api/detail-planner", detailPlannerRoutes); 


// 5. Resolusi penyelarasan frekuensi alokasi ketersediaan terminal port komunikasi.
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Orkestrasi arsitektur subsistem backend telah bersiaga di terminal port transmisi: ${port}`);
});

// 6. Eksportase variabel tumpuan sistem
export default app;