import { PenggunaModel } from "../models/penggunaModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabaseClient.js"; // Pastikan ini sudah diimpor untuk logika meal planner

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
      const { 
        username, email, password, berat_badan, 
        tinggi_badan, tanggal_lahir, gender 
      } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ 
          success: false, 
          error: "Username, email, dan password wajib diisi." 
        });
      }

      const penggunaEksisting = await PenggunaModel.getByEmail(email);
      if (penggunaEksisting) {
        return res.status(409).json({ success: false, error: "Email sudah terdaftar." });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const payloadBaru = { 
        username, email, password: hashedPassword,
        berat_badan, tinggi_badan, tanggal_lahir, gender,
        role: req.body.role || 'user'
      };
      
      const penggunaBaru = await PenggunaModel.create(payloadBaru);
      const id_pengguna_baru = penggunaBaru.id_pengguna;

      // --- LOGIKA MEAL PLANNER (Pindahkan ke DALAM blok TRY) ---
      const hariSeminggu = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const plannerPayload = hariSeminggu.map(hari => ({
        id_pengguna: id_pengguna_baru,
        hari: hari,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      // Pastikan import { supabase } from "../config/supabaseClient.js" sudah ada di atas
      const { error: plannerError } = await supabase
        .from('meal_planner')
        .insert(plannerPayload);

      if (plannerError) {
        console.error("Gagal generate meal planner:", plannerError);
        // Tetap lanjut karena user sudah berhasil dibuat
      }

      delete penggunaBaru.password;
      // Respon dikirim PALING TERAKHIR
      return res.status(201).json({ success: true, data: penggunaBaru });

    } catch (err) {
      return res.status(400).json({ success: false, error: err.message });
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
      await PenggunaModel.update(pengguna.id_pengguna, { 
      updated_at: new Date().toISOString() 
    })

      // 3. PENYEMPURNAAN: Sertakan 'role' dalam token JWT
      const token = jwt.sign(
        { 
          id: pengguna.id_pengguna, 
          email: pengguna.email,
          role: pengguna.role // Informasi role masuk ke token
        }, 
        JWT_SECRET, 
        { expiresIn: "12h" }
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

  async getProfile(req, res) {
    try {
      // req.user.id didapatkan dari token JWT yang sudah di-decode oleh middleware
      const userId = req.user.id; 
      const pengguna = await PenggunaModel.getById(userId);
      
      if (!pengguna) {
        return res.status(404).json({ success: false, error: "Data pengguna tidak ditemukan." });
      }

      // Jangan kirim password ke frontend!
      delete pengguna.password;
      
      res.status(200).json({ success: true, data: pengguna });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  // Mengupdate data profil
  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const payloadUpdate = req.body; // Data baru dari form Edit Profile di Vue

      // Pastikan user tidak bisa mengubah password atau role melalui endpoint ini sembarangan
      delete payloadUpdate.password;
      delete payloadUpdate.role;
      delete payloadUpdate.id_pengguna; 

      payloadUpdate.updated_at = new Date().toISOString();

      const updatedUser = await PenggunaModel.update(userId, payloadUpdate);
      delete updatedUser.password;

      res.status(200).json({ success: true, data: updatedUser, message: "Profil berhasil diperbarui." });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
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