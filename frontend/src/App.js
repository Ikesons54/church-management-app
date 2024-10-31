import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { theme } from './theme';
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

function App() {
  return (
    <ConfigProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Layout />}>
            <Route path="dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="members" element={
              <ProtectedRoute>
                <Members />
              </ProtectedRoute>
            } />
            <Route path="events" element={
              <ProtectedRoute>
                <Events />
              </ProtectedRoute>
            } />
            <Route path="finance" element={
              <ProtectedRoute>
                <Finance />
              </ProtectedRoute>
            } />
            <Route path="attendance" element={
              <ProtectedRoute>
                <Attendance />
              </ProtectedRoute>
            } />
            <Route path="blog" element={
              <ProtectedRoute>
                <Blog />
              </ProtectedRoute>
            } />
            <Route path="prayer-requests" element={
              <ProtectedRoute>
                <PrayerRequests />
              </ProtectedRoute>
            } />
            <Route path="settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
