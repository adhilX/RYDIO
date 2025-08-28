import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Send, Paperclip, Smile } from 'lucide-react';
import type { RefObject } from 'react';

interface MessageInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  disabled?: boolean;
}

const MessageInput = ({ 
  message, 
  setMessage, 
  onSendMessage, 
  onKeyPress, 
  inputRef,
  disabled = false 
}: MessageInputProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-[#1e1e1e] border-t border-[#2f2f2f] px-4 py-3 flex-shrink-0"
    >
      <div className="flex items-center space-x-3">
        {/* Attachment Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-400 hover:text-white hover:bg-[#2f2f2f] rounded-full p-2"
          disabled={disabled}
        >
          <Paperclip className="w-5 h-5" />
        </Button>

        {/* Message Input */}
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={onKeyPress}
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
          >
            <Smile className="w-4 h-4" />
          </Button>
        </div>

        {/* Send Button */}
        <Button 
          onClick={onSendMessage}
          disabled={!message.trim() || disabled}
          className={`rounded-full p-3 transition-all duration-200 ${
            message.trim() && !disabled
              ? 'bg-[#007AFF] hover:bg-[#0056CC] text-white' 
              : 'bg-[#2f2f2f] text-gray-500 cursor-not-allowed'
          }`}
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  );
};

export default MessageInput;
