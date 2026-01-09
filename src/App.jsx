import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
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

const Dashboard = () => <div className="p-6"><h1 className="text-2xl font-bold">Welcome to Estate CMS</h1><p>Select a section from the sidebar to manage your content.</p></div>;

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
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
            <Route path="users" element={<Users />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
