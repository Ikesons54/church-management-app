import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { createTransaction } from '../../store/slices/financeSlice';

const DonationForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    type: 'Tithe',
    amount: '',
    paymentMethod: 'Cash',
    donor: '',
    description: ''
  });

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(createTransaction(formData));
    onClose();
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <DialogTitle>Record Donation</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel>Type</InputLabel>
          <Select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <MenuItem value="Tithe">Tithe</MenuItem>
            <MenuItem value="Offering">Offering</MenuItem>
            <MenuItem value="Donation">Donation</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Amount"
          type="number"
          margin="normal"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          required
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Payment Method</InputLabel>
          <Select
            value={formData.paymentMethod}
            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
          >
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="Check">Check</MenuItem>
            <MenuItem value="Card">Card</MenuItem>
            <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Donor Name"
          margin="normal"
          value={formData.donor}
          onChange={(e) => setFormData({ ...formData, donor: e.target.value })}
        />

        <TextField
          fullWidth
          label="Description"
          margin="normal"
          multiline
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </DialogActions>
    </Box>
  );
};

export default DonationForm; 