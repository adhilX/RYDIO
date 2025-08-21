
import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, MoreVertical, Phone, Video, Search, MessageCircle, Users } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../Navbar';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'file';
}

interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  lastSeen: string;
  isOnline: boolean;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
}

function Chat() {
  const [selectedContactId, setSelectedContactId] = useState<string>('1');
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const contacts: ChatContact[] = [
    {
      id: '1',
      name: 'Rajesh Kumar',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      lastSeen: 'Active now',
      isOnline: true,
      lastMessage: 'Perfect! How do we proceed with the booking?',
      lastMessageTime: new Date(Date.now() - 300000),
      unreadCount: 0
    },
    {
      id: '2',
      name: 'Priya Sharma',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1c5?w=150&h=150&fit=crop&crop=face',
      lastSeen: '2 hours ago',
      isOnline: false,
      lastMessage: 'Thanks for the Honda Civic. Great experience!',
      lastMessageTime: new Date(Date.now() - 7200000),
      unreadCount: 2
    },
    {
      id: '3',
      name: 'Amit Patel',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      lastSeen: '1 day ago',
      isOnline: false,
      lastMessage: 'Is the BMW available for next week?',
      lastMessageTime: new Date(Date.now() - 86400000),
      unreadCount: 1
    },
    {
      id: '4',
      name: 'Sneha Reddy',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      lastSeen: 'Active now',
      isOnline: true,
      lastMessage: 'Can we extend the rental by one day?',
      lastMessageTime: new Date(Date.now() - 600000),
      unreadCount: 0
    },
    {
      id: '5',
      name: 'Vikram Singh',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      lastSeen: '3 hours ago',
      isOnline: false,
      lastMessage: 'Payment completed successfully',
      lastMessageTime: new Date(Date.now() - 10800000),
      unreadCount: 0
    }
  ];

  const chatMessages: Record<string, Message[]> = {
    '1': [
      {
        id: '1',
        text: 'Hey! I saw your Toyota Camry listing. Is it still available?',
        sender: 'user',
        timestamp: new Date(Date.now() - 3600000),
        status: 'read',
        type: 'text'
      },
      {
        id: '2',
        text: 'Yes, it\'s still available! When would you like to book it?',
        sender: 'other',
        timestamp: new Date(Date.now() - 3500000),
        status: 'read',
        type: 'text'
      },
      {
        id: '3',
        text: 'I need it for this weekend. Friday to Sunday. What\'s the total cost?',
        sender: 'user',
        timestamp: new Date(Date.now() - 3400000),
        status: 'read',
        type: 'text'
      },
      {
        id: '4',
        text: 'That would be ₹4,500 for 3 days. The car is in excellent condition and fully serviced.',
        sender: 'other',
        timestamp: new Date(Date.now() - 3300000),
        status: 'read',
        type: 'text'
      },
      {
        id: '5',
        text: 'Perfect! How do we proceed with the booking?',
        sender: 'user',
        timestamp: new Date(Date.now() - 300000),
        status: 'delivered',
        type: 'text'
      }
    ],
    '2': [
      {
        id: '6',
        text: 'Hi! I just returned the Honda Civic. Everything went smoothly.',
        sender: 'other',
        timestamp: new Date(Date.now() - 7300000),
        status: 'read',
        type: 'text'
      },
      {
        id: '7',
        text: 'Thanks for the Honda Civic. Great experience!',
        sender: 'other',
        timestamp: new Date(Date.now() - 7200000),
        status: 'read',
        type: 'text'
      }
    ],
    '3': [
      {
        id: '8',
        text: 'Is the BMW available for next week?',
        sender: 'other',
        timestamp: new Date(Date.now() - 86400000),
        status: 'read',
        type: 'text'
      }
    ],
    '4': [
      {
        id: '9',
        text: 'Can we extend the rental by one day?',
        sender: 'other',
        timestamp: new Date(Date.now() - 600000),
        status: 'read',
        type: 'text'
      }
    ],
    '5': [
      {
        id: '10',
        text: 'Payment completed successfully',
        sender: 'other',
        timestamp: new Date(Date.now() - 10800000),
        status: 'read',
        type: 'text'
      }
    ]
  };

  const [messages, setMessages] = useState<Message[]>(chatMessages[selectedContactId] || []);
  const selectedContact = contacts.find(c => c.id === selectedContactId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages(chatMessages[selectedContactId] || []);
  }, [selectedContactId]);

  const handleContactSelect = (contactId: string) => {
    setSelectedContactId(contactId);
    setNewMessage('');
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'user',
        timestamp: new Date(),
        status: 'sent',
        type: 'text'
      };
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Simulate typing indicator
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        // Simulate response
        const response: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Thanks for your message! I\'ll get back to you shortly.',
          sender: 'other',
          timestamp: new Date(),
          status: 'sent',
          type: 'text'
        };
        setMessages(prev => [...prev, response]);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return '✓';
      case 'delivered':
        return '✓✓';
      case 'read':
        return <span className="text-blue-400">✓✓</span>;
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white pt-20">
      <Navbar />
      <div className="container mx-auto px-4 py-6 h-screen flex max-w-7xl">
        {/* Left Sidebar - Contacts List */}
        <div className="w-1/3 pr-4">
          <Card className="bg-gray-800/80 border-gray-700 backdrop-blur-sm h-full">
            <CardHeader className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Messages
                </h2>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 h-full overflow-y-auto">
              <div className="space-y-1">
                {contacts.map((contact) => (
                  <motion.div
                    key={contact.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleContactSelect(contact.id)}
                    className={`p-4 cursor-pointer transition-colors border-b border-gray-700/50 ${
                      selectedContactId === contact.id 
                        ? 'bg-blue-600/20 border-l-4 border-l-blue-500' 
                        : 'hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative flex-shrink-0">
                        <img
                          src={contact.avatar}
                          alt={contact.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
                        />
                        {contact.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-white truncate">{contact.name}</h3>
                          {contact.lastMessageTime && (
                            <span className="text-xs text-gray-400 flex-shrink-0">
                              {formatLastMessageTime(contact.lastMessageTime)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm text-gray-400 truncate">
                            {contact.lastMessage || 'No messages yet'}
                          </p>
                          {contact.unreadCount && contact.unreadCount > 0 && (
                            <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                              {contact.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Chat Interface */}
        <div className="flex-1 flex flex-col">
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <Card className="bg-gray-800/80 border-gray-700 backdrop-blur-sm mb-4">
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={selectedContact.avatar}
                          alt={selectedContact.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
                        />
                        {selectedContact.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{selectedContact.name}</h3>
                        <p className="text-sm text-gray-400">{selectedContact.lastSeen}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <Phone className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <Video className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <Search className="w-5 h-5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Messages Container */}
              <Card className="flex-1 bg-gray-800/80 border-gray-700 backdrop-blur-sm mb-4 overflow-hidden">
                <CardContent className="p-0 h-full flex flex-col">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <AnimatePresence>
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                              message.sender === 'user'
                                ? 'bg-blue-600 text-white rounded-br-md'
                                : 'bg-gray-700 text-gray-100 rounded-bl-md'
                            }`}
                          >
                            <p className="text-sm">{message.text}</p>
                            <div className={`flex items-center justify-end mt-1 space-x-1 text-xs ${
                              message.sender === 'user' ? 'text-blue-200' : 'text-gray-400'
                            }`}>
                              <span>{formatTime(message.timestamp)}</span>
                              {message.sender === 'user' && (
                                <span className="ml-1">{getStatusIcon(message.status)}</span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    {/* Typing Indicator */}
                    <AnimatePresence>
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex justify-start"
                        >
                          <div className="bg-gray-700 text-gray-100 px-4 py-2 rounded-2xl rounded-bl-md max-w-xs">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                  </div>
                </CardContent>
              </Card>

              {/* Message Input */}
              <Card className="bg-gray-800/80 border-gray-700 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <Paperclip className="w-5 h-5" />
                    </Button>
                    <div className="flex-1 relative">
                      <input
                        ref={inputRef}
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="w-full bg-gray-700 border border-gray-600 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <Smile className="w-5 h-5" />
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            /* No Chat Selected State */
            <div className="flex-1 flex items-center justify-center">
              <Card className="bg-gray-800/80 border-gray-700 backdrop-blur-sm p-8 text-center">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Select a conversation</h3>
                <p className="text-gray-400">Choose a contact from the list to start messaging</p>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;