// Premium Dashboard Layout
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Sidebar } from "../../components/user/Dashboard/DashBoardSidebar";
import Navbar from "@/components/user/Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white relative overflow-hidden">
      {/* Premium Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
      
      <Navbar />
      
      <div className="relative z-10 flex flex-col md:flex-row min-h-[calc(100vh-80px)]">
        <Sidebar />
        
        {/* Premium Main Content Area */}
        <motion.main 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 p-6 md:p-8 lg:p-10 mt-4 md:mt-0"
        >
          {/* Glass Container for Content */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl min-h-full p-6 md:p-8">
            <Outlet />
          </div>
        </motion.main>
      </div>
      
      {/* Premium Floating Elements */}
      <div className="fixed top-1/4 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-1/4 -left-20 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
    </div>
  );
}
