import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Box, Dialog, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import EventForm from './EventForm';
import EventDetails from './EventDetails';
import { useSelector, useDispatch } from 'react-redux';
import { createEvent, updateEvent } from '../../store/slices/eventSlice';

const localizer = momentLocalizer(moment);

const EventCalendar = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const events = useSelector(state => state.events.events);
  const dispatch = useDispatch();

  const handleSelectSlot = ({ start, end }) => {
    setSelectedEvent({ start, end });
    setOpenForm(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setOpenDetails(true);
  };

  const handleSaveEvent = async (eventData) => {
    if (eventData._id) {
      await dispatch(updateEvent(eventData));
    } else {
      await dispatch(createEvent(eventData));
    }
    setOpenForm(false);
  };

  return (
    <Box sx={{ height: 'calc(100vh - 200px)' }}>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedEvent(null);
            setOpenForm(true);
          }}
        >
          Add Event
        </Button>
      </Box>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        selectable
        popup
        views={['month', 'week', 'day', 'agenda']}
      />

      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="md"
        fullWidth
      >
        <EventForm
          event={selectedEvent}
          onSave={handleSaveEvent}
          onClose={() => setOpenForm(false)}
        />
      </Dialog>

      <Dialog
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        maxWidth="md"
        fullWidth
      >
        <EventDetails
          event={selectedEvent}
          onEdit={() => {
            setOpenDetails(false);
            setOpenForm(true);
          }}
          onClose={() => setOpenDetails(false)}
        />
      </Dialog>
    </Box>
  );
};

export default EventCalendar; 