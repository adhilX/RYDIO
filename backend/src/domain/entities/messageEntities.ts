
export interface IMessage {
    _id?: string,
    chatId: string,
    seen: boolean,
    messageContent: string,
    sendedTime: Date
    senderId: string
    senderModel: 'user' | 'owner'
}