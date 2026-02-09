import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AuthProvider, useAuth } from './context/AuthContext';
import { settingsService } from './services/api';
import Login from './pages/Login';
import DashboardLayout from './components/DashboardLayout';
import './index.css';

import SiteSettings from './pages/SiteSettings';
import PageContent from './pages/PageContent';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

import Leads from './pages/Leads';
import Users from './pages/Users';
import LayoutManager from './pages/LayoutManager';
import Properties from './pages/Properties';
import Blog from './pages/Blog';
import Agents from './pages/Agents';
import Services from './pages/Services';
import Projects from './pages/Projects';
import RecycleBin from './pages/RecycleBin';
import PdfTemplates from './pages/PdfTemplates';
import TemplateBuilder from './pages/TemplateBuilder';
import Submissions from './pages/Submissions';
// import PublicLayout from './layouts/PublicLayout';
// import LeadVerify from './pages/public/LeadVerify';
// import DocumentView from './pages/public/DocumentView';

import Dashboard from './pages/Dashboard';

const App = () => {
  const [primaryColor, setPrimaryColor] = useState('#1677ff');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await settingsService.getSettings();
        if (res.data && res.data.primaryColor) {
          setPrimaryColor(res.data.primaryColor);
        }
      } catch (error) {
        console.error('Failed to fetch site settings:', error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <ConfigProvider theme={{ token: { colorPrimary: primaryColor } }}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* Public Routes */}
            {/* <Route path="/public" element={<PublicLayout />}>
              <Route path="verify/:id" element={<LeadVerify />} />
              <Route path="document/:id" element={<DocumentView />} />
            </Route> */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="settings" element={<SiteSettings />} />
              <Route path="content" element={<PageContent />} />
              <Route path="layout" element={<LayoutManager />} />
              <Route path="properties" element={<Properties />} />
              <Route path="blog" element={<Blog />} />
              <Route path="agents" element={<Agents />} />
              <Route path="services" element={<Services />} />
              <Route path="projects" element={<Projects />} />
              <Route path="leads" element={<Leads />} />
              <Route path="recycle-bin" element={<RecycleBin />} />
              <Route path="pdf-templates" element={<PdfTemplates />} />
              <Route path="templates/new" element={<TemplateBuilder />} />
              <Route path="templates/edit/:id" element={<TemplateBuilder />} />
              <Route path="submissions" element={<Submissions />} />
              <Route path="users" element={<Users />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;
