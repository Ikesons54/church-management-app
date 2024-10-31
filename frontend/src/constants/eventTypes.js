export const CHURCH_LEADERSHIP = {
  ROLES: [
    { value: 'pastor', label: 'Pastor', rank: 1 },
    { value: 'presiding_elder', label: 'Presiding Elder', rank: 2 },
    { value: 'elder', label: 'Elder', rank: 3 },
    { value: 'deacon', label: 'Deacon', rank: 4 },
    { value: 'deaconess', label: 'Deaconess', rank: 4 }
  ],
  
  PERMISSIONS: {
    pastor: ['all'], // Full access to everything
    presiding_elder: ['create', 'update', 'delete', 'approve', 'view', 'manage_leaders'],
    elder: ['create', 'update', 'approve', 'view', 'manage_members'],
    deacon: ['create', 'update', 'view'],
    deaconess: ['create', 'update', 'view']
  }
};

export const EVENT_TYPES = {
  SPECIAL: [
    { value: 'convention', label: 'Convention' },
    { value: 'conference', label: 'Conference' },
    { value: 'retreat', label: 'Retreat' },
    { value: 'revival', label: 'Revival' },
    { value: 'thanksgiving', label: 'Thanksgiving Service' },
    { value: 'ordination', label: 'Ordination Service' },
    { value: 'baptism', label: 'Baptismal Service' },
    { value: 'communion', label: 'Communion Service' }
  ],
  
  MINISTRY: [
    { 
      value: 'pemem', 
      label: 'PEMEM',
      leaders: ['pastor', 'presiding_elder', 'elder']
    },
    { 
      value: 'womens', 
      label: "Women's Movement",
      leaders: ['deaconess']
    },
    { 
      value: 'youth', 
      label: 'Youth Ministry',
      leaders: ['elder', 'deacon']
    },
    { 
      value: 'children', 
      label: "Children's Ministry",
      leaders: ['deaconess']
    },
    { 
      value: 'choir', 
      label: 'Church Choir',
      leaders: ['elder', 'deacon', 'deaconess']
    },
    { 
      value: 'pemfit', 
      label: 'PEMFIT',
      leaders: ['deacon', 'deaconess']
    },
    { 
      value: 'media', 
      label: 'Media Team',
      leaders: ['deacon']
    },
    { 
      value: 'ushers', 
      label: 'Ushering Team',
      leaders: ['deacon', 'deaconess']
    }
  ],

  REGULAR: [
    { 
      value: 'sunday_service', 
      label: 'Sunday Service',
      schedule: {
        day: 'Sunday',
        startTime: '11:30',
        endTime: '14:45',
        frequency: 'weekly'
      }
    },
    { 
      value: 'time_with_jesus', 
      label: 'Time with Jesus',
      schedule: {
        day: 'Wednesday',
        startTime: '20:00',
        endTime: '21:30',
        frequency: 'weekly'
      }
    },
    { 
      value: 'begin_with_jesus', 
      label: 'Begin Your Day with Jesus',
      schedule: {
        days: ['Monday', 'Thursday'],
        startTime: '05:00',
        endTime: '06:00',
        frequency: 'weekly'
      }
    },
    { 
      value: 'battle_ground', 
      label: 'The Battle Ground',
      schedule: {
        day: 'Friday',
        startTime: '22:00',
        endTime: '23:30',
        frequency: 'weekly'
      }
    },
    { 
      value: 'prayer_meeting', 
      label: 'Prayer Meeting',
      schedule: {
        dynamic: true, // Schedule set by leadership
        defaultDuration: 90 // minutes
      }
    }
  ]
};

export const EVENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Helper function to get next occurrence of an event
export const getNextEventOccurrence = (eventType) => {
  const event = EVENT_TYPES.REGULAR.find(e => e.value === eventType);
  if (!event || !event.schedule || event.schedule.dynamic) return null;

  const now = new Date();
  const nextDate = new Date();
  
  if (event.schedule.days) {
    // For events with multiple days (like Begin Your Day with Jesus)
    const today = now.getDay();
    const nextDays = event.schedule.days
      .map(day => getDayNumber(day))
      .filter(day => day > today);
    
    if (nextDays.length > 0) {
      nextDate.setDate(nextDate.getDate() + (nextDays[0] - today));
    } else {
      nextDate.setDate(nextDate.getDate() + (7 - today + getDayNumber(event.schedule.days[0])));
    }
  } else {
    // For single day events
    const eventDay = getDayNumber(event.schedule.day);
    const daysUntilNext = (eventDay - now.getDay() + 7) % 7;
    nextDate.setDate(nextDate.getDate() + daysUntilNext);
  }

  const [hours, minutes] = event.schedule.startTime.split(':');
  nextDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  
  return nextDate;
};

// Helper function to convert day names to numbers
const getDayNumber = (day) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days.indexOf(day);
}; 