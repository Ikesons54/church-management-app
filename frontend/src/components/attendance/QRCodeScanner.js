import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { Card, message } from 'antd';

const QRCodeScanner = ({ onScan }) => {
  const [scanning, setScanning] = useState(true);

  const handleScan = async (data) => {
    if (data) {
      try {
        const memberData = JSON.parse(data);
        await onScan(memberData);
        message.success('Attendance marked successfully');
      } catch (error) {
        message.error('Invalid QR code');
      }
    }
  };

  return (
    <Card title="QR Code Scanner">
      <QrReader
        onResult={handleScan}
        style={{ width: '100%' }}
        constraints={{ facingMode: 'environment' }}
      />
    </Card>
  );
}; 