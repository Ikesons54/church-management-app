import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Switch,
  FormControlLabel,
  Autocomplete,
  Alert
} from '@mui/material';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import { QrReader } from 'react-qr-reader';
import { useIndexedDB } from 'react-indexed-db';
import { syncData } from '../utils/syncHelper';

const saveAttendanceToServer = async (attendanceRecord) => {
  const response = await fetch('/api/attendance', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(attendanceRecord),
  });
  if (!response.ok) {
    throw new Error('Failed to save attendance');
  }
  return response.json();
};

const AttendanceSystem = () => {
  // States for different attendance methods
  const [attendanceMethod, setAttendanceMethod] = useState('manual'); // manual, qr, deviceScan
  const [selectedService, setSelectedService] = useState('');
  const [searchMember, setSearchMember] = useState('');
  const [currentLocation, setCurrentLocation] = useState('entrance1');

  // Sample service types
  const serviceTypes = [
    { id: 'sunday_first', name: 'Sunday First Service' },
    { id: 'sunday_second', name: 'Sunday Second Service' },
    { id: 'bible_study', name: 'Wednesday Bible Study' },
    { id: 'prayer_meeting', name: 'Friday Prayer Meeting' },
    { id: 'youth_service', name: 'Youth Service' },
    { id: 'choir_practice', name: 'Choir Practice' },
    { id: 'pemem_meeting', name: 'PEMEM Meeting' },
    { id: 'womens_meeting', name: "Women's Meeting" }
  ];

  // IndexedDB for offline storage
  const { add, getAll, update } = useIndexedDB('attendance');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSync, setPendingSync] = useState([]);
  const [scannerAssignment, setScannerAssignment] = useState({
    entrance1: { usher: '', active: false },
    entrance2: { usher: '', active: false },
    youthEntrance: { usher: '', active: false },
    childrenEntrance: { usher: '', active: false }
  });

  // Monitor online status
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

  const syncPendingData = async () => {
    try {
      await syncData(pendingSync);
      setPendingSync([]);
    } catch (error) {
      console.error('Error syncing data:', error);
    }
  };

  useEffect(() => {
    if (isOnline && pendingSync.length > 0) {
      syncPendingData();
    }
  }, [isOnline, pendingSync]);

  const handleAttendanceMarking = async (memberData) => {
    const attendanceRecord = {
      memberId: memberData.id,
      serviceId: selectedService,
      timestamp: new Date().toISOString(),
      location: scannerAssignment.location,
      markedBy: scannerAssignment.usher,
      synced: isOnline
    };

    try {
      if (isOnline) {
        // Send to server
        await saveAttendanceToServer(attendanceRecord);
      } else {
        // Save locally
        await add('attendance', attendanceRecord);
        setPendingSync([...pendingSync, attendanceRecord]);
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  };

  return (
    <Box>
      {/* Offline Mode Indicator */}
      {!isOnline && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Working in offline mode - Data will sync when connection is restored
          {pendingSync.length > 0 && ` (${pendingSync.length} records pending)`}
        </Alert>
      )}

      {/* Scanner Assignment Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Scanner Assignment
          </Typography>
          
          <Grid container spacing={2}>
            {Object.entries(scannerAssignment).map(([location, data]) => (
              <Grid item xs={12} md={3} key={location}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1">
                      {location.replace(/([A-Z])/g, ' $1').trim()}
                    </Typography>
                    
                    <FormControl fullWidth sx={{ mt: 1 }}>
                      <InputLabel>Assigned Usher</InputLabel>
                      <Select
                        value={data.usher}
                        onChange={(e) => setScannerAssignment({
                          ...scannerAssignment,
                          [location]: {
                            ...data,
                            usher: e.target.value
                          }
                        })}
                      >
                        {/* Populate with ushers list */}
                        <MenuItem value="usher1">John (Usher)</MenuItem>
                        <MenuItem value="usher2">Mary (Usher)</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControlLabel
                      control={
                        <Switch
                          checked={data.active}
                          onChange={(e) => setScannerAssignment({
                            ...scannerAssignment,
                            [location]: {
                              ...data,
                              active: e.target.checked
                            }
                          })}
                        />
                      }
                      label="Active"
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* QR Scanner Component */}
      {attendanceMethod === 'qr' && (
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                QR Code Scanner
              </Typography>
              
              {scannerAssignment[currentLocation]?.active ? (
                <Box>
                  <QrReader
                    onResult={async (result) => {
                      if (result) {
                        await handleAttendanceMarking(JSON.parse(result));
                      }
                    }}
                    constraints={{ facingMode: 'environment' }}
                    style={{ width: '100%' }}
                  />
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Scanning as: {scannerAssignment[currentLocation].usher}
                  </Typography>
                </Box>
              ) : (
                <Alert severity="info">
                  Please activate scanner assignment first
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      )}

      {/* Manual Attendance Entry */}
      {attendanceMethod === 'manual' && (
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Manual Attendance Entry
              </Typography>
              
              <Box mb={2}>
                <Autocomplete
                  freeSolo
                  options={[]} // Would be populated with member list
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search Member"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </Box>

              <Button
                variant="contained"
                startIcon={<PersonAddIcon />}
              >
                Add First-Time Visitor
              </Button>
            </CardContent>
          </Card>
        </Grid>
      )}

      {/* Today's Attendance List */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Today's Attendance
            </Typography>
            
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Member ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Ministry</TableCell>
                    <TableCell>Time In</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Sample attendance row */}
                  <TableRow>
                    <TableCell>COPAD001</TableCell>
                    <TableCell>John Doe</TableCell>
                    <TableCell>PEMEM</TableCell>
                    <TableCell>09:45 AM</TableCell>
                    <TableCell>
                      <Chip
                        icon={<CheckCircleIcon />}
                        label="Present"
                        color="success"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small">
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Stats */}
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary">Total Present</Typography>
                <Typography variant="h4">156</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary">First Time Visitors</Typography>
                <Typography variant="h4">8</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary">Regular Members</Typography>
                <Typography variant="h4">142</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary">Attendance Rate</Typography>
                <Typography variant="h4">78%</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      {/* Export Options */}
      <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
        <Button variant="outlined">
          Export to Excel
        </Button>
        <Button variant="outlined">
          Generate Report
        </Button>
        <Button variant="outlined">
          Print Summary
        </Button>
      </Box>
    </Box>
  );
};

export default AttendanceSystem; 