import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Input, 
  Button, 
  Alert, 
  Space, 
  Row, 
  Col,
  Statistic,
  Divider 
} from 'antd';
import { 
  QrcodeOutlined, 
  UserOutlined, 
  CheckCircleOutlined,
  CloseCircleOutlined 
} from '@ant-design/icons';
import { QrReader } from 'react-qr-reader';

const { Title, Text } = Typography;

const SpecialEventScanner = () => {
  const [eventDetails, setEventDetails] = useState({
    id: '',
    name: '',
    type: '',
    capacity: 0,
    checkedIn: 0,
    requiresRegistration: false
  });

  const [scanResult, setScanResult] = useState(null);
  const [scannerActive, setScannerActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const processCheckIn = async (memberData) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/events/${eventDetails.id}/check-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData)
      });
      
      if (!response.ok) throw new Error('Check-in failed');
      
      setEventDetails(prev => ({
        ...prev,
        checkedIn: prev.checkedIn + 1
      }));

      setScanResult({
        success: true,
        message: 'Successfully checked in!',
        memberData
      });
    } catch (error) {
      setScanResult({
        success: false,
        message: 'Check-in failed: ' + error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const checkRegistration = async (memberId) => {
    try {
      const response = await fetch(`/api/events/${eventDetails.id}/check-registration/${memberId}`);
      return response.ok;
    } catch (error) {
      console.error('Registration check failed:', error);
      return false;
    }
  };

  const handleScan = async (data) => {
    if (data && !loading) {
      try {
        // Verify QR code authenticity
        const decodedData = JSON.parse(atob(data));
        
        // Check if member is registered for event
        const isRegistered = await checkRegistration(decodedData.memberId);
        
        if (isRegistered) {
          await processCheckIn(decodedData);
        } else {
          setScanResult({
            success: false,
            message: 'Member not registered for this event'
          });
        }
      } catch (error) {
        setScanResult({
          success: false,
          message: 'Invalid QR code'
        });
      }
    }
  };

  return (
    <Card>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Title level={4}>
          <QrcodeOutlined /> Event Check-in Scanner
        </Title>

        <Row gutter={16}>
          <Col span={12}>
            <Statistic 
              title="Event Name" 
              value={eventDetails.name || 'N/A'} 
              prefix={<UserOutlined />} 
            />
          </Col>
          <Col span={12}>
            <Statistic 
              title="Attendance" 
              value={eventDetails.checkedIn} 
              suffix={`/ ${eventDetails.capacity}`} 
            />
          </Col>
        </Row>

        <Divider />

        {scannerActive && (
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <QrReader
              onResult={handleScan}
              constraints={{ facingMode: 'environment' }}
              style={{ width: '100%' }}
            />
          </div>
        )}

        {scanResult && (
          <Alert
            message={scanResult.success ? "Check-in Successful" : "Check-in Failed"}
            description={scanResult.message}
            type={scanResult.success ? "success" : "error"}
            showIcon
            icon={scanResult.success ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          />
        )}

        <Button
          type="primary"
          size="large"
          block
          loading={loading}
          onClick={() => setScannerActive(!scannerActive)}
          icon={<QrcodeOutlined />}
          style={{ backgroundColor: '#4B0082' }}
        >
          {scannerActive ? 'Stop Scanner' : 'Start Scanner'}
        </Button>

        {scanResult?.success && scanResult.memberData && (
          <Card size="small">
            <Space direction="vertical">
              <Text strong>Member Details:</Text>
              <Text>ID: {scanResult.memberData.memberId}</Text>
              <Text>Name: {scanResult.memberData.name}</Text>
              <Text>Time: {new Date().toLocaleTimeString()}</Text>
            </Space>
          </Card>
        )}
      </Space>
    </Card>
  );
};

export default SpecialEventScanner; 