import React, { useEffect, useState } from 'react';
import { Table, Card, Tag, Button, Modal, message, Space } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { templateService } from '../services/api';

const Submissions = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    const fetchSubmissions = async () => {
        setLoading(true);
        try {
            const res = await templateService.getSubmissions();
            setSubmissions(res.data);
        } catch (err) {
            message.error('Failed to load submissions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const handleReview = async (id, status) => {
        try {
            await templateService.reviewSubmission(id, { status });
            message.success(`Application ${status}`);
            fetchSubmissions();
        } catch (err) {
            message.error('Failed to update status');
        }
    };

    const columns = [
        {
            title: 'Lead',
            dataIndex: ['lead', 'name'],
            key: 'leadName'
        },
        {
            title: 'Template',
            dataIndex: ['template', 'name'],
            key: 'templateName'
        },
        {
            title: 'Submitted At',
            dataIndex: 'submittedAt',
            key: 'submittedAt',
            render: (date) => date ? new Date(date).toLocaleString() : 'Pending'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'default';
                if (status === 'Accepted') color = 'green';
                if (status === 'Declined') color = 'red';
                if (status === 'Submitted') color = 'blue';
                return <Tag color={color}>{status}</Tag>;
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button icon={<EyeOutlined />} onClick={() => {
                        setSelectedSubmission(record);
                        setViewModalVisible(true);
                    }}>View</Button>
                    {record.status === 'Submitted' && (
                        <>
                            <Button
                                type="primary"
                                icon={<CheckOutlined />}
                                onClick={() => handleReview(record._id, 'Accepted')}
                                className="bg-green-600 hover:bg-green-500"
                            >
                                Accept
                            </Button>
                            <Button
                                type="primary"
                                danger
                                icon={<CloseOutlined />}
                                onClick={() => handleReview(record._id, 'Declined')}
                            >
                                Decline
                            </Button>
                        </>
                    )}
                </Space>
            )
        }
    ];

    return (
        <div className="p-6">
            <Card title="Document Submissions">
                <Table
                    dataSource={submissions}
                    columns={columns}
                    rowKey="_id"
                    loading={loading}
                />
            </Card>

            <Modal
                title="Submission Details"
                open={viewModalVisible}
                onCancel={() => setViewModalVisible(false)}
                footer={null}
                width={800}
            >
                {selectedSubmission && (
                    <div>
                        <h3 className="font-bold mb-2">Form Data:</h3>
                        <div className="bg-gray-50 p-4 rounded mb-4">
                            {selectedSubmission.values && Object.entries(selectedSubmission.values).map(([key, value]) => (
                                <div key={key} className="mb-2">
                                    <span className="font-semibold">{key}: </span>
                                    <span>{value}</span>
                                </div>
                            ))}
                        </div>
                        {selectedSubmission.status === 'Submitted' && (
                            <div className="flex gap-4 justify-end mt-4">
                                <Button
                                    type="primary"
                                    className="bg-green-600"
                                    onClick={() => {
                                        handleReview(selectedSubmission._id, 'Accepted');
                                        setViewModalVisible(false);
                                    }}
                                >
                                    Accept & Enroll
                                </Button>
                                <Button
                                    danger
                                    onClick={() => {
                                        handleReview(selectedSubmission._id, 'Declined');
                                        setViewModalVisible(false);
                                    }}
                                >
                                    Decline
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Submissions;
