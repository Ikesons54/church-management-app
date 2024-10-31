import React, { useState } from 'react';
import { Form, Input, Select, DatePicker, Button, Card, message, Space, Typography } from 'antd';
import eventTypes from '../../constants/eventTypes';

const { Title } = Typography;
const { Option } = Select;

const EventRegistration = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [eventType, setEventType] = useState(null);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // API call to register for event
      const response = await fetch('http://localhost:5000/api/events/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success('Successfully registered for event!');
        form.resetFields();
      } else {
        message.error('Failed to register for event');
      }
    } catch (error) {
      message.error('Error registering for event');
    } finally {
      setLoading(false);
    }
  };

  // Render different fields based on event type
  const renderEventSpecificFields = () => {
    switch(eventType) {
      case 'permfit':
      case 'permfit_training':
        return (
          <>
            <Form.Item
              name="fitnessLevel"
              label="Fitness Level"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="beginner">Beginner</Option>
                <Option value="intermediate">Intermediate</Option>
                <Option value="advanced">Advanced</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="medicalConditions"
              label="Any Medical Conditions?"
              rules={[{ required: true }]}
            >
              <Input.TextArea />
            </Form.Item>
          </>
        );
      
      case 'evangelism':
        return (
          <>
            <Form.Item
              name="preferredArea"
              label="Preferred Area for Evangelism"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="abu_dhabi_city">Abu Dhabi City</Option>
                <Option value="mussafah">Mussafah</Option>
                <Option value="khalifa_city">Khalifa City</Option>
                {/* Add more areas */}
              </Select>
            </Form.Item>
            <Form.Item
              name="language"
              label="Languages Spoken"
              rules={[{ required: true }]}
            >
              <Select mode="multiple">
                <Option value="english">English</Option>
                <Option value="arabic">Arabic</Option>
                <Option value="twi">Twi</Option>
                <Option value="hindi">Hindi</Option>
                {/* Add more languages */}
              </Select>
            </Form.Item>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card style={{ margin: '24px' }}>
      <Title level={2} style={{ color: '#4B0082', textAlign: 'center' }}>
        Event Registration
      </Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="eventType"
          label="Event Type"
          rules={[{ required: true, message: 'Please select event type' }]}
        >
          <Select 
            onChange={(value) => setEventType(value)}
            placeholder="Select event type"
          >
            {eventTypes.map(type => (
              <Option key={type.value} value={type.value}>{type.label}</Option>
            ))}
          </Select>
        </Form.Item>

        {renderEventSpecificFields()}

        <Form.Item
          name="notes"
          label="Additional Notes"
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ 
              width: '100%',
              backgroundColor: '#4B0082'
            }}
          >
            Register for Event
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default EventRegistration; 