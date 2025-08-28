export interface Inotification {
    _id?: string
    userId: string
    userModel: 'user' | 'owner'
    title: string
    message: string
    type: 'booking' | 'payment' | 'chat' | 'system' | 'ride'
    isRead: boolean
    data?: {
        bookingId?: string
        chatId?: string
        messageId?: string
        transactionId?: string
        [key: string]: any
    }
    createdAt?: Date
    updatedAt?: Date
}
