import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  IconButton,
  Chip,
  Dialog,
  FormControlLabel,
  Switch,
  Select,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  PriorityHigh as UrgentIcon
} from '@mui/icons-material';

const AnnouncementSystem = () => {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'Sunday Service Time Change',
      content: 'Please note that our Sunday service will start at 11:00 AM sharp.',
      type: 'general',
      priority: 'high',
      date: new Date(),
      sendTo: ['all'],
      status: 'active'
    }
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    type: 'general',
    priority: 'normal',
    sendTo: ['all'],
    status: 'active'
  });

  const announcementTypes = [
    { value: 'general', label: 'General' },
    { value: 'service', label: 'Service Related' },
    { value: 'pemem', label: 'PEMEM' },
    { value: 'womens', label: "Women's Movement" },
    { value: 'pemfit', label: 'PEMFIT' },
    { value: 'children', label: "Children's Ministry" }
  ];

  const handleSaveAnnouncement = () => {
    if (selectedAnnouncement) {
      setAnnouncements(announcements.map(ann => 
        ann.id === selectedAnnouncement.id ? { ...newAnnouncement, id: ann.id } : ann
      ));
    } else {
      setAnnouncements([
        ...announcements, 
        { ...newAnnouncement, id: announcements.length + 1, date: new Date() }
      ]);
    }
    setOpenDialog(false);
  };

  const handleDeleteAnnouncement = (id) => {
    setAnnouncements(announcements.filter(ann => ann.id !== id));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          COPABUDHABI Announcements
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedAnnouncement(null);
            setNewAnnouncement({
              title: '',
              content: '',
              type: 'general',
              priority: 'normal',
              sendTo: ['all'],
              status: 'active'
            });
            setOpenDialog(true);
          }}
        >
          New Announcement
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Active Announcements */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Announcements
              </Typography>
              
              {announcements
                .filter(ann => ann.status === 'active')
                .map((announcement) => (
                  <Card key={announcement.id} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">
                          {announcement.title}
                          {announcement.priority === 'high' && (
                            <UrgentIcon color="error" sx={{ ml: 1 }} />
                          )}
                        </Typography>
                        <Box>
                          <IconButton
                            onClick={() => {
                              setSelectedAnnouncement(announcement);
                              setNewAnnouncement(announcement);
                              setOpenDialog(true);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteAnnouncement(announcement.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                      
                      <Typography color="textSecondary" variant="body2" gutterBottom>
                        {new Date(announcement.date).toLocaleDateString()}
                      </Typography>
                      
                      <Typography paragraph>
                        {announcement.content}
                      </Typography>
                      
                      <Box display="flex" gap={1}>
                        <Chip 
                          label={announcement.type} 
                          size="small" 
                          color="primary" 
                        />
                        <Chip 
                          label={announcement.priority} 
                          size="small" 
                          color={getPriorityColor(announcement.priority)} 
                        />
                      </Box>
                    </CardContent>
                  </Card>
                ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Announcement Stats
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Active
                      </Typography>
                      <Typography variant="h4">
                        {announcements.filter(a => a.status === 'active').length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Urgent
                      </Typography>
                      <Typography variant="h4">
                        {announcements.filter(a => a.priority === 'high').length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            {selectedAnnouncement ? 'Edit Announcement' : 'New Announcement'}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({ 
                  ...newAnnouncement, 
                  title: e.target.value 
                })}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Content"
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement({ 
                  ...newAnnouncement, 
                  content: e.target.value 
                })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Select
                fullWidth
                value={newAnnouncement.type}
                onChange={(e) => setNewAnnouncement({ 
                  ...newAnnouncement, 
                  type: e.target.value 
                })}
              >
                {announcementTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12} md={6}>
              <Select
                fullWidth
                value={newAnnouncement.priority}
                onChange={(e) => setNewAnnouncement({ 
                  ...newAnnouncement, 
                  priority: e.target.value 
                })}
              >
                <MenuItem value="normal">Normal</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={newAnnouncement.status === 'active'}
                    onChange={(e) => setNewAnnouncement({
                      ...newAnnouncement,
                      status: e.target.checked ? 'active' : 'inactive'
                    })}
                  />
                }
                label="Active"
              />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveAnnouncement}
                >
                  {selectedAnnouncement ? 'Update' : 'Create'}
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<SendIcon />}
                >
                  Send Notification
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
    </Box>
  );
};

export default AnnouncementSystem; 