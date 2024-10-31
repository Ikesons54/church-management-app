import React, { useState } from 'react';
import { Layout as AntLayout } from 'antd';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const { Content } = AntLayout;

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
      <AntLayout>
        <Sidebar collapsed={collapsed} />
        <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280 }}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout; 