import React, { useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Button
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import {
  People,
  Event,
  AttachMoney,
  Podcasts,
  Settings,
  Refresh
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminStats } from '../../store/slices/adminSlice';
import AdminChart from './AdminChart';
import SystemHealth from './SystemHealth';
import RecentActivities from './RecentActivities';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector(state => state.admin);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  const refreshStats = () => {
    dispatch(fetchAdminStats());
  };

  const StatCard = ({ title, value, icon, color, progress }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}.light`,
              borderRadius: '50%',
              padding: 1
            }}
          >
            {icon}
          </Box>
        </Box>
        {progress && (
          <Box mt={2}>
            <LinearProgress
              variant="determinate"
              value={progress}
              color={color}
            />
            <Typography variant="caption" color="textSecondary">
              {progress}% growth this month
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Admin Dashboard</Typography>
        <Button
          startIcon={<Refresh />}
          onClick={refreshStats}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Members"
            value={stats?.totalMembers || 0}
            icon={<People color="primary" />}
            color="primary"
            progress={stats?.memberGrowth}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <StatCard
            title="Monthly Revenue"
            value={`$${stats?.monthlyRevenue?.toLocaleString() || 0}`}
            icon={<AttachMoney color="success" />}
            color="success"
            progress={stats?.revenueGrowth}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <StatCard
            title="Active Events"
            value={stats?.activeEvents || 0}
            icon={<Event color="warning" />}
            color="warning"
            progress={stats?.eventGrowth}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Growth Overview
              </Typography>
              <AdminChart data={stats?.growthData || []} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <SystemHealth stats={stats?.systemHealth} />
        </Grid>

        <Grid item xs={12}>
          <RecentActivities activities={stats?.recentActivities || []} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard; 