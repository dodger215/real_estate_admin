import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, message, Space, Tag, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { editorService } from '../services/api';
import dayjs from 'dayjs';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [form] = Form.useForm();

    const fetchProjects = async () => {
        try {
            const res = await editorService.getProjects();
            setProjects(res.data);
        } catch (err) {
            message.error('Failed to fetch projects');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (isModalVisible) {
            if (editingProject) {
                form.setFieldsValue({
                    ...editingProject,
                    completionDate: editingProject.completionDate ? dayjs(editingProject.completionDate) : null
                });
            } else {
                form.resetFields();
            }
        }
    }, [isModalVisible, editingProject, form]);

    const showModal = (project = null) => {
        setEditingProject(project);
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (editingProject) {
                await editorService.updateProject(editingProject._id, values);
                message.success('Project updated successfully');
            } else {
                await editorService.createProject(values);
                message.success('Project created successfully');
            }
            setIsModalVisible(false);
            fetchProjects();
        } catch (err) {
            message.error('Operation failed');
        }
    };

    const handleDelete = async (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this project?',
            onOk: async () => {
                try {
                    await editorService.deleteProject(id);
                    message.success('Project deleted successfully');
                    fetchProjects();
                } catch (err) {
                    message.error('Delete failed');
                }
            }
        });
    };

    const [viewMode, setViewMode] = useState(window.innerWidth < 768 ? 'card' : 'table');

    const columns = [
        { title: 'Title', dataIndex: 'title', key: 'title', className: 'font-bold' },
        { title: 'Location', dataIndex: 'location', key: 'location' },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = status === 'Completed' ? 'green' : status === 'Ongoing' ? 'blue' : 'orange';
                return <Tag color={color} className="rounded-lg border-none px-3 font-bold uppercase text-[10px]">{status}</Tag>;
            }
        },
        {
            title: 'Completion',
            dataIndex: 'completionDate',
            key: 'completionDate',
            render: (date) => <span className="text-xs font-bold text-gray-400">{date ? dayjs(date).format('MMM YYYY') : 'N/A'}</span>
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 120,
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="text"
                        icon={<EditOutlined className="text-primary" />}
                        onClick={() => showModal(record)}
                        className="hover:bg-primary/10 rounded-lg h-10 w-10 flex items-center justify-center transition-colors"
                    />
                    <Button
                        type="text"
                        icon={<DeleteOutlined className="text-red-500" />}
                        danger
                        onClick={() => handleDelete(record._id)}
                        className="hover:bg-red-50 rounded-lg h-10 w-10 flex items-center justify-center transition-colors"
                    />
                </Space>
            )
        }
    ];

    const renderCard = (project) => (
        <div key={project._id} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all mb-4">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-black text-gray-900 mb-1 leading-tight">{project.title}</h3>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{project.location}</p>
                </div>
                <Tag
                    color={project.status === 'Completed' ? 'green' : project.status === 'Ongoing' ? 'blue' : 'orange'}
                    className="m-0 rounded-lg border-none px-3 font-bold uppercase text-[10px]"
                >
                    {project.status}
                </Tag>
            </div>

            <div className="flex items-end justify-between pt-4 border-t border-gray-50">
                <div>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-tighter mb-1">Completion</p>
                    <p className="text-sm font-bold text-gray-900 leading-none">{project.completionDate ? dayjs(project.completionDate).format('MMM YYYY') : 'N/A'}</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => showModal(project)}
                        className="rounded-xl h-12 w-12 border-gray-100 shadow-sm hover:border-primary hover:text-primary transition-all flex items-center justify-center"
                    />
                    <Button
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => handleDelete(project._id)}
                        className="rounded-xl h-12 w-12 border-gray-100 shadow-sm hover:border-red-500 hover:bg-red-50 transition-all flex items-center justify-center"
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 leading-none mb-2">Projects</h1>
                    <p className="text-gray-400 font-medium">Manage your development portfolio</p>
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
                        onClick={() => showModal()}
                        className="rounded-xl h-12 px-6 font-black uppercase tracking-widest flex-1 sm:flex-none shadow-lg shadow-primary/20"
                    >
                        Add Project
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
                        columns={columns}
                        dataSource={projects}
                        rowKey="_id"
                        pagination={{ pageSize: 10 }}
                        className="admin-table"
                    />
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                    {projects.map(renderCard)}
                </div>
            )}

            <Modal
                title={editingProject ? 'Edit Project' : 'Add Project'}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
                width={800}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="title" label="Project Title" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="location" label="Location">
                        <Input />
                    </Form.Item>
                    <Form.Item name="status" label="Status" initialValue="Ongoing">
                        <Select>
                            <Select.Option value="Ongoing">Ongoing</Select.Option>
                            <Select.Option value="Completed">Completed</Select.Option>
                            <Select.Option value="Upcoming">Upcoming</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="completionDate" label="Completion Date">
                        <DatePicker picker="month" className="w-full" />
                    </Form.Item>
                    <Form.Item name="image" label="Featured Image URL">
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Projects;
