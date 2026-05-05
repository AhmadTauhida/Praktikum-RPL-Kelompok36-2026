import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  // 1. Ekstraksi token dari header Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Jika tidak ada token sama sekali
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: "Akses ditolak: Token tidak ditemukan." 
    });
  }

  try {
    // 2. Verifikasi token
    // Pastikan process.env.JWT_SECRET sudah terisi di .env
    const secret = process.env.JWT_SECRET || "kunci_rahasia_sistem_absolut_123";
    const verified = jwt.verify(token, secret);

    // 3. Simpan data user ke dalam object request (req.user)
    // Ini yang akan digunakan oleh PenggunaController.getProfile nanti
    req.user = verified; 
    
    next(); 
  } catch (err) {
    console.error("JWT Verification Error:", err.message);

    // Jika token kedaluwarsa, kirim 401 agar frontend (Vue) otomatis logout
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        error: "Sesi telah berakhir (Expired)", 
        expiredAt: err.expiredAt 
      });
    }

    // Untuk error lainnya (token palsu/dimanipulasi), kirim 403
    res.status(403).json({ 
      success: false, 
      error: "Token tidak valid", 
      detail: err.message 
    });
  }
};