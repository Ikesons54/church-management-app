import React, { useState } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  DatePicker, 
  Select, 
  message,
  Modal,
  Form,
  Radio,
  Divider
} from 'antd';
import { 
  DownloadOutlined, 
  MailOutlined, 
  PrinterOutlined,
  FileExcelOutlined,
  FilePdfOutlined 
} from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const { RangePicker } = DatePicker;

const AttendanceReports = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportForm] = Form.useForm();

  // Fetch report data
  const fetchReportData = async (filters) => {
    setLoading(true);
    try {
      const response = await fetch('/api/reports/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters)
      });

      if (!response.ok) throw new Error('Failed to fetch report data');
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      message.error('Error fetching report data');
    } finally {
      setLoading(false);
    }
  };

  // Export to Excel
  const exportToExcel = (data) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance Report');
    XLSX.writeFile(wb, 'attendance_report.xlsx');
  };

  // Export to PDF
  const exportToPDF = (data) => {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(16);
    doc.text('Attendance Report', 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);

    // Add table
    doc.autoTable({
      head: [['Date', 'Service', 'Total', 'Present', 'Absent', 'First Time']],
      body: data.map(row => [
        row.date,
        row.service,
        row.total,
        row.present,
        row.absent,
        row.firstTime
      ]),
      startY: 35
    });

    doc.save('attendance_report.pdf');
  };

  // Email report
  const emailReport = async (recipients, format) => {
    try {
      const response = await fetch('/api/reports/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients,
          format,
          reportData,
          reportType: 'attendance'
        })
      });

      if (!response.ok) throw new Error('Failed to send report');
      message.success('Report sent successfully');
    } catch (error) {
      message.error('Error sending report');
    }
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date) - new Date(b.date)
    },
    {
      title: 'Service',
      dataIndex: 'service',
      key: 'service',
      filters: [
        { text: 'Sunday Service', value: 'sunday_service' },
        { text: 'Battle Ground', value: 'battle_ground' },
        { text: 'Begin with Jesus', value: 'begin_with_jesus' },
        { text: 'Time with Jesus', value: 'time_with_jesus' }
      ],
      onFilter: (value, record) => record.service === value
    },
    {
      title: 'Total Members',
      dataIndex: 'total',
      key: 'total',
      sorter: (a, b) => a.total - b.total
    },
    {
      title: 'Present',
      dataIndex: 'present',
      key: 'present',
      render: (text, record) => (
        <span style={{ color: 'green' }}>{text} ({((text/record.total) * 100).toFixed(1)}%)</span>
      )
    },
    {
      title: 'Absent',
      dataIndex: 'absent',
      key: 'absent',
      render: (text, record) => (
        <span style={{ color: 'red' }}>{text} ({((text/record.total) * 100).toFixed(1)}%)</span>
      )
    },
    {
      title: 'First Time Visitors',
      dataIndex: 'firstTime',
      key: 'firstTime'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            size="small" 
            onClick={() => window.open(`/attendance/details/${record.id}`)}
          >
            View Details
          </Button>
        </Space>
      )
    }
  ];

  return (
    <Card title="Attendance Reports">
      <Space direction="vertical" style={{ width: '100%' }}>
        {/* Filters */}
        <Space>
          <RangePicker 
            onChange={(dates) => fetchReportData({ dateRange: dates })}
          />
          <Select
            placeholder="Select Service"
            style={{ width: 200 }}
            onChange={(value) => fetchReportData({ service: value })}
            allowClear
          >
            <Select.Option value="sunday_service">Sunday Service</Select.Option>
            <Select.Option value="battle_ground">Battle Ground</Select.Option>
            <Select.Option value="begin_with_jesus">Begin with Jesus</Select.Option>
            <Select.Option value="time_with_jesus">Time with Jesus</Select.Option>
          </Select>
          <Button 
            type="primary" 
            icon={<DownloadOutlined />}
            onClick={() => setShowExportModal(true)}
          >
            Export Report
          </Button>
        </Space>

        {/* Report Table */}
        <Table
          columns={columns}
          dataSource={reportData}
          loading={loading}
          rowKey="id"
          summary={pageData => {
            const totals = pageData.reduce(
              (acc, curr) => ({
                total: acc.total + curr.total,
                present: acc.present + curr.present,
                absent: acc.absent + curr.absent,
                firstTime: acc.firstTime + curr.firstTime
              }),
              { total: 0, present: 0, absent: 0, firstTime: 0 }
            );

            return (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell>Total</Table.Summary.Cell>
                  <Table.Summary.Cell />
                  <Table.Summary.Cell>{totals.total}</Table.Summary.Cell>
                  <Table.Summary.Cell>{totals.present}</Table.Summary.Cell>
                  <Table.Summary.Cell>{totals.absent}</Table.Summary.Cell>
                  <Table.Summary.Cell>{totals.firstTime}</Table.Summary.Cell>
                  <Table.Summary.Cell />
                </Table.Summary.Row>
              </Table.Summary>
            );
          }}
        />

        {/* Export Modal */}
        <Modal
          title="Export Report"
          visible={showExportModal}
          onCancel={() => setShowExportModal(false)}
          footer={null}
        >
          <Form
            form={exportForm}
            onFinish={async (values) => {
              switch(values.format) {
                case 'excel':
                  exportToExcel(reportData);
                  break;
                case 'pdf':
                  exportToPDF(reportData);
                  break;
                case 'email':
                  await emailReport(values.recipients, values.emailFormat);
                  break;
              }
              setShowExportModal(false);
            }}
          >
            <Form.Item
              name="format"
              label="Export Format"
              rules={[{ required: true }]}
            >
              <Radio.Group>
                <Radio.Button value="excel">
                  <FileExcelOutlined /> Excel
                </Radio.Button>
                <Radio.Button value="pdf">
                  <FilePdfOutlined /> PDF
                </Radio.Button>
                <Radio.Button value="email">
                  <MailOutlined /> Email
                </Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              noStyle
              shouldUpdate={(prev, curr) => prev.format !== curr.format}
            >
              {({ getFieldValue }) => 
                getFieldValue('format') === 'email' && (
                  <>
                    <Form.Item
                      name="recipients"
                      label="Email Recipients"
                      rules={[{ required: true, type: 'email' }]}
                    >
                      <Select mode="tags" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                      name="emailFormat"
                      label="Email Format"
                      rules={[{ required: true }]}
                    >
                      <Radio.Group>
                        <Radio value="excel">Excel</Radio>
                        <Radio value="pdf">PDF</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </>
                )
              }
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Export
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </Card>
  );
};

export default AttendanceReports; 