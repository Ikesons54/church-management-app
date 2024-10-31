import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Space, Steps, message, DatePicker, Select, Option } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';

const { Title, Text } = Typography;
const { Step } = Steps;

// Daily Bible Verses - Extended List
const bibleVerses = [
  { verse: "For where two or three gather in my name, there am I with them.", reference: "Matthew 18:20" },
  { verse: "I was glad when they said unto me, Let us go into the house of the LORD.", reference: "Psalm 122:1" },
  { verse: "But those who hope in the Lord will renew their strength.", reference: "Isaiah 40:31" },
  { verse: "This is the day that the Lord has made; let us rejoice and be glad in it.", reference: "Psalm 118:24" },
  { verse: "Your word is a lamp for my feet, a light on my path.", reference: "Psalm 119:105" },
  { verse: "The Lord is my shepherd; I shall not want.", reference: "Psalm 23:1" },
  { verse: "Trust in the LORD with all your heart.", reference: "Proverbs 3:5" },
  { verse: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.", reference: "Joshua 1:9" },
  { verse: "The Lord bless you and keep you; the Lord make his face shine on you and be gracious to you.", reference: "Numbers 6:24-25" },
  { verse: "Come to me, all you who are weary and burdened, and I will give you rest.", reference: "Matthew 11:28" },
  { verse: "And we know that in all things God works for the good of those who love him.", reference: "Romans 8:28" },
  { verse: "I can do all this through him who gives me strength.", reference: "Philippians 4:13" },
  { verse: "Be still, and know that I am God.", reference: "Psalm 46:10" },
  { verse: "Give thanks to the Lord, for he is good; his love endures forever.", reference: "Psalm 107:1" },
  { verse: "Let everything that has breath praise the Lord.", reference: "Psalm 150:6" }
];

// Nationality Select Options - Comprehensive List
const nationalityOptions = [
  // Africa
  { value: 'ghana', label: 'Ghanaian' },
  { value: 'nigeria', label: 'Nigerian' },
  { value: 'kenya', label: 'Kenyan' },
  { value: 'south_africa', label: 'South African' },
  { value: 'ethiopia', label: 'Ethiopian' },
  { value: 'uganda', label: 'Ugandan' },
  { value: 'tanzania', label: 'Tanzanian' },
  { value: 'cameroon', label: 'Cameroonian' },
  
  // Middle East
  { value: 'uae', label: 'Emirati' },
  { value: 'saudi', label: 'Saudi Arabian' },
  { value: 'oman', label: 'Omani' },
  { value: 'qatar', label: 'Qatari' },
  { value: 'bahrain', label: 'Bahraini' },
  { value: 'kuwait', label: 'Kuwaiti' },
  
  // Asia
  { value: 'india', label: 'Indian' },
  { value: 'pakistan', label: 'Pakistani' },
  { value: 'bangladesh', label: 'Bangladeshi' },
  { value: 'philippines', label: 'Filipino' },
  { value: 'china', label: 'Chinese' },
  { value: 'indonesia', label: 'Indonesian' },
  { value: 'malaysia', label: 'Malaysian' },
  { value: 'sri_lanka', label: 'Sri Lankan' },
  { value: 'nepal', label: 'Nepalese' },
  
  // Europe
  { value: 'uk', label: 'British' },
  { value: 'france', label: 'French' },
  { value: 'germany', label: 'German' },
  { value: 'italy', label: 'Italian' },
  { value: 'spain', label: 'Spanish' },
  { value: 'portugal', label: 'Portuguese' },
  { value: 'netherlands', label: 'Dutch' },
  { value: 'belgium', label: 'Belgian' },
  { value: 'sweden', label: 'Swedish' },
  
  // Americas
  { value: 'usa', label: 'American' },
  { value: 'canada', label: 'Canadian' },
  { value: 'mexico', label: 'Mexican' },
  { value: 'brazil', label: 'Brazilian' },
  { value: 'argentina', label: 'Argentinian' },
  { value: 'colombia', label: 'Colombian' },
  
  // Oceania
  { value: 'australia', label: 'Australian' },
  { value: 'new_zealand', label: 'New Zealander' },
  
  // Other
  { value: 'other', label: 'Other' }
];

const Register = () => {
  const [form] = Form.useForm();
  const [current, setCurrent] = React.useState(0);
  const navigate = useNavigate();
  const [dailyVerse, setDailyVerse] = useState(bibleVerses[0]);

  useEffect(() => {
    // Get today's date and use it to select a verse
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const verseIndex = dayOfYear % bibleVerses.length;
    setDailyVerse(bibleVerses[verseIndex]);
  }, []);

  const steps = [
    {
      title: 'Personal Info',
      content: (
        <>
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
            name="phone"
            rules={[{ required: true, message: 'Please input your Phone Number!' }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
          </Form.Item>
          <Form.Item
            name="dateOfBirth"
            rules={[{ required: true, message: 'Please input your Date of Birth!' }]}
          >
            <DatePicker style={{ width: '100%' }} placeholder="Date of Birth" />
          </Form.Item>
          <Form.Item
            name="nationality"
            rules={[{ required: true, message: 'Please select your Nationality!' }]}
          >
            <Select
              showSearch
              placeholder="Select your Nationality"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              options={nationalityOptions}
            />
          </Form.Item>
        </>
      ),
    },
    {
      title: 'Church Info',
      content: (
        <>
          <Form.Item
            name="ministry"
            rules={[{ required: true, message: 'Please select your Ministry!' }]}
          >
            <Select placeholder="Select Ministry">
              <Option value="youth">Youth Ministry (12-35 years)</Option>
              <Option value="women">Women's Ministry (Pentecost Women's Movement)</Option>
              <Option value="men">Men's Ministry (Pentecost Men's Fellowship)</Option>
              <Option value="children">Children's Ministry (0-12 years)</Option>
              <Option value="evangelism">Evangelism Ministry</Option>
              <Option value="choir">Church Choir</Option>
              <Option value="media">Media Team</Option>
              <Option value="protocol">Protocol Department</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="assembly"
            rules={[{ required: true, message: 'Please select your Assembly!' }]}
          >
            <Select placeholder="Select Assembly">
              <Option value="main">Main Assembly - Abu Dhabi</Option>
              <Option value="alain">Al Ain Assembly</Option>
              <Option value="musaffah">Musaffah Assembly</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="membershipStatus"
            rules={[{ required: true, message: 'Please select your Membership Status!' }]}
          >
            <Select placeholder="Membership Status">
              <Option value="baptized">Baptized Member</Option>
              <Option value="newConvert">New Convert</Option>
              <Option value="visitor">Visitor</Option>
              <Option value="transfer">Transfer from another Assembly</Option>
            </Select>
          </Form.Item>
        </>
      ),
    },
    {
      title: 'Account Setup',
      content: (
        <>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your Password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your Password!' },
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
        </>
      ),
    },
  ];

  const next = async () => {
    try {
      await form.validateFields(steps[current].formFields);
      setCurrent(current + 1);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

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
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f0f2f5',
      padding: '20px 0'
    }}>
      <Space direction="vertical" align="center" size="large">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img 
            src={logo} 
            alt="COP Abu Dhabi"
            className="logo-spin"
            style={{ width: 80, marginBottom: 16 }} 
          />
          <Title level={2} style={{ margin: 0, color: '#4B0082' }}>
            Join Our Church
          </Title>
          <Text type="secondary">
            Register to become a member of COP Abu Dhabi
          </Text>
          <Text italic style={{ display: 'block', marginTop: 16, color: '#666' }}>
            "{dailyVerse.verse}" - {dailyVerse.reference}
          </Text>
        </div>

        <Card 
          style={{ 
            width: 500,
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            borderRadius: 8
          }}
        >
          <Steps current={current} style={{ marginBottom: 24 }}>
            {steps.map(item => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>

          <Form
            form={form}
            name="register"
            onFinish={onFinish}
            size="large"
            layout="vertical"
          >
            {steps[current].content}

            <Form.Item>
              <div style={{ marginTop: 24 }}>
                {current > 0 && (
                  <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                    Previous
                  </Button>
                )}
                {current < steps.length - 1 && (
                  <Button type="primary" onClick={() => next()}>
                    Next
                  </Button>
                )}
                {current === steps.length - 1 && (
                  <Button type="primary" htmlType="submit">
                    Register
                  </Button>
                )}
              </div>
            </Form.Item>
          </Form>
        </Card>

        <Text>
          Already have an account? <Link to="/login" style={{ color: '#4B0082' }}>Login now!</Link>
        </Text>
      </Space>
    </div>
  );
};

export default Register; 