import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  Grid,
  Dialog,
  IconButton
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Security as SecurityIcon,
  People as PeopleIcon,
  Event as EventIcon
} from '@mui/icons-material';

const MemberMobileApp = () => {
  const [memberData, setMemberData] = useState({
    id: 'COPAD001',
    name: 'John Doe',
    qrToken: '',
    familyMembers: [],
    expiryTime: null
  });

  // Generate secure QR token
  const generateQRToken = () => {
    const token = {
      memberId: memberData.id,
      timestamp: new Date().getTime(),
      random: Math.random().toString(36).substring(7),
      expiry: new Date().getTime() + (5 * 60 * 1000) // 5 minutes expiry
    };
    
    return btoa(JSON.stringify(token));
  };

  // Refresh QR code every 5 minutes
  useEffect(() => {
    const updateQRCode = () => {
      const newToken = generateQRToken();
      setMemberData(prev => ({
        ...prev,
        qrToken: newToken,
        expiryTime: new Date().getTime() + (5 * 60 * 1000)
      }));
    };

    updateQRCode();
    const interval = setInterval(updateQRCode, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" mb={3}>
            <Avatar sx={{ width: 60, height: 60, mr: 2 }}>
              {memberData.name[0]}
            </Avatar>
            <Box>
              <Typography variant="h6">{memberData.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                ID: {memberData.id}
              </Typography>
            </Box>
          </Box>

          {/* QR Code Display */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mb={3}
          >
            <QRCode
              value={memberData.qrToken}
              size={200}
              level="H"
              includeMargin={true}
            />
            <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
              QR Code refreshes in {Math.floor((memberData.expiryTime - new Date().getTime()) / 1000)} seconds
            </Typography>
            <Button
              startIcon={<RefreshIcon />}
              onClick={() => setMemberData(prev => ({
                ...prev,
                qrToken: generateQRToken()
              }))}
              sx={{ mt: 1 }}
            >
              Refresh QR Code
            </Button>
          </Box>

          {/* Quick Actions */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<PeopleIcon />}
                onClick={() => {/* Handle family check-in */}}
              >
                Family Check-in
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<EventIcon />}
                onClick={() => {/* Handle special events */}}
              >
                Special Events
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MemberMobileApp; 