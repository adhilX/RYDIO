import { motion } from 'framer-motion';
import BlurText from '../common/BlurText';

function MessageTemplate() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="flex-1 flex flex-col items-center justify-center bg-transparent px-4 relative z-10"
    >
      <div className="text-center space-y-8">


        <div className="space-y-4 max-w-lg mx-auto">
          <div className="flex justify-center">
            <BlurText
              text="Welcome to RYDIO Chat"
              className="text-3xl font-bold text-white tracking-tight text-center justify-center"
              delayStep={0.05}
            />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="text-white/40 text-lg leading-relaxed font-light"
          >
            Select a conversation from the sidebar to start chatting with vehicle owners and renters.
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}

export default MessageTemplate;