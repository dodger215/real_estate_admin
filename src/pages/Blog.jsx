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

    useEffect(() => {
        if (isModalVisible) {
            if (editingPost) {
                form.setFieldsValue(editingPost);
            } else {
                form.resetFields();
            }
        }
    }, [isModalVisible, editingPost, form]);

    const handleAdd = () => {
        setEditingPost(null);
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingPost(record);
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

    const [viewMode, setViewMode] = useState(window.innerWidth < 768 ? 'card' : 'table');

    const columns = [
        { title: 'Title', dataIndex: 'title', key: 'title', className: 'font-bold' },
        { title: 'Category', dataIndex: 'category', key: 'category', render: (cat) => <Tag color="blue" className="rounded-lg border-none px-3 font-bold uppercase text-[10px]">{cat}</Tag> },
        {
            title: 'Published',
            dataIndex: 'isPublished',
            key: 'isPublished',
            render: (pub) => pub ? <Tag color="green" className="rounded-lg border-none px-3 font-bold uppercase text-[10px]">Yes</Tag> : <Tag className="rounded-lg border-none px-3 font-bold uppercase text-[10px]">No</Tag>
        },
        { title: 'Date', dataIndex: 'publishedAt', key: 'publishedAt', render: (date) => <span className="text-xs font-bold text-gray-400">{new Date(date).toLocaleDateString()}</span> },
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

    const renderCard = (post) => (
        <div key={post._id} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all mb-4">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-black text-gray-900 mb-1 leading-tight">{post.title}</h3>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{new Date(post.publishedAt).toLocaleDateString()}</p>
                </div>
                <Tag color="blue" className="m-0 rounded-lg border-none px-3 font-bold uppercase text-[10px]">{post.category}</Tag>
            </div>

            <div className="flex items-end justify-between pt-4 border-t border-gray-50">
                <div>
                    <Tag color={post.isPublished ? "green" : "default"} className="rounded-lg border-none px-3 font-bold uppercase text-[10px]">
                        {post.isPublished ? "Published" : "Draft"}
                    </Tag>
                </div>
                <div className="flex gap-2">
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(post)}
                        className="rounded-xl h-12 w-12 border-gray-100 shadow-sm hover:border-primary hover:text-primary transition-all flex items-center justify-center"
                    />
                    <Button
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => handleDelete(post._id)}
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
                    <h1 className="text-3xl font-black text-gray-900 leading-none mb-2">Blog Posts</h1>
                    <p className="text-gray-400 font-medium">Manage your articles and news</p>
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
                        Add Post
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
                        dataSource={posts}
                        rowKey="_id"
                        pagination={{ pageSize: 10 }}
                        className="admin-table"
                    />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fadeIn">
                    {posts.map(renderCard)}
                </div>
            )}

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
                        <ImageUploader mode="single" />
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