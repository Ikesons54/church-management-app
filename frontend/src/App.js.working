import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import {
  Login,
  Register,
  Dashboard,
  Members,
  Events,
  Finance,
  Attendance,
  Blog,
  PrayerRequests,
  Settings
} from './pages';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<Layout />}>
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/members/*" element={<Members />} />
              <Route path="/events/*" element={<Events />} />
              <Route path="/finance/*" element={<Finance />} />
              <Route path="/attendance/*" element={<Attendance />} />
              <Route path="/blog/*" element={<Blog />} />
              <Route path="/prayer-requests/*" element={<PrayerRequests />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
