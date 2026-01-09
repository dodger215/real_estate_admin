import React, { useState } from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import {
    DashboardOutlined,
    SettingOutlined,
    FileTextOutlined,
    TeamOutlined,
    LogoutOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    MenuOutlined,
    HomeOutlined,
    ReadOutlined,
    AppstoreOutlined,
    MailOutlined,
    ProjectOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Header, Sider, Content } = Layout;

const DashboardLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

    const menuItems = [
        { key: '/', icon: <DashboardOutlined />, label: 'Dashboard', onClick: () => navigate('/') },
        { key: '/settings', icon: <SettingOutlined />, label: 'Site Settings', onClick: () => navigate('/settings') },
        { key: '/content', icon: <FileTextOutlined />, label: 'Page Content', onClick: () => navigate('/content') },
        { key: '/layout', icon: <MenuOutlined />, label: 'Layout Manager', onClick: () => navigate('/layout') },
        { key: '/properties', icon: <HomeOutlined />, label: 'Properties', onClick: () => navigate('/properties') },
        { key: '/blog', icon: <ReadOutlined />, label: 'Blog', onClick: () => navigate('/blog') },
        { key: '/agents', icon: <TeamOutlined />, label: 'Agents', onClick: () => navigate('/agents') },
        { key: '/services', icon: <AppstoreOutlined />, label: 'Services', onClick: () => navigate('/services') },
        { key: '/projects', icon: <ProjectOutlined />, label: 'Projects', onClick: () => navigate('/projects') },
        { key: '/leads', icon: <MailOutlined />, label: 'Leads', onClick: () => navigate('/leads') },
        ...(user?.role === 'admin' ? [
            { key: '/users', icon: <UserOutlined />, label: 'Users', onClick: () => navigate('/users') }
        ] : []),
    ];

    return (
        <Layout style={{ height: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="p-4 text-white text-center font-bold text-xl">
                    {collapsed ? 'E' : 'Estate'}
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={({ key }) => navigate(key)}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '24px' }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: '16px', width: 64, height: 64 }}
                    />
                    <div className="flex items-center gap-4">
                        <span>Welcome, {user?.name}</span>
                        <Button icon={<LogoutOutlined />} onClick={logout}>Logout</Button>
                    </div>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        overflow: 'auto'
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default DashboardLayout;
