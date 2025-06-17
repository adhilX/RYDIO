import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserManagement } from '@/components/admin/UserManagment';
import { Dashboard } from '@/components/admin/Dashboard';
import { Sidebar } from '@/components/admin/SideBar';

const Index = () => {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const pageVariants = {
        initial: { opacity: 0, x: 50 },
        in: { opacity: 1, x: 0 },
        out: { opacity: 0, x: -50 }
    };

    const pageTransition = {
        type: 'tween' as const,
        ease: 'easeInOut' as const,
        duration: 0.3
    };

    const renderCurrentPage = () => {
        switch (currentPage) {
            case 'users':
                return <UserManagement />;
            case 'analytics':
                return (
                    <div className="p-6 bg-gray-900">
                        <h1 className="text-3xl font-bold dark:text-white">Analytics</h1>
                        <p className="dark:text-gray-400 mt-1">Analytics page coming soon...</p>
                    </div>
                );
            case 'settings':
                return (
                    <div className="p-6 dark:bg-gray-900">
                        <h1 className="text-3xl font-bold dark:text-white">Settings</h1>
                        <p className="dark:text-gray-400 mt-1">Settings page coming soon...</p>
                    </div>
                );
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex w-full">
            <Sidebar
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
            <main className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentPage}
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                        className="h-full overflow-y-auto"
                    >
                        {renderCurrentPage()}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default Index;
