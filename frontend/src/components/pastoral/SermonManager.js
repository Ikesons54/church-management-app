import React, { useState, useCallback } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  DatePicker, 
  Upload,
  Space,
  Tag,
  message 
} from 'antd';
import { 
  UploadOutlined, 
  PlusOutlined,
  AudioOutlined,
  VideoCameraOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { addSermon, updateSermon, deleteSermon } from '../../store/slices/pastoralSlice';
import PropTypes from 'prop-types';
import moment from 'moment';

const { TextArea } = Input;

const SermonManager = () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedSermon, setSelectedSermon] = useState(null);
  const dispatch = useDispatch();

  const handleEdit = useCallback((sermon) => {
    setSelectedSermon(sermon);
    form.setFieldsValue({
      ...sermon,
      date: sermon.date ? moment(sermon.date) : null
    });
    setVisible(true);
  }, [form]);

  const handleSubmit = useCallback(async (values) => {
    try {
      if (selectedSermon) {
        await dispatch(updateSermon({ 
          id: selectedSermon._id, 
          updates: values 
        })).unwrap();
        message.success('Sermon updated successfully');
      } else {
        await dispatch(addSermon(values)).unwrap();
        message.success('Sermon added successfully');
      }
      setVisible(false);
      form.resetFields();
      setSelectedSermon(null);
    } catch (error) {
      message.error(`Error saving sermon: ${error.message}`);
    }
  }, [selectedSermon, dispatch, form]);

  const handleDelete = useCallback(async (id) => {
    try {
      await dispatch(deleteSermon(id)).unwrap();
      message.success('Sermon deleted successfully');
    } catch (error) {
      message.error(`Error deleting sermon: ${error.message}`);
    }
  }, [dispatch]);

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: true,
      render: date => new Date(date).toLocaleDateString()
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      searchable: true
    },
    {
      title: 'Scripture',
      dataIndex: 'scripture',
      key: 'scripture'
    },
    {
      title: 'Media',
      key: 'media',
      render: (_, record) => (
        <Space>
          {record.audioUrl && <AudioOutlined />}
          {record.videoUrl && <VideoCameraOutlined />}
          {record.documentUrl && <FileTextOutlined />}
        </Space>
      )
    },
    {
      title: 'Attendance',
      dataIndex: 'attendance',
      key: 'attendance',
      sorter: true
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button danger onClick={() => handleDelete(record._id)}>Delete</Button>
        </Space>
      )
    }
  ];

  return (
    <Card title="Sermon Management">
      <Button 
        type="primary" 
        icon={<PlusOutlined />}
        onClick={() => {
          setSelectedSermon(null);
          form.resetFields();
          setVisible(true);
        }}
        style={{ marginBottom: 16 }}
      >
        Add New Sermon
      </Button>

      <Table 
        columns={columns}
        rowKey="_id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} sermons`
        }}
      />

      <Modal
        title={selectedSermon ? 'Edit Sermon' : 'Add New Sermon'}
        open={visible}
        onCancel={() => {
          setVisible(false);
          form.resetFields();
          setSelectedSermon(null);
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={selectedSermon}
        >
          <Form.Item
            name="date"
            label="Sermon Date"
            rules={[{ required: true, message: 'Please select the sermon date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="title"
            label="Sermon Title"
            rules={[{ required: true, message: 'Please enter the sermon title' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="scripture"
            label="Scripture Reference"
            rules={[{ required: true, message: 'Please enter the scripture reference' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="attendance"
            label="Attendance"
            rules={[{ type: 'number', min: 0, message: 'Please enter a valid attendance number' }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="audioUrl"
            label="Audio Recording"
          >
            <Upload
              maxCount={1}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Upload Audio</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="videoUrl"
            label="Video Recording"
          >
            <Upload
              maxCount={1}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Upload Video</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="documentUrl"
            label="Sermon Notes"
          >
            <Upload
              maxCount={1}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Upload Notes</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {selectedSermon ? 'Update Sermon' : 'Add Sermon'}
              </Button>
              <Button onClick={() => {
                setVisible(false);
                form.resetFields();
                setSelectedSermon(null);
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

SermonManager.propTypes = {
  onSermonUpdate: PropTypes.func,
  onError: PropTypes.func
};

export default SermonManager; 