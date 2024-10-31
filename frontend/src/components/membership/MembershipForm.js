import React, { useState, useEffect } from 'react';
import { Form, Input, Select, DatePicker, Radio, Button, Card, message, Space, Typography, Spin } from 'antd';
import { UserOutlined, HomeOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

// Add marital status options
const maritalStatusOptions = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'widowed', label: 'Widowed' },
  { value: 'divorced', label: 'Divorced' }
];

// Add comprehensive nationality options
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
  { value: 'zimbabwe', label: 'Zimbabwean' },
  { value: 'zambia', label: 'Zambian' },
  { value: 'angola', label: 'Angolan' },
  { value: 'mozambique', label: 'Mozambican' },
  { value: 'ivory_coast', label: 'Ivorian' },
  { value: 'senegal', label: 'Senegalese' },
  { value: 'mali', label: 'Malian' },
  
  // Middle East
  { value: 'uae', label: 'Emirati' },
  { value: 'saudi', label: 'Saudi Arabian' },
  { value: 'oman', label: 'Omani' },
  { value: 'qatar', label: 'Qatari' },
  { value: 'bahrain', label: 'Bahraini' },
  { value: 'kuwait', label: 'Kuwaiti' },
  { value: 'lebanon', label: 'Lebanese' },
  { value: 'jordan', label: 'Jordanian' },
  
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
  { value: 'vietnam', label: 'Vietnamese' },
  { value: 'thailand', label: 'Thai' },
  { value: 'myanmar', label: 'Burmese' },
  
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
  { value: 'norway', label: 'Norwegian' },
  { value: 'denmark', label: 'Danish' },
  { value: 'finland', label: 'Finnish' },
  { value: 'ireland', label: 'Irish' },
  
  // Americas
  { value: 'usa', label: 'American' },
  { value: 'canada', label: 'Canadian' },
  { value: 'mexico', label: 'Mexican' },
  { value: 'brazil', label: 'Brazilian' },
  { value: 'argentina', label: 'Argentinian' },
  { value: 'colombia', label: 'Colombian' },
  { value: 'chile', label: 'Chilean' },
  { value: 'peru', label: 'Peruvian' },
  
  // Oceania
  { value: 'australia', label: 'Australian' },
  { value: 'new_zealand', label: 'New Zealander' },
  { value: 'fiji', label: 'Fijian' },
  
  // Other
  { value: 'other', label: 'Other' }
];

const MembershipForm = () => {
  const [memberId, setMemberId] = useState('');
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    generateMemberId();
  }, []);

  const generateMemberId = async () => {
    try {
      setFormLoading(true);
      const response = await fetch('http://localhost:5000/api/membership/generate-id');
      const data = await response.json();
      if (response.ok) {
        setMemberId(data.memberId);
      } else {
        message.error('Failed to generate member ID');
      }
    } catch (error) {
      message.error('Error connecting to server');
    } finally {
      setFormLoading(false);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formData = {
        ...values,
        memberId,
        birthday: values.birthday?.format('MM-DD'),
        dateJoined: values.dateJoined ? values.dateJoined.format('MM/YYYY') : null,
        applicationDate: new Date().toISOString()
      };

      const response = await fetch('http://localhost:5000/api/membership/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        message.success('Application submitted successfully! The church office will review your application.');
        form.resetFields();
        generateMemberId(); // Generate new ID for next application
      } else {
        const errorData = await response.json();
        message.error(errorData.message || 'Failed to submit application');
      }
    } catch (error) {
      message.error('Error submitting application. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (formLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <Text style={{ display: 'block', marginTop: '20px' }}>Loading membership form...</Text>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={2} style={{ color: '#4B0082' }}>Church Membership Application</Title>
            <Text strong>Member ID: {memberId}</Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              waterBaptism: false,
              holyGhostBaptism: false
            }}
          >
            {/* Personal Information */}
            <Title level={4}>Personal Information</Title>
            
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[
                { required: true, message: 'Please enter your first name' },
                { min: 2, message: 'Name must be at least 2 characters' },
                { pattern: /^[a-zA-Z\s]*$/, message: 'Name can only contain letters' }
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Enter your first name" />
            </Form.Item>

            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[
                { required: true, message: 'Please enter your last name' },
                { min: 2, message: 'Name must be at least 2 characters' },
                { pattern: /^[a-zA-Z\s]*$/, message: 'Name can only contain letters' }
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Enter your last name" />
            </Form.Item>

            <Form.Item
              name="maritalStatus"
              label="Marital Status"
              rules={[{ required: true, message: 'Please select your marital status' }]}
            >
              <Select placeholder="Select your marital status">
                {maritalStatusOptions.map(option => (
                  <Option key={option.value} value={option.value}>{option.label}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="birthday"
              label="Birthday"
              rules={[{ required: true, message: 'Please select your birthday' }]}
            >
              <DatePicker 
                picker="date" 
                format="MM-DD"
                style={{ width: '100%' }}
                placeholder="Select your birthday"
              />
            </Form.Item>

            <Form.Item
              name="nationality"
              label="Nationality"
              rules={[{ required: true, message: 'Please select your nationality' }]}
            >
              <Select
                showSearch
                placeholder="Select your nationality"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option?.label?.toLowerCase().includes(input.toLowerCase())
                }
              >
                {nationalityOptions.map(option => (
                  <Option key={option.value} value={option.value}>{option.label}</Option>
                ))}
              </Select>
            </Form.Item>

            {/* Contact Information */}
            <Title level={4}>Contact Information</Title>
            
            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[
                { required: true, message: 'Please enter your phone number' },
                { pattern: /^[0-9+\s-]+$/, message: 'Please enter a valid phone number' }
              ]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="Enter your phone number" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email address' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Enter your email address" />
            </Form.Item>

            <Form.Item
              name="address"
              label="Address in Abu Dhabi"
              rules={[
                { required: true, message: 'Please enter your address' },
                { min: 10, message: 'Please enter a complete address' }
              ]}
            >
              <Input.TextArea 
                placeholder="Enter your complete address in Abu Dhabi"
                rows={4}
              />
            </Form.Item>

            {/* Baptism Information */}
            <Title level={4}>Baptism Information</Title>
            
            <Form.Item
              name="waterBaptism"
              label="Have you been baptized by immersion (water)?"
              rules={[{ required: true, message: 'Please select yes or no' }]}
            >
              <Radio.Group>
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="holyGhostBaptism"
              label="Have you been baptized with the Holy Ghost?"
              rules={[{ required: true, message: 'Please select yes or no' }]}
            >
              <Radio.Group>
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>

            {/* Modified Date of Joining field */}
            <Form.Item
              name="dateJoined"
              label="Date of Joining (Optional)"
            >
              <DatePicker 
                picker="month" 
                format="MM/YYYY"
                style={{ width: '100%' }}
                placeholder="Select month and year of joining"
              />
            </Form.Item>

            {/* Emergency Contact Section (Optional) */}
            <Title level={4}>Emergency Contact (Optional)</Title>
            <Form.Item
              name={['emergencyContact', 'name']}
              label="Emergency Contact Name"
            >
              <Input placeholder="Full name of emergency contact" />
            </Form.Item>

            <Form.Item
              name={['emergencyContact', 'relationship']}
              label="Relationship"
            >
              <Select placeholder="Select relationship">
                <Option value="spouse">Spouse</Option>
                <Option value="parent">Parent</Option>
                <Option value="child">Child</Option>
                <Option value="sibling">Sibling</Option>
                <Option value="friend">Friend</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name={['emergencyContact', 'phone']}
              label="Emergency Contact Phone"
              rules={[
                { pattern: /^[0-9+\s-]+$/, message: 'Please enter a valid phone number' }
              ]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="Emergency contact phone number" />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit"
                size="large"
                loading={loading}
                style={{ 
                  width: '100%',
                  backgroundColor: '#4B0082'
                }}
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  );
};

export default MembershipForm;