import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, message, Tabs, ColorPicker } from 'antd';
import { settingsService } from '../services/api';

const SiteSettings = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await settingsService.getSettings();
                form.setFieldsValue(res.data);
            } catch (err) {
                message.error('Failed to fetch settings');
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, [form]);

    const onFinish = async (values) => {
        try {
            await settingsService.updateSettings(values);
            message.success('Settings updated successfully');
        } catch (err) {
            message.error('Failed to update settings');
        }
    };

    const items = [
        {
            key: '1',
            label: 'General',
            children: (
                <>
                    <Form.Item name="siteName" label="Site Name">
                        <Input />
                    </Form.Item>
                    <Form.Item name="logo" label="Logo URL">
                        <Input />
                    </Form.Item>
                    <Form.Item name="favicon" label="Favicon URL">
                        <Input />
                    </Form.Item>
                    <Form.Item name="primaryColor" label="Primary Color">
                        <Input placeholder="#1890ff" />
                    </Form.Item>
                </>
            ),
        },
        {
            key: '2',
            label: 'Contact',
            children: (
                <>
                    <Form.Item name="contactPhone" label="Contact Phone">
                        <Input />
                    </Form.Item>
                    <Form.Item name="whatsappNumber" label="WhatsApp Number">
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email Address">
                        <Input />
                    </Form.Item>
                    <Form.Item name="officeAddress" label="Office Address">
                        <Input.TextArea />
                    </Form.Item>
                </>
            ),
        },
        {
            key: '3',
            label: 'Social Media',
            children: (
                <>
                    <Form.Item name={['socialLinks', 'facebook']} label="Facebook">
                        <Input />
                    </Form.Item>
                    <Form.Item name={['socialLinks', 'instagram']} label="Instagram">
                        <Input />
                    </Form.Item>
                    <Form.Item name={['socialLinks', 'twitter']} label="Twitter">
                        <Input />
                    </Form.Item>
                    <Form.Item name={['socialLinks', 'linkedin']} label="LinkedIn">
                        <Input />
                    </Form.Item>
                </>
            ),
        },
        {
            key: '4',
            label: 'SEO & Analytics',
            children: (
                <>
                    <Form.Item name={['seo', 'metaTitle']} label="Meta Title">
                        <Input />
                    </Form.Item>
                    <Form.Item name={['seo', 'metaDescription']} label="Meta Description">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item name={['seo', 'googleAnalyticsId']} label="Google Analytics ID">
                        <Input />
                    </Form.Item>
                    <Form.Item name={['seo', 'facebookPixelId']} label="Facebook Pixel ID">
                        <Input />
                    </Form.Item>
                </>
            ),
        },
    ];

    return (
        <Card title="Global Site Settings" loading={loading}>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Tabs defaultActiveKey="1" items={items} />
                <Form.Item className="mt-4">
                    <Button type="primary" htmlType="submit">Save Settings</Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default SiteSettings;
