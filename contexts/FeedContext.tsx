import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback } from 'react';
import { Post, Comment } from '@/types';
import { mockPosts } from '@/mocks/posts';

export const [FeedProvider, useFeed] = createContextHook(() => {
  const [posts, setPosts] = useState<Post[]>(mockPosts);

  const addPost = useCallback((newPost: Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments'>) => {
    const post: Post = {
      ...newPost,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      likes: [],
      comments: [],
    };

    setPosts((prevPosts) => [post, ...prevPosts]);
  }, []);

  const toggleLike = useCallback((postId: string, userId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const hasLiked = post.likes.includes(userId);
          return {
            ...post,
            likes: hasLiked
              ? post.likes.filter((id) => id !== userId)
              : [...post.likes, userId],
          };
        }
        return post;
      })
    );
  }, []);

  const addComment = useCallback((postId: string, comment: Omit<Comment, 'id' | 'timestamp'>) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const newComment: Comment = {
            ...comment,
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
          };
          return {
            ...post,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      })
    );
  }, []);

  const deletePost = useCallback((postId: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  }, []);

  return {
    posts,
    addPost,
    toggleLike,
    addComment,
    deletePost,
  };
});
