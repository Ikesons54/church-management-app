import React, { useState, useCallback } from 'react';
import { 
  Card, 
  Table, 
  DatePicker, 
  Button, 
  Space, 
  Select, 
  Tag, 
  Row, 
  Col, 
  Statistic,
  Input,
  Form,
  Modal,
  Tooltip,
  Badge,
  message
} from 'antd';
import { 
  TeamOutlined, 
  CalendarOutlined, 
  UserAddOutlined,
  DownloadOutlined,
  EditOutlined
} from '@ant-design/icons';
import { useAttendanceData } from '../../hooks/useAttendanceData';
import { getServiceTypes, formatAttendanceForExport } from '../../utils/attendanceUtils';
import moment from 'moment';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { exportToExcel } from '../../utils/exportService';

const { Option } = Select;
const { TextArea } = Input;

const MinistryAttendanceTracker = () => {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [selectedMinistry, setSelectedMinistry] = useState('');
  const [eventType, setEventType] = useState('');
  const [visitorModalVisible, setVisitorModalVisible] = useState(false);
  const [form] = Form.useForm();

  const { 
    data, 
    loading, 
    fetchData, 
    markAttendance, 
    addVisitor 
  } = useAttendanceData('ministry');

  const ministryTypes = getServiceTypes().ministry;

  const handleMinistryChange = useCallback((value) => {
    setSelectedMinistry(value);
    setEventType(''); // Reset event type when ministry changes
    fetchData({ 
      date: selectedDate.format('YYYY-MM-DD'), 
      ministry: value 
    });
  }, [fetchData, selectedDate]);

  const handleAddVisitor = async (values) => {
    try {
      await addVisitor({
        ...values,
        ministryId: selectedMinistry,
        date: selectedDate.format('YYYY-MM-DD'),
        eventType
      });
      message.success('Visitor added successfully');
      setVisitorModalVisible(false);
      form.resetFields();
      fetchData({ 
        date: selectedDate.format('YYYY-MM-DD'), 
        ministry: selectedMinistry 
      });
    } catch (error) {
      message.error('Failed to add visitor');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <Space>
          {`${record.firstName} ${record.lastName}`}
          {record.isVisitor && <Tag color="blue">Visitor</Tag>}
        </Space>
      )
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: role => (
        <Tag color={
          role === 'leader' ? 'gold' : 
          role === 'member' ? 'green' : 
          'default'
        }>
          {role?.toUpperCase()}
        </Tag>
      )
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
            onClick={() => markAttendance({
              memberId: record.id,
              status: 'present',
              ministryId: selectedMinistry,
              eventType
            })}
            disabled={record.status === 'present'}
          >
            Present
          </Button>
          <Button
            danger
            size="small"
            onClick={() => markAttendance({
              memberId: record.id,
              status: 'absent',
              ministryId: selectedMinistry,
              eventType
            })}
            disabled={record.status === 'absent'}
          >
            Absent
          </Button>
        </Space>
      )
    }
  ];

  return (
    <ErrorBoundary>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card>
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <DatePicker
                value={selectedDate}
                onChange={setSelectedDate}
                style={{ width: '100%' }}
              />
            </Col>
            <Col span={6}>
              <Select
                value={selectedMinistry}
                onChange={handleMinistryChange}
                style={{ width: '100%' }}
                placeholder="Select Ministry"
              >
                {ministryTypes.map(ministry => (
                  <Option key={ministry.id} value={ministry.id}>
                    {ministry.name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={6}>
              <Select
                value={eventType}
                onChange={setEventType}
                style={{ width: '100%' }}
                placeholder="Select Event Type"
                disabled={!selectedMinistry}
              >
                {ministryTypes
                  .find(m => m.id === selectedMinistry)
                  ?.events.map(event => (
                    <Option key={event} value={event}>
                      {event}
                    </Option>
                  ))
                }
              </Select>
            </Col>
            <Col span={6}>
              <Space>
                <Button
                  type="primary"
                  icon={<UserAddOutlined />}
                  onClick={() => setVisitorModalVisible(true)}
                  disabled={!selectedMinistry || !eventType}
                >
                  Add Visitor
                </Button>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={() => {
                    const exportData = formatAttendanceForExport(
                      [data], 
                      'ministry'
                    );
                    exportToExcel(
                      exportData,
                      `${selectedMinistry}_attendance_${selectedDate.format('YYYY-MM-DD')}`
                    );
                  }}
                  disabled={!data}
                >
                  Export
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        <Card>
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Statistic
                title="Total Attendance"
                value={data?.stats.total || 0}
                prefix={<TeamOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Members Present"
                value={data?.stats.members || 0}
                valueStyle={{ color: '#3f8600' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Visitors"
                value={data?.stats.visitors || 0}
                valueStyle={{ color: '#1890ff' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Attendance Rate"
                value={data?.stats.rate || 0}
                suffix="%"
                precision={1}
              />
            </Col>
          </Row>
        </Card>

        <Table
          columns={columns}
          dataSource={data?.attendees}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} attendees`
          }}
        />

        <Modal
          title="Add Visitor"
          visible={visitorModalVisible}
          onOk={() => form.submit()}
          onCancel={() => {
            setVisitorModalVisible(false);
            form.resetFields();
          }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleAddVisitor}
          >
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Phone Number"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ type: 'email' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="notes"
              label="Notes"
            >
              <TextArea rows={4} />
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </ErrorBoundary>
  );
};

export default MinistryAttendanceTracker; 