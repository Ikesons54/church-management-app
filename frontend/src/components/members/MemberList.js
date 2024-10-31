import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Card, 
  Button, 
  Space, 
  Tag, 
  Input,
  message 
} from 'antd';
import { 
  UserOutlined, 
  EditOutlined, 
  DeleteOutlined,
  SearchOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/members');
      if (!response.ok) throw new Error('Failed to fetch members');
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      message.error('Error fetching members: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Member ID',
      dataIndex: 'memberId',
      key: 'memberId',
      sorter: (a, b) => a.memberId.localeCompare(b.memberId)
    },
    {
      title: 'Name',
      dataIndex: 'firstName',
      key: 'name',
      render: (_, record) => `${record.firstName} ${record.lastName}`,
      sorter: (a, b) => a.firstName.localeCompare(b.firstName)
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Tag color={record.status === 'active' ? 'green' : 'orange'}>
          {record.status?.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' }
      ],
      onFilter: (value, record) => record.status === value
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => navigate(`/members/edit/${record.memberId}`)}
          >
            Edit
          </Button>
          <Button 
            icon={<UserOutlined />}
            onClick={() => navigate(`/members/profile/${record.memberId}`)}
          >
            View
          </Button>
        </Space>
      )
    }
  ];

  return (
    <Card title="Church Members">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space style={{ marginBottom: 16 }}>
          <Input.Search
            placeholder="Search members..."
            allowClear
            onSearch={(value) => {
              // Implement search functionality
            }}
            style={{ width: 300 }}
          />
          <Button 
            type="primary"
            onClick={() => navigate('/members/add')}
          >
            Add New Member
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={members}
          rowKey="memberId"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} members`
          }}
        />
      </Space>
    </Card>
  );
};

export default MemberList; 