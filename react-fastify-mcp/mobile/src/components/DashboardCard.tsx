import React from 'react';
import { TouchableOpacity, Text, View, ViewStyle } from 'react-native';
import tw from 'twrnc';
import Animated, { useAnimatedStyle, withTiming, useSharedValue, withSequence, withRepeat } from 'react-native-reanimated';
import { GlassContainer } from './GlassContainer';

interface DashboardCardProps {
  title: string;
  count?: number | string;
  subtitle?: string;
  icon?: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  accentColor?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  count, 
  subtitle, 
  icon, 
  style, 
  onPress,
  accentColor = 'orange-500' // tailwind color name part
}) => {
  const scale = useSharedValue(1);
  const glow = useSharedValue(0.2);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: glow.value,
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 100 });
    glow.value = withTiming(0.6, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 100 });
    glow.value = withTiming(0.2, { duration: 100 });
  };

  React.useEffect(() => {
    // Subtle breathing glow effect
    glow.value = withRepeat(
      withSequence(
        withTiming(0.2, { duration: 2000 }),
        withTiming(0.4, { duration: 2000 })
      ),
      -1,
      true
    );
  }, []);

  return (
    <Animated.View style={[
      tw`mb-4 shadow-lg shadow-${accentColor}`,
      animatedStyle,
      style
    ]}>
      <GlassContainer intensity={20} borderRadius={16} style={tw`h-full p-0`}>
        <TouchableOpacity 
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
          style={tw`h-full justify-between p-4`}
        >
          <View style={tw`flex-row justify-between items-start`}>
            <View style={tw`bg-gray-800/50 p-2 rounded-lg`}>
              <Text style={tw`text-${accentColor} font-bold text-lg`}>
                {icon || '•'}
              </Text>
            </View>
            {count !== undefined && (
              <Text style={tw`text-3xl font-bold text-white`}>{count}</Text>
            )}
          </View>
          
          <View>
            <Text style={tw`text-gray-300 text-sm font-medium uppercase tracking-wider`}>{title}</Text>
            {subtitle && <Text style={tw`text-gray-400 text-xs mt-1`}>{subtitle}</Text>}
          </View>
        </TouchableOpacity>
      </GlassContainer>
    </Animated.View>
  );
};
