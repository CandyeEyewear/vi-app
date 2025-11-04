import { Post } from '@/types';

export const mockPosts: Post[] = [
  {
    id: '1',
    author: {
      id: '2',
      name: 'Marcus Thompson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
      role: 'Community Leader',
    },
    content: 'Amazing turnout at today\'s beach cleanup! We collected over 500 pounds of trash and made our coastline beautiful again. Thank you to all the volunteers who came out! 🌊',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    likes: ['1', '3', '4'],
    comments: [
      {
        id: 'c1',
        author: {
          id: '1',
          name: 'Sarah Johnson',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
        },
        content: 'So proud to be part of this initiative!',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
    ],
    media: [
      {
        type: 'image',
        uri: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&h=600&fit=crop',
      },
    ],
  },
  {
    id: '2',
    author: {
      id: '3',
      name: 'Jennifer Lee',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
      role: 'Education Coordinator',
    },
    content: 'Looking for volunteers to help with our after-school tutoring program next week. If you have experience in math or science, we\'d love to have you! DM me for details.',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    likes: ['1', '2'],
    comments: [],
  },
  {
    id: '3',
    author: {
      id: '4',
      name: 'David Williams',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
      role: 'Volunteer',
    },
    content: 'Just completed my 100th volunteer hour! This journey has been incredibly rewarding. Thank you to this amazing community for all the opportunities to give back.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    likes: ['1', '2', '3', '5'],
    comments: [
      {
        id: 'c2',
        author: {
          id: '2',
          name: 'Marcus Thompson',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
        },
        content: 'Congratulations David! Well deserved!',
        timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
];
