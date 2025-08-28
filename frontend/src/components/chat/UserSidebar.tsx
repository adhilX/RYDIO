import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
}

interface UserSidebarProps {
  users: User[];
  isOpen: boolean;
  onClose: () => void;
}

const formatLastMessageTime = (date: Date) => {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    return diffInMinutes < 1 ? 'now' : `${diffInMinutes}m`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
  }
};

const UserSidebar = ({ users, isOpen, onClose }: UserSidebarProps) => {
  const navigate = useNavigate();
  const { userId } = useParams();

  const handleUserSelect = (user: User) => {
    navigate(`/chat/${user.id}`);
    onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
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
          {users.map((user) => (
            <motion.div
              key={user.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleUserSelect(user)}
              className={`px-4 py-3 cursor-pointer transition-colors duration-150 border-b border-[#2f2f2f]/30 ${
                userId === user.id
                  ? 'bg-[#2f2f2f]'
                  : 'hover:bg-[#2a2a2a] active:bg-[#2f2f2f]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative flex-shrink-0">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {user.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#4CAF50] rounded-full border-2 border-[#1e1e1e]"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="font-medium text-white truncate text-base">{user.name}</h3>
                    {user.lastMessageTime && (
                      <span className="text-sm text-[#8E8E93] flex-shrink-0">
                        {formatLastMessageTime(user.lastMessageTime)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[#8E8E93] truncate">
                      {user.lastMessage || 'No messages yet'}
                    </p>
                    {user.unreadCount && user.unreadCount > 0 && (
                      <span className="bg-[#4CAF50] text-white text-xs font-medium rounded-full px-2 py-1 min-w-[20px] text-center">
                        {user.unreadCount}
                      </span>
                    )}
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

export default UserSidebar;
