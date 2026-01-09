// Blog.jsx - Updated with uploader
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space, Tag, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { editorService } from '../services/api';
import ImageUploader from '../components/ImageUploader'; // Import the uploader

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [form] = Form.useForm();

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await editorService.getBlogs();
            setPosts(res.data);
        } catch (err) {
            message.error('Failed to fetch posts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleAdd = () => {
        setEditingPost(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingPost(record);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await editorService.deleteBlog(id);
            message.success('Post deleted');
            fetchPosts();
        } catch (err) {
            message.error('Delete failed');
        }
    };

    const onFinish = async (values) => {
        try {
            if (editingPost) {
                await editorService.updateBlog(editingPost._id, values);
                message.success('Post updated');
            } else {
                await editorService.createBlog(values);
                message.success('Post created');
            }
            setIsModalVisible(false);
            fetchPosts();
        } catch (err) {
            message.error('Operation failed');
        }
    };

    const columns = [
        { title: 'Title', dataIndex: 'title', key: 'title' },
        { title: 'Category', dataIndex: 'category', key: 'category', render: (cat) => <Tag color="blue">{cat}</Tag> },
        {
            title: 'Published',
            dataIndex: 'isPublished',
            key: 'isPublished',
            render: (pub) => pub ? <Tag color="green">Yes</Tag> : <Tag>No</Tag>
        },
        { title: 'Date', dataIndex: 'publishedAt', key: 'publishedAt', render: (date) => new Date(date).toLocaleDateString() },
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
                <h1 className="text-2xl font-bold">Blog Posts</h1>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Add Post
                </Button>
            </div>

            <Table columns={columns} dataSource={posts} loading={loading} rowKey="_id" />

            <Modal
                title={editingPost ? 'Edit Post' : 'Add Post'}
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
                            <Form.Item name="slug" label="Slug" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="category" label="Category">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="author" label="Author">
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    
                    <Form.Item name="featuredImage" label="Featured Image">
                        <ImageUploader mode="single"/>
                    </Form.Item>
                    
                    <Form.Item name="excerpt" label="Excerpt">
                        <Input.TextArea rows={2} />
                    </Form.Item>
                    
                    <Form.Item name="content" label="Content">
                        <Input.TextArea rows={10} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Blog;