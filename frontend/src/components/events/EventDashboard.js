import React from 'react';
import { Tabs } from 'antd';
import EventCalendar from './EventCalendar';
import SpecialEventManager from './SpecialEventManager';
import RegularEventManager from './RegularEventManager';
import AttendanceReports from './AttendanceReports';
import NotificationCenter from './NotificationCenter';

const { TabPane } = Tabs;

const EventDashboard = () => {
  return (
    <Tabs defaultActiveKey="calendar">
      <TabPane tab="Calendar" key="calendar">
        <EventCalendar />
      </TabPane>
      
      <TabPane tab="Special Events" key="special">
        <SpecialEventManager />
      </TabPane>
      
      <TabPane tab="Regular Services" key="regular">
        <RegularEventManager />
      </TabPane>
      
      <TabPane tab="Attendance" key="attendance">
        <AttendanceReports />
      </TabPane>
      
      <TabPane tab="Notifications" key="notifications">
        <NotificationCenter />
      </TabPane>
    </Tabs>
  );
};

export default EventDashboard; 