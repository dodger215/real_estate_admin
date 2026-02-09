import React, { useEffect, useState } from 'react';
import { Table, Card, Tag, Select, message, Button, Space, Modal } from 'antd';
import { DownloadOutlined, SendOutlined } from '@ant-design/icons';
import { editorService, templateService, leadService } from '../services/api';

const { Option } = Select;

const Leads = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(false);

    // Reply Modal State
    const [replyModalVisible, setReplyModalVisible] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [sending, setSending] = useState(false);

    const fetchLeads = async () => {
        setLoading(true);
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

    const handleStatusChange = async (leadId, newStatus) => {
        try {
            await leadService.updateLead(leadId, { status: newStatus });
            message.success('Status updated');
            fetchLeads();
        } catch (err) {
            message.error('Failed to update status');
        }
    };

    const handleOpenReply = async (lead) => {
        setSelectedLead(lead);
        setReplyModalVisible(true);
        // Fetch templates if not loaded
        if (templates.length === 0) {
            try {
                const res = await templateService.getTemplates();
                setTemplates(res.data);
            } catch (err) {
                message.error('Failed to load templates');
            }
        }
    };

    const handleSendTemplate = async () => {
        if (!selectedTemplate) {
            message.error('Please select a template');
            return;
        }
        setSending(true);
        try {
            await templateService.sendToLead({
                leadId: selectedLead._id,
                templateId: selectedTemplate
            });
            message.success('Template sent to lead');
            setReplyModalVisible(false);
            setSelectedTemplate(null);
            handleStatusChange(selectedLead._id, 'contacted');
        } catch (err) {
            message.error('Failed to send template');
        } finally {
            setSending(false);
        }
    };

    const exportCSV = () => {
        if (leads.length === 0) return;
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

    const [viewMode, setViewMode] = useState(window.innerWidth < 768 ? 'card' : 'table');

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name', className: 'font-bold' },
        {
            title: 'Contact', key: 'contact', render: (_, record) => (
                <div className="flex flex-col">
                    <span className="text-sm font-medium">{record.email}</span>
                    <span className="text-xs text-gray-400">{record.phone}</span>
                </div>
            )
        },
        { title: 'Source', dataIndex: 'source', key: 'source', render: (text) => <Tag className="rounded-lg border-none px-3 font-bold uppercase text-[10px]">{text}</Tag> },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => <span className="text-xs font-bold text-gray-400">{new Date(date).toLocaleDateString()}</span>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => (
                <Select
                    defaultValue={status}
                    className="w-32 rounded-lg"
                    onChange={(val) => handleStatusChange(record._id, val)}
                >
                    <Option value="new">New</Option>
                    <Option value="contacted">Contacted</Option>
                    <Option value="assigned">Assigned</Option>
                    <Option value="closed">Closed</Option>
                </Select>
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={() => handleOpenReply(record)}
                    className="rounded-xl font-bold h-10 px-4"
                >
                    Reply
                </Button>
            )
        }
    ];

    const renderCard = (lead) => (
        <div key={lead._id} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all mb-4">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-black text-gray-900 mb-1 leading-tight">{lead.name}</h3>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{new Date(lead.createdAt).toLocaleDateString()}</p>
                </div>
                <Tag className="m-0 rounded-lg border-none px-3 font-bold uppercase text-[10px]">{lead.source}</Tag>
            </div>

            <div className="flex flex-col gap-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-bold">Email:</span> {lead.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-bold">Phone:</span> {lead.phone}
                </div>
                {lead.message && (
                    <div className="bg-gray-50 p-4 rounded-2xl mt-2 italic text-gray-500 text-sm">
                        "{lead.message}"
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <Select
                    defaultValue={lead.status}
                    className="w-32"
                    variant="borderless"
                    onChange={(val) => handleStatusChange(lead._id, val)}
                >
                    <Option value="new">New</Option>
                    <Option value="contacted">Contacted</Option>
                    <Option value="assigned">Assigned</Option>
                    <Option value="closed">Closed</Option>
                </Select>
                <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={() => handleOpenReply(lead)}
                    className="rounded-xl h-12 px-6 font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                >
                    Reply
                </Button>
            </div>
        </div>
    );

    return (
        <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 leading-none mb-2">Leads</h1>
                    <p className="text-gray-400 font-medium">Manage incoming inquiries</p>
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
                        icon={<DownloadOutlined />}
                        onClick={exportCSV}
                        className="rounded-xl h-12 px-6 font-bold border-gray-100 flex-1 sm:flex-none"
                    >
                        Export CSV
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : viewMode === 'table' && window.innerWidth >= 768 ? (
                <Card className="rounded-[2rem] shadow-xl shadow-gray-200/50 border-none overflow-hidden">
                    <Table
                        dataSource={leads}
                        columns={columns}
                        rowKey="_id"
                        pagination={{ pageSize: 10 }}
                        className="admin-table"
                    />
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                    {leads.map(renderCard)}
                </div>
            )}

            <Modal
                title={`Reply to ${selectedLead?.name}`}
                open={replyModalVisible}
                onCancel={() => setReplyModalVisible(false)}
                onOk={handleSendTemplate}
                confirmLoading={sending}
                okText="Send Template"
            >
                <p>Select a document template to send to this lead. They will receive an email with a link to view and sign.</p>
                <Select
                    style={{ width: '100%', marginTop: 16 }}
                    placeholder="Select Template"
                    onChange={setSelectedTemplate}
                    value={selectedTemplate}
                >
                    {templates.map(t => (
                        <Option key={t._id} value={t._id}>{t.name}</Option>
                    ))}
                </Select>
            </Modal>
        </div>
    );
};

export default Leads;
