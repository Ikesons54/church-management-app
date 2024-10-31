import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Descriptions, 
  Space, 
  Button, 
  Tag,
  message,
  Row,
  Col,
  Avatar 
} from 'antd';
import { 
  UserOutlined, 
  PhoneOutlined, 
  MailOutlined,
  EditOutlined 
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';

const MemberProfile = () => {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const { memberId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMemberDetails();
  }, [memberId]);

  const fetchMemberDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/members/${memberId}`);
      if (!response.ok) throw new Error('Failed to fetch member details');
      const data = await response.json();
      setMember(data);
    } catch (error) {
      message.error('Error fetching member details: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Card loading={true} />;
  if (!member) return <Card>Member not found</Card>;

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Card>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Avatar size={200} icon={<UserOutlined />} />
          </Col>
          <Col span={18}>
            <Descriptions title="Member Information" bordered>
              <Descriptions.Item label="Member ID">{member.memberId}</Descriptions.Item>
              <Descriptions.Item label="Full Name">
                {`${member.firstName} ${member.lastName}`}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={member.status === 'active' ? 'green' : 'orange'}>
                  {member.status?.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                <Space>
                  <PhoneOutlined />
                  {member.phone}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                <Space>
                  <MailOutlined />
                  {member.email}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Address">
                {member.address}
              </Descriptions.Item>
              <Descriptions.Item label="Date Joined">
                {new Date(member.dateJoined).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Water Baptism">
                {member.waterBaptism ? 'Yes' : 'No'}
              </Descriptions.Item>
              <Descriptions.Item label="Holy Ghost Baptism">
                {member.holyGhostBaptism ? 'Yes' : 'No'}
              </Descriptions.Item>
            </Descriptions>

            <Space style={{ marginTop: 16 }}>
              <Button 
                type="primary" 
                icon={<EditOutlined />}
                onClick={() => navigate(`/members/edit/${member.memberId}`)}
              >
                Edit Profile
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
    </Space>
  );
};

export default MemberProfile; 