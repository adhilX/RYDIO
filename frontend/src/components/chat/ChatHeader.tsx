import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Phone, MoreVertical, ArrowLeft } from 'lucide-react';

interface ChatHeaderProps {
  user: {
    id: string;
    name: string;
    avatar: string;
    isOnline: boolean;
    lastSeen: string;
  } | null;
  onBackClick?: () => void;
  showBackButton?: boolean;
}

const ChatHeader = ({ user, onBackClick, showBackButton = false }: ChatHeaderProps) => {
  if (!user) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-[#1e1e1e] border-b border-[#2f2f2f] px-4 py-3 flex items-center justify-between flex-shrink-0"
    >
      <div className="flex items-center space-x-3">
        {/* Back button for mobile */}
        {showBackButton && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-300 hover:text-white hover:bg-[#2f2f2f] rounded-full p-2 lg:hidden"
            onClick={onBackClick}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="relative"
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          {user.isOnline && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2, delay: 0.4 }}
              className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#4CAF50] rounded-full border-2 border-[#1e1e1e]"
            />
          )}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <h3 className="font-medium text-white text-base">{user.name}</h3>
          <p className="text-sm text-[#8E8E93]">{user.lastSeen}</p>
        </motion.div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="flex items-center space-x-2"
      >
        <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-[#2f2f2f] rounded-full p-2">
          <Phone className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-[#2f2f2f] rounded-full p-2">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default ChatHeader;
