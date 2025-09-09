export interface Ichat{
    _id?:string,
    lastMessage: string;
    lastMessageAt: Date;
    name: string;
    profile_image: string;
    isOnline: boolean;
}

// Interface for chat data with populated user information
export interface IChatWithUsers {
    _id?: string;
    lastMessage: string;
    lastMessageAt: Date;
    senderId: {
        _id: string;
        name: string;
        profile_image?: string;
    };
    receiverId: {
        _id: string;
        name: string;
        profile_image?: string;
    };
    senderModel: 'user' | 'owner';
    receiverModel: 'user' | 'owner';
}