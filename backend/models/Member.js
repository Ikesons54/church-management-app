const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const memberSchema = new mongoose.Schema({
  membershipId: {
    type: String,
    unique: true,
    required: true
  },
  personalInfo: {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    middleName: String,
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: true
    },
    dateOfBirth: {
      type: Date,
      required: true
    },
    maritalStatus: {
      type: String,
      enum: ['single', 'married', 'widowed', 'divorced']
    },
    occupation: String,
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: true
    },
    alternatePhone: String,
    photo: String
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  churchInfo: {
    dateJoined: {
      type: Date,
      required: true
    },
    membershipStatus: {
      type: String,
      enum: ['active', 'inactive', 'transferred', 'deceased'],
      default: 'active'
    },
    role: {
      type: String,
      enum: [
        'member', 
        'deacon', 
        'deaconess', 
        'elder', 
        'presiding_elder', 
        'pastor',
        'senior_pastor',  // Added senior pastor role
        'associate_pastor', // Added associate pastor role
        'assistant_pastor'  // Added assistant pastor role
      ],
      default: 'member'
    },
    pastoralInfo: {
      ordinationDate: Date,
      position: {
        type: String,
        enum: [
          'senior_pastor',
          'associate_pastor',
          'assistant_pastor',
          'youth_pastor',
          'worship_pastor'
        ]
      },
      credentials: {
        licenseNumber: String,
        issuedDate: Date,
        expiryDate: Date,
        issuingBody: String
      },
      specializations: [{
        type: String,
        enum: [
          'counseling',
          'youth_ministry',
          'worship',
          'evangelism',
          'teaching',
          'administration',
          'missions'
        ]
      }],
      education: [{
        institution: String,
        degree: String,
        field: String,
        graduationYear: Number,
        certificateUrl: String
      }],
      previousAssignments: [{
        churchName: String,
        position: String,
        startDate: Date,
        endDate: Date,
        location: String
      }]
    },
    leadershipResponsibilities: [{
      title: String,
      description: String,
      startDate: Date,
      endDate: Date,
      status: {
        type: String,
        enum: ['active', 'completed', 'transferred'],
        default: 'active'
      }
    }],
    baptismStatus: {
      isBaptized: {
        type: Boolean,
        default: false
      },
      baptismDate: Date,
      baptismPlace: String,
      baptizedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member'
      }
    },
    department: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department'
    }],
    previousChurch: String
  },
  family: {
    spouseName: String,
    marriageDate: Date,
    children: [{
      name: String,
      dateOfBirth: Date,
      gender: String
    }],
    nextOfKin: {
      name: String,
      relationship: String,
      phone: String,
      address: String
    }
  },
  attendance: [{
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    },
    date: Date,
    status: {
      type: String,
      enum: ['present', 'absent', 'excused'],
      default: 'present'
    }
  }],
  contributions: [{
    type: {
      type: String,
      enum: ['tithe', 'offering', 'special_offering', 'project_offering'],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    receipt: String
  }],
  notes: [{
    title: String,
    content: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    visibility: {
      type: String,
      enum: ['private', 'leadership', 'public'],
      default: 'private'
    }
  }],
  account: {
    username: {
      type: String,
      unique: true,
      sparse: true
    },
    password: String,
    isActive: {
      type: Boolean,
      default: true
    },
    lastLogin: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
  },
  pastoralActivities: [{
    type: {
      type: String,
      enum: [
        'sermon',
        'counseling_session',
        'wedding',
        'funeral',
        'baptism',
        'home_visit',
        'hospital_visit',
        'prayer_meeting'
      ]
    },
    date: Date,
    description: String,
    attendees: Number,
    location: String,
    notes: String,
    followUpRequired: Boolean,
    followUpDate: Date,
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'postponed'],
      default: 'scheduled'
    }
  }],
  sermons: [{
    title: String,
    date: Date,
    scripture: String,
    summary: String,
    audioUrl: String,
    videoUrl: String,
    documentUrl: String,
    tags: [String],
    attendance: Number,
    feedback: [{
      member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member'
      },
      rating: Number,
      comment: String,
      date: Date
    }]
  }]
}, {
  timestamps: true
});

// Indexes
memberSchema.index({ 'personalInfo.firstName': 1, 'personalInfo.lastName': 1 });
memberSchema.index({ 'personalInfo.email': 1 });
memberSchema.index({ membershipId: 1 });
memberSchema.index({ 'churchInfo.membershipStatus': 1 });
memberSchema.index({ 'churchInfo.role': 1 });
memberSchema.index({ 'churchInfo.pastoralInfo.position': 1 });

// Virtual for full name
memberSchema.virtual('fullName').get(function() {
  return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`;
});

// Pre-save middleware to hash password
memberSchema.pre('save', async function(next) {
  if (this.account.password && this.isModified('account.password')) {
    this.account.password = await bcrypt.hash(this.account.password, 10);
  }
  next();
});

// Method to check password
memberSchema.methods.checkPassword = async function(password) {
  return await bcrypt.compare(password, this.account.password);
};

// Method to generate membership ID
memberSchema.statics.generateMembershipId = async function() {
  const year = new Date().getFullYear().toString().substr(-2);
  const count = await this.countDocuments();
  const sequence = (count + 1).toString().padStart(4, '0');
  return `COP${year}${sequence}`;
};

// Add method to check if member is a pastor
memberSchema.methods.isPastor = function() {
  return ['pastor', 'senior_pastor', 'associate_pastor', 'assistant_pastor'].includes(this.churchInfo.role);
};

// Add method to get pastoral statistics
memberSchema.methods.getPastoralStats = async function() {
  const stats = {
    totalSermons: this.sermons.length,
    totalCounseling: this.pastoralActivities.filter(a => a.type === 'counseling_session').length,
    totalBaptisms: this.pastoralActivities.filter(a => a.type === 'baptism').length,
    totalVisits: this.pastoralActivities.filter(a => ['home_visit', 'hospital_visit'].includes(a.type)).length,
    averageAttendance: this.sermons.reduce((acc, sermon) => acc + (sermon.attendance || 0), 0) / this.sermons.length
  };
  return stats;
};

const Member = mongoose.model('Member', memberSchema);

module.exports = Member; 