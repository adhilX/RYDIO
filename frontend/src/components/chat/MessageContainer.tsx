import { AnimatePresence, motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import type { Imessage } from '@/Types/chat/Imessage';
import { findOrCreateChat } from '@/services/chat/chatService';
import type { Ichat } from '@/Types/chat/Ichat';
import toast from 'react-hot-toast';
import socket from '@/hooks/ConnectSocketIo';


const MessageContainer = () => {
  const { chatId } = useParams();
  
// Extract user IDs from chat ID (format: userId_ownerId)
const [userId, ownerId] = chatId?.split('_') || [];


const [message, setMessage] = useState('');
const messagesEndRef = useRef<HTMLDivElement>(null);
const inputRef = useRef<HTMLInputElement>(null);
const [isLoading,setIsLoading] = useState(false)
const [messages,setMessages] = useState<Imessage[]>([])
const [isTyping,setIsTyping] = useState(false)
const [user,setUser] = useState<Ichat>({ _id:'',lastMessage:'',lastMessageAt:new Date(),name:'',profile_image:'',isOnline:false })
 const roomId = userId + ownerId;
useEffect(() => {
  const fetchMessages = async () => {
    try {
      setIsLoading(true)
      const response = await findOrCreateChat(userId,ownerId)
      setUser(response.data);
      setIsLoading(false)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error('Error fetching messages:', error);
      setIsLoading(false)
      toast.error(errorMessage)
    }
  };
  fetchMessages();
},[])

useEffect(()=>{
  if(!socket.connected){
    socket.connect()
    console.log("connecting websocket")
  }
   socket.on('connected',(id)=>{
    console.log('socked connected',id)
    })
    // socket.emit('connection')
    socket.emit('join-room',{roomId})
    socket.on('recive-message',(data)=>{
      console.log(data)
      setMessages((prev)=>[...prev,data])
    })

    socket.on('typing',()=>{
      setIsTyping(true)
     })
     socket.on('stop typing',()=>{
      setIsTyping(false)
   })

   socket.on('err', (err)=>alert(err))

  return ()=>{
    socket.disconnect()
  }
},[roomId])
const handleSendMessage =()=>{
    socket.emit('send-message',message)
}



  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-400">Loading messages...</div>
      </div>
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
          isOnline: true,
          lastSeen: 'Online'
        }}
        onBackClick={() => window.history.back()}
        showBackButton={true}
      />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#212121] relative min-h-0 chat-scrollbar">
        {/* Date Separator */}
        <div className="flex justify-center my-6">
          <span className="bg-[#2f2f2f] text-[#8E8E93] text-sm px-4 py-2 rounded-full">
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex ${message.senderModel === 'user' ? 'justify-end' : 'justify-start'} mb-2`}
            >
              <div
                className={`max-w-[280px] lg:max-w-md px-4 py-3 rounded-3xl shadow-sm ${
                  message.senderModel === 'user'
                    ? 'bg-[#007AFF] text-white rounded-br-lg'
                    : 'bg-[#2f2f2f] text-white rounded-bl-lg'
                }`}
              >
                <p className="text-base leading-relaxed break-words">{message.messageContent}</p>
                <div className={`flex items-center justify-end mt-2 space-x-1 text-xs ${
                  message.senderModel === 'user' ? 'text-blue-200' : 'text-[#8E8E93]'
                }`}>
                  {message.senderModel === 'user' && (
                    <span className={`ml-1 ${message.seen ? 'text-blue-400' : ''}`}>
                      ✓
                    </span>
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
              <div className="bg-[#2f2f2f] text-white px-4 py-3 rounded-3xl rounded-bl-lg max-w-xs">
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
      />
    </div>
  );
};

export default MessageContainer;