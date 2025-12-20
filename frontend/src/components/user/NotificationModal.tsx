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
  if (!user) return null
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserNotifications(user._id);
      setNotifications(data);
    } catch (err) {
      setError('Failed to fetch notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

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
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'owner':
        return <Car className="w-5 h-5 text-green-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    }
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 right-0 z-50">
      {/* Modal */}
      <div className="absolute top-20 right-8 w-80 sm:w-96 bg-gray-900 rounded-xl shadow-2xl border border-gray-700 transform transition-all duration-300 ease-out animate-in slide-in-from-top-2 fade-in-0">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-700 bg-gray-800 rounded-t-xl">
          <div className="flex items-center space-x-3">
            <h3 className="text-xl font-bold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-semibold rounded-full px-2.5 py-1 shadow-sm">
                {unreadCount} new
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          {loading ? (
            <div className="p-8 text-center text-gray-400">
              <Spinner size="md" className="mx-auto mb-4 border-gray-600 border-t-blue-500" />
              <p className="text-sm">Loading notifications...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-400">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-900/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-sm">{error}</p>
              <button
                onClick={fetchNotifications}
                className="mt-2 text-xs text-blue-400 hover:text-blue-300 underline"
              >
                Try again
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                <Car className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 hover:bg-gray-800 transition-all duration-200 group relative ${!notification.read ? 'bg-blue-900/30 border-l-4 border-l-blue-500' : ''
                    }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {notification.from?.profileImage ? (
                        <img
                          src={IMG_URL + notification.from.profileImage}
                          alt={notification.from.name || 'User'}
                          className="w-10 h-10 rounded-full object-cover border border-gray-600 shadow-sm"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-800 shadow-sm border border-gray-600 flex items-center justify-center">
                          {getNotificationIcon(notification.senderModel!)}
                        </div>
                      )}
                    </div>
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => !notification.read && handleMarkAsRead(notification._id!)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className={`text-sm font-semibold leading-5 ${!notification.read ? 'text-white' : 'text-gray-300'
                            }`}>
                            {notification.from?.name || 'Unknown User'}
                          </p>
                          <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2 font-medium">
                            {formatTimestamp(notification?.createdAt!)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {!notification.read && (
                            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full flex-shrink-0 mt-1 shadow-sm" />
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNotification(notification._id!);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 hover:bg-red-600/20 rounded-full"
                            title="Delete notification"
                          >
                            <Trash2 className="w-4 h-4 text-red-400 hover:text-red-300" />
                          </button>
                        </div>
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
          <div className="p-4 border-t border-gray-700 bg-gray-800 rounded-b-xl">
            <div className="flex justify-between items-center">
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200 hover:underline"
              >
                Mark all as read
              </button>
              <button
                onClick={handleDeleteAllNotifications}
                className="text-sm text-red-400 hover:text-red-300 font-semibold transition-colors duration-200 hover:underline"
              >
                Delete All
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationModal;
