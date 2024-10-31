import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';

const ErrorPage = ({ status = '404', title = 'Page Not Found', subTitle = 'Sorry, the page you visited does not exist.' }) => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f0f2f5'
    }}>
      <Result
        icon={<img src={logo} alt="COP Abu Dhabi" style={{ width: 80 }} />}
        status={status}
        title={title}
        subTitle={subTitle}
        extra={
          <Button 
            type="primary" 
            onClick={() => navigate('/')}
            style={{ backgroundColor: '#4B0082' }}
          >
            Back Home
          </Button>
        }
      />
    </div>
  );
};

export default ErrorPage; 