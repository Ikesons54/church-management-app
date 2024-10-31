import React, { useState, useEffect } from 'react';
import { Table, Badge, Button, Space, Modal, Card, Typography, message } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const MembershipReview = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch applications
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/admin/membership-applications');
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      message.error('Error fetching applications');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Handle application approval/rejection
  const handleStatusUpdate = async (memberId, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/membership-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ memberId, status }),
      });

      if (response.ok) {
        message.success(`Application ${status === 'approved' ? 'approved' : 'rejected'}`);
        fetchApplications();
      }
    } catch (error) {
      message.error('Error updating application status');
    }
  };

  const columns = [
    {
      title: 'Member ID',
      dataIndex: 'memberId',
      key: 'memberId',
    },
    {
      title: 'Name',
      key: 'name',
      render: (text, record) => (
        `${record.firstName} ${record.middleName ? record.middleName + ' ' : ''}${record.lastName}`
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge 
          status={
            status === 'approved' ? 'success' :
            status === 'rejected' ? 'error' :
            'processing'
          } 
          text={status.charAt(0).toUpperCase() + status.slice(1)}
        />
      ),
    },
    {
      title: 'Application Date',
      dataIndex: 'applicationDate',
      key: 'applicationDate',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space>
          <Button 
            icon={<EyeOutlined />} 
            onClick={() => {
              setSelectedMember(record);
              setModalVisible(true);
            }}
          >
            View
          </Button>
          {record.status === 'pending' && (
            <>
              <Button 
                type="primary" 
                icon={<CheckOutlined />}
                onClick={() => handleStatusUpdate(record.memberId, 'approved')}
                style={{ backgroundColor: '#4B0082' }}
              >
                Approve
              </Button>
              <Button 
                danger 
                icon={<CloseOutlined />}
                onClick={() => handleStatusUpdate(record.memberId, 'rejected')}
              >
                Reject
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={2} style={{ color: '#4B0082', marginBottom: '24px' }}>
          Membership Applications Review
        </Title>

        <Table 
          columns={columns} 
          dataSource={applications}
          loading={loading}
          rowKey="memberId"
        />

        <Modal
          title="Application Details"
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={800}
        >
          {selectedMember && (
            <Card>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Title level={4}>Personal Information</Title>
                <Text strong>Member ID:</Text> <Text>{selectedMember.memberId}</Text>
                <Text strong>Full Name:</Text> 
                <Text>
                  {`${selectedMember.firstName} ${selectedMember.middleName ? selectedMember.middleName + ' ' : ''}${selectedMember.lastName}`}
                </Text>
                <Text strong>Nationality:</Text> <Text>{selectedMember.nationality}</Text>
                <Text strong>Birthday:</Text> <Text>{selectedMember.birthday}</Text>

                <Title level={4}>Contact Information</Title>
                <Text strong>Email:</Text> <Text>{selectedMember.email}</Text>
                <Text strong>Phone:</Text> <Text>{selectedMember.phone}</Text>
                <Text strong>Address:</Text> <Text>{selectedMember.address}</Text>

                <Title level={4}>Baptism Information</Title>
                <Text strong>Water Baptism:</Text> <Text>{selectedMember.waterBaptism ? 'Yes' : 'No'}</Text>
                {selectedMember.waterBaptism && (
                  <>
                    <Text strong>Date:</Text> <Text>{selectedMember.waterBaptismDate}</Text>
                    <Text strong>Place:</Text> <Text>{selectedMember.waterBaptismPlace}</Text>
                    <Text strong>Church:</Text> <Text>{selectedMember.waterBaptismChurch}</Text>
                  </>
                )}
                <Text strong>Holy Ghost Baptism:</Text> <Text>{selectedMember.holyGhostBaptism ? 'Yes' : 'No'}</Text>
                {selectedMember.holyGhostBaptism && (
                  <>
                    <Text strong>Date Received:</Text> <Text>{selectedMember.holyGhostBaptismDate}</Text>
                    <Text strong>Speaking in Tongues:</Text> <Text>{selectedMember.speakingInTongues ? 'Yes' : 'No'}</Text>
                  </>
                )}
              </Space>
            </Card>
          )}
        </Modal>
      </Card>
    </div>
  );
};

export default MembershipReview; 