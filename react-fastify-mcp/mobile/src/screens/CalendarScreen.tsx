import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';

import MenuHeader from '../components/MenuHeader';

const BACKEND_URL = 'http://10.97.249.210:3000';

type CalendarEvent = {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  location?: string;
};

export default function CalendarScreen() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/calendar`);
      const data = await response.json();
      if (data.success) {
        setEvents(data.events || []);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch events');
      }
    } catch (e: any) {
      setError('Could not connect to backend');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (event: CalendarEvent) => {
    const dateStr = event.start.dateTime || event.start.date;
    if (!dateStr) return 'All Day';
    if (!event.start.dateTime) return 'All Day'; // All-day events have only date
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const formatDate = (event: CalendarEvent) => {
    const dateStr = event.start.dateTime || event.start.date;
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatDuration = (event: CalendarEvent) => {
    const start = event.start.dateTime;
    const end = event.end.dateTime;
    if (!start || !end) return 'All Day';
    const diff = (new Date(end).getTime() - new Date(start).getTime()) / 60000;
    if (diff < 60) return `${diff}m`;
    return `${Math.round(diff / 60)}h`;
  };

  // Group events by date
  const groupedEvents: { [date: string]: CalendarEvent[] } = {};
  events.forEach(event => {
    const dateKey = formatDate(event);
    if (!groupedEvents[dateKey]) groupedEvents[dateKey] = [];
    groupedEvents[dateKey].push(event);
  });

  return (
    <SafeAreaView style={tw`flex-1 bg-[#0f0f12]`}>
       <MenuHeader title="Calendar" />

      <ScrollView contentContainerStyle={tw`p-6`}>
        
        {loading ? (
          <View style={tw`items-center py-10`}>
            <ActivityIndicator size="large" color="#f97316" />
            <Text style={tw`text-gray-500 mt-4`}>Loading events...</Text>
          </View>
        ) : error ? (
          <View style={tw`items-center py-10`}>
            <Ionicons name="warning" size={40} color="#ef4444" />
            <Text style={tw`text-red-400 mt-4 text-center`}>{error}</Text>
            <TouchableOpacity onPress={fetchEvents} style={tw`mt-4 bg-orange-600 px-4 py-2 rounded-lg`}>
              <Text style={tw`text-white font-medium`}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : events.length === 0 ? (
          <View style={tw`items-center py-10`}>
            <Ionicons name="calendar-outline" size={40} color="#6b7280" />
            <Text style={tw`text-gray-500 mt-4`}>No upcoming events</Text>
          </View>
        ) : (
          Object.entries(groupedEvents).map(([dateLabel, dateEvents]) => (
            <View key={dateLabel}>
              {/* Date Header */}
              <Text style={tw`text-xs font-bold text-orange-500 uppercase tracking-wider mb-4 mt-2`}>
                {dateLabel}
              </Text>
              
              {dateEvents.map((event) => (
                <View key={event.id} style={tw`flex-row mb-4`}>
                  <Text style={tw`w-20 text-gray-500 font-medium text-sm`}>{formatTime(event)}</Text>
                  <View style={tw`flex-1 bg-orange-900/20 p-4 rounded-xl border-l-4 border-orange-500`}>
                    <Text style={tw`font-semibold text-orange-100`}>{event.summary}</Text>
                    <Text style={tw`text-orange-400 text-sm`}>
                      {event.location ? `${event.location} • ` : ''}{formatDuration(event)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ))
        )}

      </ScrollView>
    </SafeAreaView>
  );
}
