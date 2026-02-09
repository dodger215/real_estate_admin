// Properties.jsx - Updated with uploader
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, InputNumber, Switch, message, Space, Tag, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { editorService } from '../services/api';
import ImageUploader from '../components/ImageUploader'; // Import the uploader

const Properties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingProperty, setEditingProperty] = useState(null);
    const [form] = Form.useForm();

    const [chechBedrooms, setCheckBedrooms] = useState(false);

    const [agents, setAgents] = useState([]);

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const [propsRes, agentsRes] = await Promise.all([
                editorService.getProperties(),
                editorService.getAgents()
            ]);
            setProperties(propsRes.data);
            setAgents(agentsRes.data);
        } catch (err) {
            message.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    useEffect(() => {
        if (isModalVisible) {
            if (editingProperty) {
                form.setFieldsValue(editingProperty);
            } else {
                form.resetFields();
            }
        }
    }, [isModalVisible, editingProperty, form]);

    const handleAdd = () => {
        setEditingProperty(null);
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingProperty(record);
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await editorService.deleteProperty(id);
            message.success('Property deleted');
            fetchProperties();
        } catch (err) {
            message.error('Delete failed');
        }
    };

    const onFinish = async (values) => {
        try {
            if (editingProperty) {
                await editorService.updateProperty(editingProperty._id, values);
                message.success('Property updated');
            } else {
                await editorService.createProperty(values);
                message.success('Property created');
            }
            setIsModalVisible(false);
            fetchProperties();
        } catch (err) {
            message.error('Operation failed');
        }
    };

    const [viewMode, setViewMode] = useState(window.innerWidth < 768 ? 'card' : 'table');

    const columns = [
        { title: 'Title', dataIndex: 'title', key: 'title', className: 'font-bold' },
        { title: 'Type', dataIndex: 'type', key: 'type', render: (type) => <Tag color="blue" className="rounded-lg border-none px-3 font-bold uppercase text-[10px]">{type}</Tag> },
        { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color="green" className="rounded-lg border-none px-3 font-bold uppercase text-[10px]">{status}</Tag> },
        { title: 'Price', dataIndex: 'price', key: 'price', render: (price) => <span className="font-black text-gray-900">₵‎{price?.toLocaleString()}</span> },
        { title: 'Location', dataIndex: 'location', key: 'location' },
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

    const renderCard = (property) => (
        <div key={property._id} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all mb-4">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-black text-gray-900 mb-1 leading-tight">{property.title}</h3>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{property.location}</p>
                </div>
                <div className="flex gap-2">
                    <Tag color="blue" className="m-0 rounded-lg border-none px-2 font-bold uppercase text-[9px]">{property.type}</Tag>
                    <Tag color="green" className="m-0 rounded-lg border-none px-2 font-bold uppercase text-[9px]">{property.status}</Tag>
                </div>
            </div>

            <div className="flex items-end justify-between">
                <div>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-tighter mb-1">Price</p>
                    <p className="text-xl font-black text-primary leading-none">₵‎{property.price?.toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(property)}
                        className="rounded-xl h-12 w-12 border-gray-100 shadow-sm hover:border-primary hover:text-primary transition-all flex items-center justify-center"
                    />
                    <Button
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => handleDelete(property._id)}
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
                    <h1 className="text-3xl font-black text-gray-900 leading-none mb-2">Properties</h1>
                    <p className="text-gray-400 font-medium">Manage your real estate listings</p>
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
                        New Listing
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : viewMode === 'table' && window.innerWidth >= 768 ? (
                <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
                    <Table
                        columns={columns}
                        dataSource={properties}
                        rowKey="_id"
                        pagination={{
                            pageSize: 10,
                            className: "px-6 py-4",
                            showSizeChanger: false
                        }}
                        className="admin-table"
                    />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fadeIn">
                    {properties.map(renderCard)}
                </div>
            )}

            <Modal
                title={editingProperty ? 'Edit Property' : 'Add Property'}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => form.submit()}
                width={800}
            >
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="slug" label="Slug (URL)" rules={[{ required: true }]}>
                                <Input placeholder="e.g. luxury-villa-beverly-hills" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                                <Select>
                                    <Select.Option value="Apartment">Apartment</Select.Option>
                                    <Select.Option value="Villa">Villa</Select.Option>
                                    <Select.Option value="Land">Land</Select.Option>
                                    <Select.Option value="Commercial">Commercial</Select.Option>
                                    <Select.Option value="Office">Office</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="status" label="Status" initialValue="Ready">
                                <Select>
                                    <Select.Option value="Ready">Ready</Select.Option>
                                    <Select.Option value="Off-plan">Off-plan</Select.Option>
                                    <Select.Option value="Sold">Sold</Select.Option>
                                    <Select.Option value="Rent">Rent</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>



                    <Form.Item name="featuredImage" label="Featured Image">
                        <ImageUploader mode="single" />
                    </Form.Item>

                    <Form.Item name="images" label="Image Gallery">
                        <ImageUploader mode="multiple" maxFiles={10} />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="agent" label="Assign Agent">
                                <Select placeholder="Select an agent" allowClear>
                                    {agents.map(agent => (
                                        <Select.Option key={agent._id} value={agent._id}>
                                            {agent.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="bedrooms" label="Bedrooms">
                                <InputNumber className="w-full" min={0} placeholder='Optional' />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="bathrooms" label="Bathrooms">
                                <InputNumber className="w-full" min={0} placeholder='Optional' />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="isFeatured" label="Featured" valuePropName="checked">
                        <Switch />
                    </Form.Item>

                    <Form.Item name="description" label="Description">
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Properties;