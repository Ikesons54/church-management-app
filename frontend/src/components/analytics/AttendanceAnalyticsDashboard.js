import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Select, 
  DatePicker, 
  Table,
  Progress,
  Space 
} from 'antd';
import {
  LineChart,
  BarChart,
  PieChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { 
  UserOutlined, 
  RiseOutlined, 
  TeamOutlined,
  ClockCircleOutlined 
} from '@ant-design/icons';

const { RangePicker } = DatePicker;

const AttendanceAnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [dateRange, setDateRange] = useState([]);
  const [serviceType, setServiceType] = useState('all');
  const [analyticsData, setAnalyticsData] = useState({
    overview: {},
    trends: [],
    serviceBreakdown: [],
    memberEngagement: []
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange, dateRange, serviceType]);

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch('/api/analytics/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timeRange,
          dateRange,
          serviceType
        })
      });

      if (!response.ok) throw new Error('Failed to fetch analytics');
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Card title="Attendance Analytics">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Space>
              <Select 
                value={timeRange}
                onChange={setTimeRange}
                style={{ width: 120 }}
              >
                <Select.Option value="week">Week</Select.Option>
                <Select.Option value="month">Month</Select.Option>
                <Select.Option value="quarter">Quarter</Select.Option>
                <Select.Option value="year">Year</Select.Option>
              </Select>
              
              <RangePicker 
                onChange={setDateRange}
                format="YYYY-MM-DD"
              />

              <Select
                value={serviceType}
                onChange={setServiceType}
                style={{ width: 200 }}
              >
                <Select.Option value="all">All Services</Select.Option>
                <Select.Option value="sunday_service">Sunday Service</Select.Option>
                <Select.Option value="battle_ground">Battle Ground</Select.Option>
                <Select.Option value="begin_with_jesus">Begin with Jesus</Select.Option>
                <Select.Option value="time_with_jesus">Time with Jesus</Select.Option>
              </Select>
            </Space>
          </Col>
        </Row>

        {/* Overview Statistics */}
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Attendance"
                value={analyticsData.overview.totalAttendance}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Growth Rate"
                value={analyticsData.overview.growthRate}
                suffix="%"
                prefix={<RiseOutlined />}
                valueStyle={{ color: analyticsData.overview.growthRate >= 0 ? '#3f8600' : '#cf1322' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="New Members"
                value={analyticsData.overview.newMembers}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Retention Rate"
                value={analyticsData.overview.retentionRate}
                suffix="%"
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Attendance Trends Chart */}
        <Card title="Attendance Trends" style={{ marginTop: 16 }}>
          <LineChart
            width={800}
            height={300}
            data={analyticsData.trends}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="attendance" stroke="#8884d8" />
            <Line type="monotone" dataKey="onlineAttendance" stroke="#82ca9d" />
          </LineChart>
        </Card>

        {/* Service Breakdown */}
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={12}>
            <Card title="Service Breakdown">
              <PieChart width={400} height={300}>
                {/* Pie chart implementation */}
              </PieChart>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Member Engagement">
              <Table
                dataSource={analyticsData.memberEngagement}
                columns={[
                  {
                    title: 'Engagement Level',
                    dataIndex: 'level',
                    key: 'level',
                  },
                  {
                    title: 'Members',
                    dataIndex: 'count',
                    key: 'count',
                  },
                  {
                    title: 'Percentage',
                    dataIndex: 'percentage',
                    key: 'percentage',
                    render: (value) => (
                      <Progress percent={value} size="small" />
                    ),
                  },
                ]}
                pagination={false}
              />
            </Card>
          </Col>
        </Row>
      </Card>
    </Space>
  );
};

export default AttendanceAnalyticsDashboard; 