import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Typography,
  Avatar,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Alert
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateProfile,
  updatePreferences,
  updateNotifications
} from '../../store/slices/settingsSlice';

const UserSettings = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const [success, setSuccess] = useState('');

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.target);
      await dispatch(updateProfile(formData));
      setSuccess('Profile updated successfully');
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handlePreferencesUpdate = async (preferences) => {
    try {
      await dispatch(updatePreferences(preferences));
      setSuccess('Preferences updated successfully');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ mb: 3 }}
          >
            <Tab label="Profile" />
            <Tab label="Preferences" />
            <Tab label="Notifications" />
            <Tab label="Security" />
          </Tabs>

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {activeTab === 0 && (
            <Box component="form" onSubmit={handleProfileUpdate}>
              <Grid container spacing={3}>
                <Grid item xs={12} display="flex" justifyContent="center">
                  <Box position="relative">
                    <Avatar
                      src={user.profileImage}
                      sx={{ width: 120, height: 120 }}
                    />
                    <Button
                      variant="contained"
                      component="label"
                      size="small"
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0
                      }}
                    >
                      Change
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        name="profileImage"
                      />
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserSettings; 