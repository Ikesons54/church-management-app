import CryptoJS from 'crypto-js';

export const SecurityHelpers = {
  // Generate secure QR token
  generateToken: (memberData) => {
    const payload = {
      memberId: memberData.id,
      timestamp: new Date().getTime(),
      random: CryptoJS.lib.WordArray.random(16).toString(),
      expiry: new Date().getTime() + (5 * 60 * 1000)
    };

    // Encrypt payload
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(payload),
      process.env.REACT_APP_QR_SECRET
    ).toString();

    return encrypted;
  },

  // Verify QR token
  verifyToken: (token) => {
    try {
      // Decrypt token
      const decrypted = CryptoJS.AES.decrypt(
        token,
        process.env.REACT_APP_QR_SECRET
      ).toString(CryptoJS.enc.Utf8);

      const payload = JSON.parse(decrypted);

      // Check expiry
      if (payload.expiry < new Date().getTime()) {
        return {
          valid: false,
          message: 'QR code has expired'
        };
      }

      return {
        valid: true,
        data: payload
      };
    } catch (error) {
      return {
        valid: false,
        message: 'Invalid QR code'
      };
    }
  },

  // Prevent duplicate check-ins
  preventDuplicateCheckIn: async (memberId, eventId) => {
    // Implementation to check if member is already checked in
  },

  // Audit logging
  logActivity: async (activity) => {
    // Implementation to log all scanning activities
  }
}; 