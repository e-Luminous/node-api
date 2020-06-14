let mongoose = require('mongoose');
let validator = require('validator');

let userSchema = new mongoose.Schema = {
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
}

// dpcument middleware
userSchema.pre('save', function(next) {
  this.userName = this.email.match(/^([^@]*)@/)[1];
  next();
});

// Export User model
module.exports = mongoose.model('User', userSchema);