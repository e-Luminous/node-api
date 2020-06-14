let mongoose = require('mongoose');
let validator = require('validator');
let bcrypt = require('bcryptjs');

let userSchema = new mongoose.Schema ({
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  userName: String,
  mobile: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password!'],
    validate: {
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!!!'
    }
  },
  mobileConfirmed: Boolean,
  emailConfirmed: Boolean,
  twoFactorEnabled: Boolean,
  lockOutEnabled: Boolean,
  role: {
    type: String,
    enum: ['student', 'instructor', 'moderator', 'admin'],
    default: 'admin'
  }
});

/***** Document middleware******/

// Password hash with bcrypt
userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  
  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

// get User from email
userSchema.pre('save', function(next) {
  this.userName = this.email.match(/^([^@]*)@/)[1];
  next();
});

// Middleware function
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
}

let User = mongoose.model('User', userSchema);
// Export User model
module.exports = User;
