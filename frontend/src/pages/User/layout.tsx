// Layout.jsx
import { Outlet } from "react-router-dom";
import { Sidebar } from "../../components/user/Dashboard/DashBoardSidebar";
import Navbar from "@/components/user/Navbar";
export default function Layout() {
  
  return (
    <div className="min-h-screen bg-black text-white relative">
      <Navbar />
      <div className="flex flex-col md:flex-row"> 
        <Sidebar />
        <main className="flex-1 p-5 md:p-6"> 
          <Outlet />
        </main>
      </div>
    </div>
  );
}
