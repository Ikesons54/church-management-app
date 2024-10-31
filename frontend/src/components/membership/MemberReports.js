import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Table, 
  Select, 
  DatePicker,
  Button,
  Space,
  Pie,
  Bar
} from 'antd';
import {
  UserOutlined,
  GlobalOutlined,
  HomeOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { Chart } from '@antv/g2';

const { RangePicker } = DatePicker;

const MemberReports = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [dateRange, setDateRange] = useState(null);

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/membership/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dateRange })
      });
      
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/membership/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dateRange })
      });
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `member-report-${new Date().toISOString()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Report Controls */}
        <Card>
          <Space>
            <RangePicker 
              onChange={setDateRange}
              format="YYYY-MM-DD"
            />
            <Button 
              type="primary"
              icon={<DownloadOutlined />}
              onClick={exportReport}
            >
              Export Report
            </Button>
          </Space>
        </Card>

        {/* Overview Statistics */}
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Members"
                value={reportData?.totalMembers || 0}
                prefix={<UserOutlined />}
                loading={loading}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Water Baptized"
                value={reportData?.waterBaptizedCount || 0}
                suffix={`(${reportData?.waterBaptizedPercentage || 0}%)`}
                loading={loading}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Holy Ghost Baptized"
                value={reportData?.holyGhostBaptizedCount || 0}
                suffix={`(${reportData?.holyGhostBaptizedPercentage || 0}%)`}
                loading={loading}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="New Members This Month"
                value={reportData?.newMembersThisMonth || 0}
                loading={loading}
              />
            </Card>
          </Col>
        </Row>

        {/* Demographic Charts */}
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Card title="Marital Status Distribution">
              <Pie
                data={reportData?.maritalStatusDistribution || []}
                angleField="value"
                colorField="type"
                radius={0.8}
                label={{
                  type: 'outer',
                  content: '{name}: {percentage}'
                }}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Nationality Distribution (Top 10)">
              <Bar
                data={reportData?.nationalityDistribution?.slice(0, 10) || []}
                xField="value"
                yField="nationality"
                seriesField="nationality"
                legend={false}
                label={{
                  position: 'right'
                }}
              />
            </Card>
          </Col>
        </Row>

        {/* Detailed Member Table */}
        <Card title="Member Details">
          <Table
            loading={loading}
            dataSource={reportData?.members || []}
            columns={[
              {
                title: 'Member ID',
                dataIndex: 'memberId',
                key: 'memberId',
              },
              {
                title: 'Name',
                dataIndex: 'firstName',
                key: 'name',
                render: (_, record) => `${record.firstName} ${record.lastName}`,
              },
              {
                title: 'Nationality',
                dataIndex: 'nationality',
                key: 'nationality',
              },
              {
                title: 'Marital Status',
                dataIndex: 'maritalStatus',
                key: 'maritalStatus',
              },
              {
                title: 'Water Baptized',
                dataIndex: 'waterBaptism',
                key: 'waterBaptism',
                render: value => value ? 'Yes' : 'No',
              },
              {
                title: 'Holy Ghost Baptized',
                dataIndex: 'holyGhostBaptism',
                key: 'holyGhostBaptism',
                render: value => value ? 'Yes' : 'No',
              },
              {
                title: 'Join Date',
                dataIndex: 'dateJoined',
                key: 'dateJoined',
                render: date => date ? date : 'Not Specified',
                sorter: (a, b) => {
                  if (!a.dateJoined) return 1;
                  if (!b.dateJoined) return -1;
                  return new Date(a.dateJoined) - new Date(b.dateJoined);
                }
              }
            ]}
            pagination={{
              total: reportData?.totalMembers,
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} of ${total} members`
            }}
          />
        </Card>
      </Space>
    </div>
  );
};

export default MemberReports; 