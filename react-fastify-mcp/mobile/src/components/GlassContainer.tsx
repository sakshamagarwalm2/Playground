import React from 'react';
import { View, ViewStyle, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import tw from 'twrnc';

interface GlassContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default' | 'extraLight' | 'regular' | 'prominent';
  borderRadius?: number;
}

export const GlassContainer: React.FC<GlassContainerProps> = ({ 
  children, 
  style, 
  intensity = 50, 
  tint = 'dark',
  borderRadius = 16
}) => {
  return (
    <View style={[
      tw`overflow-hidden bg-gray-900/30 border border-white/10`, // Fallback/Basis styles
      { borderRadius },
      style
    ]}>
      {Platform.OS !== 'web' ? (
        <BlurView 
          intensity={intensity} 
          tint={tint} 
          style={StyleSheet.absoluteFill} 
        />
      ) : (
        // Web fallback (optional, though expo-blur supports web sometimes, CSS backdrop-filter is safer)
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(20,20,30,0.6)', backdropFilter: 'blur(10px)' } as any]} />
      )}
      <View style={tw`p-4 z-10`}>
        {children}
      </View>
    </View>
  );
};
