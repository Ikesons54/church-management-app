import React from 'react';
import {
  Box,
  Grid,
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
  Chip,
  Avatar
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const MinistryGrowthReport = ({ period }) => {
  const ministryData = {
    summary: {
      totalMembers: 450,
      newMembers: 45,
      activeMembers: 380,
      growthRate: '+10%'
    },
    ministries: {
      leadership: {
        name: 'Church Leadership',
        members: [
          { id: 'COPAD0001', name: 'John Doe', role: 'Presiding Elder' },
          { id: 'COPAD0002', name: 'Jane Smith', role: 'Elder' },
          { id: 'COPAD0003', name: 'James Wilson', role: 'Deacon' },
          { id: 'COPAD0004', name: 'Mary Johnson', role: 'Deaconess' }
        ],
        meetings: 12,
        activities: [
          { name: 'Leadership Meeting', date: '2024-01-15', attendance: 15 }
        ]
      },
      pemem: {
        name: 'PEMEM (Men\'s Ministry)',
        totalMembers: 150,
        activeMembers: 130,
        newMembers: 15,
        activities: 12,
        attendance: 85,
        leaders: [
          { id: 'COPAD0005', name: 'Peter Brown', role: 'Ministry Leader' }
        ],
        events: [
          { name: 'Men\'s Prayer Meeting', date: '2024-01-15', attendance: 120 }
        ]
      },
      womensMovement: {
        name: 'Women\'s Movement',
        totalMembers: 180,
        activeMembers: 160,
        newMembers: 20,
        activities: 15,
        attendance: 90,
        leaders: [
          { id: 'COPAD0006', name: 'Sarah Jones', role: 'Ministry Leader' }
        ],
        events: [
          { name: 'Women\'s Prayer Meeting', date: '2024-01-16', attendance: 150 }
        ]
      },
      youth: {
        name: 'Youth Ministry',
        totalMembers: 80,
        activeMembers: 65,
        newMembers: 8,
        activities: 10,
        attendance: 75,
        leaders: [
          { id: 'COPAD0007', name: 'David Lee', role: 'Youth Leader' }
        ],
        events: [
          { name: 'Youth Fellowship', date: '2024-01-17', attendance: 60 }
        ]
      },
      childrens: {
        name: 'Children\'s Ministry',
        totalMembers: 40,
        activeMembers: 35,
        newMembers: 5,
        activities: 8,
        attendance: 88,
        leaders: [
          { id: 'COPAD0008', name: 'Grace Chen', role: 'Ministry Leader' }
        ],
        events: [
          { name: 'Sunday School', date: '2024-01-14', attendance: 35 }
        ]
      },
      choir: {
        name: 'Church Choir',
        totalMembers: 30,
        activeMembers: 28,
        newMembers: 3,
        activities: 20,
        attendance: 95,
        leaders: [
          { id: 'COPAD0009', name: 'Michael Song', role: 'Choir Director' }
        ],
        events: [
          { name: 'Choir Practice', date: '2024-01-13', attendance: 28 }
        ]
      },
      pemfit: {
        name: 'PEMFIT (Fitness Club)',
        totalMembers: 50,
        activeMembers: 40,
        newMembers: 5,
        activities: 16,
        attendance: 80,
        leaders: [
          { id: 'COPAD0010', name: 'Tom Fitness', role: 'PEMFIT Coordinator' }
        ],
        events: [
          { name: 'Fitness Session', date: '2024-01-18', attendance: 35 }
        ]
      },
      mediaTeam: {
        name: 'Media Team',
        totalMembers: 15,
        activeMembers: 12,
        newMembers: 2,
        activities: 52, // Weekly service
        attendance: 90,
        leaders: [
          { id: 'COPAD0011', name: 'Tech Leader', role: 'Media Team Lead' }
        ],
        events: [
          { name: 'Sunday Service Coverage', date: '2024-01-14', attendance: 12 }
        ]
      },
      ushers: {
        name: 'Ushering Team',
        totalMembers: 20,
        activeMembers: 18,
        newMembers: 2,
        activities: 52, // Weekly service
        attendance: 90,
        leaders: [
          { id: 'COPAD0012', name: 'Head Usher', role: 'Head Usher' }
        ],
        events: [
          { name: 'Sunday Service', date: '2024-01-14', attendance: 18 }
        ]
      }
    },
    monthlyGrowth: [
      {
        month: 'Jan',
        pemem: 150,
        womensMovement: 180,
        youth: 80,
        childrens: 40,
        choir: 30,
        pemfit: 50,
        mediaTeam: 15,
        ushers: 20
      }
      // More monthly data...
    ]
  };

  const COLORS = [
    '#1B4F72', // Leadership
    '#922B21', // PEMEM
    '#148F77', // Women's Movement
    '#B7950B', // Youth
    '#6C3483', // Children's
    '#2874A6', // Choir
    '#CB4335', // PEMFIT
    '#1ABC9C', // Media Team
    '#F1C40F'  // Ushers
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Ministry Growth Report - {period}
      </Typography>

      {/* Overall Summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card variant="outlined">
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Members
              </Typography>
              <Typography variant="h4">
                {ministryData.summary.totalMembers}
              </Typography>
              <Typography variant="body2" color="success.main">
                {ministryData.summary.growthRate} from last {period}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card variant="outlined">
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                New Members
              </Typography>
              <Typography variant="h4">
                {ministryData.summary.newMembers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card variant="outlined">
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Members
              </Typography>
              <Typography variant="h4">
                {ministryData.summary.activeMembers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card variant="outlined">
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Attendance
              </Typography>
              <Typography variant="h4">
                {Math.round(
                  (ministryData.summary.activeMembers / 
                   ministryData.summary.totalMembers) * 100
                )}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add a new section for Church Leadership */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Church Leadership
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Role</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Member ID</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ministryData.ministries.leadership.members.map((leader) => (
                  <TableRow key={leader.id}>
                    <TableCell>{leader.role}</TableCell>
                    <TableCell>{leader.name}</TableCell>
                    <TableCell>{leader.id}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Ministry Breakdown */}
      <Grid container spacing={3}>
        {Object.values(ministryData.ministries).map((ministry, index) => (
          <Grid item xs={12} md={6} key={ministry.name}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {ministry.name}
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Total Members
                    </Typography>
                    <Typography variant="h6">
                      {ministry.totalMembers}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Active Members
                    </Typography>
                    <Typography variant="h6">
                      {ministry.activeMembers}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      New Members
                    </Typography>
                    <Typography variant="h6">
                      {ministry.newMembers}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Attendance Rate
                    </Typography>
                    <Typography variant="h6">
                      {ministry.attendance}%
                    </Typography>
                  </Grid>
                </Grid>

                <Box mt={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Leadership
                  </Typography>
                  {ministry.leaders.map((leader) => (
                    <Box key={leader.id} display="flex" alignItems="center" gap={1} mb={1}>
                      <Avatar sx={{ width: 24, height: 24 }}>
                        {leader.name[0]}
                      </Avatar>
                      <Typography variant="body2">
                        {leader.name} - {leader.role}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Box mt={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Recent Events
                  </Typography>
                  {ministry.events.map((event, idx) => (
                    <Box key={idx} mb={1}>
                      <Typography variant="body2">
                        {event.name} - {event.date}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Attendance: {event.attendance}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Growth Trends */}
      <Card variant="outlined" sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Ministry Growth Trends
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ministryData.monthlyGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pemem" name="PEMEM" stroke={COLORS[1]} />
              <Line type="monotone" dataKey="womensMovement" name="Women's Movement" stroke={COLORS[2]} />
              <Line type="monotone" dataKey="youth" name="Youth" stroke={COLORS[3]} />
              <Line type="monotone" dataKey="childrens" name="Children's" stroke={COLORS[4]} />
              <Line type="monotone" dataKey="choir" name="Choir" stroke={COLORS[5]} />
              <Line type="monotone" dataKey="pemfit" name="PEMFIT" stroke={COLORS[6]} />
              <Line type="monotone" dataKey="mediaTeam" name="Media Team" stroke={COLORS[7]} />
              <Line type="monotone" dataKey="ushers" name="Ushers" stroke={COLORS[8]} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MinistryGrowthReport; 