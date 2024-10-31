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
  Badge,
  Button,
  CircularProgress,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  Refresh,
  WifiOff,
  Warning,
  CheckCircle,
  Error,
  DeviceHub,
  Storage,
  Speed
} from '@mui/icons-material';

const MonitoringDashboard = () => {
  const [devices, setDevices] = useState([]);
  const [syncStatus, setSyncStatus] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [systemHealth, setSystemHealth] = useState({
    database: 'healthy',
    server: 'healthy',
    scanners: 'healthy'
  });

  // Monitor system health
  const checkSystemHealth = async () => {
    try {
      const response = await fetch('/api/admin/system-health');
      const health = await response.json();
      setSystemHealth(health);
    } catch (error) {
      console.error('Error checking system health:', error);
      setSystemHealth(prev => ({
        ...prev,
        server: 'error'
      }));
    }
  };

  // Real-time monitoring setup
  useEffect(() => {
    const socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleWebSocketMessage(data);
    };

    // Check system health every 5 minutes
    const healthCheck = setInterval(checkSystemHealth, 300000);
    checkSystemHealth(); // Initial check

    return () => {
      socket.close();
      clearInterval(healthCheck);
    };
  }, []);

  const handleWebSocketMessage = (data) => {
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
      case 'SYSTEM_HEALTH':
        setSystemHealth(data.health);
        break;
      default:
        console.warn('Unhandled websocket message type:', data.type);
    }
  };

  const getHealthIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle color="success" />;
      case 'warning':
        return <Warning color="warning" />;
      case 'error':
        return <Error color="error" />;
      default:
        return <CircularProgress size={20} />;
    }
  };

  const getDeviceStatusChip = (status) => {
    const statusConfig = {
      online: { color: 'success', label: 'Online' },
      offline: { color: 'error', label: 'Offline' },
      syncing: { color: 'info', label: 'Syncing' },
      error: { color: 'error', label: 'Error' }
    };

    const config = statusConfig[status] || statusConfig.error;

    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        variant="outlined"
      />
    );
  };

  const handleDeviceAction = (deviceId, action) => {
    // Implement device action logic
  };

  const dismissAlert = (alertId) => {
    // Implement alert dismissal logic
  };

  const handleAlertAction = (alert) => {
    // Implement alert action logic
  };

  const updateDeviceStatus = (device) => {
    setDevices(prev => [...prev.filter(d => d.id !== device.id), device]);
  };

  const updateSyncStatus = (status) => {
    setSyncStatus(status);
  };

  const addAlert = (alert) => {
    setAlerts(prev => [...prev, alert]);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h5">System Monitoring</Typography>
        <Button
          startIcon={<Refresh />}
          onClick={checkSystemHealth}
        >
          Refresh Status
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* System Health Overview */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Health
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Storage />
                    <Box>
                      <Typography variant="subtitle2">Database</Typography>
                      {getHealthIcon(systemHealth.database)}
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <DeviceHub />
                    <Box>
                      <Typography variant="subtitle2">Server</Typography>
                      {getHealthIcon(systemHealth.server)}
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Speed />
                    <Box>
                      <Typography variant="subtitle2">QR Scanners</Typography>
                      {getHealthIcon(systemHealth.scanners)}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Connected Devices */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Connected Devices
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Device ID</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Last Sync</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {devices.map(device => (
                    <TableRow key={device.id}>
                      <TableCell>{device.id}</TableCell>
                      <TableCell>{device.location}</TableCell>
                      <TableCell>
                        {getDeviceStatusChip(device.status)}
                      </TableCell>
                      <TableCell>
                        {new Date(device.lastSync).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleDeviceAction(device.id, 'restart')}
                        >
                          <Refresh />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        {/* Sync Status */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Synchronization Status
              </Typography>
              <Box>
                <Typography variant="subtitle2">
                  Last Sync: {new Date(syncStatus.lastSync).toLocaleString()}
                </Typography>
                <Typography variant="body2">
                  Status: {syncStatus.status}
                </Typography>
                {syncStatus.progress && (
                  <Box mt={2}>
                    <LinearProgress 
                      variant="determinate" 
                      value={syncStatus.progress} 
                    />
                    <Typography variant="caption">
                      {syncStatus.progress}% Complete
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* System Alerts */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Alerts
              </Typography>
              {alerts.length === 0 ? (
                <Alert severity="success">
                  No active alerts at this time
                </Alert>
              ) : (
                alerts.map(alert => (
                  <Alert
                    key={alert.id}
                    severity={alert.severity}
                    onClose={() => dismissAlert(alert.id)}
                    style={{ marginBottom: 8 }}
                    action={
                      <Button 
                        color="inherit" 
                        size="small"
                        onClick={() => handleAlertAction(alert)}
                      >
                        Resolve
                      </Button>
                    }
                  >
                    <Typography variant="subtitle2">
                      {alert.title}
                    </Typography>
                    <Typography variant="body2">
                      {alert.message}
                    </Typography>
                    <Typography variant="caption" display="block">
                      {new Date(alert.timestamp).toLocaleString()}
                    </Typography>
                  </Alert>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MonitoringDashboard;