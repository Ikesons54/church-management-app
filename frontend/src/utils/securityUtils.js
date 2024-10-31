import { AES, enc } from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

export class SecurityUtils {
  static encryptData(data, key) {
    try {
      return AES.encrypt(JSON.stringify(data), key).toString();
    } catch (error) {
      console.error('Encryption error:', error);
      throw error;
    }
  }

  static decryptData(encryptedData, key) {
    try {
      const bytes = AES.decrypt(encryptedData, key);
      return JSON.parse(bytes.toString(enc.Utf8));
    } catch (error) {
      console.error('Decryption error:', error);
      throw error;
    }
  }

  static generateSessionId() {
    return uuidv4();
  }

  static validateAttendanceData(data) {
    // Basic validation rules
    const required = ['memberId', 'status', 'date', 'serviceType'];
    const errors = [];

    required.forEach(field => {
      if (!data[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    });

    // Validate date format
    if (data.date && !moment(data.date).isValid()) {
      errors.push('Invalid date format');
    }

    // Validate status
    if (data.status && !['present', 'absent', 'excused'].includes(data.status)) {
      errors.push('Invalid status value');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .trim();
  }
} 