import { PenggunaModel } from "../models/penggunaModel.js";

export const PenggunaController = {
  async getAll(req, res) {
    try {
      const pengguna = await PenggunaModel.getAll();
      res.status(200).json({ success: true, data: pengguna });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async create(req, res) {
    try {
      // Melakukan pembedahan data bungkusan payload klien dari kerangka muatan (req.body)
      const { username, email, password } = req.body;

      // Pengujian integritas properti wajib: Memblokir proses jika klien mengirim anomali rumpang
      if (!username || !email || !password) {
        return res.status(400).json({ 
          success: false, 
          error: "Format muatan melanggar spesifikasi: Username, email, dan sandi absolut." 
        });
      }

      const penggunaBaru = await PenggunaModel.create(req.body);
      res.status(201).json({ success: true, data: penggunaBaru });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
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