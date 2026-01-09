import React, { useEffect, useState } from 'react';
import { Table, Card, Tag, Select, message, Button, Space } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { leadService } from '../services/api';

const Leads = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLeads = async () => {
        try {
            const res = await leadService.getLeads();
            setLeads(res.data);
        } catch (err) {
            message.error('Failed to fetch leads');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const handleStatusChange = async (id, status) => {
        try {
            await leadService.updateLead(id, { status });
            message.success('Status updated');
            fetchLeads();
        } catch (err) {
            message.error('Failed to update status');
        }
    };

    const exportCSV = () => {
        const headers = ['Name', 'Email', 'Phone', 'Message', 'Status', 'Date'];
        const rows = leads.map(l => [
            l.name,
            l.email,
            l.phone,
            l.message,
            l.status,
            new Date(l.createdAt).toLocaleDateString()
        ]);

        let csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "leads.csv");
        document.body.appendChild(link);
        link.click();
    };

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Phone', dataIndex: 'phone', key: 'phone' },
        { title: 'Message', dataIndex: 'message', key: 'message', ellipsis: true },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => (
                <Select
                    defaultValue={status}
                    style={{ width: 120 }}
                    onChange={(val) => handleStatusChange(record._id, val)}
                    options={[
                        { value: 'new', label: 'New' },
                        { value: 'contacted', label: 'Contacted' },
                        { value: 'assigned', label: 'Assigned' },
                        { value: 'closed', label: 'Closed' },
                    ]}
                />
            ),
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleDateString(),
        },
    ];

    return (
        <Card
            title="Leads Management"
            extra={
                <Button icon={<DownloadOutlined />} onClick={exportCSV}>
                    Export CSV
                </Button>
            }
        >
            <Table dataSource={leads} columns={columns} rowKey="_id" loading={loading} />
        </Card>
    );
};

export default Leads;
