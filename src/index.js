import express from "express";
import dotenv from "dotenv";

// 1. Proses penyerapan ekstensi utilitas rute sistem terdesentralisasi
import penggunaRoutes from "./routes/penggunaRoutes.js";
import mealPlannerRoutes from "./routes/mealPlannerRoutes.js";
import resepRoutes from "./routes/resepRoutes.js"; // <-- Import resep cukup di sini saja

// 2. Operasi penggalian kunci rahasia dari relung .env untuk proses otorisasi komputasi
dotenv.config();
const app = express();

// 3. Aktivasi fasilitator piranti lunak lapisan perantara (Middleware) Global
app.use(express.json());

// 4. Proses merakit struktur dan registrasi sub-modul pemetaan matriks tautan URL sistem
app.use("/api/pengguna", penggunaRoutes);
app.use("/api/meal-planners", mealPlannerRoutes);
app.use("/api/resep", resepRoutes); // <-- Route resep didaftarkan

// 5. Resolusi penyelarasan frekuensi alokasi ketersediaan terminal port komunikasi.
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Orkestrasi arsitektur subsistem backend telah bersiaga di terminal port transmisi: ${port}`);
});

// 6. Eksportase variabel tumpuan sistem
export default app;