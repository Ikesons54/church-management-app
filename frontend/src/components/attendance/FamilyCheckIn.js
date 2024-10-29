import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert
} from '@mui/material';

const FamilyCheckIn = ({ familyData, onCheckIn }) => {
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [notes, setNotes] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const handleCheckIn = async () => {
    try {
      const checkInData = {
        familyId: familyData.id,
        members: selectedMembers,
        timestamp: new Date().toISOString(),
        notes: notes,
        checkedInBy: 'USHER_ID'
      };

      await onCheckIn(checkInData);
      setOpenDialog(false);
    } catch (error) {
      console.error('Family check-in failed:', error);
    }
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Family Check-in
          </Typography>

          <List>
            {familyData.members.map((member) => (
              <ListItem key={member.id}>
                <ListItemText
                  primary={member.name}
                  secondary={`${member.relationship} - ${member.age} years`}
                />
                <ListItemSecondaryAction>
                  <Checkbox
                    edge="end"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedMembers([...selectedMembers, member.id]);
                      } else {
                        setSelectedMembers(selectedMembers.filter(id => id !== member.id));
                      }
                    }}
                    checked={selectedMembers.includes(member.id)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>

          <Button
            variant="contained"
            fullWidth
            onClick={() => setOpenDialog(true)}
            disabled={selectedMembers.length === 0}
          >
            Check In Family Members
          </Button>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Family Check-in</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Checking in {selectedMembers.length} family members
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCheckIn} variant="contained">
            Confirm Check-in
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FamilyCheckIn; 