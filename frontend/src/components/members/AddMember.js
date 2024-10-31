import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Button, 
  message, 
  Space 
} from 'antd';
import { useNavigate } from 'react-router-dom';
import MemberForm from './MemberForm';

const AddMember = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values)
      });

      if (!response.ok) throw new Error('Failed to add member');

      message.success('Member added successfully');
      navigate('/members');
    } catch (error) {
      message.error('Error adding member: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Add New Member">
      <MemberForm 
        form={form} 
        onFinish={handleSubmit}
      />
      <Space style={{ marginTop: 16 }}>
        <Button 
          type="primary" 
          onClick={() => form.submit()}
          loading={loading}
        >
          Add Member
        </Button>
        <Button onClick={() => navigate('/members')}>
          Cancel
        </Button>
      </Space>
    </Card>
  );
};

export default AddMember; 