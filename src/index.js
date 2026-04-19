import express from "express";
import dotenv from "dotenv";

// 1. Proses penyerapan ekstensi utilitas rute sistem terdesentralisasi
import penggunaRoutes from "./routes/penggunaRoutes.js";
import mealPlannerRoutes from "./routes/mealPlannerRoutes.js";

// 2. Operasi penggalian kunci rahasia dari relung .env untuk proses otorisasi komputasi
dotenv.config();
const app = express();

// 3. Aktivasi fasilitator piranti lunak lapisan perantara (Middleware) Global
// express.json() adalah mekanisme mutlak yang membelah aliran struktur data buffer mentah 
// input Postman milik klien menjadi pemodelan objek murni Javascript yang legal.
app.use(express.json());

// 4. Proses merakit struktur dan registrasi sub-modul pemetaan matriks tautan URL sistem
app.use("/api/pengguna", penggunaRoutes);
app.use("/api/meal-planners", mealPlannerRoutes);

// 5. Resolusi penyelarasan frekuensi alokasi ketersediaan terminal port komunikasi.
// Menjalankan fallback prioritas: proses env Vercel diutamakan; lokalisme instans 3000 disusulkan.
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Orkestrasi arsitektur subsistem backend telah bersiaga di terminal port transmisi: ${port}`);
});

// 6. Eksportase variabel tumpuan sistem untuk asimilasi instrumen perakitan Serverless pada lingkungan awan.
export default app;