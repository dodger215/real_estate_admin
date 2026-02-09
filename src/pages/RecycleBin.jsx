import React, { useEffect, useState } from 'react';
import { Table, Button, Tabs, message, Tag, Space, Modal, Card } from 'antd';
import { UndoOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { recycleBinService } from '../services/api';

const { confirm } = Modal;

const RecycleBin = () => {
    const [deletedProperties, setDeletedProperties] = useState([]);
    const [deletedAgents, setDeletedAgents] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [propsRes, agentsRes] = await Promise.all([
                recycleBinService.getDeletedProperties(),
                recycleBinService.getDeletedAgents()
            ]);
            setDeletedProperties(propsRes.data);
            setDeletedAgents(agentsRes.data);
        } catch (err) {
            message.error('Failed to fetch recycle bin data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRestore = async (type, id) => {
        try {
            if (type === 'property') {
                await recycleBinService.restoreProperty(id);
            } else if (type === 'agent') {
                await recycleBinService.restoreAgent(id);
            }
            message.success('Item restored successfully');
            fetchData();
        } catch (err) {
            message.error('Failed to restore item');
        }
    };

    const handleDeleteForever = (type, id) => {
        confirm({
            title: 'Are you sure delete this item forever?',
            icon: <ExclamationCircleOutlined />,
            content: 'This action cannot be undone.',
            okText: 'Yes, Delete Forever',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    if (type === 'property') {
                        await recycleBinService.permanentDeleteProperty(id);
                    } else if (type === 'agent') {
                        await recycleBinService.permanentDeleteAgent(id);
                    }
                    message.success('Item permanently deleted');
                    fetchData();
                } catch (err) {
                    message.error('Failed to delete item');
                }
            },
        });
    };

    const propertyColumns = [
        { title: 'Title', dataIndex: 'title', key: 'title' },
        { title: 'Type', dataIndex: 'type', key: 'type', render: (type) => <Tag>{type}</Tag> },
        { title: 'Price', dataIndex: 'price', key: 'price', render: (price) => price?.toLocaleString() },
        { title: 'Deleted At', dataIndex: 'deletedAt', key: 'deletedAt', render: (date) => new Date(date).toLocaleString() },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<UndoOutlined />}
                        onClick={() => handleRestore('property', record._id)}
                    >
                        Restore
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteForever('property', record._id)}
                    >
                        Delete Forever
                    </Button>
                </Space>
            ),
        },
    ];

    const agentColumns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Role', dataIndex: 'role', key: 'role' },
        { title: 'Deleted At', dataIndex: 'deletedAt', key: 'deletedAt', render: (date) => new Date(date).toLocaleString() },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<UndoOutlined />}
                        onClick={() => handleRestore('agent', record._id)}
                    >
                        Restore
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteForever('agent', record._id)}
                    >
                        Delete Forever
                    </Button>
                </Space>
            ),
        },
    ];

    const items = [
        {
            key: 'properties',
            label: `Properties (${deletedProperties.length})`,
            children: <Table dataSource={deletedProperties} columns={propertyColumns} rowKey="_id" loading={loading} />
        },
        {
            key: 'agents',
            label: `Agents (${deletedAgents.length})`,
            children: <Table dataSource={deletedAgents} columns={agentColumns} rowKey="_id" loading={loading} />
        }
    ];

    return (
        <div className="p-6">
            <Card title="Recycle Bin">
                <Tabs defaultActiveKey="properties" items={items} />
            </Card>
        </div>
    );
};

export default RecycleBin;
