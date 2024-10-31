import { AES, enc } from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';

export class QRCodeSecurity {
  static generateSecureQR(memberData) {
    const timestamp = Date.now();
    const nonce = uuidv4();
    
    // Create secure payload
    const payload = {
      mid: memberData.id,
      name: `${memberData.firstName} ${memberData.lastName}`,
      ts: timestamp,
      nonce,
      type: 'member'
    };

    // Encrypt payload
    const encrypted = AES.encrypt(
      JSON.stringify(payload),
      process.env.REACT_APP_QR_SECRET_KEY
    ).toString();

    // Create verification hash
    const verificationData = `${memberData.id}-${timestamp}-${nonce}`;
    const verificationHash = AES.encrypt(
      verificationData,
      process.env.REACT_APP_QR_VERIFICATION_KEY
    ).toString();

    return {
      data: encrypted,
      hash: verificationHash,
      exp: timestamp + (24 * 60 * 60 * 1000) // 24 hours expiry
    };
  }

  static validateQRCode(qrData) {
    try {
      // Decrypt payload
      const bytes = AES.decrypt(qrData.data, process.env.REACT_APP_QR_SECRET_KEY);
      const decrypted = JSON.parse(bytes.toString(enc.Utf8));

      // Check expiry
      if (Date.now() > qrData.exp) {
        throw new Error('QR Code has expired');
      }

      // Verify hash
      const verificationData = `${decrypted.mid}-${decrypted.ts}-${decrypted.nonce}`;
      const verificationBytes = AES.decrypt(
        qrData.hash,
        process.env.REACT_APP_QR_VERIFICATION_KEY
      );
      const verified = verificationBytes.toString(enc.Utf8) === verificationData;

      if (!verified) {
        throw new Error('Invalid QR Code');
      }

      return decrypted;
    } catch (error) {
      console.error('QR validation error:', error);
      throw error;
    }
  }
} 