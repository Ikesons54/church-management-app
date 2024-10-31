import { openDB } from 'idb';
import { QRCodeSecurity } from './QRCodeSecurity';
import { QRCodeGenerator } from './QRCodeGenerator';

export class OfflineQRManager {
  static async initDB() {
    return openDB('memberQRDB', 1, {
      upgrade(db) {
        db.createObjectStore('qrCodes', { keyPath: 'id' });
      }
    });
  }

  static async saveOfflineQR(memberData) {
    try {
      const db = await this.initDB();
      const secureData = QRCodeSecurity.generateSecureQR(memberData);
      const qrCodeURL = await QRCodeGenerator.generateMemberQR(secureData);

      await db.put('qrCodes', {
        id: memberData.id,
        qrCode: qrCodeURL,
        timestamp: Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      });

      return qrCodeURL;
    } catch (error) {
      console.error('Error saving offline QR:', error);
      throw error;
    }
  }

  static async getOfflineQR(memberId) {
    try {
      const db = await this.initDB();
      const qrData = await db.get('qrCodes', memberId);

      if (!qrData || Date.now() > qrData.expiresAt) {
        throw new Error('QR Code expired or not found');
      }

      return qrData.qrCode;
    } catch (error) {
      console.error('Error getting offline QR:', error);
      throw error;
    }
  }
} 