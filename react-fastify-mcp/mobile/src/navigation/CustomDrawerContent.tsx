import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CustomDrawerContent(props: any) {
  return (
    <View style={tw`flex-1 bg-[#0f0f12]`}>
      <DrawerContentScrollView {...props} contentContainerStyle={tw`pt-0`}>
        
        {/* Profile Section in Drawer */}
        <View style={tw`bg-gray-900 p-6 pt-16 mb-4 border-b border-gray-800`}>
           <View style={tw`flex-row items-center mb-4`}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop' }} 
                style={tw`w-16 h-16 rounded-full border-2 border-orange-500`}
              />
              <View style={tw`ml-4`}>
                 <Text style={tw`text-white text-lg font-bold`}>Saksham</Text>
                 <Text style={tw`text-orange-400 text-xs`}>Pro Workspace</Text>
              </View>
           </View>
        </View>

        {/* Menu Items */}
        <View style={tw`px-2`}>
           <DrawerItemList {...props} />
        </View>

      </DrawerContentScrollView>

      {/* Footer */}
      <View style={tw`p-6 border-t border-gray-800`}>
         <TouchableOpacity onPress={() => props.navigation.replace('Login')} style={tw`flex-row items-center`}>
            <Ionicons name="log-out-outline" size={20} color="#9ca3af" />
            <Text style={tw`text-gray-400 ml-3 font-medium`}>Sign Out</Text>
         </TouchableOpacity>
      </View>
    </View>
  );
}
