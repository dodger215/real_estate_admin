import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, message, Space, Table, Modal, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { editorService } from '../services/api';
import ImageUploader from '../components/ImageUploader';

const Agents = () => {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [agentModalVisible, setAgentModalVisible] = useState(false);
    const [editingAgent, setEditingAgent] = useState(null);
    const [agentForm] = Form.useForm();

    const fetchAgents = async () => {
        setLoading(true);
        try {
            const res = await editorService.getAgents();
            setAgents(res.data);
        } catch (err) {
            message.error('Failed to fetch agents');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgents();
    }, []);

    useEffect(() => {
        if (agentModalVisible) {
            if (editingAgent) {
                agentForm.setFieldsValue(editingAgent);
            } else {
                agentForm.resetFields();
            }
        }
    }, [agentModalVisible, editingAgent, agentForm]);

    const handleAgentSave = async (values) => {
        try {
            if (editingAgent) {
                await editorService.updateAgent(editingAgent._id, values);
                message.success('Agent updated');
            } else {
                await editorService.createAgent(values);
                message.success('Agent created');
            }
            setAgentModalVisible(false);
            fetchAgents();
        } catch (err) {
            message.error('Failed to save agent');
        }
    };

    const handleAgentDelete = async (id) => {
        try {
            await editorService.deleteAgent(id);
            message.success('Agent deleted');
            fetchAgents();
        } catch (err) {
            message.error('Failed to delete agent');
        }
    };

    const [viewMode, setViewMode] = useState(window.innerWidth < 768 ? 'card' : 'table');

    const agentColumns = [
        { title: 'Name', dataIndex: 'name', key: 'name', className: 'font-bold' },
        { title: 'Role', dataIndex: 'role', key: 'role', render: (role) => <Tag className="rounded-lg border-none px-3 font-bold uppercase text-[10px]">{role}</Tag> },
        {
            title: 'Photo',
            dataIndex: 'photo',
            key: 'photo',
            render: (photo) => photo ? <img src={photo} alt="agent" className="w-10 h-10 rounded-xl object-cover" /> : <div className="w-10 h-10 rounded-xl bg-gray-100" />
        },
        {
            title: 'Contact', key: 'contact', render: (_, record) => (
                <div className="flex flex-col">
                    <span className="text-sm font-medium">{record.email}</span>
                    <span className="text-xs text-gray-400">{record.phone}</span>
                </div>
            )
        },
        {
            title: 'Action',
            key: 'action',
            width: 120,
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="text"
                        icon={<EditOutlined className="text-primary" />}
                        onClick={() => {
                            setEditingAgent(record);
                            setAgentModalVisible(true);
                        }}
                        className="hover:bg-primary/10 rounded-lg h-10 w-10 flex items-center justify-center transition-colors"
                    />
                    <Button
                        type="text"
                        icon={<DeleteOutlined className="text-red-500" />}
                        danger
                        onClick={() => handleAgentDelete(record._id)}
                        className="hover:bg-red-50 rounded-lg h-10 w-10 flex items-center justify-center transition-colors"
                    />
                </Space>
            )
        }
    ];

    const renderCard = (agent) => (
        <div key={agent._id} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all mb-4">
            <div className="flex items-center gap-4 mb-4">
                {agent.photo ? (
                    <img src={agent.photo} alt={agent.name} className="w-16 h-16 rounded-2xl object-cover" />
                ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gray-100" />
                )}
                <div className="flex-1">
                    <h3 className="text-lg font-black text-gray-900 mb-0 leading-tight">{agent.name}</h3>
                    <Tag className="m-0 mt-1 rounded-lg border-none px-2 font-bold uppercase text-[9px]">{agent.role}</Tag>
                </div>
            </div>

            <div className="flex flex-col gap-2 mb-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <span className="font-bold">Email:</span> {agent.email}
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-bold">Phone:</span> {agent.phone}
                </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-50">
                <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => {
                        setEditingAgent(agent);
                        agentForm.setFieldsValue(agent);
                        setAgentModalVisible(true);
                    }}
                    className="rounded-xl h-12 flex-1 font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                >
                    Edit
                </Button>
                <Button
                    icon={<DeleteOutlined />}
                    danger
                    onClick={() => handleAgentDelete(agent._id)}
                    className="rounded-xl h-12 w-12 border-gray-100 shadow-sm hover:border-red-500 hover:bg-red-50 transition-all flex items-center justify-center"
                />
            </div>
        </div>
    );

    return (
        <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 leading-none mb-2">Agents</h1>
                    <p className="text-gray-400 font-medium">Manage your team of professionals</p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="hidden md:flex bg-gray-100 p-1 rounded-xl">
                        <Button
                            type={viewMode === 'table' ? 'primary' : 'text'}
                            onClick={() => setViewMode('table')}
                            className={`rounded-lg h-10 px-4 font-bold ${viewMode === 'table' ? 'shadow-md' : 'text-gray-500'}`}
                        >
                            Table
                        </Button>
                        <Button
                            type={viewMode === 'card' ? 'primary' : 'text'}
                            onClick={() => setViewMode('card')}
                            className={`rounded-lg h-10 px-4 font-bold ${viewMode === 'card' ? 'shadow-md' : 'text-gray-500'}`}
                        >
                            Cards
                        </Button>
                    </div>
                    <Button
                        type="primary"
                        size="large"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setEditingAgent(null);
                            setAgentModalVisible(true);
                        }}
                        className="rounded-xl h-12 px-6 font-black uppercase tracking-widest flex-1 sm:flex-none shadow-lg shadow-primary/20"
                    >
                        Add Agent
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : viewMode === 'table' && window.innerWidth >= 768 ? (
                <Card className="rounded-[2rem] shadow-xl shadow-gray-200/50 border-none overflow-hidden" styles={{ body: { padding: 0 } }}>
                    <Table
                        dataSource={agents}
                        columns={agentColumns}
                        rowKey="_id"
                        pagination={{ pageSize: 10 }}
                        className="admin-table"
                    />
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                    {agents.map(renderCard)}
                </div>
            )}

            <Modal
                title={editingAgent ? "Edit Agent" : "Add Agent"}
                open={agentModalVisible}
                onCancel={() => setAgentModalVisible(false)}
                onOk={() => agentForm.submit()}
            >
                <Form form={agentForm} layout="vertical" onFinish={handleAgentSave}>
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="role" label="Role">
                        <Input placeholder="e.g. Senior Broker" />
                    </Form.Item>
                    <Form.Item name="photo" label="Photo">
                        <ImageUploader mode="single" />
                    </Form.Item>
                    <Form.Item name="bio" label="Bio">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Space className='w-full' orientation="vertical">
                        <Form.Item name="phone" label="Phone">
                            <Input />
                        </Form.Item>
                        <Form.Item name="email" label="Email">
                            <Input />
                        </Form.Item>
                    </Space>
                    <Space className='w-full' orientation="vertical">
                        <Form.Item name={['social', 'facebook']} label="Facebook URL">
                            <Input placeholder="https://facebook.com/..." />
                        </Form.Item>
                        <Form.Item name={['social', 'linkedin']} label="LinkedIn URL">
                            <Input placeholder="https://linkedin.com/in/..." />
                        </Form.Item>
                        <Form.Item name={['social', 'twitter']} label="Twitter URL">
                            <Input placeholder="https://twitter.com/..." />
                        </Form.Item>
                        <Form.Item name={['social', 'instagram']} label="Instagram URL">
                            <Input placeholder="https://instagram.com/..." />
                        </Form.Item>
                    </Space>
                </Form>
            </Modal>
        </div>
    );
};

export default Agents;
