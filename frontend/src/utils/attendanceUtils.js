import moment from 'moment';

export const calculateAttendanceStats = (members) => {
  if (!Array.isArray(members) || members.length === 0) {
    return {
      total: 0,
      present: 0,
      absent: 0,
      rate: 0
    };
  }

  const present = members.filter(m => m.status === 'present').length;
  const total = members.length;

  return {
    total,
    present,
    absent: total - present,
    rate: Math.round((present / total) * 100)
  };
};

export const formatAttendanceForExport = (attendanceData) => {
  if (!Array.isArray(attendanceData)) {
    throw new Error('Invalid attendance data format');
  }

  return attendanceData.map(record => ({
    Date: moment(record.date).format('YYYY-MM-DD'),
    'Service Type': record.serviceType,
    'Total Members': record.stats.total,
    'Present': record.stats.present,
    'Absent': record.stats.absent,
    'Attendance Rate': `${record.stats.rate}%`,
    Categories: Object.entries(record.categories || {})
      .map(([category, count]) => `${category}: ${count}`)
      .join(', '),
    Notes: record.notes || ''
  }));
};

export const getServiceTypes = () => ({
  church: [
    { id: 'sunday_first', name: 'Sunday First Service' },
    { id: 'sunday_second', name: 'Sunday Second Service' },
    { id: 'bible_study', name: 'Bible Study' },
    { id: 'prayer_meeting', name: 'Prayer Meeting' }
  ],
  ministry: [
    { id: 'youth', name: 'Youth Ministry' },
    { id: 'children', name: 'Children Ministry' },
    { id: 'choir', name: 'Choir Practice' },
    { id: 'evangelism', name: 'Evangelism Team' },
    { id: 'mens', name: "Men's Fellowship" },
    { id: 'womens', name: "Women's Fellowship" }
  ]
}); 