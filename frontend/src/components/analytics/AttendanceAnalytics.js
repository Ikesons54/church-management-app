import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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

const AttendanceAnalytics = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [analyticsData, setAnalyticsData] = useState({
    trends: [],
    demographics: {},
    ministryBreakdown: [],
    growthMetrics: {}
  });

  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
    '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'
  ];

  const calculateTrends = (attendanceData) => {
    return attendanceData.map(entry => ({
      date: entry.date,
      totalAttendance: entry.count,
      newMembers: entry.newMembers || 0
    }));
  };

  const analyzeDemographics = (membersData) => {
    // Transform members data into pie chart format
    return membersData || [];
  };

  const calculateMinistryMetrics = (ministriesData) => {
    // Transform ministry data into bar chart format
    return ministriesData || [];
  };

  const calculateGrowthMetrics = (data) => {
    // Calculate growth metrics
    return {};
  };

  // Fetch and process analytics data
  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics/${timeRange}`);
      const data = await response.json();
      processAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  // Process and calculate advanced metrics
  const processAnalyticsData = (data) => {
    const processed = {
      trends: calculateTrends(data.attendance),
      demographics: analyzeDemographics(data.members),
      ministryBreakdown: calculateMinistryMetrics(data.ministries),
      growthMetrics: calculateGrowthMetrics(data)
    };
    setAnalyticsData(processed);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Attendance Trends */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6">Attendance Trends</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="totalAttendance" 
                    stroke="#8884d8" 
                    name="Total Attendance"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="newMembers" 
                    stroke="#82ca9d" 
                    name="New Members"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Demographics Breakdown */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Demographics</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.demographics}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analyticsData.demographics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Ministry Performance */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Ministry Performance</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.ministryBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="attendance" fill="#8884d8" name="Attendance" />
                  <Bar dataKey="growth" fill="#82ca9d" name="Growth Rate" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AttendanceAnalytics; 