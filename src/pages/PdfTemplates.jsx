import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Space, message, Modal } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { templateService } from '../services/api';

const { confirm } = Modal;

const PdfTemplates = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchTemplates = async () => {
        setLoading(true);
        try {
            const res = await templateService.getTemplates();
            setTemplates(res.data);
        } catch (err) {
            message.error('Failed to fetch templates');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const handleDelete = (id) => {
        confirm({
            title: 'Are you sure delete this template?',
            icon: <ExclamationCircleOutlined />,
            content: 'This action cannot be undone.',
            okType: 'danger',
            onOk: async () => {
                try {
                    await templateService.deleteTemplate(id);
                    message.success('Template deleted');
                    fetchTemplates();
                } catch (err) {
                    message.error('Failed to delete template');
                }
            },
        });
    };

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt', render: (date) => new Date(date).toLocaleDateString() },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => navigate(`/templates/edit/${record._id}`)} />
                    <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)} />
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <Card
                title="PDF Templates"
                extra={
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/templates/new')}>
                        Create Template
                    </Button>
                }
            >
                <Table
                    dataSource={templates}
                    columns={columns}
                    rowKey="_id"
                    loading={loading}
                />
            </Card>
        </div>
    );
};

export default PdfTemplates;
