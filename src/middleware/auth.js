const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Ελέγχουμε αν υπάρχει το Header "Authorization" και ξεκινάει με "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Παίρνουμε το token (το χωρίζουμε από τη λέξη "Bearer")
      token = req.headers.authorization.split(' ')[1];

      // Αποκωδικοποίηση
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Βρίσκουμε τον χρήστη και τον αποθηκεύουμε στο req.user (χωρίς τον κωδικό)
      req.user = await User.findById(decoded.id).select('-password');

      next(); 
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, error: 'Not authorized, no token' });
  }
};

module.exports = { protect };