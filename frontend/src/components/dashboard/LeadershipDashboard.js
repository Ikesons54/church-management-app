import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
  Chip
} from '@mui/material';
import {
  People as PeopleIcon,
  Event as EventIcon,
  Assignment as AssignmentIcon,
  Notifications as NotificationsIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

const LeadershipDashboard = () => {
  const churchStats = {
    totalMembers: 450,
    newMembers: 15,
    attendance: 380,
    upcomingEvents: 5,
    pendingApprovals: 3
  };

  const upcomingEvents = [
    {
      id: 1,
      name: 'Sunday Service',
      date: '2024-01-21',
      type: 'service',
      status: 'confirmed'
    },
    {
      id: 2,
      name: 'Leadership Meeting',
      date: '2024-01-22',
      type: 'meeting',
      status: 'pending'
    }
  ];

  const pendingApprovals = [
    {
      id: 1,
      type: 'Membership',
      requestedBy: 'John Doe',
      date: '2024-01-20'
    },
    {
      id: 2,
      type: 'Event Proposal',
      requestedBy: 'Women\'s Ministry',
      date: '2024-01-19'
    }
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Leadership Dashboard
      </Typography>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Members
              </Typography>
              <Typography variant="h3">
                {churchStats.totalMembers}
              </Typography>
              <Typography variant="body2" color="success.main">
                +{churchStats.newMembers} this month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Last Sunday Attendance
              </Typography>
              <Typography variant="h3">
                {churchStats.attendance}
              </Typography>
              <Typography variant="body2">
                {Math.round((churchStats.attendance / churchStats.totalMembers) * 100)}% attendance rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Upcoming Events
              </Typography>
              <Typography variant="h3">
                {churchStats.upcomingEvents}
              </Typography>
              <Typography variant="body2">
                Next 7 days
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending Approvals
              </Typography>
              <Typography variant="h3">
                {churchStats.pendingApprovals}
              </Typography>
              <Typography variant="body2" color="error.main">
                Requires attention
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Events
              </Typography>
              <List>
                {upcomingEvents.map((event) => (
                  <React.Fragment key={event.id}>
                    <ListItem>
                      <ListItemIcon>
                        <EventIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={event.name}
                        secondary={event.date}
                      />
                      <Chip
                        label={event.status}
                        color={event.status === 'confirmed' ? 'success' : 'warning'}
                        size="small"
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
              >
                View All Events
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ministry Reports
              </Typography>
              {/* Add ministry reports summary */}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pending Approvals
              </Typography>
              <List>
                {pendingApprovals.map((item) => (
                  <React.Fragment key={item.id}>
                    <ListItem>
                      <ListItemText
                        primary={item.type}
                        secondary={`Requested by: ${item.requestedBy} on ${item.date}`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Review Approvals
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <List>
                <ListItem button>
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Member Directory" />
                </ListItem>
                <ListItem button>
                  <ListItemIcon>
                    <AssignmentIcon />
                  </ListItemIcon>
                  <ListItemText primary="Generate Reports" />
                </ListItem>
                <ListItem button>
                  <ListItemIcon>
                    <NotificationsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Send Announcements" />
                </ListItem>
                <ListItem button>
                  <ListItemIcon>
                    <TrendingUpIcon />
                  </ListItemIcon>
                  <ListItemText primary="View Analytics" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LeadershipDashboard; 