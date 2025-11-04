import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  useColorScheme,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { Search, X, Send } from 'lucide-react-native';
import { useMessaging } from '@/contexts/MessagingContext';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/colors';

export default function MessagesScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { conversations, sendMessage, markAsRead } = useMessaging();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId);

  const filteredConversations = conversations.filter((conv) =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    markAsRead(conversationId);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversationId || !user) return;

    sendMessage(selectedConversationId, user.id, messageText);
    setMessageText('');

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const renderConversation = ({ item: conversation }: any) => (
    <TouchableOpacity
      style={[styles.conversationCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => handleOpenConversation(conversation.id)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: conversation.participant.avatar }}
        style={styles.avatar}
        contentFit="cover"
      />
      <View style={styles.conversationInfo}>
        <View style={styles.conversationHeader}>
          <Text style={[styles.participantName, { color: colors.text }]}>
            {conversation.participant.name}
          </Text>
          <Text style={[styles.timestamp, { color: colors.muted }]}>
            {formatTimestamp(conversation.lastMessage.timestamp)}
          </Text>
        </View>
        <View style={styles.messageRow}>
          <Text
            style={[
              styles.lastMessage,
              { color: conversation.unreadCount > 0 ? colors.text : colors.muted },
              conversation.unreadCount > 0 && styles.unreadMessage,
            ]}
            numberOfLines={1}
          >
            {conversation.lastMessage.content}
          </Text>
          {conversation.unreadCount > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.primary }]}>
              <Text style={styles.badgeText}>{conversation.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 8, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Messages</Text>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <View style={[styles.searchBar, { backgroundColor: colors.background }]}>
            <Search size={20} color={colors.muted} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search conversations..."
              placeholderTextColor={colors.placeholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Conversations List */}
        <FlatList
          data={filteredConversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />

        {/* Conversation Modal */}
        <Modal
          visible={selectedConversationId !== null}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setSelectedConversationId(null)}
        >
          {selectedConversation && (
            <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
              {/* Modal Header */}
              <View style={[styles.modalHeader, { paddingTop: insets.top + 8, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedConversationId(null);
                    if (Platform.OS !== 'web') {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                  }}
                  activeOpacity={0.7}
                  style={styles.backButton}
                >
                  <X size={24} color={colors.text} />
                </TouchableOpacity>
                <View style={styles.modalHeaderInfo}>
                  <Image
                    source={{ uri: selectedConversation.participant.avatar }}
                    style={styles.modalAvatar}
                    contentFit="cover"
                  />
                  <Text style={[styles.modalTitle, { color: colors.text }]}>
                    {selectedConversation.participant.name}
                  </Text>
                </View>
                <View style={{ width: 24 }} />
              </View>

              {/* Messages */}
              <FlatList
                data={selectedConversation.messages}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.messagesList}
                renderItem={({ item: message }) => {
                  const isOwnMessage = message.senderId === user?.id;
                  return (
                    <View
                      style={[
                        styles.messageBubble,
                        isOwnMessage ? styles.ownMessage : styles.otherMessage,
                      ]}
                    >
                      <View
                        style={[
                          styles.messageContent,
                          {
                            backgroundColor: isOwnMessage ? colors.primary : colors.card,
                            borderColor: colors.border,
                          },
                          !isOwnMessage && { borderWidth: 1 },
                        ]}
                      >
                        <Text style={[styles.messageText, { color: isOwnMessage ? '#FFFFFF' : colors.text }]}>
                          {message.content}
                        </Text>
                      </View>
                      <Text style={[styles.messageTime, { color: colors.muted }]}>
                        {formatMessageTime(message.timestamp)}
                      </Text>
                    </View>
                  );
                }}
                inverted={false}
                showsVerticalScrollIndicator={false}
              />

              {/* Message Input */}
              <View style={[styles.messageInputContainer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
                <TextInput
                  style={[styles.messageInput, { backgroundColor: colors.background, color: colors.text }]}
                  placeholder="Type a message..."
                  placeholderTextColor={colors.placeholder}
                  value={messageText}
                  onChangeText={setMessageText}
                  multiline
                  maxLength={500}
                />
                <TouchableOpacity
                  style={[styles.sendButton, { backgroundColor: colors.primary }]}
                  onPress={handleSendMessage}
                  activeOpacity={0.8}
                  disabled={!messageText.trim()}
                >
                  <Send size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  list: {
    paddingTop: 8,
  },
  conversationCard: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  conversationInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 13,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  unreadMessage: {
    fontWeight: '600',
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  modalHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  messageBubble: {
    marginBottom: 12,
  },
  ownMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  messageContent: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
    marginHorizontal: 8,
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    gap: 8,
    borderTopWidth: 1,
  },
  messageInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
