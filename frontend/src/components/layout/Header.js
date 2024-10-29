import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { CHURCH_CONFIG } from '../../config/branding';
import Logo from '../../assets/images/copa-logo-light.png';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        backgroundColor: CHURCH_CONFIG.colors.primary,
        zIndex: theme.zIndex.drawer + 1 
      }}
    >
      <Toolbar>
        <Box display="flex" alignItems="center">
          <img 
            src={Logo} 
            alt={CHURCH_CONFIG.name.full} 
            style={{ height: 40, marginRight: 16 }}
          />
          {!isMobile && (
            <Typography variant="h6" noWrap component="div">
              {CHURCH_CONFIG.name.full}
            </Typography>
          )}
          {isMobile && (
            <Typography variant="h6" noWrap component="div">
              {CHURCH_CONFIG.name.short}
            </Typography>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 