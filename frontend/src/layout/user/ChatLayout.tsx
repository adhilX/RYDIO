import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import Navbar from '../../components/user/Navbar';
import ChatSidebar from '../../components/chat/ChatSidebar';
import { ChatProvider } from '../../contexts/ChatContext';
import Particles from '@/components/common/Particles';


const ChatLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Initialize chat on mount
  return (
    <ChatProvider>
      <div className="h-screen bg-[#000000] text-white flex flex-col relative overflow-hidden selection:bg-white/20">
        <div className="absolute inset-0 bg-neutral-950/80 z-0" />
        <Particles className="absolute inset-0 z-0 animate-fade-in" quantity={50} ease={80} refresh />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black pointer-events-none z-0" />

        <div className="relative z-10 flex flex-col h-full">
          <Navbar />
          <div className="flex-1 flex pt-16 relative overflow-hidden">
            {/* Chat Sidebar */}
            <ChatSidebar
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
            />

            {/* Chat Area - Outlet renders child routes */}
            <div className={`flex-1 flex flex-col bg-transparent h-full overflow-hidden ${!isSidebarOpen ? 'block' : 'hidden lg:flex'
              }`}>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </ChatProvider>
  );
};

export default ChatLayout;
