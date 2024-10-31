import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Button, 
  message, 
  Space,
  Spin,
  Modal 
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import MemberForm from './MemberForm';

const { confirm } = Modal;

const EditMember = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [member, setMember] = useState(null);
  const navigate = useNavigate();
  const { memberId } = useParams();

  useEffect(() => {
    fetchMemberDetails();
  }, [memberId]);

  const fetchMemberDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/members/${memberId}`);
      if (!response.ok) throw new Error('Failed to fetch member details');
      const data = await response.json();
      setMember(data);
      form.setFieldsValue(data);
    } catch (error) {
      message.error('Error fetching member details: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      const response = await fetch(`http://localhost:5000/api/members/${memberId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values)
      });

      if (!response.ok) throw new Error('Failed to update member');

      message.success('Member updated successfully');
      navigate('/members');
    } catch (error) {
      message.error('Error updating member: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    confirm({
      title: 'Are you sure you want to delete this member?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/members/${memberId}`, {
            method: 'DELETE'
          });

          if (!response.ok) throw new Error('Failed to delete member');

          message.success('Member deleted successfully');
          navigate('/members');
        } catch (error) {
          message.error('Error deleting member: ' + error.message);
        }
      }
    });
  };

  if (loading) return <Card><Spin /></Card>;

  return (
    <Card 
      title="Edit Member"
      extra={
        <Button danger onClick={handleDelete}>
          Delete Member
        </Button>
      }
    >
      <MemberForm 
        form={form} 
        initialValues={member}
      />
      <Space style={{ marginTop: 16 }}>
        <Button 
          type="primary" 
          onClick={() => form.submit()}
          loading={saving}
        >
          Save Changes
        </Button>
        <Button onClick={() => navigate('/members')}>
          Cancel
        </Button>
      </Space>
    </Card>
  );
};

export default EditMember; 