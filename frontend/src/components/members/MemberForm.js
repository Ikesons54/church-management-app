import React from 'react';
import { 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Switch, 
  Row, 
  Col,
  Space,
  Divider 
} from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';

const { Option } = Select;

const MemberForm = ({ form, initialValues = {} }) => {
  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        ...initialValues,
        dateJoined: initialValues.dateJoined ? moment(initialValues.dateJoined) : null,
        birthday: initialValues.birthday ? moment(initialValues.birthday) : null
      }}
    >
      <Divider>Personal Information</Divider>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: 'Please enter first name' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: 'Please enter last name' }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="birthday"
            label="Date of Birth"
            rules={[{ required: true, message: 'Please select date of birth' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: 'Please select gender' }]}
          >
            <Select>
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="maritalStatus"
            label="Marital Status"
            rules={[{ required: true, message: 'Please select marital status' }]}
          >
            <Select>
              <Option value="single">Single</Option>
              <Option value="married">Married</Option>
              <Option value="widowed">Widowed</Option>
              <Option value="divorced">Divorced</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="occupation"
            label="Occupation"
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Divider>Contact Information</Divider>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[
              { required: true, message: 'Please enter phone number' },
              { pattern: /^[0-9+\s-]+$/, message: 'Please enter a valid phone number' }
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { type: 'email', message: 'Please enter a valid email' },
              { required: true, message: 'Please enter email' }
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="address"
        label="Address"
        rules={[{ required: true, message: 'Please enter address' }]}
      >
        <Input.TextArea rows={3} />
      </Form.Item>

      <Divider>Church Information</Divider>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="dateJoined"
            label="Date Joined"
            rules={[{ required: true, message: 'Please select date joined' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="membershipStatus"
            label="Membership Status"
            rules={[{ required: true, message: 'Please select membership status' }]}
          >
            <Select>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
              <Option value="transferred">Transferred</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="waterBaptism"
            label="Water Baptism"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="holyGhostBaptism"
            label="Holy Ghost Baptism"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="department"
            label="Department"
          >
            <Select mode="multiple">
              <Option value="choir">Choir</Option>
              <Option value="ushering">Ushering</Option>
              <Option value="technical">Technical</Option>
              <Option value="children">Children</Option>
              <Option value="youth">Youth</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Divider>Emergency Contact</Divider>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name={['emergencyContact', 'name']}
            label="Emergency Contact Name"
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name={['emergencyContact', 'relationship']}
            label="Relationship"
          >
            <Select>
              <Option value="spouse">Spouse</Option>
              <Option value="parent">Parent</Option>
              <Option value="sibling">Sibling</Option>
              <Option value="friend">Friend</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name={['emergencyContact', 'phone']}
            label="Emergency Contact Phone"
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

MemberForm.propTypes = {
  form: PropTypes.object.isRequired,
  initialValues: PropTypes.object
};

export default MemberForm; 