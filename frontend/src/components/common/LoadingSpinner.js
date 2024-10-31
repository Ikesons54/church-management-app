import React from 'react';
import { Spin } from 'antd';
import logo from '../../assets/images/logo.png';

const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: '#f0f2f5'
  }}>
    <img 
      src={logo} 
      alt="COP Abu Dhabi"
      className="logo-spin"
      style={{ 
        width: 80,
        marginBottom: 24
      }} 
    />
    <Spin size="large" />
  </div>
);

export default LoadingSpinner; 