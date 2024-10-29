import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  TextField,
  Box,
  Dialog
} from '@mui/material';
import {
  Edit,
  Delete,
  Visibility,
  Add as AddIcon
} from '@mui/icons-material';
import { fetchMembers, deleteMember } from '../../store/slices/memberSlice';
import MemberForm from './MemberForm';
import MemberDetails from './MemberDetails';

const MemberList = () => {
  const dispatch = useDispatch();
  const { members } = useSelector(state => state.members);
  const [searchTerm, setSearchTerm] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);

  useEffect(() => {
    dispatch(fetchMembers());
  }, [dispatch]);

  const handleEdit = (member) => {
    setSelectedMember(member);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      await dispatch(deleteMember(id));
    }
  };

  const filteredMembers = members.filter(member =>
    `${member.firstName} ${member.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <TextField
          label="Search Members"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedMember(null);
            setOpenForm(true);
          }}
        >
          Add Member
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMembers.map((member) => (
              <TableRow key={member._id}>
                <TableCell>
                  {member.firstName} {member.lastName}
                </TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.phone}</TableCell>
                <TableCell>{member.status}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(member)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(member._id)}>
                    <Delete />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setSelectedMember(member);
                      setOpenDetails(true);
                    }}
                  >
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="md"
        fullWidth
      >
        <MemberForm
          member={selectedMember}
          onClose={() => setOpenForm(false)}
        />
      </Dialog>

      <Dialog
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        maxWidth="md"
        fullWidth
      >
        <MemberDetails
          member={selectedMember}
          onClose={() => setOpenDetails(false)}
        />
      </Dialog>
    </Box>
  );
};

export default MemberList; 