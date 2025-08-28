
export interface Ichat {
    _id?: string,
    lastMessage: string,
    lastMessageAt: string,
    senderId: string,
    receiverId: string
    senderModel: 'user' | 'owner'
    receiverModel: 'user' | 'owner'
}