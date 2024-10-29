import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  Dialog,
  Box,
  TextField
} from '@mui/material';
import {
  Favorite,
  Comment,
  PrayingHands,
  Add as AddIcon
} from '@mui/icons-material';
import { fetchPrayerRequests, markAsPrayed } from '../../store/slices/prayerSlice';
import PrayerRequestForm from './PrayerRequestForm';
import PrayerComments from './PrayerComments';

const PrayerRequestList = () => {
  const [openForm, setOpenForm] = useState(false);
  const [openComments, setOpenComments] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filter, setFilter] = useState('all');

  const dispatch = useDispatch();
  const { requests, loading } = useSelector(state => state.prayers);
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    dispatch(fetchPrayerRequests());
  }, [dispatch]);

  const handlePray = async (requestId) => {
    await dispatch(markAsPrayed(requestId));
  };

  const filteredRequests = requests.filter(request => {
    if (filter === 'mine') return request.requester._id === user._id;
    if (filter === 'praying') return request.prayedBy.some(p => p.user._id === user._id);
    return true;
  });

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Box>
          <Chip
            label="All Requests"
            onClick={() => setFilter('all')}
            color={filter === 'all' ? 'primary' : 'default'}
            sx={{ mr: 1 }}
          />
          <Chip
            label="My Requests"
            onClick={() => setFilter('mine')}
            color={filter === 'mine' ? 'primary' : 'default'}
            sx={{ mr: 1 }}
          />
          <Chip
            label="Praying For"
            onClick={() => setFilter('praying')}
            color={filter === 'praying' ? 'primary' : 'default'}
          />
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
        >
          New Prayer Request
        </Button>
      </Box>

      <Grid container spacing={3}>
        {filteredRequests.map((request) => (
          <Grid item xs={12} md={6} key={request._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {request.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {request.description}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <IconButton
                      onClick={() => handlePray(request._id)}
                      color={request.prayedBy.some(p => p.user._id === user._id) ? 'primary' : 'default'}
                    >
                      <PrayingHands />
                    </IconButton>
                    <Typography variant="caption" sx={{ ml: 1 }}>
                      {request.prayedBy.length} praying
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton
                      onClick={() => {
                        setSelectedRequest(request);
                        setOpenComments(true);
                      }}
                    >
                      <Comment />
                    </IconButton>
                    <Typography variant="caption" sx={{ ml: 1 }}>
                      {request.comments.length} comments
                    </Typography>
                  </Box>
                </Box>
                <Box mt={2}>
                  <Typography variant="caption" color="textSecondary">
                    Requested by {request.requester.firstName} {request.requester.lastName}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="sm"
        fullWidth
      >
        <PrayerRequestForm onClose={() => setOpenForm(false)} />
      </Dialog>

      <Dialog
        open={openComments}
        onClose={() => setOpenComments(false)}
        maxWidth="sm"
        fullWidth
      >
        <PrayerComments
          request={selectedRequest}
          onClose={() => setOpenComments(false)}
        />
      </Dialog>
    </Box>
  );
};

export default PrayerRequestList; 