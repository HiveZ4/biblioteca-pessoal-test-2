const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ message: 'Token de acesso requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido ou expirado' });
    }
    
    req.user = user; 
    next();
  });
};


const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      email: user.email 
    },
    JWT_SECRET,
    { expiresIn: '24h' } 
  );
};


const generateRefreshToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username 
    },
    JWT_SECRET + '_refresh',
    { expiresIn: '7d' } 
  );
};

module.exports = {
  authenticateToken,
  generateToken,
  generateRefreshToken,
  JWT_SECRET
};

