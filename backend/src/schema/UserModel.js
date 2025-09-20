const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: ""},
  phone: { type: String, default: ""},
  organization: { type: String, default: ""},
  address: { type: String, default: ""},
  tier: { 
    type: String, 
    enum: ["free", "pro", "expired"], 
    required: true, 
    default: "free" 
  },
  freeTrialEnds: { type: Date, default: null } 

});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);