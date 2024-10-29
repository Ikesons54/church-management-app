import React, { useState, useEffect } from 'react';
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Badge
} from '@mui/material';
import {
  Home,
  Event,
  QrCode,
  Person,
  Notifications
} from '@mui/icons-material';
import HomeScreen from './screens/HomeScreen';
import EventsScreen from './screens/EventsScreen';
import QRCodeScreen from './screens/QRCodeScreen';
import ProfileScreen from './screens/ProfileScreen';

const MobileApp = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Handle offline functionality
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

  const updatePushSubscription = async (subscription) => {
    try {
      await fetch('/api/push-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });
    } catch (error) {
      console.error('Failed to update push subscription:', error);
    }
  };

  // Initialize push notifications
  useEffect(() => {
    initializePushNotifications();
  }, []);

  const initializePushNotifications = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY
      });
      
      // Send subscription to server
      await updatePushSubscription(subscription);
    } catch (error) {
      console.error('Push notification initialization failed:', error);
    }
  };

  return (
    <Box sx={{ pb: 7 }}>
      {/* Main Content Area */}
      <Box sx={{ height: '100vh', overflow: 'auto' }}>
        {/* Home Tab */}
        {activeTab === 0 && (
          <HomeScreen
            userProfile={userProfile}
            isOnline={isOnline}
          />
        )}

        {/* Events Tab */}
        {activeTab === 1 && (
          <EventsScreen
            userProfile={userProfile}
            isOnline={isOnline}
          />
        )}

        {/* QR Code Tab */}
        {activeTab === 2 && (
          <QRCodeScreen
            userProfile={userProfile}
            isOnline={isOnline}
          />
        )}

        {/* Profile Tab */}
        {activeTab === 3 && (
          <ProfileScreen
            userProfile={userProfile}
            isOnline={isOnline}
          />
        )}
      </Box>

      {/* Bottom Navigation */}
      <Paper
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          value={activeTab}
          onChange={(event, newValue) => {
            setActiveTab(newValue);
          }}
        >
          <BottomNavigationAction
            label="Home"
            icon={<Home />}
          />
          <BottomNavigationAction
            label="Events"
            icon={<Event />}
          />
          <BottomNavigationAction
            label="QR Code"
            icon={<QrCode />}
          />
          <BottomNavigationAction
            label="Profile"
            icon={
              <Badge badgeContent={notifications.length} color="error">
                <Person />
              </Badge>
            }
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default MobileApp; 