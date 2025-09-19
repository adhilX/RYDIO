export type Notification = {
    _id?: string;
    from: {
        _id: string;
        name: string;
        profileImage?: string;
    };
    type: string;
    message: string;
    read: boolean;
    senderModel?: 'user' | 'owner';
    receiverModel?: 'user' | 'owner';
    createdAt?: string;
    updatedAt?: string;
}