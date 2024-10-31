import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Select, 
  DatePicker,
  Space 
} from 'antd';
import { 
  UserOutlined, 
  RiseOutlined,
  TeamOutlined,
  CheckCircleOutlined 
} from '@ant-design/icons';
import { Line, Pie } from '@ant-design/plots';
import moment from 'moment';
import PropTypes from 'prop-types';

const { RangePicker } = DatePicker;

const MemberAnalytics = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/membership/analytics?timeRange=${timeRange}`);
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Controls */}
        <Card>
          <Space>
            <Select 
              value={timeRange}
              onChange={setTimeRange}
              style={{ width: 120 }}
            >
              <Select.Option value="week">Week</Select.Option>
              <Select.Option value="month">Month</Select.Option>
              <Select.Option value="year">Year</Select.Option>
            </Select>
            <RangePicker />
          </Space>
        </Card>

        {/* Key Metrics */}
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Members"
                value={analytics?.totalMembers}
                prefix={<TeamOutlined />}
                loading={loading}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="New Members"
                value={analytics?.newMembers}
                prefix={<RiseOutlined />}
                loading={loading}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Water Baptized"
                value={analytics?.waterBaptized}
                prefix={<CheckCircleOutlined />}
                loading={loading}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Holy Ghost Baptized"
                value={analytics?.holyGhostBaptized}
                prefix={<CheckCircleOutlined />}
                loading={loading}
              />
            </Card>
          </Col>
        </Row>

        {/* Growth Charts */}
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Card title="Membership Growth">
              <Line
                data={analytics?.growthData || []}
                xField="date"
                yField="members"
                point={{
                  size: 5,
                  shape: 'diamond',
                }}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Nationality Distribution">
              <Pie
                data={analytics?.nationalityData || []}
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
        </Row>
      </Space>
    </div>
  );
};

MemberAnalytics.propTypes = {
  timeRange: PropTypes.string,
  onTimeRangeChange: PropTypes.func
};

export default MemberAnalytics; 