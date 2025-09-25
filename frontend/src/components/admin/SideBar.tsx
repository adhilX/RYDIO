import { removeToken } from '@/store/slice/admin/AdminTokenSlice';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  // BarChart3, 
  // Settings, 
  Menu,
  Home,
  LogOut,
  Car,
  MessageCircleWarning,
  Wallet,
  Flag
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
  { id: 'vehicle', label: 'vehicle Management', icon: Car, path:'/admin/vehicle' },
  { id: 'vehicle_requests', label: 'vehicle Requests', icon:MessageCircleWarning, path:'/admin/vehicle_requests'},
  { id: 'idproof-requests', label: 'ID proof Requests', icon:MessageCircleWarning, path:'/admin/idproof-requests'},
  {id:'bookings',label:'Bookings',icon:MessageCircleWarning,path:'/admin/bookings'},
  {id:'wallet',label:'Wallet',icon:Wallet,path:'/admin/wallet'},
  {id:'reports',label:'Reports',icon:Flag,path:'/admin/reports'}
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
      className="bg-black/90 backdrop-blur-xl border-r border-[#e63946]/30 shadow-2xl flex flex-col h-screen fixed left-0 top-0 z-50 rounded-r-2xl"
      variants={sidebarVariants}
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Header */}
      <div className="p-4 border-b border-black/60">
        <div className="flex items-center justify-between">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.h1
                className="text-xl font-bold text-[#e63946] tracking-wider drop-shadow"
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
            className="p-2 rounded-lg hover:bg-black/60 transition-colors"
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              <Menu size={20} color="#fff" />
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
              className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 font-semibold text-base group relative
                ${isActive
                  ? 'bg-[#e63946]/30 text-[#e63946] shadow-lg ring-2 ring-[#e63946] scale-105 border-l-4 border-[#e63946]'
                  : 'text-gray-400 hover:bg-black/60 hover:text-[#e63946]'}
              `}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon size={22} color={isActive ? "#e63946" : "#9ca3af"} className="transition-all duration-200" />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    className="ml-3 font-medium tracking-wide"
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
              {isActive && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#e63946] rounded-full shadow-lg animate-pulse" />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-black/60 mt-auto">
        <motion.button
          onClick={onLogout}
          className="w-full flex items-center p-3 rounded-xl text-[#e63946] hover:bg-black/60 hover:text-white transition-all duration-200 font-semibold border-t border-[#e63946]/20"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut size={22} color="#e63946" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                className="ml-3 font-medium tracking-wide"
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
