import React, { createContext, useContext, useState } from 'react';

const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const [attendanceData, setAttendanceData] = useState({
    churchService: {
      date: null,
      type: 'sunday',
      members: [],
      statistics: { total: 0, present: 0, absent: 0 }
    },
    ministry: {
      date: null,
      ministry: '',
      eventType: '',
      members: [],
      visitors: []
    }
  });

  const updateAttendance = (type, data) => {
    setAttendanceData(prev => ({
      ...prev,
      [type]: { ...prev[type], ...data }
    }));
  };

  return (
    <AttendanceContext.Provider value={{ attendanceData, updateAttendance }}>
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => useContext(AttendanceContext); 