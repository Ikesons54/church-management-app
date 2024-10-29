import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Alert,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  AttachMoney as BudgetIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers';

const MinistryEventPlanner = () => {
  const [events, setEvents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    ministry: '',
    startDate: new Date(),
    endDate: new Date(),
    location: '',
    description: '',
    budget: '',
    requiredResources: [],
    committees: [],
    status: 'planning',
    isRecurring: false,
    recurringPattern: '',
    attendanceTarget: '',
    notifications: true,
    approvalRequired: false,
    responsiblePersons: []
  });

  const ministries = [
    { id: 'pemem', name: 'PEMEM' },
    { id: 'womens', name: "Women's Movement" },
    { id: 'youth', name: 'Youth Ministry' },
    { id: 'children', name: "Children's Ministry" },
    { id: 'choir', name: 'Church Choir' },
    { id: 'pemfit', name: 'PEMFIT' },
    { id: 'media', name: 'Media Team' },
    { id: 'ushers', name: 'Ushering Team' }
  ];

  const handleSaveEvent = () => {
    if (selectedEvent) {
      setEvents(events.map(event => 
        event.id === selectedEvent.id ? { ...newEvent, id: event.id } : event
      ));
    } else {
      setEvents([...events, { ...newEvent, id: Date.now() }]);
    }
    setOpenDialog(false);
    resetForm();
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const resetForm = () => {
    setNewEvent({
      title: '',
      ministry: '',
      startDate: new Date(),
      endDate: new Date(),
      location: '',
      description: '',
      budget: '',
      requiredResources: [],
      committees: [],
      status: 'planning',
      isRecurring: false,
      recurringPattern: '',
      attendanceTarget: '',
      notifications: true,
      approvalRequired: false,
      responsiblePersons: []
    });
    setSelectedEvent(null);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">
          Ministry Event Planner
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            resetForm();
            setOpenDialog(true);
          }}
        >
          New Event
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Upcoming Events */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Events
              </Typography>
              <List>
                {events.map((event) => (
                  <React.Fragment key={event.id}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <EventIcon color="primary" />
                            <Typography variant="subtitle1">
                              {event.title}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Box display="flex" alignItems="center" gap={1}>
                                <ScheduleIcon fontSize="small" />
                                {new Date(event.startDate).toLocaleDateString()}
                              </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Box display="flex" alignItems="center" gap={1}>
                                <LocationIcon fontSize="small" />
                                {event.location}
                              </Box>
                            </Grid>
                          </Grid>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => {
                            setSelectedEvent(event);
                            setNewEvent(event);
                            setOpenDialog(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Event Statistics */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Event Statistics
              </Typography>
              {/* Add event statistics here */}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Event Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedEvent ? 'Edit Event' : 'New Event'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Event Title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({
                  ...newEvent,
                  title: e.target.value
                })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Ministry</InputLabel>
                <Select
                  value={newEvent.ministry}
                  onChange={(e) => setNewEvent({
                    ...newEvent,
                    ministry: e.target.value
                  })}
                >
                  {ministries.map((ministry) => (
                    <MenuItem key={ministry.id} value={ministry.id}>
                      {ministry.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                value={newEvent.location}
                onChange={(e) => setNewEvent({
                  ...newEvent,
                  location: e.target.value
                })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <DateTimePicker
                label="Start Date & Time"
                value={newEvent.startDate}
                onChange={(date) => setNewEvent({
                  ...newEvent,
                  startDate: date
                })}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <DateTimePicker
                label="End Date & Time"
                value={newEvent.endDate}
                onChange={(date) => setNewEvent({
                  ...newEvent,
                  endDate: date
                })}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({
                  ...newEvent,
                  description: e.target.value
                })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Budget (AED)"
                type="number"
                value={newEvent.budget}
                onChange={(e) => setNewEvent({
                  ...newEvent,
                  budget: e.target.value
                })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Attendance Target"
                type="number"
                value={newEvent.attendanceTarget}
                onChange={(e) => setNewEvent({
                  ...newEvent,
                  attendanceTarget: e.target.value
                })}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={newEvent.isRecurring}
                    onChange={(e) => setNewEvent({
                      ...newEvent,
                      isRecurring: e.target.checked
                    })}
                  />
                }
                label="Recurring Event"
              />
            </Grid>

            {newEvent.isRecurring && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Recurring Pattern</InputLabel>
                  <Select
                    value={newEvent.recurringPattern}
                    onChange={(e) => setNewEvent({
                      ...newEvent,
                      recurringPattern: e.target.value
                    })}
                  >
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={newEvent.approvalRequired}
                    onChange={(e) => setNewEvent({
                      ...newEvent,
                      approvalRequired: e.target.checked
                    })}
                  />
                }
                label="Requires Approval"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveEvent}
          >
            {selectedEvent ? 'Update Event' : 'Create Event'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MinistryEventPlanner; 