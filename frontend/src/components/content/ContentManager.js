import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  IconButton,
  Dialog
} from '@mui/material';
import {
  Add as AddIcon,
  PlayArrow,
  Pause
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchContent,
  deleteContent
} from '../../store/slices/contentSlice';
import ContentForm from './ContentForm';
import AudioPlayer from './AudioPlayer';
import Grid from '@mui/material/Unstable_Grid2';

const ContentManager = () => {
  const [tab, setTab] = useState('blog');
  const [openForm, setOpenForm] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [playing, setPlaying] = useState(null);

  const dispatch = useDispatch();
  const { content, loading } = useSelector(state => state.content);
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    dispatch(fetchContent(tab));
  }, [dispatch, tab]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      await dispatch(deleteContent(id));
    }
  };

  const filteredContent = content.filter(item => item.type === tab);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
          <Tab label="Blog Posts" value="blog" />
          <Tab label="Podcasts" value="podcast" />
        </Tabs>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedContent(null);
            setOpenForm(true);
          }}
        >
          Add {tab === 'blog' ? 'Post' : 'Podcast'}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {filteredContent.map((item) => (
          <Grid item xs={12} md={tab === 'blog' ? 6 : 4} key={item._id}>
            <Card>
              {item.type === 'blog' ? (
                <CardMedia
                  component="img"
                  height="200"
                  image={item.mediaUrl || '/default-blog.jpg'}
                  alt={item.title}
                />
              ) : (
                <Box position="relative">
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.thumbnailUrl || '/default-podcast.jpg'}
                    alt={item.title}
                  />
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      backgroundColor: 'rgba(0, 0, 0, 0.6)'
                    }}
                    onClick={() => setPlaying(playing === item._id ? null : item._id)}
                  >
                    {playing === item._id ? <Pause /> : <PlayArrow />}
                  </IconButton>
                </Box>
              )}
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {item.description}
                </Typography>
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
        <ContentForm onClose={() => setOpenForm(false)} />
      </Dialog>

      <Dialog
        open={playing !== null}
        onClose={() => setPlaying(null)}
        maxWidth="sm"
        fullWidth
      >
        <AudioPlayer
          url={content.find(item => item._id === playing)?.mediaUrl}
          onClose={() => setPlaying(null)}
        />
      </Dialog>
    </Box>
  );
};

export default ContentManager; 