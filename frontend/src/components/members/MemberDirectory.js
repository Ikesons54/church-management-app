import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  Avatar,
  Chip,
  Dialog,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import NationalitySelect from '../common/NationalitySelect';

const MemberDirectory = () => {
  const [members, setMembers] = useState([
    {
      id: "COPAD0001",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "+971501234567",
      nationality: "Ghanaian",
      address: "Abu Dhabi",
      ministry: ["PEMEM"],
      status: "active",
      baptismStatus: "baptized",
      joinDate: "2023-01-01",
      photo: null
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [newMember, setNewMember] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationality: '',
    address: '',
    ministry: [],
    status: 'active',
    baptismStatus: 'not baptized',
    joinDate: new Date().toISOString().split('T')[0]
  });

  const ministryOptions = [
    'PEMEM',
    "Women's Movement",
    'PEMFIT',
    "Children's Ministry"
  ];

  const handleSaveMember = () => {
    if (selectedMember) {
      setMembers(members.map(member => 
        member.id === selectedMember.id ? { ...newMember, id: member.id } : member
      ));
    } else {
      const newId = `COPAD${(members.length + 1).toString().padStart(4, '0')}`;
      setMembers([...members, { ...newMember, id: newId }]);
    }
    setOpenDialog(false);
  };

  const filteredMembers = members.filter(member => 
    member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderMemberDetails = () => {
    if (!selectedMember) return null;

    return (
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            {selectedMember ? 'Edit Member' : 'New Member'}
          </Typography>

          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ mb: 3 }}
          >
            <Tab label="Personal Info" />
            <Tab label="Church Info" />
            <Tab label="Contact Info" />
          </Tabs>

          {activeTab === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={newMember.firstName}
                  onChange={(e) => setNewMember({
                    ...newMember,
                    firstName: e.target.value
                  })}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={newMember.lastName}
                  onChange={(e) => setNewMember({
                    ...newMember,
                    lastName: e.target.value
                  })}
                />
              </Grid>

              <Grid item xs={12}>
                <NationalitySelect
                  value={newMember.nationality}
                  onChange={(e) => setNewMember({
                    ...newMember,
                    nationality: e.target.value
                  })}
                />
              </Grid>
            </Grid>
          )}

          {activeTab === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Member ID"
                  value={selectedMember?.id || 'Will be generated'}
                  disabled
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Ministry"
                  SelectProps={{
                    multiple: true,
                    renderValue: (selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )
                  }}
                  value={newMember.ministry}
                  onChange={(e) => setNewMember({
                    ...newMember,
                    ministry: e.target.value
                  })}
                >
                  {ministryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="date"
                  label="Join Date"
                  value={newMember.joinDate}
                  onChange={(e) => setNewMember({
                    ...newMember,
                    joinDate: e.target.value
                  })}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
          )}

          {activeTab === 2 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({
                    ...newMember,
                    email: e.target.value
                  })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={newMember.phone}
                  onChange={(e) => setNewMember({
                    ...newMember,
                    phone: e.target.value
                  })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={3}
                  value={newMember.address}
                  onChange={(e) => setNewMember({
                    ...newMember,
                    address: e.target.value
                  })}
                />
              </Grid>
            </Grid>
          )}

          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveMember}
            >
              {selectedMember ? 'Update Member' : 'Add Member'}
            </Button>
          </Box>
        </Box>
      </Dialog>
    );
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          COPABUDHABI Member Directory
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedMember(null);
            setNewMember({
              firstName: '',
              lastName: '',
              email: '',
              phone: '',
              nationality: '',
              address: '',
              ministry: [],
              status: 'active',
              baptismStatus: 'not baptized',
              joinDate: new Date().toISOString().split('T')[0]
            });
            setOpenDialog(true);
          }}
        >
          Add Member
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" gap={2} mb={3}>
                <TextField
                  fullWidth
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                >
                  Export
                </Button>
              </Box>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Member ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell>Ministry</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>{member.id}</TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Avatar src={member.photo}>
                              {member.firstName[0]}
                            </Avatar>
                            {`${member.firstName} ${member.lastName}`}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" flexDirection="column" gap={1}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <PhoneIcon fontSize="small" />
                              {member.phone}
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                              <EmailIcon fontSize="small" />
                              {member.email}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {member.ministry.map((min) => (
                            <Chip
                              key={min}
                              label={min}
                              size="small"
                              sx={{ mr: 1 }}
                            />
                          ))}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={member.status}
                            color={member.status === 'active' ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MemberDirectory; 