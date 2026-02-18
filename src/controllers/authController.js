const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Βοηθητική συνάρτηση για δημιουργία Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Signup 
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.create({ name, email, password });
    
    // Χρήση της βοηθητικής συνάρτησης
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// --- ΝΕΟ: Login ---
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Έλεγχος αν υπάρχει ο χρήστης
    const user = await User.findOne({ email });
    
    // Έλεγχος αν ο κωδικός ταιριάζει
    if (user && (await user.matchPassword(password))) {
      
      res.json({
        success: true,
        token: generateToken(user._id),
        user: { id: user._id, name: user.name, email: user.email }
      });
      
    } else {
      res.status(401).json({ success: false, error: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
exports.logout = async (req, res) => {
  res.status(200).json({
    success: true,
    data: {}
  });
};