import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
  Grid
} from '@mui/material';
import { QrReader } from 'react-qr-reader';

const SpecialEventScanner = () => {
  const [eventDetails, setEventDetails] = useState({
    id: '',
    name: '',
    type: '',
    capacity: 0,
    checkedIn: 0,
    requiresRegistration: false
  });

  const [scanResult, setScanResult] = useState(null);
  const [scannerActive, setScannerActive] = useState(false);

  const processCheckIn = async (memberData) => {
    try {
      const response = await fetch(`/api/events/${eventDetails.id}/check-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData)
      });
      if (!response.ok) throw new Error('Check-in failed');
    } catch (error) {
      console.error('Check-in failed:', error);
      throw error;
    }
  };

  const checkRegistration = async (memberId) => {
    // TODO: Replace with actual API call
    try {
      const response = await fetch(`/api/events/${eventDetails.id}/check-registration/${memberId}`);
      return response.ok;
    } catch (error) {
      console.error('Registration check failed:', error);
      return false;
    }
  };

  const handleScan = async (data) => {
    if (data) {
      try {
        // Verify QR code authenticity
        const decodedData = JSON.parse(atob(data));
        
        // Check if member is registered for event
        const isRegistered = await checkRegistration(decodedData.memberId);
        
        if (isRegistered) {
          // Process check-in
          await processCheckIn(decodedData);
          setScanResult({
            success: true,
            message: 'Successfully checked in!'
          });
        } else {
          setScanResult({
            success: false,
            message: 'Member not registered for this event'
          });
        }
      } catch (error) {
        setScanResult({
          success: false,
          message: 'Invalid QR code'
        });
      }
    }
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Special Event Scanner
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Event Name"
                value={eventDetails.name}
                disabled
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Capacity"
                value={`${eventDetails.checkedIn}/${eventDetails.capacity}`}
                disabled
              />
            </Grid>
          </Grid>

          {scannerActive && (
            <Box mt={2}>
              <QrReader
                onResult={handleScan}
                constraints={{ facingMode: 'environment' }}
                style={{ width: '100%' }}
              />
            </Box>
          )}

          {scanResult && (
            <Alert
              severity={scanResult.success ? 'success' : 'error'}
              sx={{ mt: 2 }}
            >
              {scanResult.message}
            </Alert>
          )}

          <Button
            fullWidth
            variant="contained"
            onClick={() => setScannerActive(!scannerActive)}
            sx={{ mt: 2 }}
          >
            {scannerActive ? 'Stop Scanner' : 'Start Scanner'}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SpecialEventScanner; 