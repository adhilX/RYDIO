/* eslint-disable react-hooks/exhaustive-deps */

import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { Bell, Car, MessageCircle, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useCurrentLocation } from '@/hooks/UseLocation';
import { useEffect, useState } from 'react';
import { setLocation } from '@/store/slice/user/locationSlice';
import NotificationModal from './NotificationModal';
import { getUnreadCount } from '../../services/notificationService';


function Navbar() {
  const token = useSelector((state: RootState) => state.userToken.userToken);
  const user = useSelector((state:RootState)=>state.auth.user)
  const navigate = useNavigate()
  const { location, error } = useCurrentLocation();
  const dispatch = useDispatch()
  const notification = useSelector((state:RootState)=>state.notification.notification)
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  if(!user)return null
  
  const fetchUnreadCount = async (userId:string) => {
    console.log( userId)
      try {
        const count = await getUnreadCount(userId);
        setUnreadCount(count);
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
  };

  useEffect(() => {
    if (location) {
      console.log("User Location:", location);
      dispatch(setLocation(location))
    }
    if (error) console.log(error)
  }, [location]);

  useEffect(() => {
    fetchUnreadCount(user._id);
  }, [token,notification]);

  return (
    <header className="absolute top-0  w-full z-50 p-6">
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        <div onClick={() => navigate('/')} className="flex items-center cursor-pointer mr-15 space-x-2 ">
          <Car className="text-white animate-bounce" size={32} />
          <span className="text-2xl font-bold text-white">RYDIO</span>
        </div>
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-4">
            {token ? (
              <>
                <button 
                  onClick={() => {
                    setIsNotificationModalOpen(!isNotificationModalOpen);
                    if (!isNotificationModalOpen) {
                      fetchUnreadCount(user._id);
                    }
                  }}
                  className="p-2 rounded-full hover:bg-gray-800 transition-colors relative" 
                  title="Notifications"
                >
                  <Bell size={20} className="text-white" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
                <Link to="/chat">
                <button className="p-2 rounded-full hover:bg-gray-800 transition-colors" title="chat">
                  <MessageCircle size={20} className="text-white" />
                </button>
                </Link>
                <Link to="/userProfile">
                  <button className="p-2 rounded-full hover:bg-gray-800 transition-colors" title="Profile">
                    <User size={20} className="text-white" />
                  </button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/signup">
                  <p className="text-white hover:underline">Signup</p>
                </Link>
                <Link to="/login">
                  <p className="text-white hover:underline">Login</p>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      
      {/* Notification Modal */}
      <NotificationModal 
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        onNotificationUpdate={() => fetchUnreadCount(user?._id)}
      />
    </header>
  );
}

export default Navbar;
