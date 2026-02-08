import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';

import MenuHeader from '../components/MenuHeader';

const BACKEND_URL = 'http://10.97.249.210:3000';

type Email = {
  id: string;
  from: string;
  subject: string;
  snippet: string;
};

export default function EmailsScreen() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/emails`);
      const data = await response.json();
      if (data.success) {
        setEmails(data.emails);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch emails');
      }
    } catch (e: any) {
      setError('Could not connect to backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[#0f0f12]`}>
      <MenuHeader title="Emails" />
      
      {/* Tabs */}
      <View style={tw`flex-row px-6 border-b border-gray-800`}>
         {['All', 'Action Required', 'Summarized'].map((tab, i) => (
           <TouchableOpacity key={tab} style={tw`pb-3 mr-6 ${i === 0 ? 'border-b-2 border-orange-500' : ''}`}>
              <Text style={tw`${i === 0 ? 'text-orange-500 font-semibold' : 'text-gray-500'}`}>{tab}</Text>
           </TouchableOpacity>
         ))}
      </View>

      <ScrollView contentContainerStyle={tw`p-6`}>
        {loading ? (
          <View style={tw`items-center py-10`}>
            <ActivityIndicator size="large" color="#f97316" />
            <Text style={tw`text-gray-500 mt-4`}>Loading emails...</Text>
          </View>
        ) : error ? (
          <View style={tw`items-center py-10`}>
            <Ionicons name="warning" size={40} color="#ef4444" />
            <Text style={tw`text-red-400 mt-4 text-center`}>{error}</Text>
            <TouchableOpacity onPress={fetchEmails} style={tw`mt-4 bg-orange-600 px-4 py-2 rounded-lg`}>
              <Text style={tw`text-white font-medium`}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : emails.length === 0 ? (
          <View style={tw`items-center py-10`}>
            <Ionicons name="mail-open" size={40} color="#6b7280" />
            <Text style={tw`text-gray-500 mt-4`}>No emails found</Text>
          </View>
        ) : (
          emails.map((email) => (
            <View key={email.id} style={tw`p-4 bg-gray-900 rounded-xl border border-gray-800 mb-4`}>
              <View style={tw`flex-row justify-between mb-2`}>
                <Text style={tw`font-semibold text-gray-200 flex-1`} numberOfLines={1}>
                  {email.from?.split('<')[0]?.trim() || 'Unknown'}
                </Text>
                <View style={tw`bg-orange-900/40 px-2 py-0.5 rounded border border-orange-500/30 ml-2`}>
                  <Text style={tw`text-orange-400 text-xs font-medium`}>New</Text>
                </View>
              </View>
              <Text style={tw`text-sm font-medium text-gray-300 mb-1`} numberOfLines={1}>
                {email.subject || '(No Subject)'}
              </Text>
              <Text style={tw`text-sm text-gray-500 leading-relaxed`} numberOfLines={2}>
                {email.snippet}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
