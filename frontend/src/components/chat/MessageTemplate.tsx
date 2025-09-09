import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

function MessageTemplate() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col items-center justify-center bg-[#212121] px-4"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 flex justify-center"
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
  );
}

export default MessageTemplate;