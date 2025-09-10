import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Send, Paperclip, Smile } from 'lucide-react';
import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';
import socket from '@/hooks/ConnectSocketIo';

interface MessageInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSendMessage: (e:React.FormEvent) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  disabled?: boolean;
  roomId: string;
}

const MessageInput = ({ 
  message, 
  setMessage, 
  onSendMessage, 
  inputRef,
  disabled = false,
  roomId
}: MessageInputProps) => {
  const typingTimeoutRef = useRef<number | null>(null);
  const isTypingRef = useRef(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    
    // Emit typing event if not already typing
    if (!isTypingRef.current) {
      socket.emit('typing', { roomId });
      isTypingRef.current = true;
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing after 1 second of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop-typing', { roomId });
      isTypingRef.current = false;
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-[#1e1e1e] border-t border-[#2f2f2f] px-4 py-3 flex-shrink-0"
    >
      <form onSubmit={onSendMessage} className="flex items-center space-x-3">
        {/* Attachment Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-400 hover:text-white hover:bg-[#2f2f2f] rounded-full p-2"
          disabled={disabled}
          type="button"
        >
          <Paperclip className="w-5 h-5" />
        </Button>

        {/* Message Input */}
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={handleInputChange}
            placeholder="Type a message..."
            disabled={disabled}
            className="w-full bg-[#2f2f2f] text-white placeholder-[#8E8E93] rounded-full px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:bg-[#3a3a3a] transition-all duration-200"
          />
          
          {/* Emoji Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white hover:bg-[#4a4a4a] rounded-full p-1.5"
            disabled={disabled}
            type="button"
          >
            <Smile className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Send Button */}
        <Button 
          type="submit"
          disabled={!message.trim() || disabled}
          className={`rounded-full p-3 transition-all duration-200 ${
            message.trim() && !disabled
              ? 'bg-[#007AFF] hover:bg-[#0056CC] text-white' 
              : 'bg-[#2f2f2f] text-gray-500 cursor-not-allowed'
          }`}
        >
          <Send className="w-5 h-5" />
        </Button>
      </form>
    </motion.div>
  );
};

export default MessageInput;
