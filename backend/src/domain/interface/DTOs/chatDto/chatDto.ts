//base 

export interface IBaseChatOut{
    _id?:string,
    lastMessage: string;
    lastMessageAt: Date;
    name: string;
    profile_image: string;
    isOnline: boolean;
}

export  interface IbaseMessageOut{
    chatId: string;
    senderId: string;
    messageContent: string;
    sendedTime: string;
}
export interface ICreateChatInputDto {
    userId: string;
    ownerId: string;
}