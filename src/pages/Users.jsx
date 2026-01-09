import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Modal, Form, Input, Select, message, Space } from 'antd';
import { PlusOutlined, UserAddOutlined } from '@ant-design/icons';
import { userService } from '../services/api';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const fetchUsers = async () => {
        try {
            const res = await userService.getUsers();
            setUsers(res.data);
        } catch (err) {
            message.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAddUser = async (values) => {
        try {
            await userService.createUser(values);
            message.success('User created successfully');
            setIsModalVisible(false);
            form.resetFields();
            fetchUsers();
        } catch (err) {
            message.error(err.response?.data?.message || 'Failed to create user');
        }
    };

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Role', dataIndex: 'role', key: 'role', render: (role) => <span className="capitalize">{role}</span> },
        {
            title: 'Permissions',
            dataIndex: 'permissions',
            key: 'permissions',
            render: (p) => (
                <Space>
                    {p.content && <span className="text-xs bg-blue-100 px-2 py-1 rounded">Content</span>}
                    {p.media && <span className="text-xs bg-green-100 px-2 py-1 rounded">Media</span>}
                    {p.leads && <span className="text-xs bg-orange-100 px-2 py-1 rounded">Leads</span>}
                    {p.users && <span className="text-xs bg-purple-100 px-2 py-1 rounded">Users</span>}
                </Space>
            ),
        },
    ];

    return (
        <Card
            title="User Management"
            extra={
                <Button type="primary" icon={<UserAddOutlined />} onClick={() => setIsModalVisible(true)}>
                    Add User
                </Button>
            }
        >
            <Table dataSource={users} columns={columns} rowKey="_id" loading={loading} />

            <Modal
                title="Add New User"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} layout="vertical" onFinish={handleAddUser}>
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item name="role" label="Role" initialValue="editor">
                        <Select>
                            <Select.Option value="admin">Admin</Select.Option>
                            <Select.Option value="editor">Editor</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name={['permissions', 'content']} valuePropName="checked" initialValue={true}>
                        <Select mode="multiple" placeholder="Select Permissions">
                            <Select.Option value="content">Content Management</Select.Option>
                            <Select.Option value="media">Media Management</Select.Option>
                            <Select.Option value="leads">Lead Management</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default Users;
