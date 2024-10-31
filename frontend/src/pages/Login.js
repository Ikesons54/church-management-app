import React from 'react';
import { Form, Input, Button, Card, Typography, Space, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setCredentials } from '../features/auth/authSlice';
import logo from '../assets/images/logo.png';

const { Title, Text } = Typography;

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
        message.success('Welcome to COP Abu Dhabi! God bless you.', 3);
        dispatch(setCredentials({
          user: data.user,
          token: data.token
        }));
        navigate('/dashboard');
      } else {
        message.error('Unable to log in. Please try again or contact the church office.', 3);
      }
    } catch (error) {
      message.error('Unable to connect. Please check your internet connection.', 3);
    }
  };

  // Get current time to display appropriate greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f0f2f5'
    }}>
      <Space direction="vertical" align="center" size="large">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img 
            src={logo} 
            alt="COP Abu Dhabi"
            className="logo-spin"
            style={{ width: 100, marginBottom: 16 }} 
          />
          <Title level={2} style={{ margin: 0, color: '#4B0082' }}>
            The Church of Pentecost
          </Title>
          <Title level={3} style={{ margin: 0, color: '#6B238E' }}>
            Abu Dhabi - City Church
          </Title>
          <Text italic style={{ display: 'block', marginTop: 16, color: '#666' }}>
            "For where two or three gather in my name, there am I with them." - Matthew 18:20
          </Text>
        </div>

        <Card 
          title={
            <Text strong style={{ fontSize: '18px' }}>
              {getGreeting()}, Welcome to Our Digital Sanctuary
            </Text>
          }
          style={{ 
            width: 400,
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            borderRadius: 8
          }}
        >
          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            size="large"
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please enter your email' }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Your Email Address"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Your Password"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                style={{ 
                  width: '100%',
                  height: 45,
                  backgroundColor: '#4B0082',
                  fontSize: '16px'
                }}
              >
                Sign In
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center' }}>
              <Text>
                New to our church? <Link to="/register" style={{ color: '#4B0082' }}>Join our family!</Link>
              </Text>
            </div>
          </Form>
        </Card>

        <Text type="secondary" style={{ fontSize: '16px' }}>
          Join us in worship and fellowship
        </Text>
        
        <Text type="secondary">
          Need help? Contact the church office at +971 XX XXX XXXX
        </Text>
      </Space>
    </div>
  );
};

export default Login;