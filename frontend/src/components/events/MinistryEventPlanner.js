import React, { useState, useCallback } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { 
  Card, 
  Typography, 
  Button, 
  Space, 
  Table, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Switch, 
  InputNumber,
  Tag,
  Divider,
  Row,
  Col,
  message
} from 'antd';
import { 
  PlusOutlined, 
  CalendarOutlined, 
  TeamOutlined, 
  EnvironmentOutlined,
  DollarOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

// Ministry options
const ministries = [
  { id: 'pemem', name: 'PEMEM' },
  { id: 'womens', name: "Women's Movement" },
  { id: 'youth', name: 'Youth Ministry' },
  { id: 'children', name: "Children's Ministry" },
  { id: 'choir', name: 'Church Choir' },
  { id: 'pemfit', name: 'PEMFIT' },
  { id: 'media', name: 'Media Team' },
  { id: 'ushers', name: 'Ushering Team' }
];

const MinistryEventPlanner = ({ onEventUpdate }) => {
  const [events, setEvents] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Table columns
  const columns = [
    {
      title: 'Event',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Space>
          <CalendarOutlined style={{ color: '#4B0082' }} />
          <Text strong>{text}</Text>
          {record.isRecurring && <Tag color="blue">Recurring</Tag>}
        </Space>
      ),
    },
    {
      title: 'Ministry',
      dataIndex: 'ministry',
      key: 'ministry',
      render: ministry => {
        const ministryData = ministries.find(m => m.id === ministry);
        return <Tag color="purple">{ministryData?.name || ministry}</Tag>;
      },
    },
    {
      title: 'Date & Time',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (_, record) => (
        <Text>
          {new Date(record.startDate).toLocaleDateString()} - 
          {new Date(record.endDate).toLocaleDateString()}
        </Text>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: location => (
        <Space>
          <EnvironmentOutlined />
          <Text>{location}</Text>
        </Space>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: status => {
        const colors = {
          planning: 'orange',
          confirmed: 'green',
          completed: 'blue',
          cancelled: 'red'
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          />
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  const handleEdit = useCallback((event) => {
    setSelectedEvent(event);
    form.setFieldsValue({
      ...event,
      dateRange: [moment(event.startDate), moment(event.endDate)],
    });
    setOpenModal(true);
  }, [form]);

  const handleDelete = useCallback(async (eventId) => {
    try {
      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
      message.success('Event deleted successfully');
      onEventUpdate?.();
    } catch (error) {
      message.error('Failed to delete event');
    }
  }, [onEventUpdate]);

  const handleSubmit = useCallback(async (values) => {
    setLoading(true);
    try {
      const [startDate, endDate] = values.dateRange;
      const eventData = {
        ...values,
        startDate: startDate.toDate(),
        endDate: endDate.toDate(),
        id: selectedEvent?.id || Date.now(),
      };

      if (selectedEvent) {
        setEvents(prevEvents => 
          prevEvents.map(event => 
            event.id === selectedEvent.id ? eventData : event
          )
        );
        message.success('Event updated successfully');
      } else {
        setEvents(prevEvents => [...prevEvents, eventData]);
        message.success('Event created successfully');
      }

      setOpenModal(false);
      form.resetFields();
      onEventUpdate?.();
    } catch (error) {
      message.error('Failed to save event');
    } finally {
      setLoading(false);
    }
  }, [selectedEvent, form, onEventUpdate]);

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4}>Ministry Event Planner</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedEvent(null);
              form.resetFields();
              setOpenModal(true);
            }}
            style={{ backgroundColor: '#4B0082' }}
          >
            New Event
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={events}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />

        <Modal
          title={selectedEvent ? 'Edit Event' : 'New Event'}
          open={openModal}
          onCancel={() => setOpenModal(false)}
          footer={null}
          width={800}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="title"
                  label="Event Title"
                  rules={[{ required: true, message: 'Please enter event title' }]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="ministry"
                  label="Ministry"
                  rules={[{ required: true, message: 'Please select ministry' }]}
                >
                  <Select>
                    {ministries.map(ministry => (
                      <Option key={ministry.id} value={ministry.id}>
                        {ministry.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="location"
                  label="Location"
                  rules={[{ required: true, message: 'Please enter location' }]}
                >
                  <Input prefix={<EnvironmentOutlined />} />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="dateRange"
                  label="Event Date & Time"
                  rules={[{ required: true, message: 'Please select date and time' }]}
                >
                  <RangePicker 
                    showTime 
                    style={{ width: '100%' }} 
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="description"
                  label="Description"
                >
                  <TextArea rows={4} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="budget"
                  label="Budget (AED)"
                >
                  <InputNumber
                    prefix={<DollarOutlined />}
                    style={{ width: '100%' }}
                    min={0}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="attendanceTarget"
                  label="Expected Attendance"
                >
                  <InputNumber
                    prefix={<TeamOutlined />}
                    style={{ width: '100%' }}
                    min={1}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="isRecurring"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="Recurring" unCheckedChildren="One-time" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="approvalRequired"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="Needs Approval" unCheckedChildren="Auto-approved" />
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            <Form.Item>
              <Space>
                <Button onClick={() => setOpenModal(false)}>
                  Cancel
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  loading={loading}
                  style={{ backgroundColor: '#4B0082' }}
                >
                  {selectedEvent ? 'Update Event' : 'Create Event'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </Card>
  );
};

MinistryEventPlanner.propTypes = {
  onEventUpdate: PropTypes.func,
};

MinistryEventPlanner.defaultProps = {
  onEventUpdate: () => {},
};

export default MinistryEventPlanner; 