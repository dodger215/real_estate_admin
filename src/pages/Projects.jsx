import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, message, Space, Tag } from 'antd';
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

    const showModal = (project = null) => {
        setEditingProject(project);
        if (project) {
            form.setFieldsValue({
                ...project,
                completionDate: project.completionDate ? dayjs(project.completionDate) : null
            });
        } else {
            form.resetFields();
        }
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

    const columns = [
        { title: 'Title', dataIndex: 'title', key: 'title' },
        { title: 'Location', dataIndex: 'location', key: 'location' },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = status === 'Completed' ? 'green' : status === 'Ongoing' ? 'blue' : 'orange';
                return <Tag color={color}>{status}</Tag>;
            }
        },
        {
            title: 'Completion Date',
            dataIndex: 'completionDate',
            key: 'completionDate',
            render: (date) => date ? dayjs(date).format('MMM YYYY') : 'N/A'
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => showModal(record)} />
                    <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record._id)} />
                </Space>
            )
        }
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Projects</h1>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                    Add Project
                </Button>
            </div>

            <Table columns={columns} dataSource={projects} rowKey="_id" loading={loading} />

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
