import React, { useState } from 'react';
import {
  Card,
  Table,
  Space,
  Button,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Checkbox,
  Badge
} from 'antd';
import {
  PhoneOutlined,
  WhatsAppOutlined,
  MailOutlined,
  CheckCircleOutlined,
  EditOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { 
  completeFollowUp, 
  updateFollowUp, 
  createFollowUp 
} from '../../store/slices/visitorSlice';

const { TextArea } = Input;
const { Option } = Select;

const FollowUpManager = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [selectedFollowUp, setSelectedFollowUp] = useState(null);
  const dispatch = useDispatch();
  const visitors = useSelector(state => state.visitors.list);
  const followUps = useSelector(state => state.visitors.followUps);
  const loading = useSelector(state => state.visitors.loading);

  const columns = [
    {
      title: 'Visitor',
      dataIndex: 'visitorName',
      key: 'visitorName',
      render: (text, record) => (
        <Space>
          <span>{text}</span>
          {record.isUrgent && <Badge status="error" text="Urgent" />}
        </Space>
      )
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: date => {
        const momentDate = moment(date);
        const isOverdue = momentDate.isBefore(moment());
        return (
          <Tag color={isOverdue ? 'error' : 'default'}>
            {momentDate.format('YYYY-MM-DD')}
          </Tag>
        );
      },
      sorter: (a, b) => moment(a.dueDate).unix() - moment(b.dueDate).unix()
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: type => {
        const icons = {
          phone: <PhoneOutlined />,
          whatsapp: <WhatsAppOutlined />,
          email: <MailOutlined />
        };
        return (
          <Space>
            {icons[type]}
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Space>
        );
      },
      filters: [
        { text: 'Phone', value: 'phone' },
        { text: 'WhatsApp', value: 'whatsapp' },
        { text: 'Email', value: 'email' }
      ],
      onFilter: (value, record) => record.type === value
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        const statusConfig = {
          pending: { color: 'warning', text: 'Pending' },
          completed: { color: 'success', text: 'Completed' },
          overdue: { color: 'error', text: 'Overdue' }
        };
        const config = statusConfig[status];
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={() => handleComplete(record)}
            disabled={record.status === 'completed'}
          >
            Complete
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
        </Space>
      )
    }
  ];

  const handleComplete = async (followUp) => {
    try {
      await dispatch(completeFollowUp(followUp.id)).unwrap();
      message.success('Follow-up marked as complete');
    } catch (error) {
      message.error('Error completing follow-up');
    }
  };

  const handleEdit = (followUp) => {
    setSelectedFollowUp(followUp);
    form.setFieldsValue({
      ...followUp,
      dueDate: moment(followUp.dueDate)
    });
    setVisible(true);
  };

  const handleSubmit = async (values) => {
    try {
      if (selectedFollowUp) {
        await dispatch(updateFollowUp({
          id: selectedFollowUp.id,
          data: values
        })).unwrap();
        message.success('Follow-up updated successfully');
      } else {
        await dispatch(createFollowUp(values)).unwrap();
        message.success('Follow-up created successfully');
      }
      setVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Error saving follow-up');
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Card title="Follow-up Manager">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setSelectedFollowUp(null);
            form.resetFields();
            setVisible(true);
          }}
          style={{ marginBottom: 16 }}
        >
          New Follow-up
        </Button>

        <Table
          columns={columns}
          dataSource={followUps}
          loading={loading}
          rowKey="id"
        />
      </Card>

      <Modal
        title={selectedFollowUp ? 'Edit Follow-up' : 'New Follow-up'}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="visitorId"
            label="Visitor"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {visitors.map(visitor => (
                <Option key={visitor.id} value={visitor.id}>
                  {visitor.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="type"
            label="Follow-up Type"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="phone">Phone Call</Option>
              <Option value="whatsapp">WhatsApp</Option>
              <Option value="email">Email</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="dueDate"
            label="Due Date"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="notes"
            label="Notes"
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="isUrgent"
            valuePropName="checked"
          >
            <Checkbox>Mark as Urgent</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default FollowUpManager; 