
export interface Ichat {
    _id?: string,
    lastMessage: string,
    lastMessageAt: Date,
    senderId: string,
    receiverId: string
    senderModel: 'user' | 'owner'
    receiverModel: 'user' | 'owner'
}

export interface IchatPopulated {
    _id?: string,
    lastMessage: string,
    lastMessageAt: Date,
    senderId: {
        _id: string,
        name: string,
        profile_image?: string
    },
    receiverId: {
        _id: string,
        name: string,
        profile_image?: string
    }
    senderModel: 'user' | 'owner'
    receiverModel: 'user' | 'owner'
}