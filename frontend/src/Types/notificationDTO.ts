
export interface NotificationDTO {
    _id?: string;
    from: {
        _id: string,
        name: string,
        profileImage?: string
    };
    to: string;
    message: string;
    read: boolean;
    senderModel: 'client' | 'vendors'
    receiverModel: 'client' | 'vendors'
}
