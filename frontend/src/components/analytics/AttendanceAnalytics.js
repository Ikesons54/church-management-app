import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Select, 
  DatePicker, 
  Table, 
  Button, 
  Space,
  Statistic,
  Tabs 
} from 'antd';
import { 
  Line, 
  Column, 
  Pie,
  DualAxes 
} from '@ant-design/plots';
import { 
  DownloadOutlined,
  UserOutlined,
  RiseOutlined,
  TeamOutlined 
} from '@ant-design/icons';
import moment from 'moment';
import { exportToExcel } from '../../utils/exportService';
import { message } from 'antd';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

const AttendanceAnalytics = () => {
  const [timeRange, setTimeRange] = useState([
    moment().subtract(30, 'days'),
    moment()
  ]);
  const [viewType, setViewType] = useState('church');
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    trends: [],
    demographics: [],
    ministryBreakdown: [],
    growthMetrics: {},
    topMetrics: {}
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange, viewType]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/analytics/${viewType}?` +
        `startDate=${timeRange[0].format('YYYY-MM-DD')}&` +
        `endDate=${timeRange[1].format('YYYY-MM-DD')}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch analytics data');
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      message.error('Error fetching analytics: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const exportData = {
      trends: analyticsData.trends.map(item => ({
        Date: moment(item.date).format('YYYY-MM-DD'),
        Attendance: item.attendance,
        'Growth Rate': item.growthRate + '%',
        'New Members': item.newMembers,
        'First Timers': item.firstTimers
      })),
      demographics: analyticsData.demographics.map(item => ({
        Category: item.name,
        Count: item.value,
        Percentage: item.percentage + '%'
      }))
    };

    exportToExcel(exportData, `attendance_analytics_${moment().format('YYYY-MM-DD')}`);
  };

  const renderTrendChart = () => (
    <Card title="Attendance Trends" loading={loading}>
      <Line
        data={analyticsData.trends}
        xField="date"
        yField="attendance"
        seriesField="type"
        point={{ size: 5, shape: 'diamond' }}
        label={{
          style: {
            fill: '#aaa',
          }
        }}
        tooltip={{
          formatter: (datum) => ({
            name: datum.type,
            value: datum.attendance,
            growthRate: datum.growthRate + '%'
          })
        }}
      />
    </Card>
  );

  const renderDemographicsChart = () => (
    <Card title="Demographics Breakdown" loading={loading}>
      <Pie
        data={analyticsData.demographics}
        angleField="value"
        colorField="name"
        radius={0.8}
        label={{
          type: 'outer',
          content: '{name} ({percentage}%)'
        }}
        interactions={[
          { type: 'element-active' }
        ]}
      />
    </Card>
  );

  const renderMinistryPerformance = () => (
    <Card title="Ministry Performance" loading={loading}>
      <DualAxes
        data={[
          analyticsData.ministryBreakdown,
          analyticsData.ministryBreakdown
        ]}
        xField="ministry"
        yField={['attendance', 'growthRate']}
        geometryOptions={[
          { geometry: 'column' },
          { geometry: 'line', lineStyle: { lineWidth: 2 } }
        ]}
        meta={{
          attendance: {
            alias: 'Attendance',
            formatter: (v) => `${v} members`
          },
          growthRate: {
            alias: 'Growth Rate',
            formatter: (v) => `${v}%`
          }
        }}
      />
    </Card>
  );

  const renderTopMetrics = () => (
    <Row gutter={[16, 16]}>
      <Col span={6}>
        <Card>
          <Statistic
            title="Average Attendance"
            value={analyticsData.topMetrics.averageAttendance}
            prefix={<TeamOutlined />}
            precision={0}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Growth Rate"
            value={analyticsData.topMetrics.growthRate}
            prefix={<RiseOutlined />}
            suffix="%"
            precision={1}
            valueStyle={{ color: '#3f8600' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="New Members"
            value={analyticsData.topMetrics.newMembers}
            prefix={<UserOutlined />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Retention Rate"
            value={analyticsData.topMetrics.retentionRate}
            suffix="%"
            precision={1}
          />
        </Card>
      </Col>
    </Row>
  );

  return (
    <ErrorBoundary>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Card>
          <Row gutter={[16, 16]} align="middle">
            <Col span={8}>
              <RangePicker
                value={timeRange}
                onChange={setTimeRange}
                style={{ width: '100%' }}
              />
            </Col>
            <Col span={8}>
              <Select
                value={viewType}
                onChange={setViewType}
                style={{ width: '100%' }}
              >
                <Option value="church">Church Service</Option>
                <Option value="ministry">Ministry</Option>
                <Option value="combined">Combined View</Option>
              </Select>
            </Col>
            <Col span={8} style={{ textAlign: 'right' }}>
              <Button
                icon={<DownloadOutlined />}
                onClick={handleExport}
                disabled={loading}
              >
                Export Analytics
              </Button>
            </Col>
          </Row>
        </Card>

        {renderTopMetrics()}

        <Tabs defaultActiveKey="trends">
          <TabPane tab="Attendance Trends" key="trends">
            {renderTrendChart()}
          </TabPane>
          <TabPane tab="Demographics" key="demographics">
            {renderDemographicsChart()}
          </TabPane>
          <TabPane tab="Ministry Performance" key="ministry">
            {renderMinistryPerformance()}
          </TabPane>
          <TabPane tab="Detailed Reports" key="reports">
            <Card loading={loading}>
              <Table
                columns={[
                  {
                    title: 'Date',
                    dataIndex: 'date',
                    key: 'date',
                    render: date => moment(date).format('YYYY-MM-DD')
                  },
                  {
                    title: 'Service Type',
                    dataIndex: 'type',
                    key: 'type'
                  },
                  {
                    title: 'Attendance',
                    dataIndex: 'attendance',
                    key: 'attendance',
                    sorter: (a, b) => a.attendance - b.attendance
                  },
                  {
                    title: 'Growth Rate',
                    dataIndex: 'growthRate',
                    key: 'growthRate',
                    render: rate => `${rate}%`,
                    sorter: (a, b) => a.growthRate - b.growthRate
                  },
                  {
                    title: 'New Members',
                    dataIndex: 'newMembers',
                    key: 'newMembers'
                  }
                ]}
                dataSource={analyticsData.trends}
                rowKey="date"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true
                }}
              />
            </Card>
          </TabPane>
        </Tabs>
      </Space>
    </ErrorBoundary>
  );
};

export default AttendanceAnalytics; 