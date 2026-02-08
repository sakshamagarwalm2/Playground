import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface MenuHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function MenuHeader({ title, subtitle }: MenuHeaderProps) {
  const navigation = useNavigation();

  return (
    <View style={tw`bg-[#0f0f12] px-6 pt-2 pb-4 flex-row items-center justify-between`}>
      <View style={tw`flex-row items-center`}>
         <TouchableOpacity 
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            style={tw`p-2 -ml-2 mr-3 rounded-full bg-gray-900 border border-gray-800`}
         >
            <Ionicons name="menu" size={24} color="#f97316" />
         </TouchableOpacity>
         
         <View>
            {title && <Text style={tw`text-xl font-bold text-white`}>{title}</Text>}
            {subtitle && <Text style={tw`text-xs text-gray-400`}>{subtitle}</Text>}
         </View>
      </View>
      
      {/* Optional: Add profile icon or actions here if needed */}
    </View>
  );
}
