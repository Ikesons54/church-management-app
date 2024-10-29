import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  IconButton,
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
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Group as GroupIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

const CellGroupManager = () => {
  const [cellGroups, setCellGroups] = useState([
    {
      id: 1,
      name: "Abu Dhabi City Cell Group",
      leader: "COPAD0001",
      leaderName: "John Doe",
      location: "Abu Dhabi City",
      meetingDay: "Wednesday",
      meetingTime: "19:30",
      members: [
        { id: "COPAD0001", name: "John Doe", role: "Leader" },
        { id: "COPAD0002", name: "Jane Smith", role: "Member" }
      ],
      status: "active"
    }
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [newGroup, setNewGroup] = useState({
    name: '',
    leader: '',
    leaderName: '',
    location: '',
    meetingDay: '',
    meetingTime: '',
    members: [],
    status: 'active'
  });

  const handleSaveGroup = () => {
    if (selectedGroup) {
      setCellGroups(cellGroups.map(group => 
        group.id === selectedGroup.id ? { ...newGroup, id: group.id } : group
      ));
    } else {
      setCellGroups([
        ...cellGroups,
        { ...newGroup, id: cellGroups.length + 1 }
      ]);
    }
    setOpenDialog(false);
  };

  const handleDeleteGroup = (id) => {
    setCellGroups(cellGroups.filter(group => group.id !== id));
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          COPABUDHABI Cell Groups
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedGroup(null);
            setNewGroup({
              name: '',
              leader: '',
              leaderName: '',
              location: '',
              meetingDay: '',
              meetingTime: '',
              members: [],
              status: 'active'
            });
            setOpenDialog(true);
          }}
        >
          New Cell Group
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Cell Groups List */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Cell Groups
              </Typography>

              {cellGroups.map((group) => (
                <Card key={group.id} variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6">
                        {group.name}
                      </Typography>
                      <Box>
                        <IconButton
                          onClick={() => {
                            setSelectedGroup(group);
                            setNewGroup(group);
                            setOpenDialog(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteGroup(group.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>

                    <Box display="flex" gap={2} my={2}>
                      <Chip
                        icon={<LocationIcon />}
                        label={group.location}
                        size="small"
                      />
                      <Chip
                        icon={<ScheduleIcon />}
                        label={`${group.meetingDay} ${group.meetingTime}`}
                        size="small"
                      />
                      <Chip
                        icon={<GroupIcon />}
                        label={`${group.members.length} members`}
                        size="small"
                      />
                    </Box>

                    <Typography variant="subtitle2" gutterBottom>
                      Leader: {group.leaderName} ({group.leader})
                    </Typography>

                    <Box mt={2}>
                      <Typography variant="subtitle2" gutterBottom>
                        Members:
                      </Typography>
                      <Box display="flex" gap={1} flexWrap="wrap">
                        {group.members.map((member) => (
                          <Chip
                            key={member.id}
                            avatar={<Avatar>{member.name[0]}</Avatar>}
                            label={member.name}
                            variant="outlined"
                            size="small"
                          />
                        ))}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Cell Group Statistics
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Total Groups
                      </Typography>
                      <Typography variant="h4">
                        {cellGroups.length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Total Members
                      </Typography>
                      <Typography variant="h4">
                        {cellGroups.reduce((acc, group) => acc + group.members.length, 0)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Box mt={3}>
                <Typography variant="subtitle2" gutterBottom>
                  Meeting Schedule
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Group</TableCell>
                        <TableCell>Day</TableCell>
                        <TableCell>Time</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cellGroups.map((group) => (
                        <TableRow key={group.id}>
                          <TableCell>{group.name}</TableCell>
                          <TableCell>{group.meetingDay}</TableCell>
                          <TableCell>{group.meetingTime}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            {selectedGroup ? 'Edit Cell Group' : 'New Cell Group'}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Group Name"
                value={newGroup.name}
                onChange={(e) => setNewGroup({ 
                  ...newGroup, 
                  name: e.target.value 
                })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Leader ID"
                value={newGroup.leader}
                onChange={(e) => setNewGroup({ 
                  ...newGroup, 
                  leader: e.target.value 
                })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Leader Name"
                value={newGroup.leaderName}
                onChange={(e) => setNewGroup({ 
                  ...newGroup, 
                  leaderName: e.target.value 
                })}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                value={newGroup.location}
                onChange={(e) => setNewGroup({ 
                  ...newGroup, 
                  location: e.target.value 
                })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Meeting Day"
                value={newGroup.meetingDay}
                onChange={(e) => setNewGroup({ 
                  ...newGroup, 
                  meetingDay: e.target.value 
                })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="time"
                label="Meeting Time"
                value={newGroup.meetingTime}
                onChange={(e) => setNewGroup({ 
                  ...newGroup, 
                  meetingTime: e.target.value 
                })}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveGroup}
                >
                  {selectedGroup ? 'Update Group' : 'Create Group'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
    </Box>
  );
};

export default CellGroupManager; 