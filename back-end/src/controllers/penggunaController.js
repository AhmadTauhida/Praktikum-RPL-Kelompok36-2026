import { PenggunaModel } from "../models/penggunaModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "kunci_rahasia_sistem_absolut_123";

export const PenggunaController = {
  async getAll(req, res) {
    try {
      const pengguna = await PenggunaModel.getAll();
      res.status(200).json({ success: true, data: pengguna });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async register(req, res) {
    try {
      // 1. Ekstraksi SELURUH data bungkusan payload klien
      // Pastikan nama variabel ini persis dengan yang dikirim dari axios di frontend
      const { 
        username, 
        email, 
        password, 
        berat_badan, 
        tinggi_badan, 
        tanggal_lahir, 
        gender // Pastikan kolom di Supabase bernama 'gender' (huruf kecil semua lebih aman)
      } = req.body;

      // Pengujian integritas properti wajib dasar
      if (!username || !email || !password) {
        return res.status(400).json({ 
          success: false, 
          error: "Format muatan melanggar spesifikasi: Username, email, dan sandi absolut." 
        });
      }

      // Validasi anomali duplikasi
      const penggunaEksisting = await PenggunaModel.getByEmail(email);
      if (penggunaEksisting) {
        return res.status(409).json({ success: false, error: "Identitas email sudah terdaftar di dalam sistem." });
      }

      // Enkripsi kata sandi
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // 2. Injeksi formasi struktur data LENGKAP untuk Supabase
      const payloadBaru = { 
        username, 
        email, 
        password: hashedPassword,
        berat_badan,
        tinggi_badan,
        tanggal_lahir,
        gender,
        role: 'user' // Default role
      };
      
      const penggunaBaru = await PenggunaModel.create(payloadBaru);
      
      // Eliminasi properti sandi dari respons
      delete penggunaBaru.password;

      res.status(201).json({ success: true, data: penggunaBaru });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }

    // Contoh sisipan logika di fungsi Register
const hariSeminggu = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Siapkan data bungkusan (payload) untuk 7 hari sekaligus
const plannerPayload = hariSeminggu.map(hari => ({
  id_pengguna: id_pengguna_baru, // ID user yang baru saja selesai register
  hari: hari,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}));

// Lakukan bulk insert ke Supabase
const { error: plannerError } = await supabase
  .from('meal_planner')
  .insert(plannerPayload);

if (plannerError) {
  console.error("Gagal men-generate hari untuk user baru:", plannerError);
  // Tangani error jika diperlukan
}
  },

  

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, error: "Kredensial login (Email dan sandi) wajib diisi." });
      }

      const pengguna = await PenggunaModel.getByEmail(email);
      if (!pengguna) {
        return res.status(401).json({ success: false, error: "Kredensial tertolak: Email tidak ditemukan." });
      }

      const sandiValid = await bcrypt.compare(password, pengguna.password);
      if (!sandiValid) {
        return res.status(401).json({ success: false, error: "Kredensial tertolak: Kata sandi tidak valid." });
      }

      // 3. PENYEMPURNAAN: Sertakan 'role' dalam token JWT
      const token = jwt.sign(
        { 
          id: pengguna.id_pengguna, 
          email: pengguna.email,
          role: pengguna.role // Informasi role masuk ke token
        }, 
        JWT_SECRET, 
        { expiresIn: "24h" }
      );

      // 4. PENYEMPURNAAN: Kirim 'role' ke Frontend untuk disimpan di localStorage
      res.status(200).json({ 
        success: true, 
        message: "Otorisasi berhasil.", 
        token: token,
        data: { 
          id: pengguna.id_pengguna, 
          username: pengguna.username, 
          email: pengguna.email,
          role: pengguna.role // Dibutuhkan oleh router.beforeEach
        }
      });

    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async remove(req, res) {
    try {
      const hasil = await PenggunaModel.remove(req.params.id);
      res.status(200).json({ success: true, data: hasil });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
};