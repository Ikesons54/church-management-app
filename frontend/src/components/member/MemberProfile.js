import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Space, 
  message, 
  Modal,
  Divider,
  Typography,
  Row,
  Col 
} from 'antd';
import { 
  QrcodeOutlined, 
  DownloadOutlined, 
  SaveOutlined,
  ShareOutlined 
} from '@ant-design/icons';
import { QRCodeGenerator } from '../../utils/QRCodeGenerator';

const { Title, Text } = Typography;

const MemberProfile = ({ memberData }) => {
  const [qrCode, setQrCode] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    generateQRCode();
  }, [memberData]);

  const generateQRCode = async () => {
    try {
      const qrCodeURL = await QRCodeGenerator.generateMemberQR(memberData);
      setQrCode(qrCodeURL);
    } catch (error) {
      message.error('Error generating QR code');
    }
  };

  // Save QR code to phone's wallet/passes
  const saveToWallet = async () => {
    try {
      const passData = {
        organizationName: "Your Church Name",
        description: "Member ID Card",
        qrCode: qrCode,
        member: memberData
      };
      // Generate Apple Wallet pass
      const applePass = await import('../../utils/walletPasses').then(m => m.generateApplePass(passData));
      
      // Generate Google Pay pass 
      const googlePass = await import('../../utils/walletPasses').then(m => m.generateGooglePass(passData));
      // Detect device type and offer appropriate pass
      const userAgent = navigator.userAgent.toLowerCase();
      const isIOS = () => /iphone|ipad|ipod/.test(userAgent);
      const isAndroid = () => /android/.test(userAgent);

      if (isIOS()) {
        window.location.href = applePass;
      } else if (isAndroid()) {
        window.location.href = googlePass;
      } else {
        // Fallback to downloading image
        downloadQRCode();
      }

      message.success('QR Code saved to wallet');
    } catch (error) {
      message.error('Error saving to wallet');
      // Fallback to downloading image
      downloadQRCode();
    }
  };

  // Download QR code as image
  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.download = `member-qr-${memberData.id}.png`;
    link.href = qrCode;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('QR Code downloaded successfully');
  };

  // Share QR code
  const shareQRCode = async () => {
    if (navigator.share) {
      try {
        const blob = await fetch(qrCode).then(r => r.blob());
        const file = new File([blob], 'member-qr.png', { type: 'image/png' });
        
        await navigator.share({
          title: 'My Member QR Code',
          text: 'My church member QR code for attendance',
          files: [file]
        });
      } catch (error) {
        message.error('Error sharing QR code');
      }
    } else {
      // Fallback for browsers that don't support sharing
      downloadQRCode();
    }
  };

  return (
    <Card title="Member Profile">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Row gutter={[16, 16]}>
          <Col span={16}>
            <Title level={4}>{memberData.firstName} {memberData.lastName}</Title>
            <Text>Member ID: {memberData.id}</Text>
          </Col>
          <Col span={8} style={{ textAlign: 'right' }}>
            <Button 
              type="primary" 
              icon={<QrcodeOutlined />}
              onClick={() => setShowQRModal(true)}
            >
              View QR Code
            </Button>
          </Col>
        </Row>

        <Modal
          title="Your Member QR Code"
          visible={showQRModal}
          onCancel={() => setShowQRModal(false)}
          footer={[
            <Button 
              key="wallet" 
              icon={<SaveOutlined />}
              onClick={saveToWallet}
            >
              Save to Wallet
            </Button>,
            <Button 
              key="download" 
              icon={<DownloadOutlined />}
              onClick={downloadQRCode}
            >
              Download
            </Button>,
            <Button 
              key="share" 
              type="primary" 
              icon={<ShareOutlined />}
              onClick={shareQRCode}
            >
              Share
            </Button>
          ]}
        >
          <div style={{ textAlign: 'center' }}>
            {qrCode && (
              <>
                <img 
                  src={qrCode} 
                  alt="Member QR Code" 
                  style={{ maxWidth: '100%', marginBottom: 16 }}
                />
                <Divider />
                <Text type="secondary">
                  Present this QR code for attendance marking at church services
                </Text>
              </>
            )}
          </div>
        </Modal>
      </Space>
    </Card>
  );
};

export default MemberProfile; 