import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Button, message, Space, Select, Divider } from 'antd';
import { MinusCircleOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { templateService } from '../services/api';

import ImageUploader from '../components/ImageUploader';

const quillModules = {
    toolbar: [
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['clean']
    ],
};

const RichTextEditor = ({ value, onChange, placeholder, style }) => (
    <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={quillModules}
        placeholder={placeholder}
        style={style}
    />
);

const TemplateBuilder = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState('');

    useEffect(() => {
        if (id) {
            fetchTemplate();
        }
    }, [id]);

    const fetchTemplate = async () => {
        try {
            const res = await templateService.getTemplate(id);
            const { name, content, formSchema, description, imageUrl } = res.data;
            form.setFieldsValue({ name, formSchema, description, imageUrl });
            setContent(content);
        } catch (err) {
            message.error('Failed to load template');
        }
    };

    const onFinish = async (values) => {
        setLoading(true);
        const payload = {
            name: values.name,
            description: values.description,
            imageUrl: values.imageUrl,
            content: content,
            formSchema: values.formSchema || []
        };

        try {
            if (id) {
                await templateService.updateTemplate(id, payload);
                message.success('Template updated');
            } else {
                await templateService.createTemplate(payload);
                message.success('Template created');
            }
            navigate('/pdf-templates');
        } catch (err) {
            message.error('Failed to save template');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <Card title={id ? "Edit Template" : "Create Template"}>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item name="name" label="Template Name" rules={[{ required: true }]}>
                        <Input placeholder="e.g. Sales Agreement" />
                    </Form.Item>

                    <Form.Item name="description" label="Description / Context">
                        <RichTextEditor placeholder="Brief summary visible to the lead..." style={{ height: 100, marginBottom: 40 }} />
                    </Form.Item>

                    <Form.Item name="imageUrl" label="Header Image">
                        <ImageUploader />
                    </Form.Item>

                    <Divider titlePlacement="left">Section 1: Documentation</Divider>
                    <div className="mb-6">
                        <p className="mb-2 text-gray-500">Provide the full documentation, terms, and conditions.</p>
                        <ReactQuill theme="snow" value={content} onChange={setContent} style={{ height: 300, marginBottom: 50 }} />
                    </div>

                    <Divider titlePlacement="left">Section 2: Form Requirements</Divider>
                    <p className="mb-4 text-gray-500">Design the form fields that the lead needs to fill out.</p>

                    <Form.List name="formSchema">
                        {(fields, { add, remove }) => (
                            <div className="space-y-4">
                                {fields.map(({ key, name, ...restField }) => (
                                    <div key={key} className="p-4 border rounded bg-gray-50">
                                        <Space style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }} align="start">
                                            <Space wrap>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'label']}
                                                    rules={[{ required: true, message: 'Missing label' }]}
                                                    style={{ width: 300, marginBottom: 0 }}
                                                >
                                                    <Input placeholder="Field Label (e.g. Full Name)" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'type']}
                                                    rules={[{ required: true, message: 'Missing type' }]}
                                                    style={{ width: 150, marginBottom: 0 }}
                                                >
                                                    <Select placeholder="Type">
                                                        <Select.Option value="text">Text</Select.Option>
                                                        <Select.Option value="number">Number</Select.Option>
                                                        <Select.Option value="date">Date</Select.Option>
                                                        <Select.Option value="email">Email</Select.Option>
                                                        <Select.Option value="textarea">Long Text</Select.Option>
                                                        <Select.Option value="signature">Signature</Select.Option>
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'required']}
                                                    valuePropName="checked"
                                                    initialValue={true}
                                                    style={{ marginBottom: 0 }}
                                                >
                                                    <Select style={{ width: 100 }} placeholder="Required">
                                                        <Select.Option value={true}>Required</Select.Option>
                                                        <Select.Option value={false}>Optional</Select.Option>
                                                    </Select>
                                                </Form.Item>
                                            </Space>
                                            <MinusCircleOutlined onClick={() => remove(name)} className="text-red-500 text-lg cursor-pointer mt-2" />
                                        </Space>

                                        <div className="mt-4">
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'description']}
                                                label="Field Instructions / Description"
                                                style={{ marginBottom: 0 }}
                                            >
                                                <RichTextEditor placeholder="Add instructions, numbering, or bullets..." style={{ height: 80, marginBottom: 40 }} />
                                            </Form.Item>
                                        </div>
                                    </div>
                                ))}
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    Add Field
                                </Button>
                            </div>
                        )}
                    </Form.List>

                    <Form.Item className="mt-6">
                        <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                            Save Template
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default TemplateBuilder;
