import React, { useState, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { 
  Card, 
  Modal, 
  Tag, 
  Tooltip, 
  Button, 
  Space,
  Badge 
} from 'antd';
import { 
  CalendarOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { setSelectedEvent } from '../../store/slices/eventSlice';
import EventForm from './EventForm';
import EventDetails from './EventDetails';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import PropTypes from 'prop-types';

const localizer = momentLocalizer(moment);

// Add CustomToolbar component before EventCalendar component
const CustomToolbar = ({ onNavigate, label, view, onView }) => {
  return (
    <div className="rbc-toolbar">
      <Space>
        <Button.Group>
          <Button onClick={() => onNavigate('PREV')}>
            <LeftOutlined />
          </Button>
          <Button onClick={() => onNavigate('TODAY')}>Today</Button>
          <Button onClick={() => onNavigate('NEXT')}>
            <RightOutlined />
          </Button>
        </Button.Group>
      </Space>
      
      <span className="rbc-toolbar-label">{label}</span>
      
      <Space>
        <Button.Group>
          <Button 
            type={view === 'month' ? 'primary' : 'default'}
            onClick={() => onView('month')}
          >
            Month
          </Button>
          <Button 
            type={view === 'week' ? 'primary' : 'default'}
            onClick={() => onView('week')}
          >
            Week
          </Button>
          <Button 
            type={view === 'day' ? 'primary' : 'default'}
            onClick={() => onView('day')}
          >
            Day
          </Button>
          <Button 
            type={view === 'agenda' ? 'primary' : 'default'}
            onClick={() => onView('agenda')}
          >
            Agenda
          </Button>
        </Button.Group>
      </Space>
    </div>
  );
};

// Add PropTypes for CustomToolbar
CustomToolbar.propTypes = {
  onNavigate: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  view: PropTypes.string.isRequired,
  onView: PropTypes.func.isRequired
};

const EventCalendar = ({ events }) => {
  const [viewMode, setViewMode] = useState('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const dispatch = useDispatch();

  const eventStyleGetter = useCallback((event) => {
    let backgroundColor = '#4B0082'; // Default church color

    switch (event.type) {
      case 'SPECIAL':
        backgroundColor = '#722ed1'; // Purple for special events
        break;
      case 'MINISTRY':
        backgroundColor = '#1890ff'; // Blue for ministry events
        break;
      case 'REGULAR':
        backgroundColor = '#52c41a'; // Green for regular events
        break;
      default:
        break;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '3px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  }, []);

  const handleEventClick = useCallback((event) => {
    setSelectedEventId(event.id);
    dispatch(setSelectedEvent(event));
    setShowEventDetails(true);
  }, [dispatch]);

  const handleSlotSelect = useCallback(({ start, end }) => {
    dispatch(setSelectedEvent(null));
    setSelectedDate(start);
    setShowEventForm(true);
  }, [dispatch]);

  const getRecurringEvents = useCallback(() => {
    const allEvents = [];
    
    events.forEach(event => {
      if (event.recurringSchedule?.enabled) {
        // Generate recurring instances
        const instances = generateRecurringInstances(event);
        allEvents.push(...instances);
      } else {
        allEvents.push({
          ...event,
          start: new Date(event.startDate),
          end: new Date(event.endDate),
          title: event.name
        });
      }
    });

    return allEvents;
  }, [events]);

  return (
    <Card>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Button.Group>
              <Button 
                type={viewMode === 'month' ? 'primary' : 'default'}
                onClick={() => setViewMode('month')}
              >
                Month
              </Button>
              <Button 
                type={viewMode === 'week' ? 'primary' : 'default'}
                onClick={() => setViewMode('week')}
              >
                Week
              </Button>
              <Button 
                type={viewMode === 'day' ? 'primary' : 'default'}
                onClick={() => setViewMode('day')}
              >
                Day
              </Button>
            </Button.Group>
          </Space>
          <Button 
            type="primary" 
            icon={<CalendarOutlined />}
            onClick={() => {
              dispatch(setSelectedEvent(null));
              setShowEventForm(true);
            }}
          >
            New Event
          </Button>
        </div>

        <Calendar
          localizer={localizer}
          events={getRecurringEvents()}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          view={viewMode}
          onView={setViewMode}
          onSelectEvent={handleEventClick}
          onSelectSlot={handleSlotSelect}
          selectable
          eventPropGetter={eventStyleGetter}
          components={{
            event: EventComponent,
            toolbar: CustomToolbar
          }}
        />

        <Modal
          title="Event Details"
          open={showEventDetails}
          onCancel={() => setShowEventDetails(false)}
          footer={null}
          width={800}
        >
          <EventDetails 
            eventId={selectedEventId}
            onEdit={() => {
              setShowEventDetails(false);
              setShowEventForm(true);
            }}
            onClose={() => setShowEventDetails(false)}
          />
        </Modal>

        <Modal
          title={selectedEventId ? "Edit Event" : "Create New Event"}
          open={showEventForm}
          onCancel={() => setShowEventForm(false)}
          footer={null}
          width={800}
        >
          <EventForm
            onSuccess={() => setShowEventForm(false)}
            initialDate={selectedDate}
          />
        </Modal>
      </Space>
    </Card>
  );
};

// Custom Event Component
const EventComponent = ({ event }) => (
  <Tooltip 
    title={
      <div>
        <p><strong>{event.name}</strong></p>
        <p><EnvironmentOutlined /> {event.location}</p>
        <p><ClockCircleOutlined /> {moment(event.start).format('LT')} - {moment(event.end).format('LT')}</p>
        <p><TeamOutlined /> {event.attendees?.length || 0} attendees</p>
      </div>
    }
  >
    <div>
      <Badge 
        status={event.status === 'ONGOING' ? 'processing' : 'default'} 
        text={event.title}
      />
    </div>
  </Tooltip>
);

// Helper function to generate recurring instances
const generateRecurringInstances = (event) => {
  const instances = [];
  const startDate = moment(event.startDate);
  const endDate = moment(event.endDate);
  const duration = moment.duration(endDate.diff(startDate));

  // Generate instances based on recurring pattern
  if (event.recurringSchedule.pattern.frequency === 'weekly') {
    const daysOfWeek = event.recurringSchedule.pattern.days;
    const currentDate = moment();
    const futureDate = moment().add(3, 'months'); // Generate 3 months of instances

    while (currentDate.isBefore(futureDate)) {
      daysOfWeek.forEach(day => {
        if (currentDate.format('dddd') === day) {
          const instanceStart = currentDate.clone();
          const instanceEnd = instanceStart.clone().add(duration);

          instances.push({
            ...event,
            id: `${event.id}_${instanceStart.format('YYYY-MM-DD')}`,
            start: instanceStart.toDate(),
            end: instanceEnd.toDate(),
            title: event.name,
            isRecurring: true
          });
        }
      });
      currentDate.add(1, 'day');
    }
  }

  return instances;
};

EventCalendar.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    recurringSchedule: PropTypes.shape({
      enabled: PropTypes.bool,
      pattern: PropTypes.shape({
        frequency: PropTypes.string,
        days: PropTypes.arrayOf(PropTypes.string)
      })
    })
  })).isRequired
};

EventComponent.propTypes = {
  event: PropTypes.shape({
    name: PropTypes.string.isRequired,
    location: PropTypes.string,
    start: PropTypes.instanceOf(Date),
    end: PropTypes.instanceOf(Date),
    attendees: PropTypes.array,
    status: PropTypes.string,
    title: PropTypes.string
  }).isRequired
};

export default EventCalendar; 