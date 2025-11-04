import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  useColorScheme,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { MapPin, Clock, Users, Calendar } from 'lucide-react-native';
import { mockEvents } from '@/mocks/events';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/colors';
import type { Event } from '@/types';

export default function EventsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Education', 'Environment', 'Health', 'Poor Relief'];

  const filteredEvents = selectedCategory === 'All'
    ? events
    : events.filter((event) => event.category === selectedCategory);

  const handleVolunteer = (eventId: string) => {
    if (!user) {
      Alert.alert('Error', 'Please log in to volunteer for events');
      return;
    }

    setEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event.id === eventId) {
          const isVolunteering = event.volunteers.includes(user.id);
          return {
            ...event,
            volunteers: isVolunteering
              ? event.volunteers.filter((id) => id !== user.id)
              : [...event.volunteers, user.id],
            spotsAvailable: isVolunteering
              ? event.spotsAvailable + 1
              : event.spotsAvailable - 1,
          };
        }
        return event;
      })
    );

    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Education':
        return '#007AFF';
      case 'Environment':
        return '#34C759';
      case 'Health':
        return '#FF3B30';
      case 'Poor Relief':
        return '#FF9500';
      default:
        return colors.primary;
    }
  };

  const renderEvent = ({ item: event }: { item: Event }) => {
    const isVolunteering = user ? event.volunteers.includes(user.id) : false;
    const categoryColor = getCategoryColor(event.category);

    return (
      <View style={[styles.eventCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {/* Event Image */}
        <Image source={{ uri: event.image }} style={styles.eventImage} contentFit="cover" />

        {/* Category Badge */}
        <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
          <Text style={styles.categoryText}>{event.category}</Text>
        </View>

        {/* Event Details */}
        <View style={styles.eventContent}>
          <Text style={[styles.eventTitle, { color: colors.text }]}>{event.title}</Text>
          <Text style={[styles.organization, { color: colors.muted }]}>{event.organization}</Text>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Calendar size={16} color={colors.muted} />
              <Text style={[styles.detailText, { color: colors.muted }]}>{formatDate(event.date)}</Text>
            </View>

            <View style={styles.detailRow}>
              <Clock size={16} color={colors.muted} />
              <Text style={[styles.detailText, { color: colors.muted }]}>{event.time}</Text>
            </View>

            <View style={styles.detailRow}>
              <MapPin size={16} color={colors.muted} />
              <Text style={[styles.detailText, { color: colors.muted }]} numberOfLines={1}>
                {event.location}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Users size={16} color={colors.muted} />
              <Text style={[styles.detailText, { color: colors.muted }]}>
                {event.spotsAvailable}/{event.spots} spots available
              </Text>
            </View>
          </View>

          <Text style={[styles.description, { color: colors.text }]} numberOfLines={2}>
            {event.description}
          </Text>

          <TouchableOpacity
            style={[
              styles.volunteerButton,
              {
                backgroundColor: isVolunteering ? colors.card : colors.primary,
                borderColor: isVolunteering ? colors.primary : colors.primary,
                borderWidth: isVolunteering ? 2 : 0,
              },
            ]}
            onPress={() => handleVolunteer(event.id)}
            activeOpacity={0.8}
            disabled={!isVolunteering && event.spotsAvailable === 0}
          >
            <Text
              style={[
                styles.volunteerButtonText,
                { color: isVolunteering ? colors.primary : '#FFFFFF' },
              ]}
            >
              {isVolunteering ? 'Cancel Registration' : event.spotsAvailable === 0 ? 'Full' : 'Volunteer'}
            </Text>
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
          <Text style={[styles.headerTitle, { color: colors.text }]}>Events</Text>
        </View>

        {/* Category Filter */}
        <View style={[styles.filterContainer, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <FlatList
            horizontal
            data={categories}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
            renderItem={({ item: category }) => (
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  { backgroundColor: colors.background, borderColor: colors.border },
                  selectedCategory === category && {
                    backgroundColor: colors.primary,
                    borderColor: colors.primary,
                  },
                ]}
                onPress={() => {
                  setSelectedCategory(category);
                  if (Platform.OS !== 'web') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterText,
                    { color: colors.text },
                    selectedCategory === category && { color: '#FFFFFF' },
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Events List */}
        <FlatList
          data={filteredEvents}
          renderItem={renderEvent}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.muted }]}>
                No events found in this category
              </Text>
            </View>
          )}
        />
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
  filterContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  filterList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    paddingTop: 16,
    paddingBottom: 80,
  },
  eventCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: 180,
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  eventContent: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  organization: {
    fontSize: 14,
    marginBottom: 12,
  },
  detailsContainer: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    flex: 1,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  volunteerButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  volunteerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
