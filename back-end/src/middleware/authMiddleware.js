import jwt from 'jsonwebtoken'; // Pastikan ini sudah di-import ya!

export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) return res.status(401).json({ error: "Akses ditolak" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; 
    next(); 
  } catch (err) {
    // TAMBAHKAN CONSOLE LOG INI
    console.error("Detail Error JWT:", err.message); 
    res.status(403).json({ error: "Token tidak valid", detail: err.message });
  }
};