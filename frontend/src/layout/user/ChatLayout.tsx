import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import Navbar from '../../components/user/Navbar';
import ChatSidebar from '../../components/chat/ChatSidebar';
import { ChatProvider } from '../../contexts/ChatContext';


const ChatLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Initialize chat on mount
  return (
    <ChatProvider>
      <div className="h-screen bg-[#212121] text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex pt-16 relative overflow-hidden">
          {/* Chat Sidebar */}
          <ChatSidebar 
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          {/* Chat Area - Outlet renders child routes */}
          <div className={`flex-1 flex flex-col bg-[#212121] h-full overflow-hidden ${
            !isSidebarOpen ? 'block' : 'hidden lg:flex'
          }`}>
            <Outlet />
          </div>
        </div>
      </div>
    </ChatProvider>
  );
};

export default ChatLayout;
