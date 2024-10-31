import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        message.success('Registration successful!');
        navigate('/login');
      } else {
        message.error(data.message || 'Registration failed');
      }
    } catch (error) {
      message.error('An error occurred during registration');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: '0 24px' }}>
      <Card title="Register">
        <Form
          name="register"
          onFinish={onFinish}
        >
          <Form.Item
            name="firstName"
            rules={[{ required: true, message: 'Please input your First Name!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="First Name" />
          </Form.Item>

          <Form.Item
            name="lastName"
            rules={[{ required: true, message: 'Please input your Last Name!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Last Name" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your Email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Register
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterForm;