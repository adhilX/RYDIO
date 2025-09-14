import { AnimatePresence, motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import type { Imessage } from '@/Types/chat/Imessage';
import { findOrCreateChat, getMessages } from '@/services/chat/chatService';
import type { Ichat } from '@/Types/chat/Ichat';
import toast from 'react-hot-toast';
import socket from '@/hooks/ConnectSocketIo';
import LoadingSpinner from '../LoadingSpinner';
import { useChatContext } from '@/contexts/ChatContext';


const MessageContainer = () => {
  const { chatId} = useParams();
  
// Extract user IDs from chat ID (format: userId_ownerId)
const [userId, ownerId] = chatId?.split('_') || [];


const [message, setMessage] = useState('');
const messagesEndRef = useRef<HTMLDivElement>(null);
const inputRef = useRef<HTMLInputElement>(null);
const [isLoading,setIsLoading] = useState(false)
const [messages,setMessages] = useState<Imessage[]>([])
const [isTyping,setIsTyping] = useState(false)
const [user,setUser] = useState<Ichat>({ _id:'',lastMessage:'',lastMessageAt:new Date(),name:'',profile_image:'',isOnline:false })
const [isUserOnline, setIsUserOnline] = useState(false)
const { triggerSidebarRefetch } = useChatContext()
// const [chatEnabled] = useState<boolean | null>(null)
// const [chatMessage] = useState('')
 // Create consistent room ID by sorting user IDs
 const sortedIds = [userId, ownerId].sort();
 const roomId = sortedIds[0] + sortedIds[1];
useEffect(() => {
  const fetchMessages = async () => {
    try {
      setIsLoading(true)
      
      // Check if chat is enabled before loading messages
      // const chatEligibility = await anableChat(ownerId,userId)
      // setChatEnabled(chatEligibility.data.canChat)
      // setChatMessage(chatEligibility.data.message)
      
      // if (!chatEligibility.data.canChat) {
      //   setIsLoading(false)
      //   return
      // }
      
      const response = await findOrCreateChat(userId,ownerId)
      setUser(response.data);
      console.log('user',user)
      const chats = await getMessages(response.data._id)
      setMessages(chats.data.messages)
      setIsLoading(false)
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error('Error fetching messages:', error);
      setIsLoading(false)
      toast.error(errorMessage)
    }
  };
  fetchMessages();
},[chatId])

useEffect(()=>{
  if(!socket.connected){
    socket.connect()
  }

  const handleConnected = (id: string) => {
    console.log('socked connected', id)
  }

  const handleReceiveMessage = (data: any) => {
    setMessages((prev) => [...prev, data])
    triggerSidebarRefetch() // Refetch sidebar when receiving a message
  }

  const handleTyping = () => {
    setIsTyping(true)
  }

  const handleStopTyping = () => {
    setIsTyping(false)
  }

  const handleUserStatusChange = ({ userId: changedUserId, isOnline }: { userId: string, isOnline: boolean }) => {
    if (changedUserId === ownerId) {
      setIsUserOnline(isOnline);
    }
  }

  // Add event listeners
  socket.on('connected', handleConnected)
  socket.on('recive-message', handleReceiveMessage)
  socket.on('typing', handleTyping)
  socket.on('stop-typing', handleStopTyping)
  socket.on('user-status-changed', handleUserStatusChange)

  // Join room
  socket.emit('join-room', {roomId})

  return () => {
    socket.off('connected', handleConnected)
    socket.off('recive-message', handleReceiveMessage)
    socket.off('typing', handleTyping)
    socket.off('stop-typing', handleStopTyping)
    socket.off('user-status-changed', handleUserStatusChange)
  }
},[roomId])

// Auto-scroll to bottom when messages change
useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages,isTyping]);

const handleSendMessage =(e:React.FormEvent)=>{

  e.preventDefault()
    if (!message.trim()) return;
    
    const newMessage: Imessage = {
        _id:'',
        chatId: user._id!,
        messageContent: message,
        senderId: userId,
        senderModel: 'user',
        seen: false,
        sendedTime: new Date(),
        messageType: 'text'
    };
    
    // Send message with receiverId for room identification
    socket.emit('send-message', { ...newMessage, receiverId: ownerId })
    setMessages((prev)=>[...prev, newMessage])
    setMessage('')
    triggerSidebarRefetch() // Refetch sidebar when sending a message
}



  if (isLoading) {
    return (
      <LoadingSpinner/>
    );
  }


  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <ChatHeader 
        user={{
          _id: user._id||'',
          name: user.name,
          avatar: user.profile_image,
          isOnline: isUserOnline,
          lastSeen: isUserOnline ? 'Online' : 'Offline'
        }}
        onBackClick={() => window.history.back()}
        showBackButton={true}
      />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#212121] relative min-h-0 chat-scrollbar">
        
        <AnimatePresence>
          {messages.map((message, index) => {
            const messageDate = new Date(message.sendedTime);
            const prevMessage = index > 0 ? messages[index - 1] : null;
            const prevMessageDate = prevMessage ? new Date(prevMessage.sendedTime) : null;
            
            const showDateSeparator = !prevMessage || 
              messageDate.toDateString() !== prevMessageDate?.toDateString();
            
            return (
              <div key={message._id}>
                {/* Date Separator */}
                {showDateSeparator && (
                  <div className="flex justify-center my-6">
                    <span className="bg-[#2f2f2f] text-[#8E8E93] text-sm px-4 py-2 rounded-full">
                      {messageDate.toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                )}
                
                {/* Message */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex ${message.senderId === userId ? 'justify-end' : 'justify-start'} mb-2`}
                >
                  <div
                    className={`max-w-[280px] lg:max-w-md px-4 py-3 rounded-3xl shadow-sm ${
                      message.senderId === userId
                        ? 'bg-[#007AFF] text-white rounded-br-lg'
                        : 'bg-[#2f2f2f] text-white rounded-bl-lg'
                    }`}
                  >
                    <p className="text-base leading-relaxed break-words">{message.messageContent}</p>
                    <div className={`flex items-center justify-end mt-2 space-x-1 text-xs ${
                      message.senderId === userId ? 'text-blue-200' : 'text-[#8E8E93]'
                    }`}>
                      <span>
                        {messageDate.toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit',
                          hour12: true 
                        })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
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
              <div className="bg-[#2f2f2f] text-white px-6 py-5 rounded-3xl rounded-bl-lg max-w-xs">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-[#8E8E93] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#8E8E93] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-[#8E8E93] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput 
        message={message}
        setMessage={setMessage}
        onSendMessage={handleSendMessage}
        inputRef={inputRef}
        disabled={isLoading}
        roomId={roomId}
      />
    </div>
  );
};

export default MessageContainer;