import React from 'react';
import QRCode from 'qrcode.react';
import { Card, Button, Space, Typography, message } from 'antd';
import { QrcodeOutlined, DownloadOutlined } from '@ant-design/icons';
import { encryptEventData } from '../../utils/encryption';

const { Title, Text } = Typography;

const QRCodeGenerator = ({ event }) => {
  const generateQRData = () => {
    const qrData = {
      eventId: event.id,
      name: event.name,
      timestamp: new Date().getTime(),
      validUntil: new Date(event.endDate).getTime()
    };
    
    return encryptEventData(qrData);
  };

  const downloadQR = () => {
    const canvas = document.getElementById('event-qr-code');
    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
    
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `${event.name}-qr.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    message.success('QR Code downloaded successfully');
  };

  return (
    <Card>
      <Space direction="vertical" align="center" style={{ width: '100%' }}>
        <Title level={4}>Event QR Code</Title>
        <QRCode
          id="event-qr-code"
          value={generateQRData()}
          size={256}
          level="H"
          includeMargin={true}
          imageSettings={{
            src: '/church-logo.png',
            height: 24,
            width: 24,
            excavate: true
          }}
        />
        <Text type="secondary">Scan this code to mark attendance</Text>
        <Button 
          icon={<DownloadOutlined />} 
          onClick={downloadQR}
          type="primary"
        >
          Download QR Code
        </Button>
      </Space>
    </Card>
  );
};

export default QRCodeGenerator; 