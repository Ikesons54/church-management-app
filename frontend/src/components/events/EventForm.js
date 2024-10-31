import React, { useEffect } from 'react';
import { 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Switch, 
  InputNumber,
  Space,
  Button,
  Row,
  Col,
  Divider 
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { createEvent, updateEvent } from '../../store/slices/eventSlice';
import { EVENT_TYPES, CHURCH_LEADERSHIP } from '../../constants/eventTypes';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const EventForm = ({ onSuccess, initialDate }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const selectedEvent = useSelector(state => state.events.selectedEvent);
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    if (selectedEvent) {
      form.setFieldsValue({
        ...selectedEvent,
        dateRange: [
          moment(selectedEvent.startDate),
          moment(selectedEvent.endDate)
        ]
      });
    } else if (initialDate) {
      form.setFieldsValue({
        dateRange: [
          moment(initialDate),
          moment(initialDate).add(1, 'hour')
        ]
      });
    }
  }, [selectedEvent, initialDate, form]);

  const handleSubmit = async (values) => {
    const [startDate, endDate] = values.dateRange;
    
    const eventData = {
      ...values,
      startDate: startDate.toDate(),
      endDate: endDate.toDate(),
      leaders: [{
        user: user.id,
        role: user.role
      }]
    };

    try {
      if (selectedEvent) {
        await dispatch(updateEvent({ id: selectedEvent.id, updates: eventData })).unwrap();
      } else {
        await dispatch(createEvent(eventData)).unwrap();
      }
      onSuccess?.();
    } catch (error) {
      // Error handling
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="name"
            label="Event Name"
            rules={[{ required: true, message: 'Please enter event name' }]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="type"
            label="Event Type"
            rules={[{ required: true, message: 'Please select event type' }]}
          >
            <Select>
              <Option value="SPECIAL">Special Event</Option>
              <Option value="MINISTRY">Ministry Event</Option>
              <Option value="REGULAR">Regular Event</Option>
            </Select>
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="dateRange"
            label="Event Date & Time"
            rules={[{ required: true, message: 'Please select date and time' }]}
          >
            <RangePicker 
              showTime 
              format="YYYY-MM-DD HH:mm"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: 'Please enter location' }]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="capacity"
            label="Capacity"
          >
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={4} />
          </Form.Item>
        </Col>

        <Divider />

        <Col span={12}>
          <Form.Item
            name={['recurringSchedule', 'enabled']}
            valuePropName="checked"
          >
            <Switch checkedChildren="Recurring" unCheckedChildren="One-time" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="requiresRegistration"
            valuePropName="checked"
          >
            <Switch checkedChildren="Registration Required" unCheckedChildren="Open Event" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Space>
          <Button onClick={() => form.resetFields()}>
            Reset
          </Button>
          <Button type="primary" htmlType="submit">
            {selectedEvent ? 'Update Event' : 'Create Event'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default EventForm; 