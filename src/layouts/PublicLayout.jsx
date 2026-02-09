import React from 'react';
import { Outlet } from 'react-router-dom';

const PublicLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
                <Outlet />
            </div>
            <div className="mt-4 text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} Estate Agency
            </div>
        </div>
    );
};

export default PublicLayout;
