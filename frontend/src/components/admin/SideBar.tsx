import { removeToken } from '@/store/slice/admin/AdminTokenSlice';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  // BarChart3, 
  // Settings, 
  Menu,
  X,
  Home,
  LogOut
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onLogout?: () => void; // Optional logout handler
}


const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, path: "/admin" },
  { id: 'users', label: 'User Management', icon: Users, path: "/admin/users" },
  // { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  // { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ currentPage, onPageChange, isCollapsed, onToggleCollapse, onLogout }: SidebarProps) {
  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 }
  };
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const itemVariants = {
    expanded: { opacity: 1, x: 0 },
    collapsed: { opacity: 0, x: -20 }
  };
  const handleLogout = ()=>{
    dispatch(removeToken())
  }

  return (
    <motion.div
      className="bg-black border-r border-gray-800 flex flex-col h-screen relative z-50"
      variants={sidebarVariants}
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.h1
                className="text-xl font-bold text-white"
                variants={itemVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                transition={{ duration: 0.2 }}
              >
                Admin Panel
              </motion.h1>
            )}
          </AnimatePresence>
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              {isCollapsed ? <Menu size={20} color="#fff" /> : <X size={20} color="#fff" />}
            </motion.div>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => {
                onPageChange(item.id);
                navigate(item.path);
              }}
              className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${isActive
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-400 hover:bg-gray-800'
                }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon size={20} color={isActive ? "#fff" : "#9ca3af"} />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    className="ml-3 font-medium"
                    variants={itemVariants}
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-800 mt-auto">
        <motion.button
          onClick={onLogout}
          className="w-full flex items-center p-3 rounded-lg text-gray-400 hover:bg-gray-800 transition-all duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut size={20} color="#9ca3af" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                className="ml-3 font-medium"
                variants={itemVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                transition={{ duration: 0.2 }}
                onClick={handleLogout}
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
}
