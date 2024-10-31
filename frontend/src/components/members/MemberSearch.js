import React, { useState } from 'react';
import { 
  Card, 
  Input, 
  Select, 
  Button, 
  Space,
  Form,
  Col,
  Row,
  DatePicker 
} from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

const MemberSearch = ({ onSearch }) => {
  const [form] = Form.useForm();

  const handleSearch = (values) => {
    onSearch(values);
  };

  const handleReset = () => {
    form.resetFields();
    onSearch({});
  };

  return (
    <Card>
      <Form
        form={form}
        onFinish={handleSearch}
        layout="vertical"
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="keyword" label="Search">
              <Input
                placeholder="Search by name, ID, phone, or email"
                prefix={<SearchOutlined />}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="status" label="Status">
              <Select allowClear placeholder="Select status">
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
                <Option value="transferred">Transferred</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="department" label="Department">
              <Select allowClear placeholder="Select department">
                <Option value="choir">Choir</Option>
                <Option value="ushering">Ushering</Option>
                <Option value="technical">Technical</Option>
                <Option value="children">Children</Option>
                <Option value="youth">Youth</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="dateJoined" label="Date Joined">
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="baptismStatus" label="Baptism Status">
              <Select allowClear placeholder="Select baptism status">
                <Option value="water">Water Baptized</Option>
                <Option value="holy">Holy Ghost Baptized</Option>
                <Option value="both">Both</Option>
                <Option value="none">None</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="ageGroup" label="Age Group">
              <Select allowClear placeholder="Select age group">
                <Option value="youth">Youth (13-25)</Option>
                <Option value="adult">Adult (26-60)</Option>
                <Option value="senior">Senior (60+)</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Space>
          <Button 
            type="primary" 
            icon={<SearchOutlined />}
            htmlType="submit"
          >
            Search
          </Button>
          <Button 
            icon={<ClearOutlined />}
            onClick={handleReset}
          >
            Reset
          </Button>
        </Space>
      </Form>
    </Card>
  );
};

export default MemberSearch; 