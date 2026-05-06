import { ResepModel } from "../models/resepModel.js";
import { supabase } from "../config/supabaseClient.js";

export const ResepController = {
  async getAll(req, res) {
    try {
      const resep = await ResepModel.getAll();
      res.status(200).json({ success: true, data: resep });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const resep = await ResepModel.getById(req.params.id);
      if (!resep) {
        return res.status(404).json({ success: false, error: "Entitas resep tidak ditemukan." });
      }
      res.status(200).json({ success: true, data: resep });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async create(req, res) {
    try {
      // 1. Ambil id_pengguna dari Token JWT yang login (Lebih Aman!)
      const id_pengguna = req.user.id; 

      // 2. Ekstraksi data teks dari form
      let { nama_resep, deskripsi, bahan, langkah, kalori, protein, prep_time } = req.body;

      // 3. Parsing JSON String ke Array/Object murni untuk kolom jsonb
      if (typeof bahan === 'string') bahan = JSON.parse(bahan);
      if (typeof langkah === 'string') langkah = JSON.parse(langkah);
    

      // Pengujian integritas properti wajib
      if (!nama_resep || !bahan || !langkah || !kalori || !protein) {
        return res.status(400).json({ 
          success: false, 
          error: "Format muatan melanggar spesifikasi. Data wajib tidak lengkap." 
        });
      }

      let img_url = null;

      // 4. Logika Upload Gambar ke Supabase Storage
      if (req.file) {
        const file = req.file;
        const fileExt = file.originalname.split('.').pop();
        // Buat nama file unik agar tidak bentrok
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `resep_images/${fileName}`;

        // PASTIKAN kamu punya bucket bernama 'recipe_images' di Supabase Storage kamu
        const { error: uploadError } = await supabase.storage
          .from('recipe_images') // <--- Sesuaikan dengan nama bucket kamu di Supabase
          .upload(filePath, file.buffer, {
            contentType: file.mimetype,
          });

        if (uploadError) throw new Error("Gagal mengunggah gambar: " + uploadError.message);

        // Dapatkan URL Publik dari gambar yang baru diupload
        const { data: publicUrlData } = supabase.storage.from('recipe_images').getPublicUrl(filePath);
        img_url = publicUrlData.publicUrl;
      }

      // 5. Susun payload untuk disimpan ke database tabel 'resep'
      const payloadBaru = {
        id_pengguna,
        nama_resep,
        deskripsi: deskripsi || null,
        bahan, 
        langkah, 
        kalori: parseInt(kalori),
        protein: parseFloat(protein),
        img_url: img_url, // URL asli dari Supabase Storage
        prep_time: prep_time ? parseInt(prep_time) : null
      };

      const resepBaru = await ResepModel.create(payloadBaru);
      res.status(201).json({ success: true, data: resepBaru });

    } catch (err) {
      console.error("Crash di create resep:", err);
      res.status(400).json({ success: false, error: err.message });
    }
  },

async update(req, res) {
    try {
      const id_resep = req.params.id;
      const id_pengguna_login = req.user.id; // Dari JWT Token

      // 1. Cek apakah resep ada dan milik pengguna yang sedang login
      const resepLama = await ResepModel.getById(id_resep);
      if (!resepLama) {
        return res.status(404).json({ success: false, error: "Resep tidak ditemukan." });
      }
   

      // 2. Ekstraksi data teks dari form
      let { nama_resep, deskripsi, bahan, langkah, kalori, protein, prep_time } = req.body;
      
      // Siapkan payload awal
      let payloadUpdate = { updated_at: new Date().toISOString() };

      // 3. Masukkan data ke payload HANYA jika data tersebut dikirim (untuk mendukung partial update)
      if (nama_resep) payloadUpdate.nama_resep = nama_resep;
      if (deskripsi !== undefined) payloadUpdate.deskripsi = deskripsi;

      // Parsing tipe data karena dikirim melalui multipart/form-data
      if (bahan) payloadUpdate.bahan = typeof bahan === 'string' ? JSON.parse(bahan) : bahan;
      if (langkah) payloadUpdate.langkah = typeof langkah === 'string' ? JSON.parse(langkah) : langkah;
      if (kalori) payloadUpdate.kalori = parseInt(kalori);
      if (protein) payloadUpdate.protein = parseFloat(protein);
      if (prep_time) payloadUpdate.prep_time = parseInt(prep_time);

      // 4. Logika Upload Gambar Baru (Jika user mengganti foto)
      if (req.file) {
        const file = req.file;
        const fileExt = file.originalname.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `resep_images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('recipe_images')
          .upload(filePath, file.buffer, {
            contentType: file.mimetype,
          });

        if (uploadError) throw new Error("Gagal mengunggah gambar baru: " + uploadError.message);

        const { data: publicUrlData } = supabase.storage.from('recipe_images').getPublicUrl(filePath);
        payloadUpdate.img_url = publicUrlData.publicUrl;
      }

      // 5. Eksekusi Update ke Database
      const resepDiperbarui = await ResepModel.update(id_resep, payloadUpdate);
      res.status(200).json({ success: true, data: resepDiperbarui });

    } catch (err) {
      console.error("Crash di update resep:", err);
      res.status(400).json({ success: false, error: err.message });
    }
  },

  async remove(req, res) {
    try {
      const hasil = await ResepModel.remove(req.params.id);
      res.status(200).json({ success: true, data: hasil });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
};