import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  DatePicker, 
  Button, 
  Space, 
  message,
  Select,
  Tag,
  Row,
  Col,
  Statistic 
} from 'antd';
import { 
  UserOutlined, 
  CalendarOutlined,
  CheckCircleOutlined 
} from '@ant-design/icons';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;

const AttendanceTracker = () => {
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [serviceType, setServiceType] = useState('sunday');
  const [statistics, setStatistics] = useState({
    total: 0,
    present: 0,
    absent: 0
  });

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate, serviceType]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/attendance?date=${selectedDate.format('YYYY-MM-DD')}&service=${serviceType}`);
      if (!response.ok) throw new Error('Failed to fetch attendance');
      const data = await response.json();
      setMembers(data.members);
      setStatistics(data.statistics);
    } catch (error) {
      message.error('Error fetching attendance: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (memberId, status) => {
    try {
      const response = await fetch('http://localhost:5000/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberId,
          date: selectedDate.format('YYYY-MM-DD'),
          serviceType,
          status
        })
      });

      if (!response.ok) throw new Error('Failed to mark attendance');
      
      message.success('Attendance marked successfully');
      fetchAttendance();
    } catch (error) {
      message.error('Error marking attendance: ' + error.message);
    }
  };

  const columns = [
    {
      title: 'Member ID',
      dataIndex: 'memberId',
      key: 'memberId'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => `${record.firstName} ${record.lastName}`
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
            onClick={() => markAttendance(record.memberId, 'present')}
            disabled={record.status === 'present'}
          >
            Present
          </Button>
          <Button
            danger
            onClick={() => markAttendance(record.memberId, 'absent')}
            disabled={record.status === 'absent'}
          >
            Absent
          </Button>
        </Space>
      )
    }
  ];

  return (
    <Card title="Attendance Tracker">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Row gutter={16}>
          <Col span={8}>
            <DatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={8}>
            <Select
              value={serviceType}
              onChange={setServiceType}
              style={{ width: '100%' }}
            >
              <Option value="sunday">Sunday Service</Option>
              <Option value="midweek">Midweek Service</Option>
              <Option value="prayer">Prayer Meeting</Option>
              <Option value="special">Special Service</Option>
            </Select>
          </Col>
          <Col span={8}>
            <Button 
              type="primary" 
              onClick={fetchAttendance}
              icon={<CalendarOutlined />}
            >
              Load Attendance
            </Button>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={8}>
            <Statistic
              title="Total Members"
              value={statistics.total}
              prefix={<UserOutlined />}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Present"
              value={statistics.present}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Absent"
              value={statistics.absent}
              valueStyle={{ color: '#cf1322' }}
            />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={members}
          rowKey="memberId"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} members`
          }}
        />
      </Space>
    </Card>
  );
};

export default AttendanceTracker; 