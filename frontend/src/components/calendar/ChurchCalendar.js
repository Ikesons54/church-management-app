import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton
} from '@mui/material';
import {
  Calendar,
  dateFnsLocalizer
} from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const locales = {
  'en-US': require('date-fns/locale/en-US')
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});

const eventTypes = [
  { value: 'service', label: 'Sunday Service' },
  { value: 'prayer', label: 'Prayer Meeting' },
  { value: 'pemem', label: 'PEMEM Meeting' },
  { value: 'womens', label: "Women's Movement Meeting" },
  { value: 'pemfit', label: 'PEMFIT Meeting' },
  { value: 'children', label: "Children's Service" },
  { value: 'convention', label: 'Convention' },
  { value: 'other', label: 'Other Event' }
];

const ChurchCalendar = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Sunday Service',
      start: new Date(2024, 0, 21, 11, 0),
      end: new Date(2024, 0, 21, 15, 0),
      type: 'service'
    }
    // Add more events here
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: new Date(),
    end: new Date(),
    type: '',
    description: '',
    location: '',
    organizer: ''
  });

  const handleSelectSlot = ({ start, end }) => {
    setSelectedEvent(null);
    setNewEvent({
      title: '',
      start,
      end,
      type: '',
      description: '',
      location: '',
      organizer: ''
    });
    setOpenDialog(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setNewEvent(event);
    setOpenDialog(true);
  };

  const handleSaveEvent = () => {
    if (selectedEvent) {
      setEvents(events.map(event => 
        event.id === selectedEvent.id ? { ...newEvent, id: event.id } : event
      ));
    } else {
      setEvents([...events, { ...newEvent, id: events.length + 1 }]);
    }
    setOpenDialog(false);
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      setEvents(events.filter(event => event.id !== selectedEvent.id));
      setOpenDialog(false);
    }
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = '#3174ad';
    switch (event.type) {
      case 'service':
        backgroundColor = '#1B4F72'; // COPABUDHABI primary color
        break;
      case 'prayer':
        backgroundColor = '#922B21'; // COPABUDHABI secondary color
        break;
      case 'pemem':
        backgroundColor = '#196F3D';
        break;
      case 'womens':
        backgroundColor = '#884EA0';
        break;
      case 'pemfit':
        backgroundColor = '#17A589';
        break;
      default:
        backgroundColor = '#2C3E50';
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '5px'
      }
    };
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          COPABUDHABI Calendar
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleSelectSlot({ start: new Date(), end: new Date() })}
        >
          Add Event
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                selectable
                eventPropGetter={eventStyleGetter}
                views={['month', 'week', 'day', 'agenda']}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            {selectedEvent ? 'Edit Event' : 'New Event'}
          </Typography>
          <TextField
            fullWidth
            label="Event Title"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          />
          <TextField
            fullWidth
            label="Start Time"
            type="datetime-local"
            value={newEvent.start.toISOString().split('T')[0]}
            onChange={(e) => setNewEvent({ ...newEvent, start: new Date(e.target.value) })}
          />
          <TextField
            fullWidth
            label="End Time"
            type="datetime-local"
            value={newEvent.end.toISOString().split('T')[0]}
            onChange={(e) => setNewEvent({ ...newEvent, end: new Date(e.target.value) })}
          />
          <FormControl fullWidth>
            <InputLabel id="event-type-label">Event Type</InputLabel>
            <Select
              labelId="event-type-label"
              id="event-type"
              value={newEvent.type}
              label="Event Type"
              onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
            >
              {eventTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Description"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
          />
          <TextField
            fullWidth
            label="Location"
            value={newEvent.location}
            onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
          />
          <TextField
            fullWidth
            label="Organizer"
            value={newEvent.organizer}
            onChange={(e) => setNewEvent({ ...newEvent, organizer: e.target.value })}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveEvent}
            startIcon={<EditIcon />}
          >
            Save Event
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDeleteEvent}
            startIcon={<DeleteIcon />}
          >
            Delete Event
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default ChurchCalendar; 