import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, withSequence, withDelay, useSharedValue, runOnJS } from 'react-native-reanimated';
import { GlassContainer } from './GlassContainer';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';

export interface NotificationProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface NotificationToastProps {
  notification: NotificationProps | null;
  onHide: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onHide }) => {
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (notification) {
      translateY.value = withSequence(
        withTiming(50, { duration: 500 }), // Slide down
        withDelay(3000, withTiming(-100, { duration: 500 }, (finished) => {
          if (finished) {
            runOnJS(onHide)();
          }
        })) // Slide up after delay
      );
      opacity.value = withSequence(
        withTiming(1, { duration: 500 }),
        withDelay(3000, withTiming(0, { duration: 500 }))
      );
    }
  }, [notification]);

  if (!notification) return null;

  const iconName = notification.type === 'success' ? 'checkmark-circle' : notification.type === 'error' ? 'alert-circle' : 'information-circle';
  const iconColor = notification.type === 'success' ? '#22c55e' : notification.type === 'error' ? '#ef4444' : '#3b82f6';

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[tw`absolute top-0 left-0 right-0 items-center z-50`, animatedStyle]}>
      <GlassContainer borderRadius={30} style={{ width: '90%', maxWidth: 400, flexDirection: 'row', alignItems: 'center' }}>
        <View style={tw`flex-row items-center`}>
           <Ionicons name={iconName} size={24} color={iconColor} style={tw`mr-3`} />
           <Text style={tw`text-white font-medium text-sm flex-1`}>{notification.message}</Text>
        </View>
      </GlassContainer>
    </Animated.View>
  );
};
