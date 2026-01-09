import axios from 'axios';

const API_URL = import.meta.env.REACT_APP_API_URL;


const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    getMe: () => api.get('/auth/me'),
};

export const settingsService = {
    getSettings: () => api.get('/settings'),
    updateSettings: (data) => api.post('/settings', data),
};

export const contentService = {
    getContent: () => api.get('/content'),
    updateContent: (data) => api.post('/content', data),
};

export const leadService = {
    getLeads: () => api.get('/leads'),
    updateLead: (id, data) => api.patch(`/leads/${id}`, data),
};

export const userService = {
    getUsers: () => api.get('/users'),
    createUser: (data) => api.post('/users', data),
};

// api.js - Update upload service
export const uploadService = {
    // Unified upload method
    upload: (files, multiple = false) => {
        const formData = new FormData();
        formData.append('multiple', multiple);
        
        if (multiple) {
            files.forEach(file => {
                formData.append('files', file);
            });
        } else {
            formData.append('file', files);
        }
        
        return api.post('/upload/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    
    deleteFile: (filename) => api.delete(`/upload/delete/${filename}`),
    
    listFiles: () => api.get('/upload/list'),
    
    getFileInfo: (filename) => api.get(`/upload/info/${filename}`)
};

export const editorService = {
    // Properties
    getProperties: () => api.get('/editor/properties'),
    getProperty: (id) => api.get(`/editor/properties/${id}`),
    createProperty: (data) => api.post('/editor/properties', data),
    updateProperty: (id, data) => api.patch(`/editor/editor/properties/${id}`, data),
    deleteProperty: (id) => api.delete(`/editor/properties/${id}`),

    // Blogs
    getBlogs: () => api.get('/editor/blogs'),
    getBlog: (id) => api.get(`/editor/blogs/${id}`),
    createBlog: (data) => api.post('/editor/blogs', data),
    updateBlog: (id, data) => api.patch(`/editor/blogs/${id}`, data),
    deleteBlog: (id) => api.delete(`/editor/blogs/${id}`),

    // Agents
    getAgents: () => api.get('/editor/agents'),
    createAgent: (data) => api.post('/editor/agents', data),
    updateAgent: (id, data) => api.patch(`/editor/agents/${id}`, data),
    deleteAgent: (id) => api.delete(`/editor/agents/${id}`),

    // Services
    getServices: () => api.get('/editor/services'),
    createService: (data) => api.post('/editor/services', data),
    updateService: (id, data) => api.patch(`/editor/services/${id}`, data),
    deleteService: (id) => api.delete(`/editor/services/${id}`),

    // Projects
    getProjects: () => api.get('/editor/projects'),
    createProject: (data) => api.post('/editor/projects', data),
    updateProject: (id, data) => api.patch(`/editor/projects/${id}`, data),
    deleteProject: (id) => api.delete(`/editor/projects/${id}`),
};

export default api;
