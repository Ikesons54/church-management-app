import React from 'react';
import { Card, Radio, Space } from 'antd';

const AttendanceMethods = ({ onMethodSelect }) => {
  return (
    <Card title="Select Attendance Method">
      <Radio.Group onChange={(e) => onMethodSelect(e.target.value)}>
        <Space direction="vertical">
          <Radio value="manual">Manual Entry</Radio>
          <Radio value="qrcode">QR Code Scanning</Radio>
          <Radio value="cardswipe">Card Swipe</Radio>
          <Radio value="facial">Facial Recognition</Radio>
        </Space>
      </Radio.Group>
    </Card>
  );
}; 