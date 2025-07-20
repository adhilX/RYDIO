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
        <div className="min-h-screen bg-black flex text-white w-full relative overflow-hidden">
            {/* <div className="absolute inset-0 bg-[url('/placeholder.svg?heigh    t=1080&width=1920')] bg-cover bg-center opacity-10"></div> */}
            {/* <div className="absolute inset-0 bg-black/70"></div> */}
            {/* <div className="absolute top-20 left-20 w-72 h-72"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96"></div> */}
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
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    )
};

export default AdminLayout
