import { render } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import { AttendanceProvider } from '../contexts/AttendanceContext';
import moment from 'moment';

export const renderWithProviders = (ui, options = {}) => {
  const Wrapper = ({ children }) => (
    <ConfigProvider>
      <BrowserRouter>
        <AttendanceProvider>
          {children}
        </AttendanceProvider>
      </BrowserRouter>
    </ConfigProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

export const mockAttendanceData = {
  generateMockAttendance: (count = 10) => {
    return Array.from({ length: count }, (_, index) => ({
      id: `member-${index + 1}`,
      firstName: `First${index + 1}`,
      lastName: `Last${index + 1}`,
      category: ['adult', 'youth', 'children'][Math.floor(Math.random() * 3)],
      status: ['present', 'absent'][Math.floor(Math.random() * 2)],
      isFirstTimer: Math.random() > 0.9,
      notes: `Test note ${index + 1}`
    }));
  },

  generateMockAnalytics: (days = 30) => {
    const startDate = moment().subtract(days, 'days');
    return {
      trends: Array.from({ length: days }, (_, index) => ({
        date: moment(startDate).add(index, 'days').format('YYYY-MM-DD'),
        attendance: Math.floor(Math.random() * 50) + 100,
        growthRate: (Math.random() * 10 - 5).toFixed(1),
        newMembers: Math.floor(Math.random() * 5)
      })),
      demographics: [
        { name: 'Adult', value: 150, percentage: '60.0' },
        { name: 'Youth', value: 75, percentage: '30.0' },
        { name: 'Children', value: 25, percentage: '10.0' }
      ],
      topMetrics: {
        averageAttendance: 125,
        growthRate: 5.2,
        newMembers: 15,
        retentionRate: 85.5
      }
    };
  }
}; 