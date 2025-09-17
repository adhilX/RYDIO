import  { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/components/admin/SideBar';
import { Outlet, useLocation } from 'react-router';

const AdminLayout = () => {
    const location = useLocation()
    const [currentPage, setCurrentPage] = useState(location.pathname.split('/')[2]|| 'dashboard');
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

    return (
        <div className="h-screen bg-black flex text-white w-full relative overflow-hidden">
            <Sidebar
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
            <main className="flex-1 h-screen overflow-hidden" style={{ marginLeft: isSidebarCollapsed ? '80px' : '280px' }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentPage}
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                        className="h-full overflow-y-auto custom-scrollbar"
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    )
};

export default AdminLayout
