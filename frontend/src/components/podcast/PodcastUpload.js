import React, { useState } from 'react';
import api from '../../services/api';
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  CircularProgress
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

const PodcastUpload = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    speaker: '',
    category: '',
    tags: '',
    audio: null,
    thumbnail: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    try {
      await api.post('/podcasts', data);
      // Handle success
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Upload New Podcast
      </Typography>
      
      <TextField
        fullWidth
        label="Title"
        margin="normal"
        name="title"
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />

      <TextField
        fullWidth
        label="Description"
        margin="normal"
        name="description"
        multiline
        rows={4}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        required
      />

      <TextField
        fullWidth
        label="Speaker"
        margin="normal"
        name="speaker"
        onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
        required
      />

      <FormControl fullWidth margin="normal">
        <InputLabel>Category</InputLabel>
        <Select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        >
          <MenuItem value="Sermon">Sermon</MenuItem>
          <MenuItem value="Bible Study">Bible Study</MenuItem>
          <MenuItem value="Youth">Youth</MenuItem>
          <MenuItem value="Worship">Worship</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </FormControl>

      <Button variant="contained" component="label" startIcon={<CloudUpload />} sx={{ mt: 2 }}>
        Upload Audio<input
          type="file"
          hidden
          accept="audio/*"
          onChange={(e) => setFormData({ ...formData, audio: e.target.files[0] })}
        />
      </Button>

      <Button variant="contained" component="label" startIcon={<CloudUpload />} sx={{ mt: 2, ml: 2 }}>
        Upload Thumbnail<input
          type="file"
          hidden
          accept="image/*"
          onChange={(e) => setFormData({ ...formData, thumbnail: e.target.files[0] })}
        />
      </Button>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 3 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Upload Podcast'}
      </Button>
    </Box>
  );
};

export default PodcastUpload; 