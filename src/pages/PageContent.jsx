import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, message, Tabs, Switch, InputNumber, Space, Divider } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { contentService } from '../services/api';

const PageContent = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await contentService.getContent();
                form.setFieldsValue(res.data);
            } catch (err) {
                message.error('Failed to fetch content');
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, [form]);

    const onFinish = async (values) => {
        try {
            await contentService.updateContent(values);
            message.success('Content updated successfully');
        } catch (err) {
            message.error('Failed to update content');
        }
    };

    const items = [
        {
            key: 'hero',
            label: 'Hero Section',
            children: (
                <>
                    <Form.Item name={['hero', 'headline']} label="Headline">
                        <Input />
                    </Form.Item>
                    <Form.Item name={['hero', 'subheadline']} label="Subheadline">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item name={['hero', 'backgroundImage']} label="Background Image URL">
                        <Input />
                    </Form.Item>
                    <Form.Item name={['hero', 'ctaText']} label="CTA Button Text">
                        <Input />
                    </Form.Item>
                    <Form.Item name={['hero', 'ctaAction']} label="CTA Action">
                        <Input placeholder="form / phone / whatsapp" />
                    </Form.Item>
                    <Form.Item name={['hero', 'showBadge']} label="Show Badge" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <Form.Item name={['hero', 'badgeText']} label="Badge Text">
                        <Input />
                    </Form.Item>
                </>
            ),
        },
        {
            key: 'about',
            label: 'About Page',
            children: (
                <>
                    <Form.Item name={['about', 'title']} label="Page Title">
                        <Input />
                    </Form.Item>
                    <Form.Item name={['about', 'image']} label="Featured Image URL">
                        <Input />
                    </Form.Item>
                    <Form.Item name={['about', 'mission']} label="Mission Statement">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item name={['about', 'vision']} label="Vision Statement">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item name={['about', 'content']} label="Main Content">
                        <Input.TextArea rows={6} />
                    </Form.Item>
                </>
            ),
        },
        {
            key: 'contactPage',
            label: 'Contact Page',
            children: (
                <>
                    <Form.Item name={['contactPage', 'title']} label="Page Title">
                        <Input />
                    </Form.Item>
                    <Form.Item name={['contactPage', 'description']} label="Description">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item name={['contactPage', 'officeLocation']} label="Office Address">
                        <Input />
                    </Form.Item>
                    <Form.Item name={['contactPage', 'mapEmbed']} label="Google Maps Embed URL">
                        <Input />
                    </Form.Item>
                </>
            ),
        },
        {
            key: 'testimonials',
            label: 'Testimonials',
            children: (
                <Form.List name="testimonials">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <div key={key} className="p-4 border rounded-xl mb-4 bg-gray-50">
                                    <Form.Item {...restField} name={[name, 'name']} label="Name" rules={[{ required: true }]}>
                                        <Input />
                                    </Form.Item>
                                    <Form.Item {...restField} name={[name, 'role']} label="Role">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item {...restField} name={[name, 'content']} label="Content">
                                        <Input.TextArea rows={3} />
                                    </Form.Item>
                                    <Form.Item {...restField} name={[name, 'avatar']} label="Avatar URL">
                                        <Input />
                                    </Form.Item>
                                    <Button type="link" danger onClick={() => remove(name)}>Remove Testimonial</Button>
                                </div>
                            ))}
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>Add Testimonial</Button>
                        </>
                    )}
                </Form.List>
            ),
        },
        {
            key: 'faq',
            label: 'FAQ',
            children: (
                <Form.List name="faq">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <div key={key} className="p-4 border rounded-xl mb-4 bg-gray-50">
                                    <Form.Item {...restField} name={[name, 'question']} label="Question" rules={[{ required: true }]}>
                                        <Input />
                                    </Form.Item>
                                    <Form.Item {...restField} name={[name, 'answer']} label="Answer" rules={[{ required: true }]}>
                                        <Input.TextArea rows={3} />
                                    </Form.Item>
                                    <Button type="link" danger onClick={() => remove(name)}>Remove FAQ</Button>
                                </div>
                            ))}
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>Add FAQ</Button>
                        </>
                    )}
                </Form.List>
            ),
        },
        {
            key: 'footer',
            label: 'Footer',
            children: (
                <>
                    <Form.Item name={['footer', 'text']} label="Footer Text">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item name={['footer', 'copyright']} label="Copyright Text">
                        <Input />
                    </Form.Item>
                </>
            ),
        }
    ];

    return (
        <Card title="Page Content Management" loading={loading}>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Tabs defaultActiveKey="hero" items={items} />
                <Form.Item className="mt-4">
                    <Button type="primary" htmlType="submit">Save Content</Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default PageContent;
