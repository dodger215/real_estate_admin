import React, { useState } from 'react';
import { Upload, Button, message, Image, List } from 'antd';
import { UploadOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { uploadService } from '../services/api';

const MultiImageUploader = ({ value = [], onChange, maxFiles = 10, ...props }) => {
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);

    const customRequest = async ({ file, onSuccess, onError, fileList: newFileList }) => {
        setLoading(true);
        try {
            // Upload multiple files
            const filesToUpload = newFileList.map(f => f.originFileObj).filter(f => f);
            const response = await uploadService.upload(filesToUpload, true);
            
            onSuccess(response.data, file);
            
            // Get the uploaded URLs
            const uploadedUrls = response.data.data.map(file => file.fullUrl || file.url);
            
            // Combine existing values with new ones
            const newValue = [...value, ...uploadedUrls];
            
            if (onChange) {
                onChange(newValue);
            }
            
            message.success(`${uploadedUrls.length} file(s) uploaded successfully`);
        } catch (error) {
            onError(error);
            message.error('Upload failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = (index) => {
        const newValue = [...value];
        newValue.splice(index, 1);
        if (onChange) {
            onChange(newValue);
        }
    };

    const beforeUpload = (file, fileList) => {
        // Check total files
        const totalFiles = value.length + fileList.length;
        if (totalFiles > maxFiles) {
            message.error(`You can only upload up to ${maxFiles} files`);
            return false;
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

    return (
        <div className="space-y-4">
            <Upload
                customRequest={customRequest}
                listType="picture-card"
                multiple
                accept="image/*"
                beforeUpload={beforeUpload}
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                {...props}
            >
                <Button icon={<UploadOutlined />} loading={loading}>
                    Upload Images
                </Button>
                <div className="mt-2 text-xs text-gray-500">
                    Upload up to {maxFiles} images
                </div>
            </Upload>
            
            {value.length > 0 && (
                <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                        <span className="font-medium">Uploaded Images ({value.length})</span>
                        {value.length >= maxFiles && (
                            <span className="text-sm text-gray-500">Maximum {maxFiles} images reached</span>
                        )}
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
                                        onClick={() => handleRemove(index)}
                                        size="small"
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {value.length > 0 && (
                        <div className="mt-4 text-xs text-gray-500">
                            Click and drag to reorder images. First image will be featured.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MultiImageUploader;