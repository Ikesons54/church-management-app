import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';

export class QRCodeGenerator {
  static async generateMemberQR(memberData) {
    const qrData = {
      id: memberData.id,
      type: 'member',
      church: process.env.REACT_APP_CHURCH_ID,
      issued: new Date().toISOString()
    };

    try {
      const qrCodeURL = await QRCode.toDataURL(JSON.stringify(qrData), {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 300,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });

      return qrCodeURL;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw error;
    }
  }

  static async generateMemberCard(memberData, qrCodeURL) {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [54, 86] // Standard card size
    });

    // Add church logo
    doc.addImage('/logo.png', 'PNG', 5, 5, 20, 20);

    // Add member details
    doc.setFontSize(12);
    doc.text('MEMBER CARD', 43, 10, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`${memberData.firstName} ${memberData.lastName}`, 43, 20, { align: 'center' });
    doc.text(`ID: ${memberData.id}`, 43, 25, { align: 'center' });

    // Add QR code
    doc.addImage(qrCodeURL, 'PNG', 28, 30, 30, 30);

    // Add card footer
    doc.setFontSize(8);
    doc.text('This card must be presented for attendance', 43, 65, { align: 'center' });

    return doc;
  }
} 