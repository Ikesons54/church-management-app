import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Button,
  Tabs,
  Tab,
  IconButton,
  Menu,
  MenuItem,
  Tooltip
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import {
  People,
  Event,
  Church,
  OnlinePrediction,
  Settings,
  Refresh,
  MoreVert,
  GroupAdd,
  Timeline,
  CalendarToday
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminStats } from '../../store/slices/adminSlice';
import AdminChart from './AdminChart';
import ServiceStats from './ServiceStats';
import AttendanceOverview from './AttendanceOverview';
import MemberStats from './MemberStats';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector(state => state.admin);
  const [currentTab, setCurrentTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminStats());
    // Set up real-time updates
    const socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'STATS_UPDATE') {
        dispatch(fetchAdminStats());
      }
    };
    return () => socket.close();
  }, [dispatch]);

  const StatCard = ({ title, value, icon, color, progress, subtitle }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary">
                {subtitle}
              </Typography>
            )}
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
              {progress}% compared to last month
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const ServiceOverview = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Today's Services
        </Typography>
        <Grid container spacing={2}>
          {stats?.todayServices?.map(service => (
            <Grid item xs={12} md={6} key={service.id}>
              <Box 
                p={2} 
                bgcolor="background.paper" 
                borderRadius={1}
                border={1}
                borderColor="divider"
              >
                <Typography variant="subtitle1">{service.name}</Typography>
                <Box display="flex" justifyContent="space-between" mt={1}>
                  <Typography variant="body2">
                    Time: {service.time}
                  </Typography>
                  <Typography variant="body2">
                    Expected: {service.expectedAttendance}
                  </Typography>
                </Box>
                {service.isLive && (
                  <Box mt={1}>
                    <Typography variant="body2" color="success.main">
                      Live Now - {service.currentAttendance} attending
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Church Admin Dashboard</Typography>
        <Box>
          <Button
            startIcon={<Refresh />}
            onClick={() => dispatch(fetchAdminStats())}
            disabled={loading}
          >
            Refresh
          </Button>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <MoreVert />
          </IconButton>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => {/* Handle export */}}>
          Export Statistics
        </MenuItem>
        <MenuItem onClick={() => {/* Handle settings */}}>
          Dashboard Settings
        </MenuItem>
      </Menu>

      <Tabs
        value={currentTab}
        onChange={(_, newValue) => setCurrentTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label="Overview" />
        <Tab label="Services" />
        <Tab label="Attendance" />
        <Tab label="Members" />
      </Tabs>

      {currentTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Total Members"
              value={stats?.totalMembers || 0}
              icon={<People color="primary" />}
              color="primary"
              progress={stats?.memberGrowth}
              subtitle="Active members"
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <StatCard
              title="Today's Attendance"
              value={stats?.todayAttendance || 0}
              icon={<Church color="success" />}
              color="success"
              subtitle={`${stats?.attendancePercentage}% of total members`}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <StatCard
              title="Online Service Views"
              value={stats?.onlineViews || 0}
              icon={<OnlinePrediction color="info" />}
              color="info"
              progress={stats?.onlineGrowth}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <StatCard
              title="New Visitors"
              value={stats?.newVisitors || 0}
              icon={<GroupAdd color="warning" />}
              color="warning"
              progress={stats?.visitorGrowth}
            />
          </Grid>

          <Grid item xs={12} md={8}>
            <ServiceOverview />
          </Grid>

          <Grid item xs={12} md={4}>
            <AttendanceOverview stats={stats?.attendanceStats} />
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Growth Trends
                </Typography>
                <AdminChart data={stats?.growthData || []} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {currentTab === 1 && <ServiceStats />}
      {currentTab === 2 && <AttendanceOverview detailed />}
      {currentTab === 3 && <MemberStats />}
    </Box>
  );
};

export default AdminDashboard; 