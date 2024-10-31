import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../../features/auth/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        dispatch(setCredentials({
          user: data.user,
          token: data.token
        }));
        navigate('/dashboard');
      } else {
        message.error(data.message || 'Login failed');
      }
    } catch (error) {
      message.error('An error occurred during login');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: '0 24px' }}>
      <Card title="Login">
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your Email!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login; 