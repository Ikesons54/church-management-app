import React, { useState, useCallback } from 'react';
import { 
  Card, 
  Table, 
  DatePicker, 
  Button, 
  Space, 
  Select, 
  Tag, 
  Row, 
  Col, 
  Statistic,
  Input,
  Modal,
  Form,
  Tooltip,
  Badge
} from 'antd';
import { 
  UserOutlined, 
  CalendarOutlined, 
  CheckCircleOutlined,
  SyncOutlined,
  DownloadOutlined,
  UploadOutlined,
  EditOutlined
} from '@ant-design/icons';
import { useAttendanceData } from '../../hooks/useAttendanceData';
import { calculateAttendanceStats, formatAttendanceForExport } from '../../utils/attendanceUtils';
import { exportToExcel } from '../../utils/exportService';
import moment from 'moment';
import { message } from 'antd';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';

const { Search } = Input;
const { Option } = Select;

const AttendanceTracker = () => {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [serviceType, setServiceType] = useState('sunday_first');
  const [searchText, setSearchText] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [form] = Form.useForm();

  const { 
    data, 
    loading, 
    error, 
    fetchData, 
    markAttendance, 
    isOnline, 
    pendingSyncCount 
  } = useAttendanceData('church');

  const handleDateChange = useCallback((date) => {
    setSelectedDate(date);
    fetchData({ date: date.format('YYYY-MM-DD'), serviceType });
  }, [fetchData, serviceType]);

  const handleServiceChange = useCallback((value) => {
    setServiceType(value);
    fetchData({ date: selectedDate.format('YYYY-MM-DD'), serviceType: value });
  }, [fetchData, selectedDate]);

  const handleSearch = useCallback((value) => {
    setSearchText(value);
  }, []);

  const handleExport = useCallback(() => {
    if (!data) return;
    const exportData = formatAttendanceForExport([{
      date: selectedDate,
      serviceType,
      stats: calculateAttendanceStats(data.members),
      categories: data.categories,
      notes: data.notes
    }]);
    exportToExcel(exportData, `attendance_${selectedDate.format('YYYY-MM-DD')}`);
  }, [data, selectedDate, serviceType]);

  const handleEdit = useCallback((member) => {
    setEditingMember(member);
    form.setFieldsValue(member);
    setEditModalVisible(true);
  }, [form]);

  const columns = [
    {
      title: 'Member ID',
      dataIndex: 'memberId',
      key: 'memberId',
      width: 120,
      fixed: 'left'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <Space>
          {`${record.firstName} ${record.lastName}`}
          {record.isFirstTimer && (
            <Tag color="green">First Timer</Tag>
          )}
        </Space>
      ),
      filterable: true,
      width: 200
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => (
        <Tag color={
          category === 'adult' ? 'blue' : 
          category === 'youth' ? 'green' : 
          'orange'
        }>
          {category.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Adult', value: 'adult' },
        { text: 'Youth', value: 'youth' },
        { text: 'Children', value: 'children' }
      ],
      width: 120
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Tag color={record.status === 'present' ? 'green' : 'red'}>
          {record.status?.toUpperCase()}
        </Tag>
      ),
      width: 100
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button 
            type="primary"
            size="small"
            onClick={() => markAttendance({
              memberId: record.memberId,
              status: 'present'
            })}
            disabled={record.status === 'present'}
          >
            Present
          </Button>
          <Button
            danger
            size="small"
            onClick={() => markAttendance({
              memberId: record.memberId,
              status: 'absent'
            })}
            disabled={record.status === 'absent'}
          >
            Absent
          </Button>
          <Tooltip title="Edit Details">
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <ErrorBoundary>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card>
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <DatePicker
                value={selectedDate}
                onChange={handleDateChange}
                style={{ width: '100%' }}
              />
            </Col>
            <Col span={6}>
              <Select
                value={serviceType}
                onChange={handleServiceChange}
                style={{ width: '100%' }}
              >
                <Option value="sunday_first">Sunday First Service</Option>
                <Option value="sunday_second">Sunday Second Service</Option>
                <Option value="bible_study">Bible Study</Option>
                <Option value="prayer_meeting">Prayer Meeting</Option>
              </Select>
            </Col>
            <Col span={6}>
              <Search
                placeholder="Search members..."
                onSearch={handleSearch}
                style={{ width: '100%' }}
              />
            </Col>
            <Col span={6}>
              <Space>
                <Tooltip title="Export Attendance">
                  <Button 
                    icon={<DownloadOutlined />}
                    onClick={handleExport}
                    disabled={!data}
                  >
                    Export
                  </Button>
                </Tooltip>
                <Tooltip title={`${pendingSyncCount} records pending sync`}>
                  <Badge count={pendingSyncCount} offset={[-10, 0]}>
                    <Button
                      icon={<SyncOutlined spin={!isOnline} />}
                      disabled={isOnline || pendingSyncCount === 0}
                    >
                      Sync
                    </Button>
                  </Badge>
                </Tooltip>
              </Space>
            </Col>
          </Row>
        </Card>

        <Card>
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Statistic
                title="Total Members"
                value={data?.stats.total || 0}
                prefix={<UserOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Present"
                value={data?.stats.present || 0}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Absent"
                value={data?.stats.absent || 0}
                valueStyle={{ color: '#cf1322' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Attendance Rate"
                value={data?.stats.rate || 0}
                suffix="%"
                precision={1}
              />
            </Col>
          </Row>
        </Card>

        <Table
          columns={columns}
          dataSource={data?.members.filter(member => 
            member.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
            member.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
            member.memberId.includes(searchText)
          )}
          rowKey="memberId"
          loading={loading}
          scroll={{ x: 1000 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} members`
          }}
        />

        <Modal
          title="Edit Member Details"
          visible={editModalVisible}
          onOk={() => form.submit()}
          onCancel={() => {
            setEditModalVisible(false);
            setEditingMember(null);
            form.resetFields();
          }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={async (values) => {
              try {
                await markAttendance({
                  ...editingMember,
                  ...values
                });
                setEditModalVisible(false);
                setEditingMember(null);
                form.resetFields();
              } catch (error) {
                message.error('Failed to update member details');
              }
            }}
          >
            {/* Form fields */}
          </Form>
        </Modal>
      </Space>
    </ErrorBoundary>
  );
};

export default AttendanceTracker; 