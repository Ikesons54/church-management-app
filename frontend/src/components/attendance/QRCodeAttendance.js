import React, { useState, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';
import { 
  Card, 
  message, 
  Switch, 
  Space, 
  Select, 
  Button,
  Modal,
  Form,
  Input 
} from 'antd';
import moment from 'moment';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';

const QRCodeAttendance = ({ serviceInfo }) => {
  const [scanning, setScanning] = useState(false);
  const [camera, setCamera] = useState('environment'); // environment or user
  const [scannerLocation, setScannerLocation] = useState('main');
  const [lastScanned, setLastScanned] = useState(null);
  const [showNewMemberForm, setShowNewMemberForm] = useState(false);

  // Scanner locations for physical service
  const scannerLocations = [
    { id: 'main', name: 'Main Entrance' },
    { id: 'side', name: 'Side Entrance' },
    { id: 'hall', name: 'Fellowship Hall' }
  ];

  const handleScan = async (data) => {
    if (data) {
      try {
        // Parse QR code data
        const memberData = JSON.parse(data);
        
        // Call API to mark attendance
        const response = await fetch('/api/attendance/mark', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            memberId: memberData.id,
            serviceId: serviceInfo.serviceType,
            date: serviceInfo.date,
            scannerLocation,
            timestamp: new Date(),
            isOnline: serviceInfo.serviceType.includes('online')
          })
        });

        if (!response.ok) throw new Error('Failed to mark attendance');

        const result = await response.json();

        // Show success message with member name
        message.success(`Attendance marked for ${result.member.firstName} ${result.member.lastName}`);
        
        // Store last scanned member
        setLastScanned(result.member);

        // Play success sound
        new Audio('/sounds/success-beep.mp3').play();

      } catch (error) {
        // If member not found
        if (error.message === 'Member not found') {
          message.warning('Member not found. Register new member?');
          setShowNewMemberForm(true);
        } else {
          message.error('Error marking attendance: ' + error.message);
        }
        // Play error sound
        new Audio('/sounds/error-beep.mp3').play();
      }
    }
  };

  return (
    <ErrorBoundary>
      <Card title="QR Code Scanner">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space>
            <Switch
              checked={scanning}
              onChange={setScanning}
              checkedChildren="Scanner On"
              unCheckedChildren="Scanner Off"
            />
            
            <Select
              value={scannerLocation}
              onChange={setScannerLocation}
              style={{ width: 200 }}
            >
              {scannerLocations.map(loc => (
                <Select.Option key={loc.id} value={loc.id}>
                  {loc.name}
                </Select.Option>
              ))}
            </Select>

            <Button 
              onClick={() => setCamera(
                camera === 'environment' ? 'user' : 'environment'
              )}
            >
              Switch Camera
            </Button>
          </Space>

          {scanning && (
            <QrReader
              onResult={handleScan}
              constraints={{ 
                facingMode: camera,
                aspectRatio: 1
              }}
              style={{ width: '100%', maxWidth: 400 }}
            />
          )}

          {lastScanned && (
            <Card size="small" title="Last Scanned Member">
              <p>{lastScanned.firstName} {lastScanned.lastName}</p>
              <p>ID: {lastScanned.memberId}</p>
              <p>Time: {moment().format('HH:mm:ss')}</p>
            </Card>
          )}

          {/* New Member Registration Modal */}
          <Modal
            title="Register New Member"
            visible={showNewMemberForm}
            onCancel={() => setShowNewMemberForm(false)}
            footer={null}
          >
            <Form
              onFinish={async (values) => {
                // Handle new member registration
                try {
                  const response = await fetch('/api/members/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(values)
                  });
                  
                  if (!response.ok) throw new Error('Failed to register member');
                  
                  message.success('New member registered successfully');
                  setShowNewMemberForm(false);
                } catch (error) {
                  message.error('Error registering member: ' + error.message);
                }
              }}
            >
              {/* Form fields */}
            </Form>
          </Modal>
        </Space>
      </Card>
    </ErrorBoundary>
  );
}; 