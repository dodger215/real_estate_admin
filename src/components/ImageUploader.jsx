// components/ImageUploader.jsx - Updated version with mode prop
import React, { useState } from 'react';
import { Upload, Button, message, Image, Space } from 'antd';
import { UploadOutlined, DeleteOutlined, PictureOutlined, PlusOutlined } from '@ant-design/icons';
import { uploadService } from '../services/api';

const ImageUploader = ({
    value,
    onChange,
    mode = 'single', // 'single' or 'multiple'
    maxFiles = 10,
    ...props
}) => {
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);

    // Single upload handler logic remains similar but simplified
    const handleSingleUpload = async ({ file, onSuccess, onError }) => {
        setLoading(true);
        try {
            const response = await uploadService.upload(file, false);
            onSuccess(response.data, file);
            if (onChange) {
                onChange(response.data.data.fullUrl || response.data.data.url);
            }
            message.success('File uploaded successfully');
        } catch (error) {
            onError(error);
            message.error('Upload failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Multiple upload: Upload per file, onSuccess updates file status
    const handleMultipleUpload = async ({ file, onSuccess, onError }) => {
        // Note: we don't set loading global here heavily as purely controlled by fileList
        try {
            const response = await uploadService.upload(file, false); // Upload as single file
            onSuccess(response.data, file);
            message.success('Uploaded ' + file.name);
        } catch (error) {
            onError(error);
            message.error(`Failed to upload ${file.name}: ${error.message}`);
        }
    };

    const handleUploadChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);

        // Check for done files and move them to value
        const doneFiles = newFileList.filter(file => file.status === 'done');
        if (doneFiles.length > 0) {
            const newUrls = doneFiles.map(file => {
                // Handle response structure. customRequest passes response.data to onSuccess
                const resp = file.response;
                return resp?.data?.fullUrl || resp?.data?.url;
            }).filter(url => url);

            if (newUrls.length > 0) {
                const existingValues = Array.isArray(value) ? value : [];
                const newValue = [...existingValues, ...newUrls];

                if (onChange) {
                    onChange(newValue);
                }

                // Clear done files from list so they aren't re-added
                // We keep error/uploading files
                setFileList(current => current.filter(f => f.status !== 'done'));
            }
        }
    };

    const handleRemoveSingle = () => {
        if (onChange) {
            onChange('');
        }
    };

    const handleRemoveMultiple = (index) => {
        if (Array.isArray(value)) {
            const newValue = [...value];
            newValue.splice(index, 1);
            if (onChange) {
                onChange(newValue);
            }
        }
    };

    const beforeUpload = (file, fileList) => {
        if (mode === 'multiple') {
            // Check total files
            const existingCount = Array.isArray(value) ? value.length : 0;
            const totalFiles = existingCount + fileList.length;
            if (totalFiles > maxFiles) {
                message.error(`You can only upload up to ${maxFiles} files`);
                return false;
            }
        }

        // Check file type
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('You can only upload image files!');
            return false;
        }

        // Check file size (5MB)
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('Image must be smaller than 5MB!');
            return false;
        }

        return true;
    };

    if (mode === 'multiple') {
        return (
            <div className="space-y-4">
                <Upload
                    customRequest={handleMultipleUpload}
                    listType="picture-card"
                    multiple
                    accept="image/*"
                    beforeUpload={beforeUpload}
                    fileList={fileList}
                    onChange={handleUploadChange}
                    {...props}
                >
                    {fileList.length >= maxFiles ? null : (
                        <div className="flex flex-col items-center justify-center h-full">
                            <PlusOutlined />
                            <div className="mt-2">Upload</div>
                        </div>
                    )}
                </Upload>
                <div className="text-xs text-gray-500">
                    Upload up to {maxFiles} images
                </div>

                {Array.isArray(value) && value.length > 0 && (
                    <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-medium">
                                Uploaded Images ({value.length})
                                {value.length >= maxFiles && (
                                    <span className="ml-2 text-sm text-gray-500">(Maximum reached)</span>
                                )}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {value.map((url, index) => (
                                <div key={index} className="relative group border rounded-lg overflow-hidden">
                                    <Image
                                        src={url}
                                        alt={`Uploaded ${index + 1}`}
                                        className="w-full h-32 object-cover"
                                        preview={false}
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <Button
                                            type="primary"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => handleRemoveMultiple(index)}
                                            size="small"
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                    {index === 0 && (
                                        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                            Featured
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Single mode (default)
    return (
        <div className="space-y-2">
            <Upload
                customRequest={handleSingleUpload}
                showUploadList={false}
                accept="image/*"
                beforeUpload={beforeUpload}
                {...props}
            >
                <Button icon={<UploadOutlined />} loading={loading}>
                    Upload Image
                </Button>
            </Upload>

            {value && (
                <div className="mt-4 border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Preview:</span>
                        <Button
                            type="link"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={handleRemoveSingle}
                            size="small"
                        >
                            Remove
                        </Button>
                    </div>
                    <Image
                        src={value}
                        alt="Preview"
                        className="max-h-48 object-cover rounded"
                        preview={false}
                    />
                    <div className="mt-2 text-xs text-gray-500 truncate">{value}</div>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;