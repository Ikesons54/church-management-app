import React from 'react';
import { Row, Col } from 'antd';
import ReminderConfiguration from '../components/members/ReminderConfiguration';

const MemberManagement = () => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <ReminderConfiguration />
      </Col>
      {/* Other member management components */}
    </Row>
  );
};

export default MemberManagement; 