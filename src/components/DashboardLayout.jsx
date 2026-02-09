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
    ProjectOutlined,
    RestOutlined,
    FilePdfOutlined,
    AuditOutlined
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
        { key: '/submissions', icon: <AuditOutlined />, label: 'Submissions', onClick: () => navigate('/submissions') },
        { key: '/pdf-templates', icon: <FilePdfOutlined />, label: 'PDF Templates', onClick: () => navigate('/pdf-templates') },
        { key: '/recycle-bin', icon: <RestOutlined />, label: 'Recycle Bin', onClick: () => navigate('/recycle-bin') },
        ...(user?.role === 'admin' ? [
            { key: '/users', icon: <UserOutlined />, label: 'Users', onClick: () => navigate('/users') }
        ] : []),
    ];

    return (
        <Layout className="h-screen overflow-hidden">
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={(broken) => {
                    setCollapsed(broken);
                }}
                className="h-screen fixed left-0 top-0 bottom-0 z-50 transition-all duration-300 md:relative"
                width={256}
            >
                <div className="p-6 text-white text-center">
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                            <HomeOutlined className="text-xl" />
                        </div>
                        {!collapsed && <span className="font-black text-xl tracking-tighter uppercase">Portal</span>}
                    </div>
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    className="border-none"
                    onClick={({ key }) => {
                        navigate(key);
                        if (window.innerWidth < 1024) setCollapsed(true);
                    }}
                />
            </Sider>
            <Layout className="h-screen flex flex-col">
                <Header
                    style={{ background: colorBgContainer }}
                    className="px-4 md:px-6 flex justify-between items-center h-16 md:h-20 sticky top-0 z-40 shadow-sm border-b border-gray-100 flex-shrink-0"
                >
                    <div className="flex items-center gap-4">
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            className="flex items-center justify-center text-lg w-10 h-10 rounded-xl hover:bg-gray-50"
                        />
                        <h2 className="hidden sm:block text-lg font-bold text-gray-800 m-0">
                            {menuItems.find(item => item.key === location.pathname)?.label || 'Dashboard'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:block text-right">
                            <p className="text-sm font-bold text-gray-900 leading-none mb-1">{user?.name}</p>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{user?.role}</p>
                        </div>
                        <Button
                            icon={<LogoutOutlined />}
                            onClick={logout}
                            type="primary"
                            className="rounded-xl font-bold h-10 flex items-center gap-2 px-4 shadow-none"
                        >
                            <span className="hidden sm:inline">Logout</span>
                        </Button>
                    </div>
                </Header>
                <Content
                    className="flex-1 overflow-auto bg-gray-50/50"
                >
                    <div className="m-4 md:m-6 p-4 md:p-8 bg-white min-h-[calc(100vh-140px)] rounded-[2rem] shadow-xl shadow-gray-200/50">
                        <Outlet />
                    </div>
                </Content>
            </Layout>

            {/* Mobile Backdrop */}
            {!collapsed && window.innerWidth < 1024 && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden"
                    onClick={() => setCollapsed(true)}
                />
            )}
        </Layout>
    );
};

export default DashboardLayout;
