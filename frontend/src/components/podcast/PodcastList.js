import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box
} from '@mui/material';
import { PlayArrow, Pause, Download } from '@mui/icons-material';
import AudioPlayer from './AudioPlayer';
import api from '../../services/api';
import Grid2 from '@mui/material/Unstable_Grid2';

const PodcastList = () => {
  const [playing, setPlaying] = useState(null);
  const [podcasts, setPodcasts] = useState([]);

  useEffect(() => {
    // Fetch podcasts
    const fetchPodcasts = async () => {
      try {
        const response = await api.get('/podcasts');
        setPodcasts(response.data);
      } catch (error) {
        console.error('Error fetching podcasts:', error);
      }
    };
    fetchPodcasts();
  }, []);

  return (
    <Grid2 container spacing={3}>
      {podcasts.map((podcast) => (
        <Grid2 item xs={12} md={6} lg={4} key={podcast._id}>
          <Card>
            <CardMedia
              component="img"
              height="140"
              image={podcast.thumbnailUrl || '/default-podcast.jpg'}
              alt={podcast.title}
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {podcast.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Speaker: {podcast.speaker}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Duration: {Math.floor(podcast.duration / 60)}:{podcast.duration % 60}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <IconButton
                  onClick={() => setPlaying(playing === podcast._id ? null : podcast._id)}
                >
                  {playing === podcast._id ? <Pause /> : <PlayArrow />}
                </IconButton>
                <IconButton onClick={() => window.open(podcast.audioUrl)}>
                  <Download />
                </IconButton>
              </Box>
              {playing === podcast._id && (
                <AudioPlayer
                  url={podcast.audioUrl}
                  onEnd={() => setPlaying(null)}
                />
              )}
            </CardContent>
          </Card>
        </Grid2>
      ))}
    </Grid2>
  );
};

export default PodcastList; 