import React, { useState, useCallback } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Progress, 
  Tag,
  message 
} from 'antd';
import { performDetailedVerification } from '../../utils/memberVerification';
import { ReminderService } from '../../utils/reminderService';
import PropTypes from 'prop-types';

const BulkProfileChecker = () => {
  const [checking, setChecking] = useState(false);
  const [results, setResults] = useState([]);

  const performBulkCheck = useCallback(async () => {
    setChecking(true);
    try {
      const response = await fetch('http://localhost:5000/api/members');
      if (!response.ok) {
        throw new Error('Failed to fetch members');
      }
      const members = await response.json();
      
      const checkResults = members.map(member => ({
        ...member,
        verificationResult: performDetailedVerification(member)
      }));
      
      setResults(checkResults);
      
      const incomplete = checkResults.filter(r => !r.verificationResult.isComplete);
      if (incomplete.length > 0) {
        await Promise.all(incomplete.map(member => 
          ReminderService.checkAndSendReminders(member)
        ));
      }
      
      message.success(`Checked ${members.length} profiles`);
    } catch (error) {
      message.error(`Error performing bulk check: ${error.message}`);
    } finally {
      setChecking(false);
    }
  }, []);

  return (
    <Card title="Bulk Profile Checker">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button 
          type="primary" 
          onClick={performBulkCheck}
          loading={checking}
        >
          Check All Profiles
        </Button>

        <Table
          dataSource={results}
          columns={[
            {
              title: 'Member ID',
              dataIndex: 'memberId',
              key: 'memberId'
            },
            {
              title: 'Name',
              dataIndex: 'firstName',
              key: 'name',
              render: (_, record) => `${record.firstName} ${record.lastName}`
            },
            {
              title: 'Completion',
              dataIndex: ['verificationResult', 'completionPercentage'],
              key: 'completion',
              render: value => <Progress percent={value} size="small" />
            },
            {
              title: 'Status',
              dataIndex: ['verificationResult', 'isFullyValid'],
              key: 'status',
              render: isValid => (
                <Tag color={isValid ? 'success' : 'error'}>
                  {isValid ? 'Valid' : 'Needs Attention'}
                </Tag>
              )
            },
            {
              title: 'Issues',
              dataIndex: ['verificationResult'],
              key: 'issues',
              render: result => (
                <Space direction="vertical">
                  {result.missingFields.map((field, i) => (
                    <Tag key={i} color="warning">{field}</Tag>
                  ))}
                  {result.validationErrors.map((error, i) => (
                    <Tag key={i} color="error">{error}</Tag>
                  ))}
                </Space>
              )
            }
          ]}
        />
      </Space>
    </Card>
  );
};

BulkProfileChecker.propTypes = {
  onCheck: PropTypes.func,
  onError: PropTypes.func
};

export default BulkProfileChecker; 