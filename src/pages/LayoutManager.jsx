import React, { useState, useEffect } from 'react';
import { Reorder } from 'framer-motion';
import { Card, Button, message, Space } from 'antd';
import { MenuOutlined, SaveOutlined } from '@ant-design/icons';
import { contentService } from '../services/api';

const LayoutManager = () => {
    const [items, setItems] = useState(['hero', 'trust', 'property', 'features', 'location', 'contact']);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await contentService.getContent();
                if (res.data.layout && res.data.layout.length > 0) {
                    setItems(res.data.layout);
                }
            } catch (err) {
                message.error('Failed to fetch layout', err);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    const handleSave = async () => {
        try {
            await contentService.updateContent({ layout: items });
            message.success('Layout order saved');
        } catch (err) {
            message.error('Failed to save layout', err);
        }
    };

    const sectionLabels = {
        hero: 'Hero Section',
        trust: 'Trust & Credibility',
        property: 'Property Details',
        features: 'Features & Amenities',
        location: 'Location & Map',
        contact: 'Lead Capture Form'
    };

    return (
        <Card
            title="Layout Manager (Drag to Reorder)"
            loading={loading}
            extra={<Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>Save Order</Button>}
        >
            <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-4">
                {items.map((item) => (
                    <Reorder.Item key={item} value={item}>
                        <div className="bg-white border rounded-xl p-4 flex items-center justify-between shadow-sm cursor-grab active:cursor-grabbing hover:border-primary transition">
                            <div className="flex items-center gap-4">
                                <MenuOutlined className="text-gray-400" />
                                <span className="font-semibold">{sectionLabels[item] || item}</span>
                            </div>
                            <div className="text-xs text-gray-400 uppercase tracking-widest">Section</div>
                        </div>
                    </Reorder.Item>
                ))}
            </Reorder.Group>
        </Card>
    );
};

export default LayoutManager;
