import SignatureCanvas from 'react-signature-canvas';
import { Form, Input, Button, Card, message, Tabs, ColorPicker, Switch } from 'antd';
import { useRef, useState, useEffect } from 'react';
import { settingsService } from '../services/api';
import ImageUploader from '../components/ImageUploader';

const SiteSettings = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const sigPad = useRef(null);
    const [signatureMode, setSignatureMode] = useState('view'); // 'view' | 'edit'
    const [existingSignature, setExistingSignature] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await settingsService.getSettings();
                form.setFieldsValue(res.data);
                if (res.data.adminSignature) {
                    setExistingSignature(res.data.adminSignature);
                    setSignatureMode('view');
                } else {
                    setSignatureMode('edit');
                }
            } catch (err) {
                message.error('Failed to fetch settings');
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, [form]);

    const onFinish = async (values) => {
        // Handle Signature
        if (signatureMode === 'edit' && sigPad.current) {
            if (!sigPad.current.isEmpty()) {
                values.adminSignature = sigPad.current.toDataURL();
            } else if (!existingSignature) {
                // Was cleared and empty, and no previous signature
                values.adminSignature = '';
            }
            // If empty but had existing and didn't clear explicitly? 
            // Logic: If in edit mode, what you see is what you get. If cleared, it's cleared.
        }

        try {
            await settingsService.updateSettings(values);
            message.success('Settings updated successfully');
            // Refresh state
            if (values.adminSignature) {
                setExistingSignature(values.adminSignature);
                setSignatureMode('view');
            }
        } catch (err) {
            message.error('Failed to update settings');
        }
    };

    const clearSignature = () => {
        sigPad.current?.clear();
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
                    <Form.Item name="logo" label="Logo">
                        <ImageUploader />
                    </Form.Item>
                    <Form.Item name="favicon" label="Favicon">
                        <ImageUploader />
                    </Form.Item>
                    <Form.Item
                        name="primaryColor"
                        label="Primary Color"
                        getValueFromEvent={(color) => typeof color.toHexString === 'function' ? color.toHexString() : color}
                    >
                        <ColorPicker showText />
                    </Form.Item>
                </>
            ),
        },
        {
            key: '5',
            label: 'Documents & Signing',
            children: (
                <>
                    <Form.Item
                        name="enableAdminSignature"
                        label="Enable Admin Signature on Forms"
                        valuePropName="checked"
                        tooltip="If enabled, your signature will be automatically added to approved documents."
                    >
                        <Switch />
                    </Form.Item>

                    <div className="mb-4">
                        <h4 className="mb-2">Admin Signature</h4>
                        <Form.Item name="adminSignature" hidden>
                            <Input />
                        </Form.Item>

                        {signatureMode === 'view' && existingSignature ? (
                            <div className="border p-4 rounded bg-gray-50 text-center">
                                <img src={existingSignature} alt="Admin Signature" className="mx-auto h-24 mb-4" />
                                <Button onClick={() => setSignatureMode('edit')}>change Signature</Button>
                            </div>
                        ) : (
                            <div className="border border-gray-300 rounded p-2 bg-white">
                                <SignatureCanvas
                                    ref={sigPad}
                                    penColor="black"
                                    canvasProps={{ width: 500, height: 200, className: 'sigCanvas w-full h-48 border-dashed border-2 border-gray-200 bg-white' }}
                                />
                                <div className="mt-2 flex gap-2">
                                    <Button onClick={clearSignature} danger>Clear</Button>
                                    {existingSignature && (
                                        <Button onClick={() => setSignatureMode('view')}>Cancel</Button>
                                    )}
                                </div>
                                <p className="text-gray-400 text-xs mt-1">Draw your signature above. It will be saved when you click "Save Settings".</p>
                            </div>
                        )}
                    </div>
                </>
            )
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
