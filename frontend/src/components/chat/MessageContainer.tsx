import { AnimatePresence } from 'framer-motion'
import { motion } from 'framer-motion'
import { forwardRef } from 'react'
import type { Imessage } from '../../Types/chat/Imessage'
import { formatTime, getStatusIcon } from '../../utils/chatUtils'

interface MessageContainerProps {
  messages: Imessage[];
  isTyping: boolean;
}

const MessageContainer = forwardRef<HTMLDivElement, MessageContainerProps>(({ messages, isTyping }, ref) => {
    
  return (
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
              <span>{formatTime(message.sendedTime)}</span>
              {message.senderModel === 'user' && (
                <span className={`ml-1 ${message.seen ? 'text-blue-400' : ''}`}>
                  {getStatusIcon(message.seen ? 'read' : 'sent')}
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
    <div ref={ref} />
  </div>
  )
});

MessageContainer.displayName = 'MessageContainer';

export default MessageContainer