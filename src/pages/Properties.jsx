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

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const res = await editorService.getProperties();
            setProperties(res.data);
        } catch (err) {
            message.error('Failed to fetch properties');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    const handleAdd = () => {
        setEditingProperty(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingProperty(record);
        form.setFieldsValue(record);
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

    const columns = [
        { title: 'Title', dataIndex: 'title', key: 'title' },
        { title: 'Type', dataIndex: 'type', key: 'type', render: (type) => <Tag color="blue">{type}</Tag> },
        { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color="green">{status}</Tag> },
        { title: 'Price', dataIndex: 'price', key: 'price', render: (price) => `${price?.toLocaleString()}` },
        { title: 'Location', dataIndex: 'location', key: 'location' },
        {
            title: 'Featured',
            dataIndex: 'isFeatured',
            key: 'isFeatured',
            render: (featured) => featured ? <Tag color="gold">Yes</Tag> : <Tag>No</Tag>
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record._id)} />
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Property Listings</h1>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Add Property
                </Button>
            </div>

            <Table columns={columns} dataSource={properties} loading={loading} rowKey="_id" />

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
                    
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="price" label="Price">
                                <InputNumber 
                                    className="w-full" 
                                    formatter={value => `₵ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="location" label="Location" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    
                    <Form.Item name="featuredImage" label="Featured Image">
                        <ImageUploader mode="single"/>
                    </Form.Item>
                    
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="bedrooms" label="Bedrooms">
                                <InputNumber className="w-full" min={0} placeholder='Optional'/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="bathrooms" label="Bathrooms">
                                <InputNumber className="w-full" min={0} placeholder='Optional'/>
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