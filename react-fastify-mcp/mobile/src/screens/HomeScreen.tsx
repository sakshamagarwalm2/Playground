
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons'; 
import MenuHeader from '../components/MenuHeader';
import { API_URL } from '../../config';

export default function HomeScreen() {

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);

  const handleSyncDay = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    setSyncLogs([]); // Clear previous logs
    
    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: "Analyze my emails for today. If there are any meetings or important events, create calendar events for them. Also summarize any key knowledge or tasks and add them to my Notion page.",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle streaming response
      // React Native fetch doesn't always support body.getReader() directly in all environments effectively
      // but usually works with text() if not streaming, or custom handling.
      // However, for true streaming in RN, we might need a library or careful handling.
      // Standard fetch in recent RN *does* support text streaming but it can be tricky.
      // Let's try a basic text-based chunk reader if possible, or fall back to waiting if the environment buffers.
      // Given it's Expo, standard fetch might buffer. 
      // But let's try to assume we can read it.
      
      const reader = response.body?.getReader(); // This might be undefined in some RN engines (Hermes often supports it now)
      
      if (!reader) {
          // Fallback if no reader (e.g. old debugger or specific engine quirk)
          // We just wait for text and parse lines
          const text = await response.text();
          const lines = text.split('\n').filter(Boolean);
          for (const line of lines) {
              try {
                  const chunk = JSON.parse(line);
                  if (chunk.type === 'log') {
                      setSyncLogs(prev => [...prev, chunk.message]);
                  } else if (chunk.type === 'result') {
                      setSyncResult(chunk.content);
                  } else if (chunk.type === 'error') {
                       Alert.alert('Sync Error', chunk.message);
                  }
              } catch (e) {
                  console.error('Error parsing chunk', e);
              }
          }
      } else {
          // Streaming reader
          const decoder = new TextDecoder();
          let buffer = '';
          
          while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              
              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              
              // Process all complete lines
              buffer = lines.pop() || ''; // Keep the last incomplete line in buffer
              
              for (const line of lines) {
                  if (!line.trim()) continue;
                  try {
                      const chunk = JSON.parse(line);
                      if (chunk.type === 'log') {
                          setSyncLogs(prev => [...prev, chunk.message]);
                      } else if (chunk.type === 'result') {
                          setSyncResult(chunk.content);
                      } else if (chunk.type === 'error') {
                           Alert.alert('Sync Error', chunk.message);
                      }
                  } catch (e) {
                      console.error('Json parse error', e);
                  }
              }
          }
      }
      
      Alert.alert('Sync Complete', 'Process finished.');

    } catch (error) {
      console.error('Sync Error:', error);
      Alert.alert('Sync Failed', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[#0f0f12]`}>
      <StatusBar style="light" />
      <MenuHeader title="Good morning, Saksham" subtitle="Here's what FlowPilot found today." />
      
      <ScrollView contentContainerStyle={tw`p-6 pt-2 pb-20`}>
        
        {/* Sync Button */}
        <TouchableOpacity 
          onPress={handleSyncDay}
          disabled={isSyncing}
          style={tw`bg-indigo-600 p-4 rounded-xl flex-row justify-center items-center shadow-lg shadow-indigo-900/50 mb-6 border border-indigo-500`}
        >
          {isSyncing ? (
             <ActivityIndicator color="white" style={tw`mr-2`} />
          ) : (
             <Ionicons name="sync" size={20} color="white" style={tw`mr-2`} />
          )}
          <Text style={tw`text-white font-bold text-lg`}>
            {isSyncing ? 'Syncing Your Day...' : 'Sync My Day'}
          </Text>
        </TouchableOpacity>

        {/* Live Logs Section */}
        {(isSyncing || syncLogs.length > 0) && (
            <View style={tw`bg-gray-900 p-4 rounded-xl border border-gray-800 mb-6 max-h-40`}>
                <Text style={tw`text-gray-500 text-xs font-bold uppercase mb-2`}>Agent Activity</Text>
                <ScrollView nestedScrollEnabled={true}>
                    {syncLogs.length === 0 && isSyncing && <Text style={tw`text-gray-400 italic`}>Starting...</Text>}
                    {syncLogs.map((log, index) => (
                        <Text key={index} style={tw`text-gray-300 text-xs mb-1 font-mono`}>
                           <Text style={tw`text-indigo-400`}>{'>'}</Text> {log}
                        </Text>
                    ))}
                </ScrollView>
            </View>
        )}

        {syncResult && (
          <View style={tw`bg-gray-900 p-4 rounded-xl border border-gray-800 mb-6`}>
            <Text style={tw`text-orange-400 font-bold mb-2`}>Final Result</Text>
            <Text style={tw`text-gray-300 text-sm italic`}>{syncResult}</Text>
          </View>
        )}

        {/* Overview Card - Responsive Fix */}
        <View style={tw`bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-800 mb-8`}>
           <View style={tw`flex-row justify-between flex-wrap mb-4`}>
              <View style={tw`w-[30%] mb-2`}>
                 <Text style={tw`text-3xl font-bold text-white`}>14</Text>
                 <Text style={tw`text-gray-500 text-[10px] uppercase tracking-wide`}>Emails Reviewed</Text>
              </View>
              <View style={tw`w-[30%] mb-2`}>
                 <Text style={tw`text-3xl font-bold text-white`}>3</Text>
                 <Text style={tw`text-gray-500 text-[10px] uppercase tracking-wide`}>Actions Suggested</Text>
              </View>
              <View style={tw`w-[30%] mb-2`}>
                 <Text style={tw`text-3xl font-bold text-white`}>5</Text>
                 <Text style={tw`text-gray-500 text-[10px] uppercase tracking-wide`}>Notes Saved</Text>
              </View>
           </View>
           <View style={tw`h-1 bg-gray-800 rounded-full w-full overflow-hidden`}>
              <View style={tw`h-full bg-orange-500 w-2/3 shadow-[0_0_10px_rgba(249,115,22,0.5)]`} />
           </View>
        </View>

        {/* Suggested Actions Feed */}
        <Text style={tw`text-lg font-bold text-white mb-4`}>Suggested Actions</Text>
        
        <View style={tw`bg-gray-900 p-5 rounded-xl border border-gray-800 mb-4 shadow-sm`}>
           <View style={tw`flex-row items-center mb-2`}>
              <Ionicons name="mail" size={16} color="#9ca3af" style={tw`mr-2`} />
              <Text style={tw`text-xs font-semibold text-gray-500 uppercase`}>From Email • 10m ago</Text>
           </View>
           <Text style={tw`text-base font-semibold text-gray-100 mb-1`}>Meeting Request: Project X</Text>
           <Text style={tw`text-gray-400 text-sm mb-4 leading-relaxed`}>
              John asked for a quick sync tomorrow at 10 AM. I can schedule this on your calendar.
           </Text>
           <View style={tw`flex-row`}>
              <TouchableOpacity style={tw`bg-orange-600 px-4 py-2 rounded-lg mr-3 shadow-lg shadow-orange-900/40`}>
                 <Text style={tw`text-white font-medium text-sm`}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity style={tw`bg-gray-800 px-4 py-2 rounded-lg border border-gray-700`}>
                 <Text style={tw`text-gray-400 font-medium text-sm`}>Dismiss</Text>
              </TouchableOpacity>
           </View>
        </View>

        <View style={tw`bg-gray-900 p-5 rounded-xl border border-gray-800 mb-8 shadow-sm`}>
           <View style={tw`flex-row items-center mb-2`}>
              <Ionicons name="calendar" size={16} color="#9ca3af" style={tw`mr-2`} />
              <Text style={tw`text-xs font-semibold text-gray-500 uppercase`}>Calendar • 1h ago</Text>
           </View>
           <Text style={tw`text-base font-semibold text-gray-100 mb-1`}>Prepare for Q3 Review</Text>
           <Text style={tw`text-gray-400 text-sm mb-4 leading-relaxed`}>
              You have a review meeting in 2 hours. I found related documents in Drive. Should I create a briefing note?
           </Text>
           <View style={tw`flex-row`}>
              <TouchableOpacity style={tw`bg-orange-600 px-4 py-2 rounded-lg mr-3 shadow-lg shadow-orange-900/40`}>
                 <Text style={tw`text-white font-medium text-sm`}>Create Note</Text>
              </TouchableOpacity>
              <TouchableOpacity style={tw`bg-gray-800 px-4 py-2 rounded-lg border border-gray-700`}>
                 <Text style={tw`text-gray-400 font-medium text-sm`}>Dismiss</Text>
              </TouchableOpacity>
           </View>
        </View>

        {/* Recent Activity */}
        <Text style={tw`text-lg font-bold text-white mb-4`}>Recent Activity</Text>
        
        <View style={tw`border-l-2 border-gray-800 ml-3 pl-6 pb-2`}>
           {[
             { title: 'Meeting Scheduled', time: '2m ago', desc: 'Sync with Design Team added to Calendar' },
             { title: 'Summary Saved', time: '1h ago', desc: 'Q3 Roadmap thread saved to Notion' },
             { title: 'Email Archived', time: '3h ago', desc: 'Newsletter from TechWeekly archived' }
           ].map((item, i) => (
             <View key={i} style={tw`mb-6 relative`}>
                <View style={tw`absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-orange-500 ring-4 ring-[#0f0f12] shadow-[0_0_8px_rgba(249,115,22,0.8)]`} />
                <View style={tw`flex-row justify-between items-start`}>
                   <View>
                      <Text style={tw`font-semibold text-gray-200`}>{item.title}</Text>
                      <Text style={tw`text-gray-500 text-sm`}>{item.desc}</Text>
                   </View>
                   <Text style={tw`text-xs text-gray-600`}>{item.time}</Text>
                </View>
             </View>
           ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
