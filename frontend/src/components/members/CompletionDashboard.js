import React, { useState, useEffect, useCallback } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Progress, 
  Table, 
  Button, 
  Statistic,
  Space,
  message 
} from 'antd';
import { Line } from '@ant-design/plots';
import moment from 'moment';
import PropTypes from 'prop-types';

const CompletionDashboard = ({ onRefresh }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCompletionStats = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/members/completion-stats');
      if (!response.ok) {
        throw new Error('Failed to fetch completion stats');
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      message.error(`Error fetching completion stats: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompletionStats();
  }, [fetchCompletionStats]);

  const handleSendReminder = useCallback(async (memberId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/members/${memberId}/send-reminder`, {
        method: 'POST'
      });
      if (!response.ok) {
        throw new Error('Failed to send reminder');
      }
      message.success('Reminder sent successfully');
      fetchCompletionStats();
    } catch (error) {
      message.error(`Error sending reminder: ${error.message}`);
    }
  }, [fetchCompletionStats]);

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Overall Completion Rate"
              value={stats?.overallCompletionRate}
              suffix="%"
              precision={1}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Members with Complete Profiles"
              value={stats?.completeProfiles}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Members Needing Updates"
              value={stats?.incompleteProfiles}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Recent Updates"
              value={stats?.recentUpdates}
              suffix="this week"
            />
          </Card>
        </Col>
      </Row>

      <Card title="Completion Trends">
        <Line
          data={stats?.completionTrend || []}
          xField="date"
          yField="completionRate"
          point={{ size: 5, shape: 'diamond' }}
        />
      </Card>

      <Card title="Incomplete Profiles">
        <Table
          dataSource={stats?.incompleteMembers}
          columns={[
            {
              title: 'Member',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: 'Completion',
              dataIndex: 'completionPercentage',
              key: 'completion',
              render: value => <Progress percent={value} size="small" />
            },
            {
              title: 'Missing Fields',
              dataIndex: 'missingFields',
              key: 'missingFields',
              render: fields => fields.join(', ')
            },
            {
              title: 'Last Reminder',
              dataIndex: 'lastReminder',
              key: 'lastReminder',
              render: date => moment(date).format('DD/MM/YYYY')
            },
            {
              title: 'Action',
              key: 'action',
              render: (_, record) => (
                <Button type="primary" size="small" onClick={() => handleSendReminder(record.id)}>
                  Send Reminder
                </Button>
              )
            }
          ]}
        />
      </Card>
    </Space>
  );
};

CompletionDashboard.propTypes = {
  onRefresh: PropTypes.func
};

export default CompletionDashboard; 