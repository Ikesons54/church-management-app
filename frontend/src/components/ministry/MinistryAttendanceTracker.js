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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Autocomplete
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon
} from '@mui/icons-material';

const MinistryAttendanceTracker = () => {
  const [selectedMinistry, setSelectedMinistry] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [attendees, setAttendees] = useState([]);

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

  const [attendanceData, setAttendanceData] = useState({
    date: new Date().toISOString().split('T')[0],
    ministry: '',
    eventType: 'regular',
    members: [],
    visitors: [],
    notes: ''
  });

  const eventTypes = {
    pemem: ['Regular Meeting', 'Prayer Meeting', 'Bible Study', 'Special Event'],
    womens: ['Regular Meeting', 'Prayer Meeting', 'Bible Study', 'Special Event'],
    youth: ['Youth Service', 'Bible Study', 'Fellowship', 'Outreach'],
    children: ['Sunday School', 'Bible Club', 'Special Program'],
    choir: ['Practice', 'Sunday Service', 'Special Performance'],
    pemfit: ['Fitness Session', 'Health Talk', 'Special Event'],
    media: ['Sunday Service', 'Training', 'Special Coverage'],
    ushers: ['Sunday Service', 'Special Event', 'Training']
  };

  const handleSubmit = async () => {
    try {
      // API call would go here
      console.log('Submitting attendance:', attendanceData);
      
      // Reset form after submission
      setAttendanceData({
        date: new Date().toISOString().split('T')[0],
        ministry: '',
        eventType: 'regular',
        members: [],
        visitors: [],
        notes: ''
      });
    } catch (error) {
      console.error('Error submitting attendance:', error);
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Attendance Input Form */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Record Attendance
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Date"
                    value={attendanceData.date}
                    onChange={(e) => setAttendanceData({
                      ...attendanceData,
                      date: e.target.value
                    })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Ministry</InputLabel>
                    <Select
                      value={attendanceData.ministry}
                      onChange={(e) => setAttendanceData({
                        ...attendanceData,
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

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Event Type</InputLabel>
                    <Select
                      value={attendanceData.eventType}
                      onChange={(e) => setAttendanceData({
                        ...attendanceData,
                        eventType: e.target.value
                      })}
                    >
                      {attendanceData.ministry && eventTypes[attendanceData.ministry].map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    options={[]} // This would be populated from your member database
                    getOptionLabel={(option) => `${option.name} (${option.id})`}
                    value={attendanceData.members}
                    onChange={(event, newValue) => {
                      setAttendanceData({
                        ...attendanceData,
                        members: newValue
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Members"
                        placeholder="Start typing to search..."
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Notes"
                    value={attendanceData.notes}
                    onChange={(e) => setAttendanceData({
                      ...attendanceData,
                      notes: e.target.value
                    })}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                  >
                    Save Attendance
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Attendance Summary */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Attendance Summary
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={() => {/* Handle export */}}
                >
                  Export
                </Button>
              </Box>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Event Type</TableCell>
                      <TableCell align="right">Members Present</TableCell>
                      <TableCell align="right">Visitors</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Sample data - would be populated from your database */}
                    <TableRow>
                      <TableCell>2024-01-21</TableCell>
                      <TableCell>Regular Meeting</TableCell>
                      <TableCell align="right">45</TableCell>
                      <TableCell align="right">3</TableCell>
                      <TableCell align="right">48</TableCell>
                      <TableCell>
                        <IconButton size="small">
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MinistryAttendanceTracker; 