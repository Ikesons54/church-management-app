import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Statistic,
  Row,
  Col,
  Timeline,
  message,
  Tooltip,
  Badge,
  Dropdown,
  Menu,
  notification
} from 'antd';
import {
  UserAddOutlined,
  WhatsAppOutlined,
  MailOutlined,
  PhoneOutlined,
  EditOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  MessageOutlined,
  PlusOutlined,
  ExportOutlined,
  BellOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { useSelector } from 'react-redux';

const { TextArea } = Input;
const { Option } = Select;

const FirstTimeVisitorTracker = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visitorForm] = Form.useForm();
  const [followUpForm] = Form.useForm();
  const [visitorModalVisible, setVisitorModalVisible] = useState(false);
  const [followUpModalVisible, setFollowUpModalVisible] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    followedUp: 0,
    converted: 0,
    pending: 0,
    weeklyGrowth: 0
  });
  const [filters, setFilters] = useState({
    dateRange: [moment().startOf('month'), moment()],
    status: 'all'
  });

  // Fetch initial data
  useEffect(() => {
    fetchVisitors();
    fetchStats();
    setupReminders();
  }, [filters]);

  // Set up automated reminders
  const setupReminders = () => {
    // Check for pending follow-ups every hour
    const checkInterval = setInterval(() => {
      checkPendingFollowUps();
    }, 3600000);

    return () => clearInterval(checkInterval);
  };

  const checkPendingFollowUps = async () => {
    try {
      const response = await fetch('/api/visitors/pending-followups');
      const pendingFollowUps = await response.json();

      pendingFollowUps.forEach(visitor => {
        notification.warning({
          message: 'Follow-up Reminder',
          description: `Follow-up pending for ${visitor.name} (${moment(visitor.visitDate).fromNow()})`,
          icon: <BellOutlined style={{ color: '#108ee9' }} />,
          duration: 0,
          btn: (
            <Button 
              type="primary" 
              size="small"
              onClick={() => handleFollowUp(visitor)}
            >
              Follow Up Now
            </Button>
          )
        });
      });
    } catch (error) {
      console.error('Error checking follow-ups:', error);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <span>{text}</span>
          {record.isNew && <Badge status="processing" text="New" />}
        </Space>
      )
    },
    {
      title: 'Visit Date',
      dataIndex: 'visitDate',
      key: 'visitDate',
      render: date => moment(date).format('YYYY-MM-DD'),
      sorter: (a, b) => moment(a.visitDate).unix() - moment(b.visitDate).unix()
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_, record) => (
        <Space>
          {record.phone && (
            <Tooltip title="Call">
              <Button 
                type="link" 
                icon={<PhoneOutlined />} 
                onClick={() => handleContact(record, 'phone')}
              />
            </Tooltip>
          )}
          {record.whatsapp && (
            <Tooltip title="WhatsApp">
              <Button 
                type="link" 
                icon={<WhatsAppOutlined />} 
                onClick={() => handleContact(record, 'whatsapp')}
              />
            </Tooltip>
          )}
          {record.email && (
            <Tooltip title="Email">
              <Button 
                type="link" 
                icon={<MailOutlined />} 
                onClick={() => handleContact(record, 'email')}
              />
            </Tooltip>
          )}
        </Space>
      )
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: status => {
        const statusConfig = {
          pending: { color: 'warning', text: 'Pending Follow-up' },
          followed_up: { color: 'processing', text: 'Followed Up' },
          converted: { color: 'success', text: 'Converted to Member' },
          inactive: { color: 'default', text: 'Inactive' }
        };
        const config = statusConfig[status] || statusConfig.pending;
        return <Tag color={config.color}>{config.text}</Tag>;
      },
      filters: [
        { text: 'Pending Follow-up', value: 'pending' },
        { text: 'Followed Up', value: 'followed_up' },
        { text: 'Converted', value: 'converted' },
        { text: 'Inactive', value: 'inactive' }
      ],
      onFilter: (value, record) => record.status === value
    },
    {
      title: 'Journey',
      key: 'journey',
      render: (_, record) => (
        <Timeline mode="left" style={{ maxWidth: 200 }}>
          {record.journey.map((step, index) => (
            <Timeline.Item 
              key={index}
              color={step.completed ? 'green' : 'gray'}
              dot={step.completed ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
            >
              {step.action}
            </Timeline.Item>
          ))}
        </Timeline>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button 
            type="primary"
            icon={<MessageOutlined />}
            onClick={() => handleFollowUp(record)}
          >
            Follow Up
          </Button>
          <Dropdown overlay={
            <Menu>
              <Menu.Item key="convert" onClick={() => handleConversion(record)}>
                Convert to Member
              </Menu.Item>
              <Menu.Item key="reminder" onClick={() => setReminder(record)}>
                Set Reminder
              </Menu.Item>
              <Menu.Item key="history" onClick={() => viewHistory(record)}>
                View History
              </Menu.Item>
            </Menu>
          }>
            <Button>More</Button>
          </Dropdown>
        </Space>
      )
    }
  ];

  // Handler Functions
  const handleEdit = (visitor) => {
    setSelectedVisitor(visitor);
    visitorForm.setFieldsValue({
      ...visitor,
      visitDate: moment(visitor.visitDate)
    });
    setVisitorModalVisible(true);
  };

  const handleFollowUp = (visitor) => {
    setSelectedVisitor(visitor);
    followUpForm.setFieldsValue({
      visitorId: visitor.id,
      date: moment(),
      type: 'phone'
    });
    setFollowUpModalVisible(true);
  };

  const handleContact = (visitor, method) => {
    switch (method) {
      case 'phone':
        window.location.href = `tel:${visitor.phone}`;
        break;
      case 'whatsapp':
        window.open(`https://wa.me/${visitor.whatsapp}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:${visitor.email}`;
        break;
    }

    // Log contact attempt
    logContactAttempt(visitor.id, method);
  };

  const handleConversion = async (visitor) => {
    try {
      const response = await fetch(`/api/visitors/${visitor.id}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        message.success('Visitor successfully converted to member!');
        fetchVisitors();
        fetchStats();
      }
    } catch (error) {
      message.error('Error converting visitor to member');
    }
  };

  const setReminder = (visitor) => {
    Modal.confirm({
      title: 'Set Follow-up Reminder',
      content: (
        <Form>
          <Form.Item label="Reminder Date">
            <DatePicker showTime />
          </Form.Item>
          <Form.Item label="Notes">
            <Input.TextArea />
          </Form.Item>
        </Form>
      ),
      onOk: async (values) => {
        try {
          await fetch('/api/visitors/reminders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              visitorId: visitor.id,
              ...values
            })
          });
          message.success('Reminder set successfully');
        } catch (error) {
          message.error('Error setting reminder');
        }
      }
    });
  };

  const viewHistory = (visitor) => {
    Modal.info({
      title: 'Visitor History',
      width: 600,
      content: (
        <Timeline mode="left">
          {visitor.history.map((event, index) => (
            <Timeline.Item 
              key={index}
              color={event.type === 'visit' ? 'green' : 'blue'}
              label={moment(event.date).format('YYYY-MM-DD HH:mm')}
            >
              <p>{event.description}</p>
              {event.notes && <p><small>{event.notes}</small></p>}
            </Timeline.Item>
          ))}
        </Timeline>
      )
    });
  };

  // API Calls
  const fetchVisitors = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters)
      });
      const data = await response.json();
      setVisitors(data);
    } catch (error) {
      message.error('Error fetching visitors');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/visitors/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      message.error('Error fetching statistics');
    }
  };

  const logContactAttempt = async (visitorId, method) => {
    try {
      await fetch('/api/visitors/contact-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId,
          method,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Error logging contact attempt:', error);
    }
  };

  return (
    <div>
      {/* Stats Dashboard */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Visitors"
              value={stats.total}
              prefix={<UserAddOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Followed Up"
              value={stats.followedUp}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pending Follow-ups"
              value={stats.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Weekly Growth"
              value={stats.weeklyGrowth}
              prefix={<UserAddOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* Action Buttons */}
      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setSelectedVisitor(null);
            visitorForm.resetFields();
            setVisitorModalVisible(true);
          }}
        >
          Add Visitor
        </Button>
        <Button
          icon={<ExportOutlined />}
          onClick={() => {/* Handle export */}}
        >
          Export Data
        </Button>
      </Space>

      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Space>
          <DatePicker.RangePicker
            value={filters.dateRange}
            onChange={(dates) => setFilters(prev => ({ ...prev, dateRange: dates }))}
          />
          <Select
            value={filters.status}
            onChange={(status) => setFilters(prev => ({ ...prev, status }))}
            style={{ width: 200 }}
          >
            <Option value="all">All Statuses</Option>
            <Option value="pending">Pending Follow-up</Option>
            <Option value="followed_up">Followed Up</Option>
            <Option value="converted">Converted</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </Space>
      </Card>

      {/* Visitors Table */}
      <Table
        columns={columns}
        dataSource={visitors}
        loading={loading}
        rowKey="id"
        pagination={{
          total: visitors.length,
          pageSize: 10,
          showTotal: (total) => `Total ${total} visitors`
        }}
      />

      {/* Add/Edit Visitor Modal */}
      <Modal
        title={selectedVisitor ? 'Edit Visitor' : 'Add New Visitor'}
        visible={visitorModalVisible}
        onCancel={() => setVisitorModalVisible(false)}
        onOk={() => visitorForm.submit()}
      >
        <Form
          form={visitorForm}
          layout="vertical"
          onFinish={async (values) => {
            try {
              const url = selectedVisitor 
                ? `/api/visitors/${selectedVisitor.id}`
                : '/api/visitors';
              
              const response = await fetch(url, {
                method: selectedVisitor ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
              });

              if (response.ok) {
                message.success(`Visitor successfully ${selectedVisitor ? 'updated' : 'added'}`);
                setVisitorModalVisible(false);
                fetchVisitors();
              }
            } catch (error) {
              message.error('Error saving visitor');
            }
          }}
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="visitDate"
            label="Visit Date"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>
          <Form.Item name="whatsapp" label="WhatsApp">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <TextArea rows={2} />
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Follow-up Modal */}
      <Modal
        title="Record Follow-up"
        visible={followUpModalVisible}
        onCancel={() => setFollowUpModalVisible(false)}
        onOk={() => followUpForm.submit()}
      >
        <Form
          form={followUpForm}
          layout="vertical"
          onFinish={async (values) => {
            try {
              const response = await fetch(`/api/visitors/${selectedVisitor.id}/follow-up`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
              });

              if (response.ok) {
                message.success('Follow-up recorded successfully');
                setFollowUpModalVisible(false);
                fetchVisitors();
              }
            } catch (error) {
              message.error('Error recording follow-up');
            }
          }}
        >
          <Form.Item name="date" label="Follow-up Date" rules={[{ required: true }]}>
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="type" label="Contact Method" rules={[{ required: true }]}>
            <Select>
              <Option value="phone">Phone Call</Option>
              <Option value="whatsapp">WhatsApp</Option>
              <Option value="email">Email</Option>
              <Option value="visit">Personal Visit</Option>
            </Select>
          </Form.Item>
          <Form.Item name="response" label="Visitor Response">
            <Select>
              <Option value="positive">Positive</Option>
              <Option value="neutral">Neutral</Option>
              <Option value="negative">Negative</Option>
              <Option value="no_response">No Response</Option>
            </Select>
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item name="nextFollowUp" label="Schedule Next Follow-up">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FirstTimeVisitorTracker; 