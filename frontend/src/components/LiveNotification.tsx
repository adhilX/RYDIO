import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, AlertTriangle, MessageCircle, X } from 'lucide-react';
import type { Notification } from '@/Types/NotificationType';
const IMG_URL = import.meta.env.VITE_IMAGE_URL;
interface LiveNotificationProps {
    notification: Notification;
    onClose: () => void;
    duration?: number;
}

const   LiveNotification: React.FC<LiveNotificationProps> = ({
    notification,
    onClose,
    duration = 5000,
}) => {
    console.log(notification)
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [onClose, duration]);

    const getIcon = () => {
        switch (notification.type) {
            case 'info':
                return <MessageCircle className="w-5 h-5 text-blue-500" />;
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'warning':
                return <AlertCircle className="w-5 h-5 text-yellow-500" />;
            case 'error':
                return <AlertTriangle className="w-5 h-5 text-red-500" />;
            default:
                return <MessageCircle className="w-5 h-5 text-blue-500" />;
        }
    };

    const getBorderColor = () => {
        switch (notification.type) {
            case 'info':
                return 'border-l-blue-500';
            case 'success':
                return 'border-l-green-500';
            case 'warning':
                return 'border-l-yellow-500';
            case 'error':
                return 'border-l-red-500';
            default:
                return 'border-l-blue-500';
        }
    };

    return (
        <div className="fixed top-20 right-5 z-50">
            <motion.div
                initial={{ opacity: 0, x: 300, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 300, scale: 0.8 }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 40,
                    mass: 1
                }}
                className={`flex w-full max-w-sm overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 border-l-4 ${getBorderColor()}`}
            >
                <div className="flex items-center px-2 py-3 w-full">
                    <div className="mx-3">
                        {notification?.from?.profileImage ? (
                            <img
                                src={IMG_URL + notification.from.profileImage}
                                alt={notification.from.name}
                                className="w-12 h-12 rounded-full"
                            />
                        ) : (
                            getIcon()
                        )}
                    </div>

                    <div className="flex-1 pr-6">
                        <h3 className="text-sm font-medium text-gray-800 dark:text-white">
                            {`${notification?.from?.name ||'Admin'}`}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                            {notification.message}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="mr-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                    >
                        <X size={16} />
                    </button>
                </div>
            </motion.div>
        </div>
    )

};

export default LiveNotification;