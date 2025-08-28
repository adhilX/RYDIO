import { useState, useRef, useEffect } from 'react';
import { useParams} from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '../../components/user/Navbar';
import UserSidebar from '../../components/chat/UserSidebar';
import ChatHeader from '../../components/chat/ChatHeader';
import MessageContainer from '../../components/chat/MessageContainer';
import MessageInput from '../../components/chat/MessageInput';

// Dummy data
const dummyUsers = [
  {
    id: '1',
    name: 'John Smith',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    isOnline: true,
    lastMessage: 'Hey, is the car still available for rent?',
    lastMessageTime: new Date(Date.now() - 5 * 60 * 1000),
    unreadCount: 2
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    isOnline: false,
    lastMessage: 'Thanks for the smooth rental experience!',
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unreadCount: 0
  },
  {
    id: '3',
    name: 'Mike Wilson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    isOnline: true,
    lastMessage: 'Can we extend the rental by one more day?',
    lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
    unreadCount: 1
  },
  {
    id: '4',
    name: 'Emma Davis',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    isOnline: false,
    lastMessage: 'Perfect! See you tomorrow at 9 AM.',
    lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
    unreadCount: 0
  }
];

const dummyMessages: { [key: string]: any[] } = {
  '1': [
    {
      _id: 'm1',
      messageContent: 'Hi! I saw your Tesla Model 3 listing. Is it still available?',
      senderModel: 'owner',
      sendedTime: new Date(Date.now() - 60 * 60 * 1000),
      seen: true,
      messageType: 'text',
      chatId: '1',
      senderId: 'other'
    },
    {
      _id: 'm2',
      messageContent: 'Yes, it\'s available! When would you like to rent it?',
      senderModel: 'user',
      sendedTime: new Date(Date.now() - 55 * 60 * 1000),
      seen: true,
      messageType: 'text',
      chatId: '1',
      senderId: 'current-user'
    },
    {
      _id: 'm3',
      messageContent: 'Great! I need it for this weekend. Friday to Sunday.',
      senderModel: 'owner',
      sendedTime: new Date(Date.now() - 50 * 60 * 1000),
      seen: true,
      messageType: 'text',
      chatId: '1',
      senderId: 'other'
    },
    {
      _id: 'm4',
      messageContent: 'Hey, is the car still available for rent?',
      senderModel: 'owner',
      sendedTime: new Date(Date.now() - 5 * 60 * 1000),
      seen: false,
      messageType: 'text',
      chatId: '1',
      senderId: 'other'
    }
  ],
  '2': [
    {
      _id: 'm5',
      messageContent: 'Thank you so much for the Honda Civic rental!',
      senderModel: 'owner',
      sendedTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
      seen: true,
      messageType: 'text',
      chatId: '2',
      senderId: 'other'
    },
    {
      _id: 'm6',
      messageContent: 'You\'re welcome! Hope you had a great trip.',
      senderModel: 'user',
      sendedTime: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
      seen: true,
      messageType: 'text',
      chatId: '2',
      senderId: 'current-user'
    }
  ],
  '3': [
    {
      _id: 'm8',
      messageContent: 'Hi, I have your Audi A4 booked for today.',
      senderModel: 'owner',
      sendedTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      seen: true,
      messageType: 'text',
      chatId: '3',
      senderId: 'other'
    },
    {
      _id: 'm9',
      messageContent: 'Yes, it\'s ready for pickup. Location is as discussed.',
      senderModel: 'user',
      sendedTime: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
      seen: true,
      messageType: 'text',
      chatId: '3',
      senderId: 'current-user'
    }
  ]
};

const ChatLayout = () => {
  const { userId } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUser = userId ? dummyUsers.find(u => u.id === userId) : null;

  useEffect(() => {
    if (userId && dummyMessages[userId]) {
      setMessages(dummyMessages[userId]);
    } else {
      setMessages([]);
    }
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim() && currentUser) {
      const newMessage = {
        id: `m${Date.now()}`,
        text: message,
        sender: 'user',
        timestamp: new Date(),
        status: 'sent',
        type: 'text'
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleBackToSidebar = () => {
    setIsSidebarOpen(true);
  };

  return (
    <div className="h-screen bg-[#212121] text-white flex flex-col">
      <Navbar />
      <div className="flex-1 flex pt-16 relative overflow-hidden">
        {/* User Sidebar */}
        <UserSidebar 
          users={dummyUsers}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col bg-[#212121] h-full overflow-hidden ${
          currentUser && !isSidebarOpen ? 'block' : 'hidden lg:flex'
        }`}>
          <AnimatePresence mode="wait">
            {currentUser ? (
              <motion.div
                key={currentUser.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex flex-col h-full"
              >
                {/* Chat Header */}
                <ChatHeader 
                  user={{
                    id: currentUser.id,
                    name: currentUser.name,
                    avatar: currentUser.avatar,
                    isOnline: currentUser.isOnline,
                    lastSeen: currentUser.isOnline ? 'Online' : 'Last seen recently'
                  }}
                  onBackClick={handleBackToSidebar}
                  showBackButton={true}
                />

                {/* Message Area */}
                <MessageContainer 
                  messages={messages}
                  isTyping={isTyping}
                  ref={messagesEndRef}
                />

                {/* Message Input */}
                <MessageInput 
                  message={message}
                  setMessage={setMessage}
                  onSendMessage={handleSendMessage}
                  onKeyPress={handleKeyPress}
                  inputRef={inputRef}
                />
              </motion.div>
            ) : (
              /* No Chat Selected State */
              <motion.div
                key="no-chat"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col items-center justify-center bg-[#212121] px-4"
              >
                {/* Mobile menu button when no chat selected */}
                <div className="absolute top-4 left-4 lg:hidden">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-300 hover:text-white hover:bg-[#2f2f2f] rounded-full p-2"
                    onClick={() => setIsSidebarOpen(true)}
                  >
                    <Menu className="w-5 h-5" />
                  </Button>
                </div>

                <div className="text-center">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="w-32 h-32 bg-[#2f2f2f] rounded-full flex items-center justify-center mx-auto mb-8"
                  >
                    <MessageCircle className="w-16 h-16 text-[#8E8E93]" />
                  </motion.div>
                  <motion.h3 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="text-2xl font-medium text-white mb-3"
                  >
                    Welcome to RYDIO Chat
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="text-[#8E8E93] text-lg leading-relaxed max-w-md mx-auto"
                  >
                    Select a conversation to start chatting with vehicle owners and renters.
                  </motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
