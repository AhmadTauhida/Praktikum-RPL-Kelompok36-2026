import { ResepModel } from "../models/resepModel.js";

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
      // Melakukan pembedahan data bungkusan payload klien
      const { id_pengguna, nama_resep, deskripsi, bahan, langkah, kalori, protein, img_url, prep_time } = req.body;

      // Pengujian integritas properti wajib (sesuai indikator NOT NULL di skema database)
      if (!id_pengguna || !nama_resep || !bahan || !langkah || kalori === undefined || protein === undefined) {
        return res.status(400).json({ 
          success: false, 
          error: "Format muatan melanggar spesifikasi: id_pengguna, nama_resep, bahan, langkah, kalori, dan protein absolut." 
        });
      }

      const payloadBaru = {
        id_pengguna,
        nama_resep,
        deskripsi: deskripsi || null,
        bahan, // Disimpan sebagai JSON/Array
        langkah, // Disimpan sebagai JSON/Array
        kalori,
        protein,
        img_url: img_url || null,
        prep_time: prep_time || null
      };

      const resepBaru = await ResepModel.create(payloadBaru);
      res.status(201).json({ success: true, data: resepBaru });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  async update(req, res) {
    try {
      const id = req.params.id;
      const payloadUpdate = req.body;
      
      // Menginjeksi waktu pembaruan secara otomatis
      payloadUpdate.updated_at = new Date().toISOString();

      const resepDiperbarui = await ResepModel.update(id, payloadUpdate);
      res.status(200).json({ success: true, data: resepDiperbarui });
    } catch (err) {
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