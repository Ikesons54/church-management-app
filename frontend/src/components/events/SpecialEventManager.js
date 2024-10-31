import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { 
  Card, 
  Typography, 
  Input, 
  Button, 
  Table, 
  Tag, 
  Space, 
  Modal, 
  Form, 
  Switch, 
  Select,
  DatePicker,
  InputNumber,
  Row,
  Col,
  Divider,
  message 
} from 'antd';
import { 
  QrcodeOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  TeamOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  NotificationOutlined
} from '@ant-design/icons';
import { saveEvent } from '../../services/eventService';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// Special event types
const eventTypes = [
  { value: 'convention', label: 'Convention' },
  { value: 'conference', label: 'Conference' },
  { value: 'retreat', label: 'Retreat' },
  { value: 'revival', label: 'Revival' },
  { value: 'thanksgiving', label: 'Thanksgiving Service' },
  { value: 'ordination', label: 'Ordination Service' },
  { value: 'baptism', label: 'Baptismal Service' },
  { value: 'communion', label: 'Communion Service' },
  { value: 'other', label: 'Other Special Event' }
];

const SpecialEventManager = ({ onEventUpdate }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openScanner, setOpenScanner] = useState(false);
  const [scanningEventId, setScanningEventId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Table columns configuration
  const columns = [
    {
      title: 'Event Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <CalendarOutlined style={{ color: '#4B0082' }} />
          <Text strong>{text}</Text>
        </Space>
      )
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        const eventType = eventTypes.find(t => t.value === type);
        return <Tag color="blue">{eventType?.label || type}</Tag>;
      }
    },
    {
      title: 'Date & Time',
      dataIndex: 'date',
      key: 'date',
      render: (date) => (
        <Text>
          {new Date(date).toLocaleDateString()} {new Date(date).toLocaleTimeString()}
        </Text>
      )
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (location) => (
        <Space>
          <EnvironmentOutlined />
          <Text>{location}</Text>
        </Space>
      )
    },
    {
      title: 'Registration',
      dataIndex: 'requiresRegistration',
      key: 'registration',
      render: (requires) => (
        <Tag color={requires ? 'green' : 'orange'}>
          {requires ? 'Required' : 'Open'}
        </Tag>
      )
    },
    {
      title: 'Capacity',
      key: 'capacity',
      render: (_, record) => (
        <Space>
          <TeamOutlined />
          <Text>{record.checkedIn || 0}/{record.capacity || 'Unlimited'}</Text>
        </Space>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEventEdit(record)} 
          />
          <Button 
            type="text" 
            icon={<DeleteOutlined />} 
            onClick={() => handleEventDelete(record.id)}
            danger 
          />
          <Button 
            type="text" 
            icon={<QrcodeOutlined />} 
            onClick={() => openEventScanner(record.id)} 
          />
          <Button
            type="text"
            icon={<NotificationOutlined />}
            onClick={() => sendEventNotification(record.id)}
          />
        </Space>
      )
    }
  ];

  const handleEventEdit = useCallback((event) => {
    setSelectedEvent(event);
    form.setFieldsValue(event);
    setOpenDialog(true);
  }, [form]);

  const handleEventDelete = useCallback(async (eventId) => {
    try {
      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
      message.success('Event deleted successfully');
      onEventUpdate?.();
    } catch (error) {
      message.error('Failed to delete event');
    }
  }, [onEventUpdate]);

  const generateEventQRConfig = useCallback(() => ({
    prefix: 'COPAEVENT',
    expiry: 24,
    encryption: 'AES',
    validationRules: ['timebound', 'single-use', 'location-specific']
  }), []);

  const generateSecuritySettings = useCallback(() => ({
    requiresVerification: true,
    accessLevel: 'standard',
    maxAttempts: 3
  }), []);

  const handleSubmit = useCallback(async (values) => {
    setLoading(true);
    try {
      const eventData = {
        ...values,
        id: selectedEvent?.id || Date.now(),
        qrConfig: generateEventQRConfig(),
        securitySettings: generateSecuritySettings()
      };

      const response = await saveEvent(eventData);
      if (response.success) {
        message.success(`Event ${selectedEvent ? 'updated' : 'created'} successfully`);
        setOpenDialog(false);
        form.resetFields();
        onEventUpdate?.();
      }
    } catch (error) {
      message.error('Failed to save event');
    } finally {
      setLoading(false);
    }
  }, [selectedEvent, form, generateEventQRConfig, generateSecuritySettings, onEventUpdate]);

  const sendEventNotification = useCallback(async (eventId) => {
    try {
      // API call to send notifications
      message.success('Event notification sent successfully');
    } catch (error) {
      message.error('Failed to send event notification');
    }
  }, []);

  const openEventScanner = useCallback((eventId) => {
    setScanningEventId(eventId);
    setOpenScanner(true);
    Modal.info({
      title: 'QR Code Scanner',
      content: (
        <div>
          <p>Scanning for Event ID: {eventId}</p>
          {/* You can integrate your QR scanner component here */}
          {/* <QRScanner eventId={eventId} onScan={handleScan} /> */}
        </div>
      ),
      onOk() {
        setOpenScanner(false);
        setScanningEventId(null);
      },
    });
  }, []);

  return (
    <Card>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4}>Special Events</Title>
          <Button 
            type="primary"
            onClick={() => {
              setSelectedEvent(null);
              form.resetFields();
              setOpenDialog(true);
            }}
          >
            Create New Event
          </Button>
        </div>

        <Table 
          columns={columns} 
          dataSource={events}
          rowKey="id"
        />

        <Modal
          title={selectedEvent ? 'Edit Event' : 'Create New Event'}
          open={openDialog}
          onCancel={() => setOpenDialog(false)}
          footer={null}
          width={800}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="name"
              label="Event Name"
              rules={[{ required: true, message: 'Please enter event name' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="date"
              label="Event Date & Time"
              rules={[{ required: true, message: 'Please select date and time' }]}
            >
              <Input type="datetime-local" />
            </Form.Item>

            <Form.Item
              name="requiresRegistration"
              valuePropName="checked"
            >
              <Switch checkedChildren="Registration Required" unCheckedChildren="Open Event" />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button onClick={() => setOpenDialog(false)}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  {selectedEvent ? 'Update Event' : 'Create Event'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Event QR Scanner"
          open={openScanner}
          onCancel={() => {
            setOpenScanner(false);
            setScanningEventId(null);
          }}
          footer={null}
        >
          <div>
            <p>Scanning for Event ID: {scanningEventId}</p>
            {/* <QRScanner eventId={scanningEventId} onScan={handleScan} /> */}
          </div>
        </Modal>
      </Space>
    </Card>
  );
};

SpecialEventManager.propTypes = {
  onEventUpdate: PropTypes.func,
};

SpecialEventManager.defaultProps = {
  onEventUpdate: () => {},
};

export default SpecialEventManager; 