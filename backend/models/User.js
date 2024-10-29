const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'staff', 'member'],
    default: 'member'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  birthday: {
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12
    },
    day: {
      type: Number,
      required: true,
      min: 1,
      max: 31
    }
  },
  nationality: {
    type: String,
    required: true,
    enum: [
      'Afghan', 'Albanian', 'Algerian', 'American', 'Andorran', 'Angolan', 
      'Argentine', 'Armenian', 'Australian', 'Austrian', 'Azerbaijani', 'Bahamian',
      'Bahraini', 'Bangladeshi', 'Barbadian', 'Belarusian', 'Belgian', 'Belizean',
      'Beninese', 'Bhutanese', 'Bolivian', 'Brazilian', 'British', 'Bruneian',
      'Bulgarian', 'Burkinabe', 'Burundian', 'Cambodian', 'Cameroonian', 'Canadian',
      'Cape Verdean', 'Chadian', 'Chilean', 'Chinese', 'Colombian', 'Congolese',
      'Costa Rican', 'Croatian', 'Cuban', 'Cypriot', 'Czech', 'Danish', 'Dominican',
      'Dutch', 'Ecuadorian', 'Egyptian', 'Emirian', 'English', 'Ethiopian', 'Fijian',
      'Filipino', 'Finnish', 'French', 'Gabonese', 'Gambian', 'Georgian', 'German',
      'Ghanaian', 'Greek', 'Grenadian', 'Guatemalan', 'Haitian', 'Honduran',
      'Hungarian', 'Icelandic', 'Indian', 'Indonesian', 'Iranian', 'Iraqi', 'Irish',
      'Israeli', 'Italian', 'Ivorian', 'Jamaican', 'Japanese', 'Jordanian',
      'Kazakhstani', 'Kenyan', 'Korean', 'Kuwaiti', 'Lebanese', 'Liberian',
      'Libyan', 'Lithuanian', 'Malaysian', 'Mexican', 'Moroccan', 'Mozambican',
      'Namibian', 'Nepalese', 'New Zealand', 'Nigerian', 'Norwegian', 'Pakistani',
      'Panamanian', 'Paraguayan', 'Peruvian', 'Polish', 'Portuguese', 'Romanian',
      'Russian', 'Rwandan', 'Saudi', 'Scottish', 'Senegalese', 'Serbian',
      'Singaporean', 'Slovak', 'South African', 'Spanish', 'Sri Lankan', 'Sudanese',
      'Swedish', 'Swiss', 'Syrian', 'Taiwanese', 'Tanzanian', 'Thai', 'Togolese',
      'Tunisian', 'Turkish', 'Ugandan', 'Ukrainian', 'Uruguayan', 'Venezuelan',
      'Vietnamese', 'Welsh', 'Zambian', 'Zimbabwean'
    ]
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  baptism: {
    status: {
      type: String,
      enum: ['not baptized', 'baptized', 'planning to be baptized'],
      default: 'not baptized'
    },
    types: [{
      type: String,
      enum: ['water baptism', 'immersion baptism']
    }],
    date: {
      type: Date
    },
    place: {
      type: String
    },
    minister: {
      type: String
    },
    certificate: {
      type: String  // URL or file path to baptism certificate
    },
    notes: {
      type: String
    }
  },
  ministries: [{
    name: String,
    role: String,
    startDate: Date
  }],
  profileImage: {
    type: String,
    default: 'default-profile.jpg'
  },
  lastLogin: {
    type: Date
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate password reset token
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

// Get full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('User', userSchema);
