import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  InputNumber, 
  Select, 
  Switch, 
  Button, 
  Space,
  TimePicker,
  message 
} from 'antd';
import { SaveOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

const ReminderConfiguration = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load saved configuration
    const savedConfig = localStorage.getItem('reminderConfig');
    if (savedConfig) {
      form.setFieldsValue(JSON.parse(savedConfig));
    }
  }, [form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Save to localStorage
      localStorage.setItem('reminderConfig', JSON.stringify(values));
      
      // Save to backend
      const response = await fetch('http://localhost:5000/api/members/reminder-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        throw new Error('Failed to save reminder configuration');
      }

      message.success('Reminder configuration saved successfully');
    } catch (error) {
      message.error(`Error saving configuration: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Reminder Configuration" extra={<ClockCircleOutlined />}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          frequency: 7,
          frequencyUnit: 'days',
          enabled: true,
          reminderType: ['notification', 'email'],
          maxReminders: 3,
          reminderTime: '09:00'
        }}
      >
        <Form.Item
          name="enabled"
          label="Enable Reminders"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Space>
          <Form.Item
            name="frequency"
            label="Reminder Frequency"
            rules={[{ required: true, message: 'Please set reminder frequency' }]}
          >
            <InputNumber min={1} max={60} />
          </Form.Item>

          <Form.Item
            name="frequencyUnit"
            label="Unit"
            rules={[{ required: true }]}
          >
            <Select style={{ width: 120 }}>
              <Option value="days">Days</Option>
              <Option value="weeks">Weeks</Option>
              <Option value="months">Months</Option>
            </Select>
          </Form.Item>
        </Space>

        <Form.Item
          name="reminderType"
          label="Reminder Methods"
          rules={[{ required: true, message: 'Please select at least one reminder method' }]}
        >
          <Select mode="multiple">
            <Option value="notification">In-App Notification</Option>
            <Option value="email">Email</Option>
            <Option value="sms">SMS</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="reminderTime"
          label="Preferred Time"
          rules={[{ required: true, message: 'Please select reminder time' }]}
        >
          <TimePicker format="HH:mm" />
        </Form.Item>

        <Form.Item
          name="maxReminders"
          label="Maximum Reminders"
          rules={[{ required: true, message: 'Please set maximum reminders' }]}
        >
          <InputNumber min={1} max={10} />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            icon={<SaveOutlined />} 
            htmlType="submit"
            loading={loading}
          >
            Save Configuration
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ReminderConfiguration; 