export type Notification = {
    from: {
        _id: string;
        name: string;
        profileImage?: string;
    };
    type: string;
    message: string;
}