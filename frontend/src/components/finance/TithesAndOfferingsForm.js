import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';

const TithesAndOfferingsForm = () => {
  const [formData, setFormData] = useState({
    memberId: '',
    memberName: '',
    amount: '',
    type: '',
    paymentMethod: '',
    reference: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [members, setMembers] = useState([]); // This would be populated from your API

  const handleMemberSelect = (event, newValue) => {
    setFormData({
      ...formData,
      memberId: newValue?.memberId || '',
      memberName: newValue?.name || ''
    });
  };

  const handleSubmit = () => {
    // TODO: Add your submission logic here
    console.log('Form submitted:', formData);
  };

  return (
    <Box>
      <Grid2 container spacing={2}>
        <Grid2 xs={12}>
          <Autocomplete
            options={members}
            getOptionLabel={(option) => `${option.memberId} - ${option.name}`}
            onChange={handleMemberSelect}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Member"
                required
                fullWidth
              />
            )}
          />
        </Grid2>

        <Grid2 xs={12} md={6}>
          <TextField
            fullWidth
            label="Amount (AED)"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({
              ...formData,
              amount: e.target.value
            })}
            required
          />
        </Grid2>

        <Grid2 xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel>Type</InputLabel>
            <Select
              value={formData.type}
              onChange={(e) => setFormData({
                ...formData,
                type: e.target.value
              })}
            >
              <MenuItem value="tithe">Tithe</MenuItem>
              <MenuItem value="offering">Offering</MenuItem>
              <MenuItem value="special">Special Offering</MenuItem>
              <MenuItem value="thanksgiving">Thanksgiving</MenuItem>
              <MenuItem value="missions">Missions</MenuItem>
            </Select>
          </FormControl>
        </Grid2>

        <Grid2 xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({
                ...formData,
                paymentMethod: e.target.value
              })}
            >
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
              <MenuItem value="card">Card Payment</MenuItem>
              <MenuItem value="cheque">Cheque</MenuItem>
            </Select>
          </FormControl>
        </Grid2>

        <Grid2 xs={12} md={6}>
          <TextField
            fullWidth
            label="Reference Number"
            value={formData.reference}
            onChange={(e) => setFormData({
              ...formData,
              reference: e.target.value
            })}
            helperText="Bank transfer reference or receipt number"
          />
        </Grid2>

        <Grid2 xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
          >
            Record Transaction
          </Button>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default TithesAndOfferingsForm; 