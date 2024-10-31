import React from 'react';
import PropTypes from 'prop-types';
import { Space, Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const CustomToolbar = ({ onNavigate, label, view, onView }) => {
  return (
    <div className="rbc-toolbar">
      <Space>
        <Button.Group>
          <Button onClick={() => onNavigate('PREV')}>
            <LeftOutlined />
          </Button>
          <Button onClick={() => onNavigate('TODAY')}>Today</Button>
          <Button onClick={() => onNavigate('NEXT')}>
            <RightOutlined />
          </Button>
        </Button.Group>
      </Space>
      
      <span className="rbc-toolbar-label">{label}</span>
      
      <Space>
        <Button.Group>
          <Button 
            type={view === 'month' ? 'primary' : 'default'}
            onClick={() => onView('month')}
          >
            Month
          </Button>
          <Button 
            type={view === 'week' ? 'primary' : 'default'}
            onClick={() => onView('week')}
          >
            Week
          </Button>
          <Button 
            type={view === 'day' ? 'primary' : 'default'}
            onClick={() => onView('day')}
          >
            Day
          </Button>
        </Button.Group>
      </Space>
    </div>
  );
};

CustomToolbar.propTypes = {
  onNavigate: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  view: PropTypes.string.isRequired,
  onView: PropTypes.func.isRequired
};

export default CustomToolbar; 