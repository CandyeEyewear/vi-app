import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback } from 'react';
import { Conversation, Message } from '@/types';
import { mockConversations } from '@/mocks/conversations';

export const [MessagingProvider, useMessaging] = createContextHook(() => {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);

  const sendMessage = useCallback((conversationId: string, senderId: string, content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId,
      receiverId: '', // Will be set based on conversation
      content,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setConversations((prevConversations) =>
      prevConversations.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: [...conv.messages, { ...newMessage, receiverId: conv.participant.id }],
            lastMessage: {
              content,
              timestamp: newMessage.timestamp,
            },
          };
        }
        return conv;
      })
    );
  }, []);

  const markAsRead = useCallback((conversationId: string) => {
    setConversations((prevConversations) =>
      prevConversations.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            unreadCount: 0,
            messages: conv.messages.map((msg) => ({ ...msg, read: true })),
          };
        }
        return conv;
      })
    );
  }, []);

  const getTotalUnreadCount = useCallback(() => {
    return conversations.reduce((total, conv) => total + conv.unreadCount, 0);
  }, [conversations]);

  return {
    conversations,
    sendMessage,
    markAsRead,
    getTotalUnreadCount,
  };
});
