import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Checkbox,
  Button,
  Dialog,
  TextField,
  FormControlLabel,
  Alert,
  Chip
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import QRCode from 'qrcode.react';
import { generateSecureHash } from '../../utils/security';
import { processFamilyCheckIn } from '../../utils/checkIn';
import { generateNameTags, notifyMinistryLeaders } from '../../utils/notifications';

const EnhancedFamilyCheckIn = () => {
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [checkInData, setCheckInData] = useState({
    members: [],
    notes: '',
    specialNeeds: [],
    childrenMinistry: false
  });

  const specialNeedsOptions = [
    { id: 'allergies', label: 'Allergies' },
    { id: 'medical', label: 'Medical Needs' },
    { id: 'behavioral', label: 'Behavioral Support' },
    { id: 'mobility', label: 'Mobility Assistance' }
  ];

  const toggleSpecialNeed = (needId) => {
    setCheckInData(prev => ({
      ...prev,
      specialNeeds: prev.specialNeeds.includes(needId)
        ? prev.specialNeeds.filter(id => id !== needId)
        : [...prev.specialNeeds, needId]
    }));
  };

  const handleMemberSelection = (memberId, checked) => {
    setCheckInData(prev => ({
      ...prev,
      members: checked 
        ? [...prev.members, memberId]
        : prev.members.filter(id => id !== memberId)
    }));
  };

  // Generate family QR code
  const generateFamilyQR = (familyId) => {
    const qrData = {
      type: 'family',
      familyId,
      timestamp: new Date().getTime(),
      members: checkInData.members,
      hash: generateSecureHash(familyId)
    };
    return JSON.stringify(qrData);
  };

  // Process family check-in
  const handleFamilyCheckIn = async () => {
    try {
      const checkInResult = await processFamilyCheckIn({
        familyId: selectedFamily.id,
        members: checkInData.members,
        timestamp: new Date().toISOString(),
        notes: checkInData.notes,
        specialNeeds: checkInData.specialNeeds,
        childrenMinistry: checkInData.childrenMinistry
      });

      if (checkInResult.success) {
        // Generate name tags, notifications, etc.
        generateNameTags(checkInResult.members);
        notifyMinistryLeaders(checkInResult);
      }
    } catch (error) {
      console.error('Family check-in failed:', error);
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Family Selection */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Family Members</Typography>
              <List>
                {selectedFamily?.members.map(member => (
                  <ListItem key={member.id}>
                    <ListItemAvatar>
                      <Avatar src={member.photo} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={member.name}
                      secondary={`${member.age} years - ${member.relationship}`}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checkInData.members.includes(member.id)}
                          onChange={(e) => handleMemberSelection(member.id, e.checked)}
                        />
                      }
                      label="Check In"
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Check-in Options */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Check-in Options</Typography>
              
              {/* Special Needs */}
              <Box mb={2}>
                <Typography variant="subtitle2">Special Needs</Typography>
                {specialNeedsOptions.map(need => (
                  <Chip
                    key={need.id}
                    label={need.label}
                    onClick={() => toggleSpecialNeed(need.id)}
                    color={checkInData.specialNeeds.includes(need.id) ? 'primary' : 'default'}
                    style={{ marginRight: 8 }}
                  />
                ))}
              </Box>

              {/* Children's Ministry Options */}
              {/* Add children's ministry content here */}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EnhancedFamilyCheckIn;