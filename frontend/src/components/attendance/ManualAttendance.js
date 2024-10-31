import React, { useState } from 'react';
import { 
  Card, 
  Table, 
  Input, 
  Button, 
  Tag, 
  Space,
  message 
} from 'antd';

const ManualAttendance = ({ serviceInfo }) => {
  const [searchText, setSearchText] = useState('');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Column definition for the attendance table
  const columns = [
    {
      title: 'ID',
      dataIndex: 'memberId',
      key: 'memberId',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <Space>
          {`${record.firstName} ${record.lastName}`}
          {record.isFirstTimer && <Tag color="green">First Timer</Tag>}
        </Space>
      ),
      filterable: true
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Tag color={record.status === 'present' ? 'green' : 'red'}>
          {record.status?.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            size="small"
            onClick={() => markAttendance(record.id, 'present')}
            disabled={record.status === 'present'}
          >
            Present
          </Button>
          <Button 
            danger 
            size="small"
            onClick={() => markAttendance(record.id, 'absent')}
            disabled={record.status === 'absent'}
          >
            Absent
          </Button>
        </Space>
      )
    }
  ];

  // Function to mark attendance
  const markAttendance = async (memberId, status) => {
    try {
      const response = await fetch('/api/attendance/mark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          memberId,
          status,
          date: serviceInfo.date,
          serviceType: serviceInfo.serviceType
        })
      });

      if (!response.ok) throw new Error('Failed to mark attendance');

      // Update local state
      setMembers(prev => prev.map(member => 
        member.id === memberId 
          ? { ...member, status } 
          : member
      ));

      message.success(`Marked ${status} successfully`);
    } catch (error) {
      message.error('Error marking attendance: ' + error.message);
    }
  };

  return (
    <Card title="Manual Attendance">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Input.Search
          placeholder="Search by name or ID..."
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        
        <Table
          columns={columns}
          dataSource={members.filter(member => 
            member.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
            member.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
            member.memberId.includes(searchText)
          )}
          rowKey="id"
          loading={loading}
        />
      </Space>
    </Card>
  );
}; 