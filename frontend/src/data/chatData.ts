import type { User, Message } from '@/Types/chat';

// Dummy users data
export const dummyUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    isOnline: true,
    lastMessage: 'Hey, is the car still available for rent?',
    lastMessageTime: new Date(Date.now() - 5 * 60 * 1000),
    lastSeen: 'Online',
    unreadCount: 2
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    isOnline: false,
    lastMessage: 'Thanks for the smooth rental experience!',
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    lastSeen: 'Last seen 2h ago',
    unreadCount: 0
  },
  {
    id: '3',
    name: 'Mike Wilson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    isOnline: true,
    lastMessage: 'Can we extend the rental by one more day?',
    lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
    lastSeen: 'Online',
    unreadCount: 1
  },
  {
    id: '4',
    name: 'Emma Davis',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    isOnline: false,
    lastMessage: 'Perfect! See you tomorrow at 9 AM.',
    lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
    lastSeen: 'Last seen yesterday',
    unreadCount: 0
  }
];

// Dummy messages data
export const dummyMessages: { [key: string]: Message[] } = {
  '1': [
    {
      id: 'm1',
      text: 'Hi! I saw your Tesla Model 3 listing. Is it still available?',
      sender: 'other',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      status: 'read',
      type: 'text'
    },
    {
      id: 'm2',
      text: 'Yes, it\'s available! When would you like to rent it?',
      sender: 'user',
      timestamp: new Date(Date.now() - 55 * 60 * 1000),
      status: 'read',
      type: 'text'
    },
    {
      id: 'm3',
      text: 'Great! I need it for this weekend. Friday to Sunday.',
      sender: 'other',
      timestamp: new Date(Date.now() - 50 * 60 * 1000),
      status: 'read',
      type: 'text'
    },
    {
      id: 'm4',
      text: 'Hey, is the car still available for rent?',
      sender: 'other',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      status: 'delivered',
      type: 'text'
    }
  ],
  '2': [
    {
      id: 'm5',
      text: 'Thank you so much for the Honda Civic rental!',
      sender: 'other',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      status: 'read',
      type: 'text'
    },
    {
      id: 'm6',
      text: 'You\'re welcome! Hope you had a great trip.',
      sender: 'user',
      timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
      status: 'read',
      type: 'text'
    }
  ],
  '3': [
    {
      id: 'm8',
      text: 'Hi, I have your Audi A4 booked for today.',
      sender: 'other',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'read',
      type: 'text'
    },
    {
      id: 'm9',
      text: 'Yes, it\'s ready for pickup. Location is as discussed.',
      sender: 'user',
      timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
      status: 'read',
      type: 'text'
    }
  ]
};
