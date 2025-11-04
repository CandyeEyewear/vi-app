import { Conversation } from '@/types';

export const mockConversations: Conversation[] = [
  {
    id: '1',
    participant: {
      id: '2',
      name: 'Marcus Thompson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    },
    lastMessage: {
      content: 'Great job at the event today!',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    unreadCount: 2,
    messages: [
      {
        id: 'm1',
        senderId: '2',
        receiverId: '1',
        content: 'Hey! Are you coming to the cleanup event tomorrow?',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: true,
      },
      {
        id: 'm2',
        senderId: '1',
        receiverId: '2',
        content: 'Yes! I\'ll be there at 9 AM',
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
        read: true,
      },
      {
        id: 'm3',
        senderId: '2',
        receiverId: '1',
        content: 'Perfect! See you there',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        read: true,
      },
      {
        id: 'm4',
        senderId: '2',
        receiverId: '1',
        content: 'Great job at the event today!',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        read: false,
      },
    ],
  },
  {
    id: '2',
    participant: {
      id: '3',
      name: 'Jennifer Lee',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    },
    lastMessage: {
      content: 'Thanks for your interest!',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
    unreadCount: 0,
    messages: [
      {
        id: 'm5',
        senderId: '1',
        receiverId: '3',
        content: 'I\'d love to help with the tutoring program',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        read: true,
      },
      {
        id: 'm6',
        senderId: '3',
        receiverId: '1',
        content: 'Thanks for your interest!',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        read: true,
      },
    ],
  },
];
