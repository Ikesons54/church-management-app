import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Alert,
  IconButton,
  Badge
} from '@mui/material';

const MonitoringDashboard = () => {
  const [devices, setDevices] = useState([]);
  const [syncStatus, setSyncStatus] = useState({});
  const [alerts, setAlerts] = useState([]);

  const addAlert = (alert) => {
    setAlerts(prevAlerts => [...prevAlerts, alert]);
  };

  const dismissAlert = (alertId) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== alertId));
  };

  const updateDeviceStatus = (device) => {
    setDevices(prevDevices => {
      const index = prevDevices.findIndex(d => d.id === device.id);
      if (index >= 0) {
        const newDevices = [...prevDevices];
        newDevices[index] = { ...newDevices[index], ...device };
        return newDevices;
      }
      return [...prevDevices, device];
    });
  };

  const updateSyncStatus = (status) => {
    setSyncStatus(status);
  };

  // Real-time monitoring of all connected devices
  useEffect(() => {
    const socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case 'DEVICE_UPDATE':
          updateDeviceStatus(data.device);
          break;
        case 'SYNC_STATUS':
          updateSyncStatus(data.status);
          break;
        case 'ALERT':
          addAlert(data.alert);
          break;
        default:
          console.warn('Unhandled websocket message type:', data.type);
      }
    };

    return () => socket.close();
  }, []);

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Device Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Connected Devices</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Device ID</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Last Sync</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {devices.map(device => (
                    <TableRow key={device.id}>
                      <TableCell>{device.id}</TableCell>
                      <TableCell>{device.location}</TableCell>
                      <TableCell>
                        <Badge
                          color={device.online ? 'success' : 'error'}
                          variant="dot"
                        />
                        {device.online ? 'Online' : 'Offline'}
                      </TableCell>
                      <TableCell>{device.lastSync}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        {/* Sync Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Synchronization Status</Typography>
              {/* Sync status content */}
            </CardContent>
          </Card>
        </Grid>

        {/* System Alerts */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">System Alerts</Typography>
              {alerts.map(alert => (
                <Alert
                  key={alert.id}
                  severity={alert.severity}
                  onClose={() => dismissAlert(alert.id)}
                >
                  {alert.message}
                </Alert>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}; 