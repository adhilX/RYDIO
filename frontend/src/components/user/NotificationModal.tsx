import React, { useEffect, useState } from 'react';
import { X, Car, MessageCircle, AlertTriangle, Trash2 } from 'lucide-react';
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, deleteAllNotifications } from '@/services/notificationService';
import type { Notification } from '@/Types/NotificationType';
import type { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { Spinner } from "@/components/ui/spinner";
const IMG_URL = import.meta.env.VITE_IMAGE_URL;
interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotificationUpdate?: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose, onNotificationUpdate }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (isOpen && user?._id) {
      fetchNotifications();
    }
  }, [isOpen, user]);

  const fetchNotifications = async () => {
    if (!user?._id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getUserNotifications(user._id);
      setNotifications(data);
    } catch (err) {
      setError('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notification =>
          notification._id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
      onNotificationUpdate?.();
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user?._id) return;
    try {
      await markAllNotificationsAsRead(user._id);
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
      onNotificationUpdate?.();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await deleteNotification(notificationId);
      setNotifications(prev =>
        prev.filter(notification => notification._id !== notificationId)
      );
      onNotificationUpdate?.();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleDeleteAllNotifications = async () => {
    if (!user?._id) return;
    try {
      await deleteAllNotifications(user._id);
      setNotifications([]);
      onNotificationUpdate?.();
    } catch (error) {
      console.error('Error deleting all notifications:', error);
    }
  };

  const getNotificationIcon = (senderModel: string) => {
    switch (senderModel) {
      case 'user':
        return <MessageCircle className="w-5 h-5 text-blue-400" />;
      case 'owner':
        return <Car className="w-5 h-5 text-green-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-orange-400" />;
    }
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} h ago`;
    return `${Math.floor(diffInMinutes / 1440)} d ago`;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 right-0 z-50">
      {/* Backdrop for mobile */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-[1px] sm:hidden" onClick={onClose} />

      {/* Modal */}
      <div className="absolute top-20 right-4 sm:right-8 w-[90vw] sm:w-96 bg-black/80 backdrop-blur-2xl rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 transform transition-all duration-300 ease-out animate-in slide-in-from-top-2 fade-in-0 overflow-hidden ring-1 ring-white/5">

        {/* Glow Effect */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/5 relative z-10">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-bold text-white tracking-wide">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5 border border-white/10 shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                {unreadCount} NEW
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors duration-200 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {loading ? (
            <div className="p-8 text-center text-gray-400">
              <Spinner size="md" className="mx-auto mb-4 border-white/20 border-t-white" />
              <p className="text-sm">Loading...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-400">
              <AlertTriangle className="w-8 h-8 mx-auto mb-3 opacity-80" />
              <p className="text-sm">{error}</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center mb-3">
                <MessageCircle className="w-6 h-6 opacity-30" />
              </div>
              <p className="text-sm font-medium">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 hover:bg-white/5 transition-all duration-200 group relative ${!notification.read ? 'bg-white/[0.03]' : ''}`}
                >
                  {/* Unread Indicator Dot */}
                  {!notification.read && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-12 bg-blue-500/50 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                  )}

                  <div className="flex items-start space-x-3 pl-1">
                    <div className="flex-shrink-0 mt-1">
                      {notification.from?.profileImage ? (
                        <img
                          src={IMG_URL + notification.from.profileImage}
                          alt={notification.from.name || 'User'}
                          className="w-9 h-9 rounded-full object-cover border border-white/10 shadow-sm"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                          {getNotificationIcon(notification.senderModel!)}
                        </div>
                      )}
                    </div>

                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => !notification.read && handleMarkAsRead(notification._id!)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className={`text-sm ${!notification.read ? 'font-semibold text-white' : 'font-medium text-gray-400'}`}>
                            {notification.from?.name || 'Unknown User'}
                          </p>
                          <p className={`text-xs mt-0.5 leading-relaxed line-clamp-2 ${!notification.read ? 'text-gray-300' : 'text-gray-500'}`}>
                            {notification.message}
                          </p>
                          <p className="text-[10px] text-gray-600 mt-1.5 font-medium uppercase tracking-wide">
                            {formatTimestamp(notification?.createdAt!)}
                          </p>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNotification(notification._id!);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 hover:bg-red-500/20 rounded-lg text-gray-500 hover:text-red-400 translate-x-2 group-hover:translate-x-0"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && !loading && (
          <div className="p-3 border-t border-white/10 bg-white/5 backdrop-blur-md flex justify-between items-center text-xs font-medium">
            <button
              onClick={handleMarkAllAsRead}
              className="text-gray-400 hover:text-white transition-colors py-1 px-2 hover:bg-white/5 rounded-lg"
            >
              Mark all read
            </button>
            <button
              onClick={handleDeleteAllNotifications}
              className="text-gray-400 hover:text-red-400 transition-colors py-1 px-2 hover:bg-red-500/10 rounded-lg"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationModal;
