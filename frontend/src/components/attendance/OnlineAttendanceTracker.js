import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Tag, Input, message } from 'antd';
import { YoutubeOutlined, FacebookOutlined, ZoomOutlined } from '@ant-design/icons';

const OnlineAttendanceTracker = ({ serviceInfo }) => {
  const [attendanceData, setAttendanceData] = useState({
    youtube: {
      viewers: 0,
      likes: 0,
      comments: 0,
      peakViewers: 0
    },
    facebook: {
      viewers: 0,
      reactions: 0,
      comments: 0,
      shares: 0
    },
    zoom: {
      participants: [],
      totalParticipants: 0,
      peakParticipants: 0
    }
  });

  const [manualEntries, setManualEntries] = useState([]);
  const [verificationCode, setVerificationCode] = useState('');

  // Generate unique service code for verification
  useEffect(() => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setVerificationCode(code);
  }, [serviceInfo]);

  // Columns for manual entry table
  const columns = [
    {
      title: 'Member ID',
      dataIndex: 'memberId',
      key: 'memberId',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Platform',
      dataIndex: 'platform',
      key: 'platform',
      render: (platform) => {
        const icons = {
          youtube: <YoutubeOutlined style={{ color: 'red' }} />,
          facebook: <FacebookOutlined style={{ color: '#1877F2' }} />,
          zoom: <ZoomOutlined style={{ color: '#2D8CFF' }} />
        };
        return <Space>{icons[platform]} {platform}</Space>;
      }
    },
    {
      title: 'Verification Code',
      dataIndex: 'verificationCode',
      key: 'verificationCode',
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Tag color={record.verified ? 'success' : 'warning'}>
          {record.verified ? 'Verified' : 'Pending'}
        </Tag>
      )
    }
  ];

  // Verify attendance code
  const verifyAttendanceCode = async (code, memberId) => {
    try {
      const response = await fetch('/api/attendance/verify-online', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          memberId,
          serviceId: serviceInfo.serviceType,
          date: serviceInfo.date
        })
      });

      if (!response.ok) throw new Error('Invalid verification code');

      message.success('Attendance verified successfully');
      return true;
    } catch (error) {
      message.error(error.message);
      return false;
    }
  };

  return (
    <Card title="Online Service Attendance">
      <Space direction="vertical" style={{ width: '100%' }}>
        {/* Service Verification Code */}
        <Card size="small" title="Service Verification Code">
          <Space direction="vertical">
            <h2>{verificationCode}</h2>
            <p>Share this code during the service for attendance verification</p>
          </Space>
        </Card>

        {/* Platform Statistics */}
        <Card size="small" title="Platform Statistics">
          <Space size="large">
            <Card type="inner" title="YouTube">
              <p>Current Viewers: {attendanceData.youtube.viewers}</p>
              <p>Peak Viewers: {attendanceData.youtube.peakViewers}</p>
              <p>Engagements: {attendanceData.youtube.likes + attendanceData.youtube.comments}</p>
            </Card>

            <Card type="inner" title="Facebook">
              <p>Current Viewers: {attendanceData.facebook.viewers}</p>
              <p>Reactions: {attendanceData.facebook.reactions}</p>
              <p>Shares: {attendanceData.facebook.shares}</p>
            </Card>

            <Card type="inner" title="Zoom">
              <p>Current Participants: {attendanceData.zoom.totalParticipants}</p>
              <p>Peak Participants: {attendanceData.zoom.peakParticipants}</p>
            </Card>
          </Space>
        </Card>

        {/* Manual Attendance Entry */}
        <Card size="small" title="Manual Attendance Entry">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Input.Search
              placeholder="Enter member ID or verification code"
              enterButton="Verify"
              onSearch={async (value) => {
                const verified = await verifyAttendanceCode(value);
                if (verified) {
                  // Update attendance list
                }
              }}
            />
            <Table
              columns={columns}
              dataSource={manualEntries}
              rowKey="memberId"
            />
          </Space>
        </Card>
      </Space>
    </Card>
  );
};

export default OnlineAttendanceTracker; 