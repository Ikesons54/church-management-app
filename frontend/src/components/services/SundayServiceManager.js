import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';

const SundayServiceManager = () => {
  const [serviceSchedule, setServiceSchedule] = useState({
    mainService: {
      startTime: '11:00',
      endTime: '15:00',
      language: 'English',
      type: 'Main Service'
    }
  });

  const serviceTypes = [
    'Main Service',
    'Communion Service',
    'Special Service',
    'Prayer Service',
    'Convention Service'
  ];

  const ministryGroups = [
    {
      name: "PEMEM",
      description: "Men's Ministry",
      meetingTime: "After Main Service",
      leader: ""
    },
    {
      name: "Women's Movement",
      description: "Women's Ministry",
      meetingTime: "After Main Service",
      leader: ""
    },
    {
      name: "Youth Ministry",
      description: "Youth Ministry",
      meetingTime: "After Main Service",
      leader: ""
    },
    {
      name: "Children's Ministry",
      description: "Children's Service",
      meetingTime: "During Main Service",
      leader: ""
    }
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Sunday Service Management - COPABUDHABI
      </Typography>

      {/* Service Schedule Card */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Main Service Schedule
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="time"
                    label="Start Time"
                    defaultValue="11:00"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="time"
                    label="End Time"
                    defaultValue="15:00"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Service Details Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Service Details
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Service Type</InputLabel>
                <Select
                  value={serviceSchedule.mainService.type}
                  onChange={(e) => {
                    setServiceSchedule({
                      ...serviceSchedule,
                      mainService: {
                        ...serviceSchedule.mainService,
                        type: e.target.value
                      }
                    });
                  }}
                >
                  {serviceTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Theme"
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Presiding Elder"
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Service Notes"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Ministry Groups Card */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ministry Groups
              </Typography>
              
              <Grid container spacing={2}>
                {ministryGroups.map((ministry) => (
                  <Grid item xs={12} md={3} key={ministry.name}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" color="primary">
                          {ministry.name}
                        </Typography>
                        <Typography variant="body2">
                          {ministry.description}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Meeting Time: {ministry.meetingTime}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Attendance Tracking Card */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Attendance Tracking
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Men"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Women"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Youth"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Children"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button 
                    variant="contained" 
                    color="primary"
                    sx={{ mt: 2 }}
                  >
                    Save Attendance
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SundayServiceManager; 