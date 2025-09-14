import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getChatsOfUser } from '@/services/chat/chatService';
import type { Ichat } from '@/Types/chat/Ichat';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import socket from '@/hooks/ConnectSocketIo';
import { useChatContext } from '@/contexts/ChatContext';

const IMG_URL = import.meta.env.VITE_IMAGE_URL;
interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const formatLastMessageTime = (date: Date | string) => {
  const now = new Date();
  const messageDate = typeof date === 'string' ? new Date(date) : date;
  
  // Check if the date is valid
  if (isNaN(messageDate.getTime())) {
    return 'now';
  }
  
  const diffInHours = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60));
    return diffInMinutes < 1 ? 'now' : `${diffInMinutes}m`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
  }
};

const ChatSidebar = ({isOpen, onClose }: UserSidebarProps) => {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?._id;
  const [chatUsers, setChatUsers] = useState<Ichat[]>([]);
  const { shouldRefetchSidebar, resetSidebarRefetch } = useChatContext();
  
  const currentChatUserId = chatId ? chatId.split('_').find(id => id !== userId) : null;
  
  const handleUserSelect = (id:string) => {
    navigate(`/chat/${userId}_${id}`);
    // onClose();
  };
  
  useEffect(() => {
    if (!userId) return;
    
    const fetchChat = async () => {
      const result = await getChatsOfUser(userId!)
      // Set all users as offline initially
      const chatsWithOfflineStatus = (result.data.chats || []).map((chat: Ichat) => ({
        ...chat,
        isOnline: false
      }));
      setChatUsers(chatsWithOfflineStatus)
    }
    fetchChat()
  }, [userId]);

  // Refetch sidebar data when shouldRefetchSidebar is true
  useEffect(() => {
    if (!userId || !shouldRefetchSidebar) return;
    
    const refetchChat = async () => {
      const result = await getChatsOfUser(userId!)
      const chatsWithOfflineStatus = (result.data.chats || []).map((chat: Ichat) => ({
        ...chat,
        isOnline: false
      }));
      setChatUsers(chatsWithOfflineStatus)
      resetSidebarRefetch()
    }
    refetchChat()
  }, [userId, shouldRefetchSidebar, resetSidebarRefetch]);

  // Socket connection and online status tracking
  useEffect(() => {
    if (!userId) return;

    // Connect socket and emit user online status
    if (!socket.connected) {
      socket.connect();
    }
    
    socket.emit('user-online', userId);

    // Listen for user status changes
    const handleUserStatusChange = ({ userId: changedUserId, isOnline }: { userId: string, isOnline: boolean }) => {
      setChatUsers(prev => 
        prev.map(chat => 
          chat._id === changedUserId 
            ? { ...chat, isOnline } 
            : chat
        )
      );
    };

    socket.on('user-status-changed', handleUserStatusChange);

    return () => {
      socket.off('user-status-changed', handleUserStatusChange);
    };
  }, [userId]);

  if (!userId) return null;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
        className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
        onClick={onClose}
        />
      )}

      { /* Sidebar */}
      <div className={`
        w-full bg-[#1e1e1e] flex flex-col z-50 h-full
        lg:w-80 lg:relative lg:translate-x-0 lg:border-r lg:border-[#2f2f2f]
        fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="px-4 py-4 border-b border-[#2f2f2f] bg-[#1e1e1e] flex-shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-medium text-white">Chats</h1>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-[#2f2f2f] rounded-full p-2">
                <Search className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-[#2f2f2f] rounded-full p-2 lg:hidden"
                onClick={onClose}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>        

        
        {/* Users List */}
        <div className="flex-1 overflow-y-auto">
          {chatUsers.map((chat) => (
            <motion.div
              key={chat._id}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleUserSelect(chat._id!)}
              className={`px-4 py-3 cursor-pointer transition-all duration-200 border-b border-[#2f2f2f]/30 relative ${
                currentChatUserId === chat._id
                  ? 'bg-gradient-to-r from-[#007AFF]/10 to-[#007AFF]/5 border-r-2 border-r-[#007AFF] shadow-lg shadow-[#007AFF]/10'
                  : 'hover:bg-[#2a2a2a] active:bg-[#2f2f2f] hover:shadow-md'
              }`}
            >
              {/* Active indicator dot */}
              {currentChatUserId === chat._id && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-[#007AFF] rounded-r-full"></div>
              )} 
              <div className="flex items-center space-x-3">
                <div className="relative flex-shrink-0">
                  <img
                    src={IMG_URL + chat.profile_image}
                    alt={chat.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {chat.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#4CAF50] rounded-full border-2 border-[#1e1e1e]"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="font-medium text-white truncate text-base">{chat.name}</h3>
                    {chat.lastMessageAt && (
                      <span className="text-sm text-[#8E8E93] flex-shrink-0">
                        {formatLastMessageTime(chat.lastMessageAt)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[#8E8E93] truncate">
                      {chat.lastMessage || 'No messages yet'}
                    </p>
                    {/* {chat.unreadCount && chat.unreadCount > 0 && (
                      <span className="bg-[#4CAF50] text-white text-xs font-medium rounded-full px-2 py-1 min-w-[20px] text-center">
                        {chat.unreadCount}
                      </span>
                    )} */}
                  </div>
                </div>
              </div>  
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;
