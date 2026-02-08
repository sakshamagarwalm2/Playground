import React, { useState } from 'react';
import { 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView,
  Dimensions
} from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }: any) {

  const handleLogin = () => {
    // Navigate to Home Main Tab
    navigation.replace('Main');
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[#0f0f12] justify-center items-center px-6`}>
      
      {/* Brand */}
      <Animated.View entering={FadeInUp.delay(200).duration(800)} style={tw`items-center mb-16`}>
         <View style={tw`w-16 h-16 bg-orange-600 rounded-2xl items-center justify-center mb-6 shadow-[0_0_20px_rgba(234,88,12,0.4)]`}>
            <Ionicons name="infinite" size={32} color="white" />
         </View>
         <Text style={tw`text-2xl font-bold text-white tracking-tight`}>Welcome back to FlowPilot</Text>
         <Text style={tw`text-gray-500 mt-2 text-center`}>Intelligent workspace management</Text>
      </Animated.View>

      {/* Auth Buttons */}
      <Animated.View entering={FadeInUp.delay(400).duration(800)} style={tw`w-full max-w-sm`}>
        
        <TouchableOpacity 
          onPress={handleLogin}
          style={tw`flex-row items-center justify-center border border-gray-800 bg-gray-900 p-4 rounded-xl mb-4 shadow-sm`}
        >
           <Ionicons name="logo-google" size={20} color="#4285F4" style={tw`mr-3`} />
           <Text style={tw`text-gray-200 font-semibold`}>Continue with Google</Text>
        </TouchableOpacity>
        <Text style={tw`text-xs text-gray-600 text-center mb-6`}>We only sync email metadata and calendar events.</Text>

        <TouchableOpacity 
          onPress={handleLogin}
          style={tw`flex-row items-center justify-center border border-gray-800 bg-gray-900 p-4 rounded-xl mb-4 shadow-sm`}
        >
           <View style={tw`mr-3 bg-white rounded p-0.5`}>
             <Text style={tw`text-black text-[10px] font-bold`}>N</Text>
           </View>
           <Text style={tw`text-gray-200 font-semibold`}>Continue with Notion</Text>
        </TouchableOpacity>
        <Text style={tw`text-xs text-gray-600 text-center`}>We organize summaries into your workspace.</Text>

      </Animated.View>

      {/* Footer */}
      <View style={tw`absolute bottom-10 items-center`}>
         <View style={tw`flex-row items-center bg-green-900/20 px-3 py-1 rounded-full border border-green-900/50`}>
             <Ionicons name="shield-checkmark" size={12} color="#22c55e" style={tw`mr-2`} />
             <Text style={tw`text-xs text-green-500 font-medium`}>Privacy-first by design</Text>
         </View>
      </View>

    </SafeAreaView>
  );
}
