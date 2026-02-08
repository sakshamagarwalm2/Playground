import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';

import MenuHeader from '../components/MenuHeader';

const BACKEND_URL = 'http://10.97.249.210:3000';

type NotionPage = {
  pageId: string;
  title: string;
  lastEdited: string;
  stats: {
    totalBlocks: number;
    childPages: number;
    paragraphs: number;
    headings: number;
  };
  textContent: string;
  url: string;
};

export default function KnowledgeScreen() {
  const [page, setPage] = useState<NotionPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPage();
  }, []);

  const fetchPage = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/knowledge`);
      const data = await response.json();
      if (data.success) {
        setPage(data.pages);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch Notion data');
      }
    } catch (e: any) {
      setError('Could not connect to backend');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[#0f0f12]`}>
      <MenuHeader title="Knowledge" />

      <ScrollView contentContainerStyle={tw`p-6`}>
         
        <View style={tw`flex-row items-center mb-6`}>
          <Text style={tw`text-xs font-bold text-gray-500 uppercase tracking-wider flex-1`}>Notion Sync</Text>
          <View style={tw`flex-row items-center`}>
            <View style={tw`w-2 h-2 rounded-full bg-green-500 mr-2 shadow-[0_0_8px_rgba(34,197,94,0.6)]`} />
            <Text style={tw`text-xs text-gray-400`}>Connected</Text>
          </View>
        </View>

        {loading ? (
          <View style={tw`items-center py-10`}>
            <ActivityIndicator size="large" color="#f97316" />
            <Text style={tw`text-gray-500 mt-4`}>Loading Notion data...</Text>
          </View>
        ) : error ? (
          <View style={tw`items-center py-10`}>
            <Ionicons name="warning" size={40} color="#ef4444" />
            <Text style={tw`text-red-400 mt-4 text-center`}>{error}</Text>
            <TouchableOpacity onPress={fetchPage} style={tw`mt-4 bg-orange-600 px-4 py-2 rounded-lg`}>
              <Text style={tw`text-white font-medium`}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : page ? (
          <View style={tw`bg-gray-900 rounded-xl border border-gray-800 overflow-hidden`}>
            {/* Page Header */}
            <View style={tw`p-5 border-b border-gray-800`}>
              <View style={tw`flex-row items-center`}>
                <View style={tw`w-10 h-10 bg-orange-900/30 rounded-lg items-center justify-center mr-3`}>
                  <Ionicons name="document-text" size={22} color="#f97316" />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-lg font-semibold text-gray-100`}>{page.title}</Text>
                  <Text style={tw`text-xs text-gray-500`}>Last edited: {formatDate(page.lastEdited)}</Text>
                </View>
              </View>
            </View>

            {/* Stats */}
            <View style={tw`flex-row p-4 border-b border-gray-800`}>
              <View style={tw`flex-1 items-center`}>
                <Text style={tw`text-xl font-bold text-orange-500`}>{page.stats.totalBlocks}</Text>
                <Text style={tw`text-xs text-gray-500`}>Blocks</Text>
              </View>
              <View style={tw`flex-1 items-center`}>
                <Text style={tw`text-xl font-bold text-purple-500`}>{page.stats.childPages}</Text>
                <Text style={tw`text-xs text-gray-500`}>Pages</Text>
              </View>
              <View style={tw`flex-1 items-center`}>
                <Text style={tw`text-xl font-bold text-blue-500`}>{page.stats.paragraphs}</Text>
                <Text style={tw`text-xs text-gray-500`}>Paragraphs</Text>
              </View>
            </View>

            {/* Content Preview */}
            <View style={tw`p-5`}>
              <Text style={tw`text-xs font-bold text-gray-500 uppercase tracking-wider mb-3`}>Content Preview</Text>
              <Text style={tw`text-gray-400 text-sm leading-relaxed`}>
                {page.textContent}
              </Text>
            </View>

            {/* Open in Notion */}
            <TouchableOpacity 
              onPress={() => page.url && Linking.openURL(page.url)}
              style={tw`m-5 mt-0 bg-gray-800 p-4 rounded-xl flex-row items-center justify-center`}
            >
              <Ionicons name="open-outline" size={18} color="#f97316" style={tw`mr-2`} />
              <Text style={tw`text-orange-500 font-medium`}>Open in Notion</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={tw`items-center py-10`}>
            <Ionicons name="document-outline" size={40} color="#6b7280" />
            <Text style={tw`text-gray-500 mt-4`}>No page configured</Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}
