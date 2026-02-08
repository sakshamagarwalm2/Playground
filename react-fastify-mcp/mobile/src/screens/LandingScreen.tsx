import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

const { height } = Dimensions.get('window');

export default function LandingScreen({ navigation }: any) {
  return (
    <SafeAreaView style={tw`flex-1 bg-[#0f0f12]`}>
      <ScrollView contentContainerStyle={tw`px-6 pt-10 pb-20`}>
        
        {/* --- Hero Section --- */}
        <Animated.View entering={FadeInDown.duration(800)} style={tw`mb-16`}>
           <View style={tw`flex-row items-center mb-6`}>
              <View style={tw`w-10 h-10 bg-orange-600 rounded-xl items-center justify-center mr-3 shadow-[0_0_15px_rgba(234,88,12,0.5)]`}>
                 <Ionicons name="infinite" size={24} color="white" />
              </View>
              <Text style={tw`text-2xl font-bold text-white tracking-tight`}>FlowPilot</Text>
           </View>

           <Text style={tw`text-4xl font-bold text-white leading-tight mb-4`}>
             Your emails, meetings, and notes—handled <Text style={tw`text-orange-500`}>intelligently</Text>.
           </Text>
           <Text style={tw`text-lg text-gray-400 leading-relaxed mb-8`}>
             FlowPilot reads emails, plans calendars when needed, and organizes everything in Notion—without chaos.
           </Text>

           <TouchableOpacity 
             onPress={() => navigation.navigate('Login')}
             style={tw`bg-orange-600 py-4 px-8 rounded-full items-center shadow-[0_0_20px_rgba(234,88,12,0.4)] mb-4`}
           >
             <Text style={tw`text-white text-lg font-bold`}>Get Started</Text>
           </TouchableOpacity>
           
           <TouchableOpacity style={tw`items-center`}>
             <Text style={tw`text-gray-500 font-medium`}>See how it works</Text>
           </TouchableOpacity>
        </Animated.View>


        {/* --- Feature Cards --- */}
        <Animated.View entering={FadeInUp.delay(200).duration(800)} style={tw`mb-16`}>
           <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`-mx-6 pl-6`}>
              
              <View style={tw`bg-gray-900 w-64 p-6 rounded-2xl mr-4 border border-gray-800`}>
                 <View style={tw`w-10 h-10 bg-blue-900/30 rounded-full items-center justify-center mb-4 border border-blue-500/30`}>
                    <Ionicons name="mail" size={20} color="#3b82f6" />
                 </View>
                 <Text style={tw`text-lg font-bold text-white mb-2`}>Email Intelligence</Text>
                 <Text style={tw`text-gray-400`}>Summarizes threads and highlights what matters.</Text>
              </View>

              <View style={tw`bg-gray-900 w-64 p-6 rounded-2xl mr-4 border border-gray-800`}>
                 <View style={tw`w-10 h-10 bg-purple-900/30 rounded-full items-center justify-center mb-4 border border-purple-500/30`}>
                    <Ionicons name="calendar" size={20} color="#a855f7" />
                 </View>
                 <Text style={tw`text-lg font-bold text-white mb-2`}>Smart Calendar</Text>
                 <Text style={tw`text-gray-400`}>Suggests meetings based on your conversations.</Text>
              </View>

              <View style={tw`bg-gray-900 w-64 p-6 rounded-2xl mr-4 border border-gray-800`}>
                 <View style={tw`w-10 h-10 bg-orange-900/30 rounded-full items-center justify-center mb-4 border border-orange-500/30`}>
                    <Ionicons name="document-text" size={20} color="#f97316" />
                 </View>
                 <Text style={tw`text-lg font-bold text-white mb-2`}>Auto Organization</Text>
                 <Text style={tw`text-gray-400`}>Files decisions and notes directly into Notion.</Text>
              </View>
           
           </ScrollView>
        </Animated.View>


        {/* --- How It Works --- */}
        <Animated.View entering={FadeInUp.delay(400).duration(800)} style={tw`mb-10`}>
           <Text style={tw`text-xl font-bold text-white mb-6`}>How it works</Text>
           
           {[
             { title: 'Connect', desc: 'Link your Gmail and Notion.', icon: 'link' },
             { title: 'AI Understands', desc: 'We analyze context securely.', icon: 'bulb' },
             { title: 'You Approve', desc: 'Nothing happens without you.', icon: 'checkmark-circle' },
             { title: 'Everything Syncs', desc: 'Your life, organized.', icon: 'sync' }
           ].map((step, index) => (
             <View key={index} style={tw`flex-row mb-6 items-start`}>
                <View style={tw`w-8 h-8 rounded-full bg-gray-900 items-center justify-center mr-4 mt-1 border border-gray-800`}>
                   <Ionicons name={step.icon as any} size={16} color="#9ca3af" />
                </View>
                <View style={tw`flex-1`}>
                   <Text style={tw`text-base font-semibold text-gray-200`}>{step.title}</Text>
                   <Text style={tw`text-gray-500`}>{step.desc}</Text>
                </View>
             </View>
           ))}
        </Animated.View>
        
        {/* --- Footer --- */}
        <View style={tw`items-center pt-8 border-t border-gray-900`}>
           <Text style={tw`text-xs text-gray-600 mb-2`}>Privacy-first design. We don't sell your data.</Text>
           <Text style={tw`text-xs font-semibold text-gray-700 uppercase tracking-widest`}>Built for Professionals</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
