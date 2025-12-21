import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Send, Paperclip, Smile } from 'lucide-react';
import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';
import socket from '@/hooks/ConnectSocketIo';

interface MessageInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
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
      className="bg-black/20 backdrop-blur-md border-t border-white/10 px-4 py-4 flex-shrink-0 relative z-20"
    >
      <form onSubmit={onSendMessage} className="flex items-center space-x-3 max-w-5xl mx-auto">
        {/* Attachment Button */}
        <Button
          variant="ghost"
          size="sm"
          className="text-white/50 hover:text-white hover:bg-white/10 rounded-full p-2.5 transition-all duration-300"
          disabled={disabled}
          type="button"
        >
          <Paperclip className="w-5 h-5" />
        </Button>

        {/* Message Input */}
        <div className="flex-1 relative group">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={handleInputChange}
            placeholder="Type a message..."
            disabled={disabled}
            className="w-full bg-white/5 text-white placeholder:text-white/30 rounded-full px-5 py-3.5 pr-12 border border-white/5 focus:outline-none focus:border-white/20 focus:bg-white/10 focus:ring-1 focus:ring-white/10 transition-all duration-300 backdrop-blur-xl"
          />

          {/* Emoji Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white hover:bg-white/10 rounded-full p-2"
            disabled={disabled}
            type="button"
          >
            <Smile className="w-5 h-5" />
          </Button>
        </div>

        {/* Send Button */}
        <Button
          type="submit"
          disabled={!message.trim() || disabled}
          className={`rounded-full p-3.5 transition-all duration-300 shadow-lg ${message.trim() && !disabled
              ? 'bg-white hover:bg-white/90 text-black transform hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]'
              : 'bg-white/10 text-white/30 cursor-not-allowed'
            }`}
        >
          <Send className="w-5 h-5" />
        </Button>
      </form>
    </motion.div>
  );
};

export default MessageInput;
