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

const ChatSidebar = ({ isOpen, onClose }: UserSidebarProps) => {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?._id;
  const [chatUsers, setChatUsers] = useState<Ichat[]>([]);
  const { shouldRefetchSidebar, resetSidebarRefetch } = useChatContext();

  const currentChatUserId = chatId ? chatId.split('_').find(id => id !== userId) : null;

  const handleUserSelect = (id: string) => {
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

    console.log('Emitting user-online for userId:', userId);
    socket.emit('user-online', userId);

    // Listen for user status changes
    const handleUserStatusChange = ({ userId: changedUserId, isOnline }: { userId: string, isOnline: boolean }) => {
      setChatUsers(prev => {
        const updated = prev.map(chat =>
          chat._id === changedUserId
            ? { ...chat, isOnline }
            : chat
        );
        console.log('Updated chat users:', updated);
        return updated;
      });
    };

    // Listen for socket connection
    const handleConnect = () => {
      console.log('Socket connected, re-emitting user-online');
      socket.emit('user-online', userId);
    };

    socket.on('connect', handleConnect);
    socket.on('user-status-changed', handleUserStatusChange);

    return () => {
      socket.off('connect', handleConnect);
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
        w-full bg-black/20 backdrop-blur-3xl flex flex-col z-50 h-full
        lg:w-80 lg:relative lg:translate-x-0 lg:border-r lg:border-white/10
        fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="px-5 py-5 border-b border-white/10 bg-transparent flex-shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white tracking-tight">Messages</h1>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all duration-300">
                <Search className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-full p-2 lg:hidden transition-all duration-300"
                onClick={onClose}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
          {chatUsers.map((chat) => (
            <motion.div
              key={chat._id}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleUserSelect(chat._id!)}
              className={`px-4 py-4 cursor-pointer transition-all duration-300 rounded-2xl border border-transparent relative group ${currentChatUserId === chat._id
                  ? 'bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] border-white/5'
                  : 'hover:bg-white/5 hover:border-white/5'
                }`}
            >
              {/* Active indicator dot */}
              {currentChatUserId === chat._id && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
              )}
              <div className="flex items-center space-x-4">
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-transparent via-white/20 to-transparent group-hover:via-white/40 transition-all duration-500">
                    <img
                      src={IMG_URL + chat.profile_image}
                      alt={chat.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  {chat.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-black shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-semibold text-base truncate transition-colors duration-300 ${currentChatUserId === chat._id ? 'text-white' : 'text-gray-200 group-hover:text-white'}`}>
                      {chat.name}
                    </h3>
                    {chat.lastMessageAt && (
                      <span className="text-xs text-white/40 flex-shrink-0">
                        {formatLastMessageTime(chat.lastMessageAt)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className={`text-sm truncate transition-colors duration-300 ${currentChatUserId === chat._id ? 'text-white/60' : 'text-gray-500 group-hover:text-gray-400'}`}>
                      {chat.lastMessage || 'No messages yet'}
                    </p>
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
