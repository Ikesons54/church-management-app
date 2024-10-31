import moment from 'moment';

export const VERIFICATION_RULES = {
  REQUIRED_FIELDS: {
    personalInfo: {
      firstName: 'First Name',
      lastName: 'Last Name',
      birthday: 'Birthday',
      maritalStatus: 'Marital Status',
      nationality: 'Nationality'
    },
    contactInfo: {
      phone: 'Phone Number',
      email: 'Email Address',
      address: 'Address'
    },
    churchInfo: {
      waterBaptism: 'Water Baptism Status',
      holyGhostBaptism: 'Holy Ghost Baptism Status'
    },
    emergencyContact: {
      isOptional: true,
      fields: {
        name: 'Emergency Contact Name',
        phone: 'Emergency Contact Phone',
        relationship: 'Emergency Contact Relationship'
      }
    }
  },
  
  VALIDATION_RULES: {
    phone: {
      pattern: /^[0-9+\s-]+$/,
      message: 'Invalid phone number format'
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Invalid email format'
    },
    birthday: {
      validate: (value) => moment().diff(moment(value), 'years') >= 18,
      message: 'Member must be at least 18 years old'
    }
  }
};

export const checkMemberCompletion = (member) => {
  const requiredFields = {
    personalInfo: {
      firstName: 'First Name',
      lastName: 'Last Name',
      birthday: 'Birthday',
      maritalStatus: 'Marital Status',
      nationality: 'Nationality'
    },
    contactInfo: {
      phone: 'Phone Number',
      email: 'Email Address',
      address: 'Address'
    },
    churchInfo: {
      waterBaptism: 'Water Baptism Status',
      holyGhostBaptism: 'Holy Ghost Baptism Status'
    }
  };

  const missingFields = [];
  const incompleteCategories = [];

  // Check Personal Information
  Object.entries(requiredFields.personalInfo).forEach(([field, label]) => {
    if (!member[field]) {
      missingFields.push(label);
      if (!incompleteCategories.includes('Personal Information')) {
        incompleteCategories.push('Personal Information');
      }
    }
  });

  // Check Contact Information
  Object.entries(requiredFields.contactInfo).forEach(([field, label]) => {
    if (!member[field]) {
      missingFields.push(label);
      if (!incompleteCategories.includes('Contact Information')) {
        incompleteCategories.push('Contact Information');
      }
    }
  });

  // Check Church Information
  Object.entries(requiredFields.churchInfo).forEach(([field, label]) => {
    if (member[field] === undefined || member[field] === null) {
      missingFields.push(label);
      if (!incompleteCategories.includes('Church Information')) {
        incompleteCategories.push('Church Information');
      }
    }
  });

  return {
    isComplete: missingFields.length === 0,
    missingFields,
    incompleteCategories,
    completionPercentage: Math.round(
      ((Object.keys(requiredFields.personalInfo).length +
        Object.keys(requiredFields.contactInfo).length +
        Object.keys(requiredFields.churchInfo).length -
        missingFields.length) /
        (Object.keys(requiredFields.personalInfo).length +
          Object.keys(requiredFields.contactInfo).length +
          Object.keys(requiredFields.churchInfo).length)) *
        100
    )
  };
};

export const validateMemberData = (member) => {
  const errors = [];
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (member.email && !emailRegex.test(member.email)) {
    errors.push('Invalid email format');
  }

  // Phone validation
  const phoneRegex = /^[0-9+\s-]+$/;
  if (member.phone && !phoneRegex.test(member.phone)) {
    errors.push('Invalid phone number format');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const performDetailedVerification = (member) => {
  const basicStatus = checkMemberCompletion(member);
  const validationErrors = [];
  
  // Check validation rules
  Object.entries(VERIFICATION_RULES.VALIDATION_RULES).forEach(([field, rule]) => {
    if (member[field] && rule.pattern && !rule.pattern.test(member[field])) {
      validationErrors.push(rule.message);
    }
    if (rule.validate && !rule.validate(member[field])) {
      validationErrors.push(rule.message);
    }
  });

  return {
    ...basicStatus,
    validationErrors,
    isFullyValid: basicStatus.isComplete && validationErrors.length === 0
  };
}; 