import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  DatePicker,
  Select,
  Table,
  Progress,
  Space,
  Button
} from 'antd';
import {
  Line,
  Pie,
  Column
} from '@ant-design/plots';
import {
  UserAddOutlined,
  RiseOutlined,
  TeamOutlined,
  CalendarOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { fetchVisitorAnalytics } from '../../store/slices/visitorSlice';
import * as XLSX from 'xlsx';

const { RangePicker } = DatePicker;
const { Option } = Select;

const VisitorAnalyticsDashboard = () => {
  const dispatch = useDispatch();
  const [timeRange, setTimeRange] = useState('week');
  const [dateRange, setDateRange] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({
    trends: [],
    conversion: [],
    sources: [],
    followUpStats: []
  });

  useEffect(() => {
    fetchData();
  }, [timeRange, dateRange]);

  const fetchData = async () => {
    const data = await dispatch(fetchVisitorAnalytics({ timeRange, dateRange })).unwrap();
    setAnalyticsData(data);
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    
    // Convert trends data
    const trendsWS = XLSX.utils.json_to_sheet(analyticsData.trends);
    XLSX.utils.book_append_sheet(wb, trendsWS, "Visitor Trends");
    
    // Convert other sheets
    const conversionWS = XLSX.utils.json_to_sheet(analyticsData.conversion);
    XLSX.utils.book_append_sheet(wb, conversionWS, "Conversion Rates");
    
    XLSX.writeFile(wb, "visitor_analytics.xlsx");
  };

  const trendConfig = {
    data: analyticsData.trends,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000
      }
    }
  };

  const pieConfig = {
    data: analyticsData.sources,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer'
    }
  };

  const columns = [
    {
      title: 'Follow-up Type',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: 'Success Rate',
      dataIndex: 'successRate',
      key: 'successRate',
      render: (value) => (
        <Progress percent={value} size="small" />
      )
    },
    {
      title: 'Average Response Time',
      dataIndex: 'responseTime',
      key: 'responseTime'
    },
    {
      title: 'Conversion Rate',
      dataIndex: 'conversionRate',
      key: 'conversionRate',
      render: (value) => `${value}%`
    }
  ];

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Space>
              <Select 
                value={timeRange} 
                onChange={setTimeRange}
                style={{ width: 120 }}
              >
                <Option value="week">Week</Option>
                <Option value="month">Month</Option>
                <Option value="quarter">Quarter</Option>
                <Option value="year">Year</Option>
              </Select>
              <RangePicker 
                value={dateRange}
                onChange={setDateRange}
              />
              <Button 
                icon={<DownloadOutlined />}
                onClick={exportToExcel}
              >
                Export Data
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Visitors"
              value={analyticsData.totalVisitors}
              prefix={<UserAddOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Conversion Rate"
              value={analyticsData.conversionRate}
              prefix={<RiseOutlined />}
              suffix="%"
              precision={2}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Average Follow-up Time"
              value={analyticsData.avgFollowUpTime}
              prefix={<CalendarOutlined />}
              suffix="days"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Return Rate"
              value={analyticsData.returnRate}
              prefix={<TeamOutlined />}
              suffix="%"
              precision={2}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Visitor Trends">
            <Line {...trendConfig} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Visitor Sources">
            <Pie {...pieConfig} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Follow-up Performance">
            <Table 
              columns={columns} 
              dataSource={analyticsData.followUpStats}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default VisitorAnalyticsDashboard; 