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
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { Heart, MessageCircle, Share2, PlusCircle, X, Image as ImageIcon, Send } from 'lucide-react-native';
import { useFeed } from '@/contexts/FeedContext';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/colors';

export default function FeedScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { posts, addPost, toggleLike, addComment } = useFeed();
  const { user } = useAuth();

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<{ type: 'image' | 'video'; uri: string }[]>([]);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const selectedPost = posts.find((p) => p.id === selectedPostId);

  const handleCreatePost = () => {
    if (!newPostContent.trim()) {
      Alert.alert('Error', 'Please enter some content for your post');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to create a post');
      return;
    }

    addPost({
      author: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
      },
      content: newPostContent,
      media: selectedMedia,
    });

    setNewPostContent('');
    setSelectedMedia([]);
    setIsCreateModalVisible(false);

    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newMedia = result.assets.map((asset) => ({
        type: 'image' as const,
        uri: asset.uri,
      }));
      setSelectedMedia([...selectedMedia, ...newMedia]);
    }
  };

  const handleRemoveMedia = (index: number) => {
    setSelectedMedia(selectedMedia.filter((_, i) => i !== index));
  };

  const handleAddComment = () => {
    if (!commentText.trim() || !selectedPostId || !user) return;

    addComment(selectedPostId, {
      author: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
      },
      content: commentText,
    });

    setCommentText('');
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleShare = (post: any) => {
    Alert.alert('Share', `Share post by ${post.author.name}`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Share', onPress: () => console.log('Shared') },
    ]);
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const postDate = new Date(timestamp);
    const diffMs = now.getTime() - postDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return postDate.toLocaleDateString();
  };

  const renderPost = ({ item: post }: any) => {
    const isLiked = user ? post.likes.includes(user.id) : false;

    return (
      <View style={[styles.postCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {/* Post Header */}
        <View style={styles.postHeader}>
          <Image source={{ uri: post.author.avatar }} style={styles.authorAvatar} contentFit="cover" />
          <View style={styles.authorInfo}>
            <Text style={[styles.authorName, { color: colors.text }]}>{post.author.name}</Text>
            {post.author.role && (
              <Text style={[styles.authorRole, { color: colors.muted }]}>{post.author.role}</Text>
            )}
            <Text style={[styles.postTime, { color: colors.muted }]}>{formatTimestamp(post.timestamp)}</Text>
          </View>
        </View>

        {/* Post Content */}
        <Text style={[styles.postContent, { color: colors.text }]}>{post.content}</Text>

        {/* Post Media */}
        {post.media && post.media.length > 0 && (
          <View style={styles.mediaContainer}>
            {post.media.map((media: any, index: number) => (
              <Image
                key={index}
                source={{ uri: media.uri }}
                style={styles.mediaImage}
                contentFit="cover"
              />
            ))}
          </View>
        )}

        {/* Post Actions */}
        <View style={styles.postActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              if (user) {
                toggleLike(post.id, user.id);
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }
            }}
            activeOpacity={0.7}
          >
            <Heart
              size={20}
              color={isLiked ? colors.danger : colors.muted}
              fill={isLiked ? colors.danger : 'none'}
            />
            <Text style={[styles.actionText, { color: colors.muted }]}>
              {post.likes.length > 0 ? post.likes.length : ''}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              setSelectedPostId(post.id);
              setCommentModalVisible(true);
              if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
            }}
            activeOpacity={0.7}
          >
            <MessageCircle size={20} color={colors.muted} />
            <Text style={[styles.actionText, { color: colors.muted }]}>
              {post.comments.length > 0 ? post.comments.length : ''}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              handleShare(post);
              if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
            }}
            activeOpacity={0.7}
          >
            <Share2 size={20} color={colors.muted} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 8, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>VIbe</Text>
          {user && (
            <TouchableOpacity onPress={() => router.push('/edit-profile')} activeOpacity={0.7}>
              <Image
                source={{ uri: user.avatar }}
                style={styles.headerAvatar}
                contentFit="cover"
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Feed */}
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />

        {/* Create Post FAB */}
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: colors.primary }]}
          onPress={() => {
            setIsCreateModalVisible(true);
            if (Platform.OS !== 'web') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
          }}
          activeOpacity={0.8}
        >
          <PlusCircle size={28} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Create Post Modal */}
        <Modal
          visible={isCreateModalVisible}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setIsCreateModalVisible(false)}
        >
          <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
            <View style={[styles.modalHeader, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
              <TouchableOpacity
                onPress={() => {
                  setIsCreateModalVisible(false);
                  setNewPostContent('');
                  setSelectedMedia([]);
                }}
                activeOpacity={0.7}
              >
                <X size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Create Post</Text>
              <TouchableOpacity onPress={handleCreatePost} activeOpacity={0.7}>
                <Text style={[styles.postButton, { color: colors.primary }]}>Post</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <TextInput
                style={[styles.postInput, { color: colors.text }]}
                placeholder="What's happening in your volunteer journey?"
                placeholderTextColor={colors.placeholder}
                value={newPostContent}
                onChangeText={setNewPostContent}
                multiline
                autoFocus
              />

              {selectedMedia.length > 0 && (
                <View style={styles.selectedMediaContainer}>
                  {selectedMedia.map((media, index) => (
                    <View key={index} style={styles.selectedMediaItem}>
                      <Image source={{ uri: media.uri }} style={styles.selectedMediaImage} contentFit="cover" />
                      <TouchableOpacity
                        style={[styles.removeMediaButton, { backgroundColor: colors.danger }]}
                        onPress={() => handleRemoveMedia(index)}
                        activeOpacity={0.8}
                      >
                        <X size={16} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              <TouchableOpacity
                style={[styles.addMediaButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={handlePickImage}
                activeOpacity={0.7}
              >
                <ImageIcon size={20} color={colors.primary} />
                <Text style={[styles.addMediaText, { color: colors.primary }]}>Add Photos</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Comments Modal */}
        <Modal
          visible={commentModalVisible}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setCommentModalVisible(false)}
        >
          <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
            <View style={[styles.modalHeader, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
              <TouchableOpacity
                onPress={() => setCommentModalVisible(false)}
                activeOpacity={0.7}
              >
                <X size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Comments</Text>
              <View style={{ width: 24 }} />
            </View>

            {selectedPost && (
              <FlatList
                data={selectedPost.comments}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.commentsList}
                ListHeaderComponent={() => (
                  <View style={[styles.postCard, { backgroundColor: colors.card, borderColor: colors.border, marginBottom: 16 }]}>
                    <View style={styles.postHeader}>
                      <Image source={{ uri: selectedPost.author.avatar }} style={styles.authorAvatar} contentFit="cover" />
                      <View style={styles.authorInfo}>
                        <Text style={[styles.authorName, { color: colors.text }]}>{selectedPost.author.name}</Text>
                        <Text style={[styles.postTime, { color: colors.muted }]}>{formatTimestamp(selectedPost.timestamp)}</Text>
                      </View>
                    </View>
                    <Text style={[styles.postContent, { color: colors.text }]}>{selectedPost.content}</Text>
                  </View>
                )}
                renderItem={({ item: comment }) => (
                  <View style={[styles.commentCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Image source={{ uri: comment.author.avatar }} style={styles.commentAvatar} contentFit="cover" />
                    <View style={styles.commentContent}>
                      <Text style={[styles.commentAuthor, { color: colors.text }]}>{comment.author.name}</Text>
                      <Text style={[styles.commentText, { color: colors.text }]}>{comment.content}</Text>
                      <Text style={[styles.commentTime, { color: colors.muted }]}>{formatTimestamp(comment.timestamp)}</Text>
                    </View>
                  </View>
                )}
                ListEmptyComponent={() => (
                  <Text style={[styles.emptyText, { color: colors.muted }]}>No comments yet. Be the first to comment!</Text>
                )}
              />
            )}

            <View style={[styles.commentInputContainer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
              <TextInput
                style={[styles.commentInput, { backgroundColor: colors.background, color: colors.text }]}
                placeholder="Write a comment..."
                placeholderTextColor={colors.placeholder}
                value={commentText}
                onChangeText={setCommentText}
              />
              <TouchableOpacity
                style={[styles.sendButton, { backgroundColor: colors.primary }]}
                onPress={handleAddComment}
                activeOpacity={0.8}
              >
                <Send size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  list: {
    paddingTop: 8,
    paddingBottom: 80,
  },
  postCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  postHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  authorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  authorInfo: {
    marginLeft: 12,
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  authorRole: {
    fontSize: 13,
    marginBottom: 2,
  },
  postTime: {
    fontSize: 13,
  },
  postContent: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  mediaContainer: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  mediaImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  postButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  postInput: {
    fontSize: 16,
    lineHeight: 24,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  selectedMediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  selectedMediaItem: {
    position: 'relative',
  },
  selectedMediaImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeMediaButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addMediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 16,
  },
  addMediaText: {
    fontSize: 16,
    fontWeight: '500',
  },
  commentsList: {
    padding: 16,
  },
  commentCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  commentContent: {
    marginLeft: 12,
    flex: 1,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  commentTime: {
    fontSize: 12,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 15,
    marginTop: 20,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
    borderTopWidth: 1,
  },
  commentInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 15,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
