import React, { useState } from 'react';
import { Layout, Steps } from 'antd';
import ServiceSelection from '../components/attendance/ServiceSelection';
import AttendanceMethods from '../components/attendance/AttendanceMethods';
import ManualAttendance from '../components/attendance/ManualAttendance';
import QRCodeScanner from '../components/attendance/QRCodeScanner';

const { Content } = Layout;
const { Step } = Steps;

const AttendancePage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [serviceInfo, setServiceInfo] = useState(null);
  const [attendanceMethod, setAttendanceMethod] = useState(null);

  const steps = [
    {
      title: 'Select Service',
      content: <ServiceSelection onServiceSelect={setServiceInfo} />
    },
    {
      title: 'Choose Method',
      content: <AttendanceMethods onMethodSelect={setAttendanceMethod} />
    },
    {
      title: 'Take Attendance',
      content: attendanceMethod === 'manual' 
        ? <ManualAttendance serviceInfo={serviceInfo} />
        : <QRCodeScanner serviceInfo={serviceInfo} />
    }
  ];

  return (
    <Layout>
      <Content style={{ padding: '24px' }}>
        <Steps current={currentStep}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>

        <div style={{ marginTop: 24 }}>
          {steps[currentStep].content}
        </div>
      </Content>
    </Layout>
  );
};

export default AttendancePage; 