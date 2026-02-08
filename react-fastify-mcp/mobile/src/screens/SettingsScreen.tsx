import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, Switch, TouchableOpacity, Linking, Alert } from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MenuHeader from '../components/MenuHeader';

// Replace with your machine's local IP if localhost doesn't work on device
const BACKEND_URL = 'http://10.97.249.210:3000'; 
const STORAGE_KEY = '@flowpilot_connection_status';

// Track connection status: null = untested, true = success, false = failed
type ConnectionStatus = { [key: string]: boolean | null };

export default function SettingsScreen({ navigation }: any) {
  const [autonomy, setAutonomy] = useState(0.5);
  const [notifications, setNotifications] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    gmail: null,
    calendar: null,
    notion: null,
  });

  // Load saved connection status on mount
  useEffect(() => {
    const loadStatus = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          setConnectionStatus(JSON.parse(saved));
        }
      } catch (e) {
        console.log('Failed to load connection status');
      }
    };
    loadStatus();
  }, []);

  // Save connection status whenever it changes
  const saveStatus = async (newStatus: ConnectionStatus) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newStatus));
    } catch (e) {
      console.log('Failed to save connection status');
    }
  };

  const handleTestConnection = async (service: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/test/${service}`);
      const data = await response.json();
      
      if (response.ok && (data.success || data.count !== undefined)) {
         const newStatus = { ...connectionStatus, [service]: true };
         setConnectionStatus(newStatus);
         saveStatus(newStatus);
         Alert.alert('✅ Connected', `${service} is working!`);
      } else {
         const newStatus = { ...connectionStatus, [service]: false };
         setConnectionStatus(newStatus);
         saveStatus(newStatus);
         Alert.alert('❌ Failed', `${service} error:\n${data.error || JSON.stringify(data)}`);
      }
    } catch (error: any) {
      const newStatus = { ...connectionStatus, [service]: false };
      setConnectionStatus(newStatus);
      saveStatus(newStatus);
      Alert.alert('⚠️ Network Error', `Could not reach backend.\n${error.message}`);
    }
  };

  // Helper to render status indicator
  const StatusIndicator = ({ service }: { service: string }) => {
    const status = connectionStatus[service];
    if (status === null) return <Text style={tw`text-xs text-orange-500`}>Check</Text>;
    if (status === true) return <Ionicons name="checkmark-circle" size={20} color="#22c55e" />;
    return <Ionicons name="close-circle" size={20} color="#ef4444" />;
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[#0f0f12]`}>
      <MenuHeader title="Settings" />

      <ScrollView contentContainerStyle={tw`p-6 pt-2`}>
        
        {/* AI Autonomy */}
        <View style={tw`mb-8`}>
           <Text style={tw`text-lg font-semibold text-white mb-2`}>AI Autonomy</Text>
           <Text style={tw`text-gray-400 text-sm mb-6`}>
              Decide how much freedom FlowPilot has to act on your behalf.
           </Text>
           
           <View style={tw`flex-row justify-between mb-2 px-2`}>
              <Text style={tw`text-xs font-medium text-gray-500`}>Manual</Text>
              <Text style={tw`text-xs font-medium text-orange-500`}>Semi-Auto</Text>
              <Text style={tw`text-xs font-medium text-gray-500`}>Full Auto</Text>
           </View>
           
           <Slider
             style={{width: '100%', height: 40}}
             minimumValue={0}
             maximumValue={1}
             value={autonomy}
             onValueChange={setAutonomy}
             minimumTrackTintColor="#f97316"
             maximumTrackTintColor="#374151"
             thumbTintColor="#f97316"
           />
           <View style={tw`bg-gray-900 p-4 rounded-xl mt-2 border border-gray-800 shadow-sm`}>
              <Text style={tw`text-sm text-gray-400`}>
                 {autonomy < 0.3 ? "I'll ask for approval before doing anything." : 
                  autonomy < 0.7 ? "I'll draft replies and schedule meetings, but wait for confirmation." : 
                  "I'll handle routine tasks automatically and notify you."}
              </Text>
           </View>
        </View>

        {/* Preferences */}
        <View style={tw`mb-8`}>
           <Text style={tw`text-lg font-semibold text-white mb-4`}>Preferences</Text>
           
           <View style={tw`flex-row justify-between items-center py-3 border-b border-gray-800`}>
              <Text style={tw`text-gray-300`}>Push Notifications</Text>
              <Switch 
                value={notifications} 
                onValueChange={setNotifications} 
                trackColor={{ false: "#374151", true: "#fdba74" }}
                thumbColor={notifications ? "#f97316" : "#f4f3f4"}
              />
           </View>
           
           <View style={tw`flex-row justify-between items-center py-3 border-b border-gray-800`}>
              <Text style={tw`text-gray-300`}>Dark Mode</Text>
              <Switch 
                value={true} 
                trackColor={{ false: "#374151", true: "#fdba74" }}
                thumbColor={true ? "#f97316" : "#f4f3f4"}
                disabled
              />
           </View>
        </View>

        {/* Profile Link */}
        <View style={tw`bg-gray-900 p-4 rounded-xl flex-row items-center justify-between border border-gray-800 mb-8`}>
           <View style={tw`flex-row items-center`}>
              <View style={tw`w-10 h-10 bg-gray-800 rounded-full items-center justify-center mr-3 border border-gray-700`}>
                 <Ionicons name="person" size={20} color="#f97316" />
              </View>
              <View>
                 <Text style={tw`font-medium text-gray-200`}>Astral Link</Text>
                 <Text style={tw`text-xs text-orange-500`}>Manage Connected Accounts</Text>
              </View>
           </View>
           <Ionicons name="chevron-forward" size={20} color="#f97316" />
        </View>

        {/* Integrations & Testing */}
        <View style={tw`mb-20`}>
          <Text style={tw`text-lg font-semibold text-white mb-4`}>Backend Integrations</Text>

          <View style={tw`bg-gray-900 rounded-xl border border-gray-800 overflow-hidden`}>
            
            {/* Connect Google */}
            <TouchableOpacity 
              onPress={() => Linking.openURL(`${BACKEND_URL}/auth/google`)}
              style={tw`p-4 border-b border-gray-800 flex-row items-center justify-between active:bg-gray-800`}
            >
              <View style={tw`flex-row items-center`}>
                <Ionicons name="logo-google" size={20} color="#f97316" style={tw`mr-3`} />
                <Text style={tw`text-gray-200`}>Authorize Google</Text>
              </View>
              <Ionicons name="open-outline" size={18} color="#6b7280" />
            </TouchableOpacity>

            {/* Test Gmail */}
            <TouchableOpacity 
              onPress={() => handleTestConnection('gmail')}
              style={tw`p-4 border-b border-gray-800 flex-row items-center justify-between active:bg-gray-800`}
            >
               <View style={tw`flex-row items-center`}>
                <Ionicons name="mail" size={20} color="#9ca3af" style={tw`mr-3`} />
                <Text style={tw`text-gray-200`}>Test Gmail</Text>
              </View>
              <StatusIndicator service="gmail" />
            </TouchableOpacity>

            {/* Test Calendar */}
            <TouchableOpacity 
              onPress={() => handleTestConnection('calendar')}
              style={tw`p-4 border-b border-gray-800 flex-row items-center justify-between active:bg-gray-800`}
            >
               <View style={tw`flex-row items-center`}>
                <Ionicons name="calendar" size={20} color="#9ca3af" style={tw`mr-3`} />
                <Text style={tw`text-gray-200`}>Test Calendar</Text>
              </View>
              <StatusIndicator service="calendar" />
            </TouchableOpacity>

            {/* Test Notion */}
            <TouchableOpacity 
              onPress={() => handleTestConnection('notion')}
              style={tw`p-4 flex-row items-center justify-between active:bg-gray-800`}
            >
               <View style={tw`flex-row items-center`}>
                <Ionicons name="document-text" size={20} color="#9ca3af" style={tw`mr-3`} />
                <Text style={tw`text-gray-200`}>Test Notion</Text>
              </View>
              <StatusIndicator service="notion" />
            </TouchableOpacity>

          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
