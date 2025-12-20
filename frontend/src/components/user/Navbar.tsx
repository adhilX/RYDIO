/* eslint-disable react-hooks/exhaustive-deps */

import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { Bell, Car, MessageCircle, User, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useCurrentLocation } from '@/hooks/UseLocation';
import { useEffect, useState } from 'react';
import { setLocation } from '@/store/slice/user/locationSlice';
import NotificationModal from './NotificationModal';
import { getUnreadCount } from '../../services/notificationService';


function Navbar() {
  const token = useSelector((state: RootState) => state.userToken.userToken);
  const user = useSelector((state: RootState) => state.auth.user)
  const navigate = useNavigate()
  const { location, error } = useCurrentLocation();
  const dispatch = useDispatch()
  const notification = useSelector((state: RootState) => state.notification.notification)
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const fetchUnreadCount = async (userId: string) => {
    console.log(userId)
    try {
      const count = await getUnreadCount(userId);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (location) {
      console.log("User Location:", location);
      dispatch(setLocation(location))
    }
    if (error) console.log(error)
  }, [location]);

  useEffect(() => {
    if (user) fetchUnreadCount(user._id);
  }, [token, notification]);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled || isMobileMenuOpen
        ? 'bg-black/80 backdrop-blur-md shadow-lg border-b border-white/10'
        : 'bg-transparent'
      }`}>
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div onClick={() => navigate('/')} className="flex items-center cursor-pointer space-x-2 z-50">
            <Car className="text-white animate-bounce" size={32} />
            <span className="text-2xl font-bold text-white">RYDIO</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-4">
              {token && user ? (
                <>
                  <button
                    onClick={() => {
                      setIsNotificationModalOpen(!isNotificationModalOpen);
                      if (!isNotificationModalOpen) {
                        fetchUnreadCount(user._id);
                      }
                    }}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors relative"
                    title="Notifications"
                  >
                    <Bell size={20} className="text-white" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </button>
                  <Link to="/chat">
                    <button className="p-2 rounded-full hover:bg-white/10 transition-colors" title="Chat">
                      <MessageCircle size={20} className="text-white" />
                    </button>
                  </Link>
                  <Link to="/userProfile">
                    <button className="p-2 rounded-full hover:bg-white/10 transition-colors" title="Profile">
                      <User size={20} className="text-white" />
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/signup">
                    <span className="text-white hover:text-gray-300 transition-colors font-medium">Signup</span>
                  </Link>
                  <Link to="/login">
                    <span className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-all font-medium">Login</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden z-50 text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Overlay */}
        <div className={`
          fixed inset-0 bg-black/95 backdrop-blur-xl z-40 transition-transform duration-300 ease-in-out md:hidden flex flex-col items-center justify-center space-y-8
          ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          {token && user ? (
            <>
              <Link to="/userProfile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-3 text-white text-xl hover:text-gray-300">
                <User size={24} />
                <span>Profile</span>
              </Link>
              <Link to="/chat" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-3 text-white text-xl hover:text-gray-300">
                <MessageCircle size={24} />
                <span>Chat</span>
              </Link>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsNotificationModalOpen(true);
                  fetchUnreadCount(user._id);
                }}
                className="flex items-center space-x-3 text-white text-xl hover:text-gray-300 relative"
              >
                <Bell size={24} />
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2">
                    {unreadCount}
                  </span>
                )}
              </button>
            </>
          ) : (
            <>
              <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="text-white text-xl font-medium">
                Signup
              </Link>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="bg-white text-black px-8 py-3 rounded-xl font-medium text-lg">
                Login
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Notification Modal */}
      {user && <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        onNotificationUpdate={() => fetchUnreadCount(user?._id)}
      />}
    </header>
  );
}

export default Navbar;
