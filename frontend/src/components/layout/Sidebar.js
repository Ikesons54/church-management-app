import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  TeamOutlined,
  CalendarOutlined,
  DollarOutlined,
  CheckSquareOutlined,
  FileTextOutlined,
  HeartOutlined,
  SettingOutlined
} from '@ant-design/icons';
import logo from '../../assets/images/logo.png';

const { Sider } = Layout;

const Sidebar = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'members',
      icon: <TeamOutlined />,
      label: 'Members',
    },
    {
      key: 'events',
      icon: <CalendarOutlined />,
      label: 'Events',
    },
    {
      key: 'finance',
      icon: <DollarOutlined />,
      label: 'Finance',
    },
    {
      key: 'attendance',
      icon: <CheckSquareOutlined />,
      label: 'Attendance',
    },
    {
      key: 'blog',
      icon: <FileTextOutlined />,
      label: 'Blog',
    },
    {
      key: 'prayer-requests',
      icon: <HeartOutlined />,
      label: 'Prayer Requests',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div style={{ 
        padding: '16px',
        textAlign: 'center',
        background: '#fff',
        margin: '16px'
      }}>
        <img 
          src={logo} 
          alt="COP Abu Dhabi"
          className="logo-spin"
          style={{ 
            width: collapsed ? '32px' : '80px',
            transition: 'width 0.2s'
          }} 
        />
        {!collapsed && (
          <div style={{ 
            color: '#fff',
            marginTop: 8,
            fontSize: 12,
            whiteSpace: 'nowrap'
          }}>
            COP Abu Dhabi
          </div>
        )}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname.split('/')[1] || 'dashboard']}
        items={menuItems}
        onClick={({ key }) => navigate(`/${key}`)}
      />
    </Sider>
  );
};

export default Sidebar; 