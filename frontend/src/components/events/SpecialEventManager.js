import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  Select,
  MenuItem
} from '@mui/material';
import {
  QrCodeScanner,
  Edit,
  Delete,
  Download,
  Send,
  People
} from '@mui/icons-material';
import { saveEvent } from '../../services/eventService';

const SpecialEventManager = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [eventForm, setEventForm] = useState({
    name: '',
    date: '',
    type: '',
    capacity: 0,
    requiresRegistration: true,
    ministries: [],
    checkInPoints: [],
    specialInstructions: '',
    resources: []
  });

  // Add this function
  const updateEventsList = () => {
    // TODO: Add API call to fetch updated events
    // For now, just refresh the current events
    setEvents([...events]);
  };

  // Handle event creation/update
  const handleEventSubmit = async () => {
    try {
      const eventData = {
        ...eventForm,
        id: selectedEvent?.id || Date.now(),
        qrConfig: generateEventQRConfig(),
        securitySettings: generateSecuritySettings()
      };

      const response = await saveEvent(eventData);
      if (response.success) {
        updateEventsList();
        setOpenDialog(false);
      }
    } catch (error) {
      console.error('Event save failed:', error);
    }
  };

  // Generate QR codes for event
  const generateEventQRConfig = () => {
    return {
      prefix: 'COPAEVENT',
      expiry: 24, // hours
      encryption: 'AES',
      validationRules: [
        'timebound',
        'single-use',
        'location-specific'
      ]
    };
  };

  // Add this function
  const generateSecuritySettings = () => {
    return {
      requiresVerification: true,
      accessLevel: 'standard',
      maxAttempts: 3
    };
  };

  const handleEventEdit = (event) => {
    setSelectedEvent(event);
    setEventForm(event);
    setOpenDialog(true);
  };

  const handleEventDelete = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
    // TODO: Add API call to delete event from backend
  };

  const openEventScanner = (eventId) => {
    // TODO: Implement scanner functionality
    console.log('Opening scanner for event:', eventId);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Event List */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h6">Special Events</Typography>
                <Button
                  variant="contained"
                  onClick={() => {
                    setSelectedEvent(null);
                    setOpenDialog(true);
                  }}
                >
                  Create New Event
                </Button>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Event Name</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Registration</TableCell>
                      <TableCell>Capacity</TableCell>
                      <TableCell>Check-ins</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {events.map(event => (
                      <TableRow key={event.id}>
                        <TableCell>{event.name}</TableCell>
                        <TableCell>{event.date}</TableCell>
                        <TableCell>
                          <Chip label={event.type} size="small" />
                        </TableCell>
                        <TableCell>
                          {event.requiresRegistration ? 'Required' : 'Open'}
                        </TableCell>
                        <TableCell>
                          {event.checkedIn}/{event.capacity}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleEventEdit(event)}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            onClick={() => handleEventDelete(event.id)}
                          >
                            <Delete />
                          </IconButton>
                          <IconButton
                            onClick={() => openEventScanner(event.id)}
                          >
                            <QrCodeScanner />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Event Creation/Edit Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {selectedEvent ? 'Edit Event' : 'Create New Event'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Event Name"
                  value={eventForm.name}
                  onChange={(e) => setEventForm({
                    ...eventForm,
                    name: e.target.value
                  })}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="datetime-local"
                  label="Event Date & Time"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({
                    ...eventForm,
                    date: e.target.value
                  })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Additional event form fields */}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleEventSubmit}
            >
              {selectedEvent ? 'Update Event' : 'Create Event'}
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Box>
  );
};

export default SpecialEventManager; 