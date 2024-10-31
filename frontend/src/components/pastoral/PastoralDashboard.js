import React, { useEffect, useState } from 'react';
import { 
  Layout, 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Table, 
  Calendar,
  Button,
  Space,
  Tabs 
} from 'antd';
import {
  UserOutlined,
  BookOutlined,
  TeamOutlined,
  ScheduleOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import SermonManager from './SermonManager';
import ActivityTracker from './ActivityTracker';
import CounselingScheduler from './CounselingScheduler';
import PastoralReports from './PastoralReports';

const { Content } = Layout;
const { TabPane } = Tabs;

const PastoralDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPastoralStats();
  }, []);

  const fetchPastoralStats = async () => {
    try {
      const response = await fetch('/api/pastoral/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching pastoral stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Content style={{ padding: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card loading={loading}>
              <Statistic
                title="Total Sermons"
                value={stats?.totalSermons || 0}
                prefix={<BookOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card loading={loading}>
              <Statistic
                title="Counseling Sessions"
                value={stats?.totalCounseling || 0}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card loading={loading}>
              <Statistic
                title="Baptisms"
                value={stats?.totalBaptisms || 0}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card loading={loading}>
              <Statistic
                title="Pastoral Visits"
                value={stats?.totalVisits || 0}
                prefix={<ScheduleOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Tabs defaultActiveKey="sermons" style={{ marginTop: 24 }}>
          <TabPane tab="Sermons" key="sermons">
            <SermonManager />
          </TabPane>
          <TabPane tab="Activities" key="activities">
            <ActivityTracker />
          </TabPane>
          <TabPane tab="Counseling" key="counseling">
            <CounselingScheduler />
          </TabPane>
          <TabPane tab="Reports" key="reports">
            <PastoralReports />
          </TabPane>
        </Tabs>
      </Content>
    </Layout>
  );
};

export default PastoralDashboard; 