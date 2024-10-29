import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  LinearProgress
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const ServiceAttendanceReport = ({ data, period }) => {
  // Sample data structure
  const attendanceData = {
    summary: {
      totalAttendance: 450,
      averageAttendance: 150,
      highestAttendance: 180,
      lowestAttendance: 120,
      growthRate: '+5%'
    },
    weekly: [
      {
        date: '2024-01-07',
        total: 150,
        men: 60,
        women: 70,
        youth: 10,
        children: 10,
        firstTimers: 3
      },
      // More weeks...
    ]
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Service Attendance Report - {period}
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Attendance
              </Typography>
              <Typography variant="h4">
                {attendanceData.summary.totalAttendance}
              </Typography>
              <Typography variant="body2" color="success.main">
                {attendanceData.summary.growthRate} from last {period}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Attendance
              </Typography>
              <Typography variant="h4">
                {attendanceData.summary.averageAttendance}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                First Time Visitors
              </Typography>
              <Typography variant="h4">
                {attendanceData.weekly.reduce((acc, week) => acc + week.firstTimers, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Attendance Chart */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Attendance Trends
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData.weekly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="men" name="Men" fill="#1B4F72" />
              <Bar dataKey="women" name="Women" fill="#922B21" />
              <Bar dataKey="youth" name="Youth" fill="#148F77" />
              <Bar dataKey="children" name="Children" fill="#B7950B" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Attendance Table */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Weekly Breakdown
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Men</TableCell>
                  <TableCell align="right">Women</TableCell>
                  <TableCell align="right">Youth</TableCell>
                  <TableCell align="right">Children</TableCell>
                  <TableCell align="right">First Timers</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceData.weekly.map((week) => (
                  <TableRow key={week.date}>
                    <TableCell>{week.date}</TableCell>
                    <TableCell align="right">{week.men}</TableCell>
                    <TableCell align="right">{week.women}</TableCell>
                    <TableCell align="right">{week.youth}</TableCell>
                    <TableCell align="right">{week.children}</TableCell>
                    <TableCell align="right">{week.firstTimers}</TableCell>
                    <TableCell align="right">{week.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ServiceAttendanceReport; 