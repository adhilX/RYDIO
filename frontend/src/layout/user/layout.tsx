// Premium Dashboard Layout
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Sidebar } from "../../components/user/Dashboard/DashBoardSidebar";
import Navbar from "@/components/user/Navbar";
import Particles from "@/components/common/Particles";

export default function Layout() {
  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col">
      <Particles className="absolute inset-0 z-0 animate-fade-in" quantity={100} ease={80} refresh/>
      <Navbar />
       
      <div className="flex-1 flex flex-col md:flex-row max-w-[1920px] mx-auto w-full pt-20 md:pt-24 p-6 gap-6 relative z-10">
        <Sidebar />

        {/* Main Content Area */}
        <motion.main
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 min-w-0"
        >
          {/* Glass Container for Content */}
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl h-[calc(100vh-140px)] p-6 md:p-10 overflow-y-auto custom-scrollbar relative shadow-[0_0_50px_rgba(255,255,255,0.05)]">
            <Outlet />
          </div>
        </motion.main>
      </div>

      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-white/5 rounded-full blur-[150px]" />
      </div>
    </div>
  );
}
