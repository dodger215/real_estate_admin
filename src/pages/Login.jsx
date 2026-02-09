import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Skeleton, Row, Col } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const imageUrl = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';

    const onFinish = async (values) => {
        try {
            await login(values.email, values.password);
            message.success('Login successful');
            navigate('/');
        } catch (err) {
            message.error(err.response?.data?.message || 'Login failed');
        }
    };

    useEffect(() => {
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
            setImageLoaded(true);
        };
        img.onerror = () => {
            setImageError(true);
            setImageLoaded(true);
        };
    }, [imageUrl]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Row className="h-screen">
                {/* Left side - Image with Skeleton */}
                <Col xs={0} md={12} lg={16} className="relative">
                    {!imageLoaded ? (
                        <Skeleton.Image 
                            active 
                            className="!w-full !h-full" 
                            style={{ width: '100%', height: '100%' }}
                        />
                    ) : imageError ? (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <div className="text-center">
                                <UserOutlined className="text-6xl text-gray-400 mb-4" />
                                <p className="text-gray-500">Failed to load image</p>
                            </div>
                        </div>
                    ) : (
                        <div 
                            className="w-full h-full bg-cover bg-center"
                            style={{
                                backgroundImage: `url(${imageUrl})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                                <div className="text-white text-center px-8">
                                    <h1 className="text-4xl font-bold mb-4">Estate</h1>
                                    <p className="text-xl opacity-90">Professional Property Management System</p>
                                </div>
                            </div>
                        </div>
                    )}
                </Col>

                {/* Right side - Login Form */}
                <Col xs={24} md={12} lg={8} className="flex items-center justify-center p-8">
                    <div className="w-full max-w-md">
                        <Card 
                            title={
                                <div className="text-center">
                                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome Back</h2>
                                    <p className="text-gray-600">Sign in to your account</p>
                                </div>
                            }
                            bordered={false}
                            className="shadow-none border-0"
                        >
                            <Form 
                                name="login" 
                                onFinish={onFinish} 
                                layout="vertical"
                                size="large"
                            >
                                <Form.Item
                                    name="email"
                                    rules={[
                                        { required: true, message: 'Please input your email!' }, 
                                        { type: 'email', message: 'Please enter a valid email!' }
                                    ]}
                                >
                                    <Input 
                                        prefix={<UserOutlined className="text-gray-400" />} 
                                        placeholder="Email address" 
                                        className="py-3 px-4 rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500"
                                    />
                                </Form.Item>
                                
                                <Form.Item
                                    name="password"
                                    rules={[{ required: true, message: 'Please input your password!' }]}
                                >
                                    <Input.Password 
                                        prefix={<LockOutlined className="text-gray-400" />} 
                                        placeholder="Password" 
                                        className="py-3 px-4 rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500"
                                    />
                                </Form.Item>
                                
                                <Form.Item>
                                    <Button 
                                        type="primary" 
                                        htmlType="submit" 
                                        className="w-full h-12 text-base font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0 shadow-md hover:shadow-lg transition-all duration-200"
                                    >
                                        Sign In
                                    </Button>
                                </Form.Item>
                                
       
                            </Form>
                        </Card>
                        
                        <div className="mt-8 text-center text-gray-500 text-sm">
                            <p>© {new Date().getFullYear()} Estate. All rights reserved.</p>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default Login;