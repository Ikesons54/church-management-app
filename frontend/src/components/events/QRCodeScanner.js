import React, { useState, useCallback } from 'react';
import { QrReader } from 'react-qr-reader';
import { 
  Card, 
  Button, 
  Space, 
  Typography, 
  Alert, 
  Modal, 
  message 
} from 'antd';
import { 
  QrcodeOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined 
} from '@ant-design/icons';
import { decryptEventData } from '../../utils/encryption';
import { useDispatch } from 'react-redux';
import { checkInAttendee } from '../../store/slices/eventSlice';

const { Title, Text } = Typography;

const QRCodeScanner = ({ eventId, onScanComplete }) => {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const handleScan = useCallback(async (data) => {
    if (data) {
      try {
        const decryptedData = decryptEventData(data);
        
        // Validate QR code
        if (decryptedData.eventId !== eventId) {
          throw new Error('Invalid event QR code');
        }
        
        if (decryptedData.validUntil < Date.now()) {
          throw new Error('QR code has expired');
        }

        // Process check-in
        const result = await dispatch(checkInAttendee({
          eventId,
          memberId: decryptedData.memberId
        })).unwrap();

        setScanResult(result);
        message.success('Check-in successful!');
        onScanComplete?.(result);
        setScanning(false);
      } catch (error) {
        setError(error.message);
        message.error(error.message);
      }
    }
  }, [eventId, dispatch, onScanComplete]);

  const handleError = (err) => {
    setError('Error accessing camera: ' + err.message);
    message.error('Failed to access camera');
  };

  return (
    <Card>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Title level={4}>
          <QrcodeOutlined /> Event Check-in Scanner
        </Title>

        {error && (
          <Alert
            message="Scanner Error"
            description={error}
            type="error"
            closable
            onClose={() => setError(null)}
          />
        )}

        {scanning ? (
          <div style={{ maxWidth: 400, margin: '0 auto' }}>
            <QrReader
              onResult={handleScan}
              onError={handleError}
              constraints={{ facingMode: 'environment' }}
              style={{ width: '100%' }}
            />
            <Button 
              onClick={() => setScanning(false)}
              danger
              block
              style={{ marginTop: 16 }}
            >
              Stop Scanning
            </Button>
          </div>
        ) : (
          <Button 
            type="primary" 
            icon={<QrcodeOutlined />}
            onClick={() => setScanning(true)}
            block
          >
            Start Scanning
          </Button>
        )}

        {scanResult && (
          <Alert
            message="Check-in Successful"
            description={
              <Space direction="vertical">
                <Text>Member: {scanResult.memberName}</Text>
                <Text>Time: {new Date().toLocaleTimeString()}</Text>
                <Text>Status: {scanResult.status}</Text>
              </Space>
            }
            type="success"
            showIcon
            icon={<CheckCircleOutlined />}
          />
        )}
      </Space>
    </Card>
  );
};

export default QRCodeScanner; 