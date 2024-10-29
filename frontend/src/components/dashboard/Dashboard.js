import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@mui/material/Unstable_Grid2';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import {
  PeopleOutline,
  EventNote,
  AttachMoney,
  PrayingHands
} from '@mui/icons-material';
import { fetchDashboardStats } from '../../store/slices/dashboardSlice';
import DashboardChart from './DashboardChart';
import RecentActivities from './RecentActivities';
import UpcomingEvents from './UpcomingEvents';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector(state => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PeopleOutline sx={{ fontSize: 40, color: 'primary.main' }} />
                <Box ml={2}>
                  <Typography variant="h4">{stats.totalMembers}</Typography>
                  <Typography variant="subtitle2">Total Members</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <EventNote sx={{ fontSize: 40, color: 'secondary.main' }} />
                <Box ml={2}>
                  <Typography variant="h4">{stats.upcomingEvents}</Typography>
                  <Typography variant="subtitle2">Upcoming Events</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AttachMoney sx={{ fontSize: 40, color: 'success.main' }} />
                <Box ml={2}>
                  <Typography variant="h4">
                    ${stats.monthlyDonations.toLocaleString()}
                  </Typography>
                  <Typography variant="subtitle2">Monthly Donations</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PrayingHands sx={{ fontSize: 40, color: 'warning.main' }} />
                <Box ml={2}>
                  <Typography variant="h4">{stats.activePrayers}</Typography>
                  <Typography variant="subtitle2">Prayer Requests</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Attendance Overview
              </Typography>
              <DashboardChart data={stats.attendanceData} />
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={4}>
          <RecentActivities activities={stats.recentActivities} />
        </Grid>

        {/* Upcoming Events */}
        <Grid item xs={12}>
          <UpcomingEvents events={stats.upcomingEventsList} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 