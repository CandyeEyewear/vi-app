import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '@/types';

const AUTH_STORAGE_KEY = 'vibe_auth';
const USER_PROFILE_KEY = 'vibe_user_profile';

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
}

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAuthState();
  }, []);

  const loadAuthState = async () => {
    try {
      const [authData, userData] = await Promise.all([
        AsyncStorage.getItem(AUTH_STORAGE_KEY),
        AsyncStorage.getItem(USER_PROFILE_KEY),
      ]);

      if (authData && userData) {
        const isAuthenticated = JSON.parse(authData);
        const user = JSON.parse(userData);
        setAuthState({ isAuthenticated, user });
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      console.log('Login with:', email, password);

      // In a real app, you would validate credentials against a backend
      const user: UserProfile = {
        id: Date.now().toString(),
        name: email.split('@')[0],
        email,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
        totalHours: 0,
        activitiesCompleted: 0,
        organizationsHelped: 0,
        joinedDate: new Date().toISOString(),
      };

      await Promise.all([
        AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(true)),
        AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(user)),
      ]);

      setAuthState({ isAuthenticated: true, user });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);

  const register = useCallback(async (userData: Partial<UserProfile> & { email: string; password?: string }) => {
    try {
      console.log('Registering user:', userData);

      // In a real app, you would send this to a backend
      const user: UserProfile = {
        id: Date.now().toString(),
        name: userData.name || userData.email.split('@')[0],
        email: userData.email,
        avatar: userData.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
        totalHours: 0,
        activitiesCompleted: 0,
        organizationsHelped: 0,
        joinedDate: new Date().toISOString(),
        bio: userData.bio,
        phone: userData.phone,
        location: userData.location,
        areasOfExpertise: userData.areasOfExpertise,
        education: userData.education,
      };

      await Promise.all([
        AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(true)),
        AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(user)),
      ]);

      setAuthState({ isAuthenticated: true, user });
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(AUTH_STORAGE_KEY),
        AsyncStorage.removeItem(USER_PROFILE_KEY),
      ]);

      setAuthState({ isAuthenticated: false, user: null });
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    try {
      if (!authState.user) return false;

      const updatedUser = { ...authState.user, ...updates };

      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updatedUser));

      setAuthState({ ...authState, user: updatedUser });
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      return false;
    }
  }, [authState]);

  return {
    ...authState,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };
});
