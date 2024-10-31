import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Card, 
  Table, 
  Button, 
  Space, 
  Input, 
  Row, 
  Col,
  Statistic,
  Tag,
  Modal 
} from 'antd';
import {
  UserAddOutlined,
  SearchOutlined,
  TeamOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchMembers, 
  setFilters 
} from '../../store/slices/memberSlice';
import MemberRegistrationForm from './MemberRegistrationForm';
import MemberFilters from './MemberFilters';

const { Content } = Layout;
const { Search } = Input;

const MemberDashboard = () => {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const dispatch = useDispatch();
  const { 
    members, 
    loading, 
    filters,
    pagination 
  } = useSelector(state => state.members);

  useEffect(() => {
    dispatch(fetchMembers(filters));
  }, [dispatch, filters]);

  const columns = [
    {
      title: 'Member ID',
      dataIndex: 'membershipId',
      key: 'membershipId',
      sorter: true
    },
    {
      title: 'Name',
      dataIndex: ['personalInfo', 'firstName'],
      key: 'name',
      render: (_, record) => (
        <Space>
          {record.personalInfo.photo && (
            <img 
              src={record.personalInfo.photo} 
              alt="profile" 
              style={{ width: 32, height: 32, borderRadius: '50%' }} 
            />
          )}
          {`${record.personalInfo.firstName} ${record.personalInfo.lastName}`}
        </Space>
      )
    },
    // ... more columns
  ];

  return (
    <Layout>
      <Content style={{ padding: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Button 
                type="primary" 
                icon={<UserAddOutlined />}
                onClick={() => setShowRegistrationForm(true)}
              >
                Add New Member
              </Button>
              <Search 
                placeholder="Search members..." 
                style={{ width: 300 }}
                onChange={e => dispatch(setFilters({ search: e.target.value }))}
              />
            </Space>
          </Col>

          <Col span={24}>
            <Card>
              <MemberFilters />
              <Table 
                columns={columns}
                dataSource={members}
                loading={loading}
                rowKey="_id"
                pagination={{
                  total: pagination.total,
                  pageSize: pagination.pageSize,
                  current: pagination.current
                }}
                onChange={(pagination, filters, sorter) => {
                  dispatch(setFilters({
                    page: pagination.current,
                    sortField: sorter.field,
                    sortOrder: sorter.order
                  }));
                }}
              />
            </Card>
          </Col>
        </Row>

        <Modal
          title="New Member Registration"
          open={showRegistrationForm}
          onCancel={() => setShowRegistrationForm(false)}
          width={800}
          footer={null}
        >
          <MemberRegistrationForm 
            onSuccess={() => setShowRegistrationForm(false)}
          />
        </Modal>
      </Content>
    </Layout>
  );
};

export default MemberDashboard; 