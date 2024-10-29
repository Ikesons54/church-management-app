import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Warning
} from '@mui/icons-material';

const SystemHealth = ({ stats }) => {
  const getStatusIcon = (status) => {
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

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          System Health
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              {getStatusIcon(stats?.database?.status)}
            </ListItemIcon>
            <ListItemText
              primary="Database"
              secondary={`${stats?.database?.latency}ms latency`}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              {getStatusIcon(stats?.storage?.status)}
            </ListItemIcon>
            <ListItemText
              primary="Storage"
              secondary={`${stats?.storage?.used}/${stats?.storage?.total} GB used`}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              {getStatusIcon(stats?.cache?.status)}
            </ListItemIcon>
            <ListItemText
              primary="Cache"
              secondary={`${stats?.cache?.hitRate}% hit rate`}
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};

export default SystemHealth; 