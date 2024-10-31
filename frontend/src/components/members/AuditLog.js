import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Card, 
  Space, 
  Tag, 
  DatePicker, 
  Select,
  Button 
} from 'antd';
import { 
  UserOutlined, 
  ClockCircleOutlined,
  ExportOutlined 
} from '@ant-design/icons';
import { exportToExcel } from '../utils/exportService';

const { RangePicker } = DatePicker;

const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateRange: null,
    action: null,
    user: null
  });

  useEffect(() => {
    fetchAuditLogs();
  }, [filters]);

  const fetchAuditLogs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/audit-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters)
      });
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: timestamp => new Date(timestamp).toLocaleString(),
      sorter: (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    },
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      render: user => (
        <Space>
          <UserOutlined />
          {user.name}
        </Space>
      )
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: action => (
        <Tag color={
          action.includes('CREATE') ? 'green' :
          action.includes('UPDATE') ? 'blue' :
          action.includes('DELETE') ? 'red' : 'default'
        }>
          {action}
        </Tag>
      )
    },
    {
      title: 'Details',
      dataIndex: 'details',
      key: 'details'
    },
    {
      title: 'IP Address',
      dataIndex: 'ipAddress',
      key: 'ipAddress'
    }
  ];

  const handleExport = () => {
    exportToExcel(logs, 'audit-logs');
  };

  return (
    <Card title="Audit Logs">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space>
          <RangePicker 
            onChange={(dates) => setFilters(prev => ({ ...prev, dateRange: dates }))}
          />
          <Select
            placeholder="Filter by action"
            style={{ width: 200 }}
            onChange={(value) => setFilters(prev => ({ ...prev, action: value }))}
          >
            <Select.Option value="CREATE">Create</Select.Option>
            <Select.Option value="UPDATE">Update</Select.Option>
            <Select.Option value="DELETE">Delete</Select.Option>
          </Select>
          <Button 
            type="primary" 
            icon={<ExportOutlined />}
            onClick={handleExport}
          >
            Export Logs
          </Button>
        </Space>

        <Table 
          columns={columns}
          dataSource={logs}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} logs`
          }}
        />
      </Space>
    </Card>
  );
};

export default AuditLog; 