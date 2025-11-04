export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  totalHours: number;
  activitiesCompleted: number;
  organizationsHelped: number;
  joinedDate: string;
  bio?: string;
  phone?: string;
  location?: string;
  areasOfExpertise?: string;
  education?: string;
}

export interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    role?: string;
  };
  content: string;
  timestamp: string;
  likes: string[]; // Array of user IDs who liked
  comments: Comment[];
  media?: {
    type: 'image' | 'video';
    uri: string;
  }[];
  event?: {
    id: string;
    name: string;
    date: string;
    location: string;
  };
}

export interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    avatar: string;
  };
  lastMessage: {
    content: string;
    timestamp: string;
  };
  unreadCount: number;
  messages: Message[];
}

export interface Event {
  id: string;
  title: string;
  organization: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string;
  spots: number;
  spotsAvailable: number;
  image: string;
  volunteers: string[]; // Array of user IDs
}
