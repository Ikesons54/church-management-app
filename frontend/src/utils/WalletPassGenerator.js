import { Template } from '@walletpass/pass-js';

export class WalletPassGenerator {
  static async generateApplePass(memberData, qrCode) {
    try {
      const template = new Template('eventTicket', {
        formatVersion: 1,
        passTypeIdentifier: process.env.REACT_APP_APPLE_PASS_TYPE_IDENTIFIER,
        teamIdentifier: process.env.REACT_APP_APPLE_TEAM_IDENTIFIER,
        organizationName: "Your Church Name",
        description: "Member ID Card"
      });

      // Set pass structure
      template.setBarcodes({
        message: qrCode,
        format: 'PKBarcodeFormatQR',
        messageEncoding: 'iso-8859-1'
      });

      // Add member info
      template.primaryFields.push({
        key: 'name',
        label: 'Member',
        value: `${memberData.firstName} ${memberData.lastName}`
      });

      template.secondaryFields.push({
        key: 'memberId',
        label: 'ID',
        value: memberData.id
      });

      // Generate and sign the pass
      const pass = template.createPass({
        serialNumber: memberData.id
      });

      const signedPass = await pass.sign();
      return signedPass;

    } catch (error) {
      console.error('Error generating Apple Wallet pass:', error);
      throw error;
    }
  }

  static async generateGooglePass(memberData, qrCode) {
    try {
      const payload = {
        id: `${process.env.REACT_APP_GOOGLE_ISSUER_ID}.${memberData.id}`,
        classId: `${process.env.REACT_APP_GOOGLE_ISSUER_ID}.member_card`,
        genericType: 'GENERIC_TYPE_UNSPECIFIED',
        hexBackgroundColor: '#FFFFFF',
        logo: {
          sourceUri: {
            uri: `${process.env.REACT_APP_WEBSITE_URL}/logo.png`
          }
        },
        cardTitle: {
          defaultValue: {
            language: 'en',
            value: 'Member Card'
          }
        },
        subheader: {
          defaultValue: {
            language: 'en',
            value: `${memberData.firstName} ${memberData.lastName}`
          }
        },
        header: {
          defaultValue: {
            language: 'en',
            value: memberData.id
          }
        },
        barcode: {
          type: 'QR_CODE',
          value: qrCode
        },
        // Add more fields as needed
      };

      // Sign the payload using Google Pay API
      const response = await fetch('/api/wallet/google-pass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to generate Google Pass');
      
      const { saveUrl } = await response.json();
      return saveUrl;

    } catch (error) {
      console.error('Error generating Google Pay pass:', error);
      throw error;
    }
  }
} 