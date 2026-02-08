import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ImageBackground, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { GlassContainer } from '../components/GlassContainer';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function ProfileScreen({ navigation }: any) {
  return (
    <ImageBackground 
      source={{ uri: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop' }} 
      style={tw`flex-1 bg-black`}
      blurRadius={Platform.OS === 'android' ? 10 : 0} 
    >
      <View style={[tw`absolute inset-0 bg-black/80`]} />

      <SafeAreaView style={tw`flex-1`}>
        <ScrollView contentContainerStyle={tw`p-6 pb-24`}>
          
          {/* Header */}
          <View style={tw`flex-row justify-between items-center mb-8`}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={tw`bg-gray-800/50 p-2 rounded-full`}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={tw`text-white text-lg font-bold`}>Profile</Text>
            <TouchableOpacity style={tw`bg-gray-800/50 p-2 rounded-full`}>
              <Ionicons name="settings-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Profile Card */}
          <Animated.View entering={FadeInDown.delay(200)}>
            <GlassContainer intensity={40} borderRadius={24} style={tw`items-center mb-6`}>
              <View style={tw`relative`}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop' }} 
                  style={tw`w-24 h-24 rounded-full border-2 border-orange-500`}
                />
                <View style={tw`absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-2 border-black items-center justify-center`}>
                  <Ionicons name="checkmark" size={14} color="white" />
                </View>
              </View>
              
              <Text style={tw`text-white text-2xl font-bold mt-4`}>Astral Link</Text>
              <Text style={tw`text-orange-400 text-sm font-medium`}>Senior Developer</Text>
              
              <View style={tw`flex-row mt-4 space-x-4`}>
                 <View style={tw`bg-white/10 px-4 py-2 rounded-full`}>
                    <Text style={tw`text-gray-300 text-xs`}>Pro Member</Text>
                 </View>
                 <View style={tw`bg-orange-500/20 px-4 py-2 rounded-full border border-orange-500/30`}>
                    <Text style={tw`text-orange-300 text-xs`}>Level 42</Text>
                 </View>
              </View>
            </GlassContainer>
          </Animated.View>

          {/* Stats Grid */}
          <View style={tw`flex-row flex-wrap justify-between mb-6`}>
             <Animated.View entering={FadeInDown.delay(300)} style={tw`w-[48%]`}>
                <GlassContainer intensity={20} borderRadius={16} style={tw`h-32 justify-between mb-4`}>
                   <View style={tw`bg-blue-500/20 p-2 rounded-lg self-start`}>
                      <Ionicons name="time" size={20} color="#60a5fa" />
                   </View>
                   <View>
                      <Text style={tw`text-3xl font-bold text-white`}>124</Text>
                      <Text style={tw`text-gray-400 text-xs uppercase`}>Hours Focus</Text>
                   </View>
                </GlassContainer>
             </Animated.View>
             
             <Animated.View entering={FadeInDown.delay(400)} style={tw`w-[48%]`}>
                <GlassContainer intensity={20} borderRadius={16} style={tw`h-32 justify-between mb-4`}>
                   <View style={tw`bg-green-500/20 p-2 rounded-lg self-start`}>
                      <Ionicons name="checkmark-done" size={20} color="#4ade80" />
                   </View>
                   <View>
                      <Text style={tw`text-3xl font-bold text-white`}>86</Text>
                      <Text style={tw`text-gray-400 text-xs uppercase`}>Tasks Done</Text>
                   </View>
                </GlassContainer>
             </Animated.View>

             <Animated.View entering={FadeInDown.delay(500)} style={tw`w-full`}>
                <GlassContainer intensity={20} borderRadius={16} style={tw`p-4 flex-row items-center justify-between`}>
                   <View style={tw`flex-row items-center`}>
                      <View style={tw`bg-purple-500/20 p-2 rounded-lg mr-4`}>
                         <Ionicons name="trophy" size={20} color="#c084fc" />
                      </View>
                      <View>
                         <Text style={tw`text-white font-bold`}>Achievements</Text>
                         <Text style={tw`text-gray-400 text-xs`}>12 of 50 unlocked</Text>
                      </View>
                   </View>
                   <Ionicons name="chevron-forward" size={20} color="gray" />
                </GlassContainer>
             </Animated.View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
