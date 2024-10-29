import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Chip,
  LinearProgress,
  Dialog,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import {
  PictureAsPdf as PdfIcon,
  CloudDownload as DownloadIcon,
  Share as ShareIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  BarChart as ChartIcon,
  CompareArrows as CompareIcon
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const MinistryReports = () => {
  const [selectedMinistry, setSelectedMinistry] = useState('all');
  const [dateRange, setDateRange] = useState('month');
  const [activeTab, setActiveTab] = useState(0);
  const [showComparison, setShowComparison] = useState(false);

  const ministries = [
    { id: 'all', name: 'All Ministries' },
    { id: 'pemem', name: 'PEMEM' },
    { id: 'womens', name: "Women's Movement" },
    { id: 'youth', name: 'Youth Ministry' },
    { id: 'children', name: "Children's Ministry" },
    { id: 'choir', name: 'Church Choir' },
    { id: 'pemfit', name: 'PEMFIT' },
    { id: 'media', name: 'Media Team' },
    { id: 'ushers', name: 'Ushering Team' }
  ];

  // Enhanced chart colors with better visibility
  const CHART_COLORS = {
    primary: {
      pemem: '#2E86C1',
      womens: '#E74C3C',
      youth: '#27AE60',
      children: '#F1C40F',
      choir: '#8E44AD',
      pemfit: '#E67E22',
      media: '#16A085',
      ushers: '#2C3E50'
    },
    secondary: {
      pemem: '#AED6F1',
      womens: '#F5B7B1',
      youth: '#ABEBC6',
      children: '#F9E79F',
      choir: '#D7BDE2',
      pemfit: '#F5CBA7',
      media: '#A2D9CE',
      ushers: '#ABB2B9'
    }
  };

  // Enhanced attendance data structure
  const attendanceData = {
    summary: {
      total: 450,
      average: 380,
      trend: '+5%',
      breakdown: {
        men: 150,
        women: 180,
        youth: 80,
        children: 40
      }
    },
    byMinistry: {
      pemem: {
        total: 150,
        active: 130,
        irregular: 15,
        inactive: 5
      },
      womens: {
        total: 180,
        active: 160,
        irregular: 12,
        inactive: 8
      }
      // ... other ministries
    },
    byService: {
      'Sunday Service': {
        average: 380,
        peak: 450,
        lowest: 320
      },
      'Bible Study': {
        average: 150,
        peak: 180,
        lowest: 120
      },
      'Prayer Meeting': {
        average: 100,
        peak: 130,
        lowest: 80
      }
    }
  };

  // Add this data structure
  const ministryData = {
    performance: {
      attendance: 85,
      participation: 75,
      engagement: 90,
      retention: 80
    },
    growth: {
      newMembers: "+15%",
      retention: "92%",
      engagement: "High",
      satisfaction: "4.5/5"
    },
    activities: [
      { id: 1, ministry: "PEMEM", name: "Bible Study", date: "2024-03-15", attendance: 45, status: "completed" },
      { id: 2, ministry: "Youth", name: "Workshop", date: "2024-03-18", attendance: 30, status: "pending" }
    ]
  };

  // Render pie chart for ministry distribution
  const renderMinistryDistributionChart = () => (
    <Box height={300}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={Object.entries(attendanceData.summary.breakdown).map(([key, value]) => ({
              name: key,
              value: value
            }))}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
          >
            {Object.entries(attendanceData.summary.breakdown).map(([key], index) => (
              <Cell key={key} fill={Object.values(CHART_COLORS.primary)[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );

  // Render attendance trends chart
  const renderAttendanceTrendsChart = () => (
    <Box height={300}>
      <ResponsiveContainer>
        <BarChart
          data={Object.entries(attendanceData.byService).map(([service, data]) => ({
            name: service,
            average: data.average,
            peak: data.peak,
            lowest: data.lowest
          }))}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="average" fill={CHART_COLORS.primary.pemem} />
          <Bar dataKey="peak" fill={CHART_COLORS.primary.youth} />
          <Bar dataKey="lowest" fill={CHART_COLORS.primary.womens} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );

  const renderPerformanceMetrics = () => (
    <Grid container spacing={2}>
      {Object.entries(ministryData.performance).map(([metric, value]) => (
        <Grid item xs={12} sm={6} md={3} key={metric}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                {metric.split(/(?=[A-Z])/).join(' ')}
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="h4">
                  {value}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={value}
                  sx={{ flexGrow: 1 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">
          Ministry Reports
        </Typography>
        <Box display="flex" gap={2}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Ministry</InputLabel>
            <Select
              value={selectedMinistry}
              onChange={(e) => setSelectedMinistry(e.target.value)}
            >
              {ministries.map((ministry) => (
                <MenuItem key={ministry.id} value={ministry.id}>
                  {ministry.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
              <MenuItem value="quarter">This Quarter</MenuItem>
              <MenuItem value="year">This Year</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<CompareIcon />}
            onClick={() => setShowComparison(!showComparison)}
          >
            Compare
          </Button>
        </Box>
      </Box>

      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label="Overview" />
        <Tab label="Attendance" />
        <Tab label="Activities" />
        <Tab label="Growth" />
        <Tab label="Performance" />
      </Tabs>

      {/* Overview Tab */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Attendance Trends
                </Typography>
                {renderAttendanceTrendsChart()}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Stats
                </Typography>
                <List>
                  {Object.entries(ministryData.growth).map(([key, value]) => (
                    <ListItem key={key}>
                      <ListItemText
                        primary={key.split(/(?=[A-Z])/).join(' ')}
                        secondary={value}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Activities Tab */}
      {activeTab === 2 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ministry</TableCell>
                <TableCell>Activity</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Attendance</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ministryData.activities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>{activity.ministry}</TableCell>
                  <TableCell>{activity.name}</TableCell>
                  <TableCell>{activity.date}</TableCell>
                  <TableCell align="right">{activity.attendance}</TableCell>
                  <TableCell>
                    <Chip
                      label={activity.status}
                      color={activity.status === 'completed' ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Performance Tab */}
      {activeTab === 4 && renderPerformanceMetrics()}

      {/* Export Options */}
      <Box display="flex" justifyContent="flex-end" mt={3} gap={2}>
        <Button startIcon={<PdfIcon />}>
          Export PDF
        </Button>
        <Button startIcon={<EmailIcon />}>
          Email Report
        </Button>
        <Button startIcon={<PrintIcon />}>
          Print
        </Button>
      </Box>
    </Box>
  );
};

export default MinistryReports; 