import React, { useState, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';
import { Card, message, Button } from 'antd';

const EventScanner = ({ eventId }) => {
  const [scanning, setScanning] = useState(false);

  const handleScan = async (data) => {
    if (data) {
      try {
        // Process QR code data
        const response = await fetch('/api/events/check-in', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            eventId,
            qrData: data,
          }),
        });

        if (response.ok) {
          message.success('Check-in successful!');
        } else {
          message.error('Check-in failed');
        }
      } catch (error) {
        message.error('Error processing QR code');
      }
    }
  };

  return (
    <Card title="Event Check-in Scanner">
      {scanning ? (
        <QrReader
          onResult={handleScan}
          style={{ width: '100%' }}
          constraints={{ facingMode: 'environment' }}
        />
      ) : (
        <Button onClick={() => setScanning(true)}>
          Start Scanning
        </Button>
      )}
    </Card>
  );
};

export default EventScanner; 