import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Space, 
  message, 
  Modal, 
  Typography,
  Tabs,
  Badge 
} from 'antd';
import { 
  QrcodeOutlined, 
  ReloadOutlined, 
  SaveOutlined,
  ShareOutlined,
  SecurityScanOutlined
} from '@ant-design/icons';
import { QRCodeSecurity } from '../../utils/QRCodeSecurity';
import { WalletPassGenerator } from '../../utils/WalletPassGenerator';
import { isIOS, isAndroid } from '../../utils/deviceUtils';
import { QRCodeGenerator } from '../../utils/QRCodeGenerator';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const DigitalMemberID = ({ memberData }) => {
  const [qrCode, setQrCode] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [refreshTimer, setRefreshTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    generateNewQRCode();
    return () => clearInterval(refreshTimer);
  }, []);

  const generateNewQRCode = async () => {
    try {
      // Generate secure QR code
      const secureData = QRCodeSecurity.generateSecureQR(memberData);
      const qrCodeURL = await QRCodeGenerator.generateMemberQR(secureData);
      setQrCode(qrCodeURL);

      // Set refresh timer
      setTimeLeft(300); // 5 minutes
      if (refreshTimer) clearInterval(refreshTimer);
      
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            generateNewQRCode();
            return 300;
          }
          return prev - 1;
        });
      }, 1000);
      
      setRefreshTimer(timer);
    } catch (error) {
      message.error('Error generating QR code');
    }
  };

  const saveToDevice = async () => {
    try {
      if (isIOS()) {
        const applePass = await WalletPassGenerator.generateApplePass(memberData, qrCode);
        window.location.href = applePass;
      } else if (isAndroid()) {
        const googlePass = await WalletPassGenerator.generateGooglePass(memberData, qrCode);
        window.location.href = googlePass;
      } else {
        // Download as image for desktop
        const link = document.createElement('a');
        link.download = `member-qr-${memberData.id}.png`;
        link.href = qrCode;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      message.success('Digital ID saved successfully');
    } catch (error) {
      message.error('Error saving digital ID');
    }
  };

  return (
    <Card>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <Title level={4}>Digital Member ID</Title>
          <Text type="secondary">
            Use this QR code for attendance at all church services
          </Text>
        </div>

        <Button 
          type="primary" 
          icon={<QrcodeOutlined />} 
          block
          onClick={() => setShowQRModal(true)}
        >
          Show QR Code
        </Button>

        <Modal
          title="Your Digital Member ID"
          visible={showQRModal}
          onCancel={() => setShowQRModal(false)}
          footer={[
            <Button 
              key="refresh" 
              icon={<ReloadOutlined />}
              onClick={generateNewQRCode}
            >
              Refresh QR
            </Button>,
            <Button 
              key="save" 
              type="primary" 
              icon={<SaveOutlined />}
              onClick={saveToDevice}
            >
              Save to Device
            </Button>
          ]}
        >
          <Tabs defaultActiveKey="qr">
            <TabPane 
              tab={
                <span>
                  <QrcodeOutlined />
                  QR Code
                </span>
              } 
              key="qr"
            >
              <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }}>
                <Badge.Ribbon 
                  text={`Refreshes in ${Math.floor(timeLeft/60)}:${(timeLeft%60).toString().padStart(2, '0')}`}
                  color="blue"
                >
                  <div style={{ padding: '20px', background: '#f0f2f5' }}>
                    {qrCode && (
                      <img 
                        src={qrCode} 
                        alt="Member QR Code" 
                        style={{ maxWidth: '100%' }}
                      />
                    )}
                  </div>
                </Badge.Ribbon>
                <Text type="secondary">
                  QR Code refreshes automatically every 5 minutes for security
                </Text>
              </Space>
            </TabPane>
            <TabPane 
              tab={
                <span>
                  <SecurityScanOutlined />
                  Security Info
                </span>
              } 
              key="security"
            >
              <Space direction="vertical">
                <Text>Member ID: {memberData.id}</Text>
                <Text>Name: {memberData.firstName} {memberData.lastName}</Text>
                <Text>Last Generated: {new Date().toLocaleString()}</Text>
                <Text type="secondary">
                  This QR code is encrypted and changes regularly for security.
                </Text>
              </Space>
            </TabPane>
          </Tabs>
        </Modal>
      </Space>
    </Card>
  );
};

export default DigitalMemberID; 