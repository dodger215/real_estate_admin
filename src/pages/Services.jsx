import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Tag, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { editorService } from '../services/api';

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [form] = Form.useForm();

    const fetchServices = async () => {
        setLoading(true);
        try {
            const res = await editorService.getServices();
            setServices(res.data);
        } catch (err) {
            message.error('Failed to fetch services');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    useEffect(() => {
        if (isModalVisible) {
            if (editingService) {
                form.setFieldsValue(editingService);
            } else {
                form.resetFields();
            }
        }
    }, [isModalVisible, editingService, form]);

    const handleAdd = () => {
        setEditingService(null);
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingService(record);
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await editorService.deleteService(id);
            message.success('Service deleted');
            fetchServices();
        } catch (err) {
            message.error('Delete failed');
        }
    };

    const onFinish = async (values) => {
        try {
            if (editingService) {
                await editorService.updateService(editingService._id, values);
                message.success('Service updated');
            } else {
                await editorService.createService(values);
                message.success('Service created');
            }
            setIsModalVisible(false);
            fetchServices();
        } catch (err) {
            message.error('Operation failed');
        }
    };

    const [viewMode, setViewMode] = useState(window.innerWidth < 768 ? 'card' : 'table');

    const columns = [
        { title: 'Title', dataIndex: 'title', key: 'title', className: 'font-bold' },
        { title: 'Icon', dataIndex: 'icon', key: 'icon' },
        {
            title: 'Action',
            key: 'action',
            width: 120,
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="text"
                        icon={<EditOutlined className="text-primary" />}
                        onClick={() => handleEdit(record)}
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
            ),
        },
    ];

    const renderCard = (service) => (
        <div key={service._id} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all mb-4">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
                            <i className={`text-xl ${service.icon || 'ri-service-line'}`}></i>
                        </div>
                        <h3 className="text-lg font-black text-gray-900 mb-0 leading-tight">{service.title}</h3>
                    </div>
                </div>
            </div>
            <p className="text-gray-500 text-sm line-clamp-2 md:line-clamp-3 mb-6 leading-relaxed">
                {service.description}
            </p>
            <div className="flex gap-2 pt-4 border-t border-gray-50">
                <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(service)}
                    className="rounded-xl h-12 flex-1 font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                >
                    Edit
                </Button>
                <Button
                    icon={<DeleteOutlined />}
                    danger
                    onClick={() => handleDelete(service._id)}
                    className="rounded-xl h-12 w-12 border-gray-100 shadow-sm hover:border-red-500 hover:bg-red-50 transition-all flex items-center justify-center"
                />
            </div>
        </div>
    );

    return (
        <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 leading-none mb-2">Services</h1>
                    <p className="text-gray-400 font-medium">Manage the services you offer</p>
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
                        onClick={handleAdd}
                        className="rounded-xl h-12 px-6 font-black uppercase tracking-widest flex-1 sm:flex-none shadow-lg shadow-primary/20"
                    >
                        New Service
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
                        dataSource={services}
                        rowKey="_id"
                        pagination={{ pageSize: 10 }}
                        className="admin-table"
                    />
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                    {services.map(renderCard)}
                </div>
            )}

            <Modal
                title={editingService ? 'Edit Service' : 'Add Service'}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="icon" label="Icon Class (RemixIcon)">
                        <Input placeholder="e.g. ri-home-line" />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Services;
