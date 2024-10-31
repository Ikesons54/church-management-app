import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Progress, 
  Alert, 
  List, 
  Button, 
  Space, 
  Tag,
  Typography,
  Collapse 
} from 'antd';
import { 
  CheckCircleOutlined, 
  WarningOutlined,
  EditOutlined 
} from '@ant-design/icons';
import { checkMemberCompletion } from '../../utils/memberVerification';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const MemberVerification = ({ member }) => {
  const [verificationStatus, setVerificationStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (member) {
      const status = checkMemberCompletion(member);
      setVerificationStatus(status);
    }
  }, [member]);

  if (!verificationStatus) {
    return null;
  }

  return (
    <Card title="Member Profile Status">
      <Space direction="vertical" style={{ width: '100%' }}>
        {/* Profile Completion Progress */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Progress
            type="circle"
            percent={verificationStatus.completionPercentage}
            status={verificationStatus.isComplete ? 'success' : 'active'}
          />
          <Title level={4} style={{ marginTop: 16 }}>
            Profile Completion: {verificationStatus.completionPercentage}%
          </Title>
        </div>

        {/* Status Alert */}
        {verificationStatus.isComplete ? (
          <Alert
            message="Profile Complete"
            description="All required information has been provided."
            type="success"
            showIcon
            icon={<CheckCircleOutlined />}
          />
        ) : (
          <Alert
            message="Incomplete Profile"
            description="Please complete all required information."
            type="warning"
            showIcon
            icon={<WarningOutlined />}
          />
        )}

        {/* Missing Fields */}
        {!verificationStatus.isComplete && (
          <Collapse>
            {verificationStatus.incompleteCategories.map((category, index) => (
              <Panel 
                header={
                  <Space>
                    <WarningOutlined />
                    <Text>{category}</Text>
                    <Tag color="red">Incomplete</Tag>
                  </Space>
                } 
                key={index}
              >
                <List
                  size="small"
                  dataSource={verificationStatus.missingFields.filter(field => 
                    field.includes(category.split(' ')[0])
                  )}
                  renderItem={field => (
                    <List.Item>
                      <Text type="danger">{field} is required</Text>
                    </List.Item>
                  )}
                />
              </Panel>
            ))}
          </Collapse>
        )}

        {/* Action Button */}
        {!verificationStatus.isComplete && (
          <Button 
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/members/edit/${member.memberId}`)}
            block
          >
            Complete Profile
          </Button>
        )}
      </Space>
    </Card>
  );
};

export default MemberVerification; 