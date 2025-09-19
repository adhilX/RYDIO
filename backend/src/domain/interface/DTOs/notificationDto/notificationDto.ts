export interface NotificationResponseDto {
    _id: string;
    from: {
        _id: string;
        name: string;
        profileImage?: string;
    };
    message: string;
    read: boolean;
    senderModel: 'user' | 'owner';
    receiverModel: 'user' | 'owner';
    createdAt: string;
    updatedAt: string;
}

export interface UnreadCountDto {
    unreadCount: number;
}

export interface MarkAllAsReadDto {
    modifiedCount: number;
}

export interface DeleteNotificationDto {
    deletedCount: number;
}

export interface DeleteAllNotificationsDto {
    deletedCount: number;
}
