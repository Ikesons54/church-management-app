import { QRCodeSecurity } from './QRCodeSecurity';

export class AttendanceVerification {
  static async verifyAttendance(qrData, serviceInfo) {
    try {
      // Validate QR code
      const memberData = QRCodeSecurity.validateQRCode(qrData);

      // Check if attendance already marked
      const existingAttendance = await fetch(
        `/api/attendance/check?memberId=${memberData.mid}&serviceId=${serviceInfo.id}`
      );
      
      if (existingAttendance.ok) {
        throw new Error('Attendance already marked');
      }

      // Mark attendance
      const response = await fetch('/api/attendance/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: memberData.mid,
          serviceId: serviceInfo.id,
          timestamp: Date.now(),
          verificationHash: qrData.hash
        })
      });

      if (!response.ok) throw new Error('Failed to mark attendance');

      return await response.json();
    } catch (error) {
      console.error('Attendance verification error:', error);
      throw error;
    }
  }

  static async verifyOnlineAttendance(memberId, serviceInfo, verificationCode) {
    try {
      const response = await fetch('/api/attendance/verify-online', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId,
          serviceId: serviceInfo.id,
          verificationCode,
          timestamp: Date.now()
        })
      });

      if (!response.ok) throw new Error('Invalid verification code');

      return await response.json();
    } catch (error) {
      console.error('Online attendance verification error:', error);
      throw error;
    }
  }
} 