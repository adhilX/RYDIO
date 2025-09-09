import { IMessage } from "../domain/entities/messageEntities";

// Frontend Message interface
export interface FrontendMessage {
    id: string;
    text: string;
    sender: 'user' | 'other';
    timestamp: Date;
    status: 'sent' | 'delivered' | 'read';
    type: 'text' | 'image' | 'file'
}

export class MessageTransformer {
    
    // Transform backend message to frontend format
    static toFrontend(backendMessage: IMessage, currentUserId: string): FrontendMessage {
        return {
            id: backendMessage._id || '',
            text: backendMessage.messageContent,
            sender: backendMessage.senderId === currentUserId ? 'user' : 'other',
            timestamp: backendMessage.sendedTime,
            status: backendMessage.seen ? 'read' : 'delivered',
            type: (backendMessage.messageType || 'text') as 'text' | 'image'
        };
    }

    // Transform frontend message to backend format
    static toBackend(frontendMessage: Partial<FrontendMessage>, chatId: string, senderId: string, senderModel: 'user' | 'owner'): Omit<IMessage, '_id'> {
        return {
            chatId,
            messageContent: frontendMessage.text || '',
            senderId,
            senderModel,
            seen: false,
            sendedTime: frontendMessage.timestamp || new Date(),
            messageType: frontendMessage.type || 'text'
        };
    }

    // Transform array of backend messages to frontend format
    static arrayToFrontend(backendMessages: IMessage[], currentUserId: string): FrontendMessage[] {
        return backendMessages.map(msg => this.toFrontend(msg, currentUserId));
    }
}
