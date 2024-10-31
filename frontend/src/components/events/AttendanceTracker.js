import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Tag, 
  Space, 
  Button, 
  Typography,
  Statistic,
  Row,
  Col,
  Progress,
  Input,
  Modal
} from 'antd';
import { 
  UserOutlined, 
  CheckCircleOutlined, 
  SearchOutlined,
  DownloadOutlined,
  QrcodeOutlined
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEventAttendance, exportAttendance } from '../../store/slices/eventSlice';
import QRCodeScanner from './QRCodeScanner';
import moment from 'moment';
import PropTypes from 'prop-types';

const { Title, Text } = Typography;
const { Search } = Input;

const AttendanceTracker = ({ eventId }) => {
  const [searchText, setSearchText] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const dispatch = useDispatch();
  const event = useSelector(state => 
    state.events.items.find(e => e.id === eventId)
  );

  useEffect(() => {
    if (eventId) {
      dispatch(fetchEventAttendance(eventId));
    }
  }, [eventId, dispatch]);

  const columns = [
    {
      title: 'Member',
      dataIndex: 'memberName',
      key: 'memberName',
      filterable: true,
      render: (text, record) => (
        <Space>
          <UserOutlined />
          <Text>{text}</Text>
        </Space>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={
          status === 'checked-in' ? 'success' : 
          status === 'registered' ? 'processing' : 
          'default'
        }>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Check-in Time',
      dataIndex: 'checkedInAt',
      key: 'checkedInAt',
      render: time => time ? moment(time).format('LLL') : '-'
    },
    {
      title: 'Checked By',
      dataIndex: 'checkedInBy',
      key: 'checkedInBy',
      render: user => user?.name || '-'
    }
  ];

  const getAttendanceStats = () => {
    const total = event?.attendees?.length || 0;
    const checkedIn = event?.attendees?.filter(a => a.status === 'checked-in').length || 0;
    const percentage = total ? Math.round((checkedIn / total) * 100) : 0;

    return { total, checkedIn, percentage };
  };

  const stats = getAttendanceStats();

  const handleExport = () => {
    dispatch(exportAttendance(eventId));
  };

  const filteredData = event?.attendees?.filter(attendee => 
    attendee.memberName.toLowerCase().includes(searchText.toLowerCase())
  ) || [];

  return (
    <Card>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Row gutter={16}>
          <Col span={8}>
            <Statistic 
              title="Total Registered" 
              value={stats.total}
              prefix={<UserOutlined />}
            />
          </Col>
          <Col span={8}>
            <Statistic 
              title="Checked In" 
              value={stats.checkedIn}
              prefix={<CheckCircleOutlined />}
            />
          </Col>
          <Col span={8}>
            <Progress 
              type="circle" 
              percent={stats.percentage}
              format={percent => `${percent}%`}
            />
          </Col>
        </Row>

        <Space style={{ justifyContent: 'space-between', width: '100%' }}>
          <Search
            placeholder="Search members"
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <Space>
            <Button 
              icon={<QrcodeOutlined />}
              onClick={() => setShowScanner(true)}
            >
              Scan QR Code
            </Button>
            <Button 
              icon={<DownloadOutlined />}
              onClick={handleExport}
            >
              Export Attendance
            </Button>
          </Space>
        </Space>

        <Table 
          columns={columns}
          dataSource={filteredData}
          rowKey="memberId"
          pagination={{ pageSize: 50 }}
          loading={!event}
        />

        <Modal
          title="QR Code Scanner"
          open={showScanner}
          onCancel={() => setShowScanner(false)}
          footer={null}
          width={400}
        >
          <QRCodeScanner 
            eventId={eventId}
            onScanComplete={() => setShowScanner(false)}
          />
        </Modal>
      </Space>
    </Card>
  );
};

AttendanceTracker.propTypes = {
  eventId: PropTypes.string.isRequired
};

export default AttendanceTracker; 