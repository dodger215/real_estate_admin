import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, List, Tag, Button, Typography, Space } from 'antd';
import {
    HomeOutlined,
    TeamOutlined,
    FileTextOutlined,
    RocketOutlined,
    PlusOutlined,
    ArrowRightOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';
import { editorService, leadService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Dashboard = () => {
    const [stats, setStats] = useState({
        properties: 0,
        leads: 0,
        agents: 0,
        projects: 0
    });
    const [recentLeads, setRecentLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

const UserRole = localStorage.getItem('userRole');
    

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [propsRes, leadsRes, agentsRes, projectsRes] = await Promise.all([
                editorService.getProperties(),
                leadService.getLeads(),
                editorService.getAgents(),
                editorService.getProjects()
            ]);

            setStats({
                properties: propsRes.data.length,
                leads: leadsRes.data.length,
                agents: agentsRes.data.length,
                projects: projectsRes.data.length
            });

            // Get last 5 leads
            const sortedLeads = leadsRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
            setRecentLeads(sortedLeads);
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const statCards = [
        { title: 'Properties', value: stats.properties, icon: <HomeOutlined />, color: '#1677ff', path: '/properties' },
        { title: 'Inquiries', value: stats.leads, icon: <FileTextOutlined />, color: '#722ed1', path: '/leads' },
        { title: 'Agents', value: stats.agents, icon: <TeamOutlined />, color: '#52c41a', path: '/agents' },
        { title: 'Projects', value: stats.projects, icon: <RocketOutlined />, color: '#fa8c16', path: '/projects' },
    ];

    const quickActions = [
        { title: 'New Listing', icon: <PlusOutlined />, path: '/properties', description: 'Add a new property to the market' },
        { title: 'Write Blog', icon: <FileTextOutlined />, path: '/blog', description: 'Create a new update or news post' },
        { title: 'Manage Leads', icon: <TeamOutlined />, path: '/leads', description: 'Check and respond to inquiries' },
        { title: 'Site Settings', icon: <RocketOutlined />, path: '/settings', description: 'Configure global site parameters' },
    ];

    return (
        <div className="max-w-[1400px] mx-auto animate-fadeIn">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-primary to-primary-dark rounded-[2.5rem] p-8 md:p-12 mb-8 text-white relative overflow-hidden shadow-2xl shadow-primary/20">
                <div className="relative z-10">
                    <Text className="text-black/80 font-black uppercase tracking-[0.2em] text-xs mb-4 block">Dashboard Overview</Text>
                    <Title level={1} className="!text-black !m-0 !text-4xl md:!text-5xl !font-black !leading-tight tracking-tight">
                        Welcome back, <br className="md:hidden" /> {UserRole == "admin" ? 'Administrator' : 'Editor'}!
                    </Title>
                    <div className="flex items-center gap-4 mt-8">
                        <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 flex items-center gap-2">
                            <ClockCircleOutlined className="text-black/80" />
                            <Text className="text-black font-bold">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</Text>
                        </div>
                        <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-2xl border border-white/20 hidden sm:flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <Text className="text-black/90 text-sm font-bold uppercase tracking-widest leading-none">System Online</Text>
                        </div>
                    </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-[-20%] left-[-10%] w-96 h-96 bg-primary-dark/20 rounded-full blur-3xl" />
            </div>

            {/* Stats Grid */}
            <Row gutter={[24, 24]} className="mb-10">
                {statCards.map((stat, idx) => (
                    <Col xs={12} lg={6} key={idx}>
                        <Card
                            hoverable
                            onClick={() => navigate(stat.path)}
                            className="rounded-[2rem] border-none shadow-xl shadow-gray-100/50 group transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                            styles={{ body: { padding: '24px' } }}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <Text className="text-gray-400 font-black uppercase tracking-widest text-[10px] block mb-1">{stat.title}</Text>
                                    <Title level={2} className="!m-0 !font-black !text-gray-900">{stat.value}</Title>
                                </div>
                                <div
                                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg shadow-gray-200"
                                    style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
                                >
                                    {stat.icon}
                                </div>
                            </div>
                            <div className="mt-6 flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500">
                                View Details <ArrowRightOutlined />
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row gutter={[24, 24]}>
                {/* Recent Leads */}
                <Col xs={24} lg={16}>
                    <Card
                        title={<span className="text-xl font-black text-gray-900 tracking-tight">Recent Inquiries</span>}
                        className="rounded-[2rem] border-none shadow-xl shadow-gray-100/50 h-full"
                        styles={{ body: { padding: '0 24px 24px' } }}
                        extra={
                            <Button
                                type="text"
                                onClick={() => navigate('/leads')}
                                className="text-primary font-bold uppercase tracking-widest text-xs"
                            >
                                View All
                            </Button>
                        }
                    >
                        <div className="space-y-1">
                            {loading ? (
                                <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
                            ) : recentLeads.length === 0 ? (
                                <div className="p-10 text-center text-gray-400">No recent inquiries</div>
                            ) : (
                                recentLeads.map((lead) => (
                                    <div
                                        key={lead._id}
                                        className="flex items-center justify-between px-4 py-5 hover:bg-gray-50/50 rounded-2xl transition-colors cursor-pointer group border-b border-gray-50 last:border-0"
                                        onClick={() => navigate('/leads')}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary font-black text-lg">
                                                {lead.name.charAt(0)}
                                            </div>
                                            <div>
                                                <Text className="font-black text-gray-900 block leading-none mb-1">{lead.name}</Text>
                                                <div className="flex items-center gap-3">
                                                    <Text className="text-gray-400 text-xs font-medium">{lead.email}</Text>
                                                    <Tag className="rounded-lg border-none px-2 py-0.5 font-bold uppercase text-[9px] m-0 bg-primary/10 text-primary">
                                                        {lead.source}
                                                    </Tag>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <Text className="text-gray-300 text-[10px] font-bold uppercase tracking-tighter">
                                                {new Date(lead.createdAt).toLocaleDateString()}
                                            </Text>
                                            <Tag
                                                color={lead.status === 'new' ? 'blue' : lead.status === 'contacted' ? 'green' : 'default'}
                                                className="m-0 rounded-lg border-none px-2 py-0.5 font-black uppercase text-[9px] shadow-sm"
                                            >
                                                {lead.status}
                                            </Tag>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </Col>

                {/* Quick Actions */}
                <Col xs={24} lg={8}>
                    <Card
                        title={<span className="text-xl font-black text-gray-900 tracking-tight">Quick Actions</span>}
                        className="rounded-[2rem] border-none shadow-xl shadow-gray-100/50 bg-gray-50/50 h-full"
                        styles={{ body: { padding: '24px' } }}
                    >
                        <Space orientation="vertical" size={16} className="w-full">
                            {quickActions.map((action, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => navigate(action.path)}
                                    className="w-full bg-white p-4 rounded-3xl border border-gray-100 flex items-center gap-4 transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/5 group"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary text-xl transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                                        {action.icon}
                                    </div>
                                    <div className="text-left flex-1">
                                        <Text className="block font-black text-gray-900 leading-tight mb-0.5">{action.title}</Text>
                                        <Text className="block text-gray-400 text-[11px] font-medium leading-tight">{action.description}</Text>
                                    </div>
                                    <ArrowRightOutlined className="text-gray-300 group-hover:text-primary transition-colors" />
                                </button>
                            ))}
                        </Space>

                        <div className="mt-10 p-6 bg-primary rounded-[2rem] text-white relative overflow-hidden group cursor-pointer" onClick={() => navigate('/settings')}>
                            <div className="relative z-10">
                                <Text className="text-white/80 font-black uppercase tracking-widest text-[10px] block mb-2">Power User Tip</Text>
                                <Text className="text-white font-bold text-sm block leading-relaxed mb-4">
                                    Customise your site's <br /> primary identity and colors in settings.
                                </Text>
                                <Button ghost size="small" className="rounded-xl border-white/30 text-xs font-black uppercase tracking-widest px-4 h-9">
                                    Upgrade Identity
                                </Button>
                            </div>
                            <CheckCircleOutlined className="absolute right-[-10px] bottom-[-10px] text-8xl text-white/10 rotate-12 transition-transform duration-700 group-hover:rotate-45" />
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
