export type Imessage = {
    _id: string;
    chatId: string;
    messageContent: string;
    senderId: string;
    senderModel: 'user' | 'owner';
    seen: boolean;
    sendedTime: Date;
    messageType: 'text' | 'image' | 'file';
}
