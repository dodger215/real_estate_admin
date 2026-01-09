import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, message, Tabs, Switch, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { contentService } from '../services/api';
import ImageUploader from '../components/ImageUploader'; // Import the ImageUploader

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
                    <Form.Item name={['hero', 'backgroundImage']} label="Background Image">
                        <ImageUploader mode="single" />
                    </Form.Item>
                    <Form.Item name={['hero', 'ctaText']} label="CTA Button Text">
                        <Input />
                    </Form.Item>
                    <Form.Item name={['hero', 'ctaAction']} label="CTA Action">
                        <Input placeholder="form / phone / whatsapp" />
                    </Form.Item>
                    <Space>
                        <Form.Item name={['hero', 'showBadge']} label="Show Badge" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                        <Form.Item name={['hero', 'badgeText']} label="Badge Text">
                            <Input placeholder="New Listing" />
                        </Form.Item>
                    </Space>
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
                    <Form.Item name={['about', 'image']} label="Featured Image">
                        <ImageUploader mode="single" />
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
            key: 'trustSignals',
            label: 'Trust Signals',
            children: (
                <>
                    <Form.Item name={['trustSignals', 'yearsExperience']} label="Years of Experience">
                        <Input placeholder="e.g., 15+" />
                    </Form.Item>
                    <Form.Item name={['trustSignals', 'homesSold']} label="Homes Sold">
                        <Input placeholder="e.g., 500+" />
                    </Form.Item>
                    <Form.List name={['trustSignals', 'badges']}>
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <div key={key} className="p-4 border rounded-xl mb-4 bg-gray-50">
                                        <Form.Item 
                                            {...restField} 
                                            name={[name]} 
                                            label={`Badge ₵‎{name + 1}`}
                                        >
                                            <Input placeholder="e.g., Top Rated Agent, Certified Luxury Specialist" />
                                        </Form.Item>
                                        <Button type="link" danger onClick={() => remove(name)}>
                                            Remove Badge
                                        </Button>
                                    </div>
                                ))}
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    Add Badge
                                </Button>
                            </>
                        )}
                    </Form.List>
                </>
            ),
        },
        {
            key: 'property',
            label: 'Featured Property',
            children: (
                <>
                    <Form.Item name={['property', 'title']} label="Property Title">
                        <Input />
                    </Form.Item>
                    <Form.Item name={['property', 'description']} label="Description">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item name={['property', 'image']} label="Property Image">
                        <ImageUploader mode="single" />
                    </Form.Item>
                    <Space direction="vertical" className="w-full">
                        <Form.Item name={['property', 'type']} label="Type">
                            <Input placeholder="e.g., Apartment, Villa" />
                        </Form.Item>
                        <Form.Item name={['property', 'location']} label="Location">
                            <Input placeholder="e.g., Downtown, Beverly Hills" />
                        </Form.Item>
                        <Form.Item name={['property', 'size']} label="Size">
                            <Input placeholder="e.g., 120 sqm" />
                        </Form.Item>
                        <Form.Item name={['property', 'price']} label="Price">
                            <Input placeholder="e.g., From ₵‎250,000" />
                        </Form.Item>
                    </Space>
                </>
            ),
        },
        {
            key: 'features',
            label: 'Features & Amenities',
            children: (
                <Form.List name="features">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <div key={key} className="p-4 border rounded-xl mb-4 bg-gray-50">
                                    <Form.Item 
                                        {...restField} 
                                        name={[name, 'name']} 
                                        label="Feature Name"
                                        rules={[{ required: true }]}
                                    >
                                        <Input placeholder="e.g., Swimming Pool, Gym, Security" />
                                    </Form.Item>
                                    <Form.Item 
                                        {...restField} 
                                        name={[name, 'icon']} 
                                        label="Icon Name"
                                    >
                                        <Input placeholder="e.g., pool, gym, security (optional)" />
                                    </Form.Item>
                                    <Form.Item 
                                        {...restField} 
                                        name={[name, 'enabled']} 
                                        label="Enabled"
                                        valuePropName="checked"
                                        initialValue={true}
                                    >
                                        <Switch />
                                    </Form.Item>
                                    <Button type="link" danger onClick={() => remove(name)}>
                                        Remove Feature
                                    </Button>
                                </div>
                            ))}
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                Add Feature
                            </Button>
                        </>
                    )}
                </Form.List>
            ),
        },
        {
            key: 'location',
            label: 'Location',
            children: (
                <>
                    <Form.Item name={['location', 'address']} label="Address">
                        <Input />
                    </Form.Item>
                    <Form.Item name={['location', 'mapEmbed']} label="Google Maps Embed URL">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item name={['location', 'neighborhoodDescription']} label="Neighborhood Description">
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.List name={['location', 'landmarks']}>
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <div key={key} className="p-4 border rounded-xl mb-4 bg-gray-50">
                                        <Space direction="vertical" className="w-full">
                                            <Form.Item 
                                                {...restField} 
                                                name={[name, 'name']} 
                                                label="Landmark Name"
                                                rules={[{ required: true }]}
                                            >
                                                <Input placeholder="e.g., Shopping Mall, School, Hospital" />
                                            </Form.Item>
                                            <Form.Item 
                                                {...restField} 
                                                name={[name, 'distance']} 
                                                label="Distance"
                                            >
                                                <Input placeholder="e.g., 5 min walk, 2 km drive" />
                                            </Form.Item>
                                        </Space>
                                        <Button type="link" danger onClick={() => remove(name)}>
                                            Remove Landmark
                                        </Button>
                                    </div>
                                ))}
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    Add Landmark
                                </Button>
                            </>
                        )}
                    </Form.List>
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
                                    <Form.Item 
                                        {...restField} 
                                        name={[name, 'name']} 
                                        label="Name" 
                                        rules={[{ required: true }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item 
                                        {...restField} 
                                        name={[name, 'role']} 
                                        label="Role"
                                    >
                                        <Input placeholder="e.g., CEO, Home Owner, Investor" />
                                    </Form.Item>
                                    <Form.Item 
                                        {...restField} 
                                        name={[name, 'content']} 
                                        label="Content"
                                    >
                                        <Input.TextArea rows={3} placeholder="What they said about your service..." />
                                    </Form.Item>
                                    <Form.Item 
                                        {...restField} 
                                        name={[name, 'avatar']} 
                                        label="Avatar"
                                    >
                                        <ImageUploader mode="single" />
                                    </Form.Item>
                                    <Form.Item 
                                        {...restField} 
                                        name={[name, 'rating']} 
                                        label="Rating"
                                    >
                                        <Input type="number" min={1} max={5} placeholder="1-5" />
                                    </Form.Item>
                                    <Form.Item 
                                        {...restField} 
                                        name={[name, 'enabled']} 
                                        label="Enabled"
                                        valuePropName="checked"
                                        initialValue={true}
                                    >
                                        <Switch />
                                    </Form.Item>
                                    <Button type="link" danger onClick={() => remove(name)}>
                                        Remove Testimonial
                                    </Button>
                                </div>
                            ))}
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                Add Testimonial
                            </Button>
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
                                    <Form.Item 
                                        {...restField} 
                                        name={[name, 'question']} 
                                        label="Question" 
                                        rules={[{ required: true }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item 
                                        {...restField} 
                                        name={[name, 'answer']} 
                                        label="Answer" 
                                        rules={[{ required: true }]}
                                    >
                                        <Input.TextArea rows={3} />
                                    </Form.Item>
                                    <Form.Item 
                                        {...restField} 
                                        name={[name, 'enabled']} 
                                        label="Enabled"
                                        valuePropName="checked"
                                        initialValue={true}
                                    >
                                        <Switch />
                                    </Form.Item>
                                    <Button type="link" danger onClick={() => remove(name)}>
                                        Remove FAQ
                                    </Button>
                                </div>
                            ))}
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                Add FAQ
                            </Button>
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
                        <Input.TextArea rows={3} placeholder="Luxury living redefined. Find your dream home with us." />
                    </Form.Item>
                    <Form.Item name={['footer', 'copyright']} label="Copyright Text">
                        <Input placeholder={`© ₵{new Date().getFullYear()} Your Company. All rights reserved.`} />
                    </Form.Item>
                    <Form.List name={['footer', 'legalLinks']}>
                        {(fields, { add, remove }) => (
                            <>
                                <div className="mb-4">
                                    {fields.map(({ key, name, ...restField }) => (
                                        <div key={key} className="p-4 border rounded-xl mb-2 bg-gray-50">
                                            <Space direction="vertical" className="w-full">
                                                <Form.Item 
                                                    {...restField} 
                                                    name={[name, 'label']} 
                                                    label="Link Label"
                                                    rules={[{ required: true }]}
                                                >
                                                    <Input placeholder="e.g., Privacy Policy, Terms of Service" />
                                                </Form.Item>
                                                <Form.Item 
                                                    {...restField} 
                                                    name={[name, 'url']} 
                                                    label="Link URL"
                                                    rules={[{ required: true }]}
                                                >
                                                    <Input placeholder="e.g., /privacy, /terms" />
                                                </Form.Item>
                                            </Space>
                                            <Button type="link" danger onClick={() => remove(name)}>
                                                Remove Link
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    Add Legal Link
                                </Button>
                            </>
                        )}
                    </Form.List>
                </>
            ),
        },
        {
            key: 'media',
            label: 'Media Gallery',
            children: (
                <>
                    <Form.Item name={['media', 'enabled']} label="Enable Media Gallery" valuePropName="checked" initialValue={true}>
                        <Switch />
                    </Form.Item>
                    <Form.Item name={['media', 'gallery']} label="Gallery Images">
                        <ImageUploader mode="multiple" maxFiles={20} />
                    </Form.Item>
                    <Form.Item name={['media', 'floorPlans']} label="Floor Plans">
                        <ImageUploader mode="multiple" maxFiles={10} />
                    </Form.Item>
                    <Form.Item name={['media', 'videoTour']} label="Video Tour URL">
                        <Input placeholder="YouTube or Vimeo embed URL" />
                    </Form.Item>
                </>
            ),
        },
        {
            key: 'paymentPlans',
            label: 'Payment Plans',
            children: (
                <Form.List name="paymentPlans">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <div key={key} className="p-4 border rounded-xl mb-4 bg-gray-50">
                                    <Form.Item 
                                        {...restField} 
                                        name={[name, 'title']} 
                                        label="Plan Title"
                                        rules={[{ required: true }]}
                                    >
                                        <Input placeholder="e.g., 20% Down Payment, Flexible Installments" />
                                    </Form.Item>
                                    <Form.Item 
                                        {...restField} 
                                        name={[name, 'description']} 
                                        label="Description"
                                    >
                                        <Input.TextArea rows={2} placeholder="Describe the payment terms..." />
                                    </Form.Item>
                                    <Button type="link" danger onClick={() => remove(name)}>
                                        Remove Payment Plan
                                    </Button>
                                </div>
                            ))}
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                Add Payment Plan
                            </Button>
                        </>
                    )}
                </Form.List>
            ),
        },
    ];

    return (
        <Card title="Page Content Management" loading={loading}>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Tabs 
                    defaultActiveKey="hero" 
                    items={items}
                    tabPosition="left"
                    style={{ minHeight: 400 }}
                />
                <Form.Item className="mt-4">
                    <Button type="primary" htmlType="submit" size="large">
                        Save All Content
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default PageContent;