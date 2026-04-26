import { PenggunaModel } from "../models/penggunaModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Definisikan secret key untuk JWT (Idealnya disimpan di file .env)
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

  // FUNGSI REGISTER: Menggantikan fungsi create() untuk keamanan tingkat lanjut
  async register(req, res) {
    try {
      // Melakukan pembedahan data bungkusan payload klien
      const { username, email, password } = req.body;

      // Pengujian integritas properti wajib
      if (!username || !email || !password) {
        return res.status(400).json({ 
          success: false, 
          error: "Format muatan melanggar spesifikasi: Username, email, dan sandi absolut." 
        });
      }

      // Validasi anomali duplikasi: Memastikan email belum memiliki entitas di database
      const penggunaEksisting = await PenggunaModel.getByEmail(email);
      if (penggunaEksisting) {
        return res.status(409).json({ success: false, error: "Identitas email sudah terdaftar di dalam sistem." });
      }

      // Enkripsi kata sandi menggunakan mekanisme hashing bcrypt
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Injeksi formasi struktur data dengan sandi yang sudah tersandi
      const payloadBaru = { username, email, password: hashedPassword };
      const penggunaBaru = await PenggunaModel.create(payloadBaru);

      // Eliminasi properti sandi dari respons demi keamanan
      delete penggunaBaru.password;

      res.status(201).json({ success: true, data: penggunaBaru });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  // FUNGSI LOGIN: Mekanisme autentikasi dan penerbitan akses token
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, error: "Kredensial login (Email dan sandi) wajib diisi." });
      }

      // 1. Ekstraksi entitas pengguna berdasarkan email
      const pengguna = await PenggunaModel.getByEmail(email);
      if (!pengguna) {
        return res.status(401).json({ success: false, error: "Kredensial tertolak: Email tidak ditemukan." });
      }

      // 2. Komparasi sandi telanjang dari klien dengan sandi terenkripsi di database
      const sandiValid = await bcrypt.compare(password, pengguna.password);
      if (!sandiValid) {
        return res.status(401).json({ success: false, error: "Kredensial tertolak: Kata sandi tidak valid." });
      }

      // 3. Penerbitan token otorisasi (JWT)
      const token = jwt.sign(
        { id: pengguna.id_pengguna, email: pengguna.email }, 
        JWT_SECRET, 
        { expiresIn: "24h" } // Masa berlaku token
      );

      res.status(200).json({ 
        success: true, 
        message: "Otorisasi berhasil.", 
        token: token,
        data: { id: pengguna.id_pengguna, username: pengguna.username, email: pengguna.email }
      });

    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async remove(req, res) {
    try {
      // req.params.id mengekstraksi nomor token dari konfigurasi perutean URL dinamis (/:id)
      const hasil = await PenggunaModel.remove(req.params.id);
      res.status(200).json({ success: true, data: hasil });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
};