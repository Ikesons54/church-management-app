import React from 'react';
import {
  Card,
  Steps,
  Timeline,
  Typography,
  Tag,
  Space,
  Button,
  Tooltip,
  Modal
} from 'antd';
import {
  UserAddOutlined,
  PhoneOutlined,
  MessageOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Step } = Steps;
const { Title, Text } = Typography;

const VisitorJourney = ({ visitor }) => {
  const getJourneySteps = () => {
    const steps = [
      {
        title: 'First Visit',
        icon: <UserAddOutlined />,
        status: 'finish',
        description: moment(visitor.visitDate).format('YYYY-MM-DD')
      },
      {
        title: 'Initial Follow-up',
        icon: <PhoneOutlined />,
        status: visitor.firstFollowUp ? 'finish' : 'waiting',
        description: visitor.firstFollowUp 
          ? moment(visitor.firstFollowUp).format('YYYY-MM-DD')
          : 'Pending'
      },
      {
        title: 'Regular Attendance',
        icon: <TeamOutlined />,
        status: visitor.regularAttendance ? 'finish' : 'waiting',
        description: visitor.attendanceCount + ' services'
      },
      {
        title: 'Member Integration',
        icon: <CheckCircleOutlined />,
        status: visitor.status === 'converted' ? 'finish' : 'waiting',
        description: visitor.status === 'converted' 
          ? 'Completed'
          : 'In Progress'
      }
    ];

    return steps;
  };

  return (
    <Card title="Visitor Journey">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Steps current={getJourneySteps().filter(s => s.status === 'finish').length - 1}>
          {getJourneySteps().map((step, index) => (
            <Step
              key={index}
              title={step.title}
              icon={step.icon}
              description={step.description}
              status={step.status}
            />
          ))}
        </Steps>

        <Card title="Journey Timeline" size="small">
          <Timeline mode="left">
            {visitor.history.map((event, index) => (
              <Timeline.Item
                key={index}
                color={event.type === 'visit' ? 'green' : 'blue'}
                dot={event.completed ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
                label={moment(event.date).format('YYYY-MM-DD HH:mm')}
              >
                <Space direction="vertical">
                  <Text strong>{event.title}</Text>
                  <Text type="secondary">{event.description}</Text>
                  {event.notes && (
                    <Text italic>{event.notes}</Text>
                  )}
                  {event.tags && (
                    <Space>
                      {event.tags.map((tag, i) => (
                        <Tag key={i} color="blue">{tag}</Tag>
                      ))}
                    </Space>
                  )}
                </Space>
              </Timeline.Item>
            ))}
          </Timeline>
        </Card>
      </Space>
    </Card>
  );
};

export default VisitorJourney; 