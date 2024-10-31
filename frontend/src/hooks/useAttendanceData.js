import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';

export const useAttendanceData = (type = 'church') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchData = useCallback(async (params) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/attendance/${type}?` + new URLSearchParams(params)
      );
      
      if (!response.ok) throw new Error('Failed to fetch attendance data');
      
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
      message.error('Error fetching attendance data: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [type]);

  const markAttendance = useCallback(async (attendanceData) => {
    try {
      if (!isOnline) {
        // Store in IndexedDB for later sync
        await storeOfflineAttendance(attendanceData);
        setPendingSyncCount(prev => prev + 1);
        message.warning('Stored offline. Will sync when online.');
        return;
      }

      const response = await fetch('/api/attendance/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attendanceData)
      });

      if (!response.ok) throw new Error('Failed to mark attendance');

      const result = await response.json();
      setData(prev => ({
        ...prev,
        members: prev.members.map(member => 
          member.id === attendanceData.memberId 
            ? { ...member, status: attendanceData.status }
            : member
        )
      }));

      message.success('Attendance marked successfully');
      return result;
    } catch (err) {
      message.error('Error marking attendance: ' + err.message);
      throw err;
    }
  }, [isOnline]);

  return {
    data,
    loading,
    error,
    fetchData,
    markAttendance,
    isOnline,
    pendingSyncCount
  };
};

// Helper function for offline storage
const storeOfflineAttendance = async (data) => {
  // Implementation would use IndexedDB
  // This is a placeholder
  console.log('Storing offline attendance:', data);
}; 