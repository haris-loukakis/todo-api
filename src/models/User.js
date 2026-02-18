const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // Δεν επιτρέπει 2 χρήστες με το ίδιο email
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true // Κρατάει πότε δημιουργήθηκε ο χρήστης
});

// Πριν αποθηκευτεί ο χρήστης, κρυπτογράφησε τον κωδικό
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Συνάρτηση για να ελέγχουμε αν ο κωδικός είναι σωστός
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);