import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import EmailsScreen from '../screens/EmailsScreen';
import CalendarScreen from '../screens/CalendarScreen';
import KnowledgeScreen from '../screens/KnowledgeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CustomDrawerContent from './CustomDrawerContent';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { TouchableOpacity } from 'react-native';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: '#1f2937', // gray-800
        drawerActiveTintColor: '#f97316', // orange-500
        drawerInactiveTintColor: '#9ca3af', // gray-400
        drawerLabelStyle: { marginLeft: 0, fontWeight: '600' },
        drawerStyle: { width: '80%', backgroundColor: '#0f0f12' },
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
           drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={22} color={color} />
        }}
      />
      <Drawer.Screen 
        name="Emails" 
        component={EmailsScreen} 
        options={{
           drawerIcon: ({ color, size }) => <Ionicons name="mail-outline" size={22} color={color} />
        }}
      />
      <Drawer.Screen 
        name="Calendar" 
        component={CalendarScreen} 
        options={{
           drawerIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={22} color={color} />
        }}
      />
      <Drawer.Screen 
        name="Knowledge" 
        component={KnowledgeScreen} 
        options={{
           drawerIcon: ({ color, size }) => <Ionicons name="library-outline" size={22} color={color} />
        }}
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{
           drawerIcon: ({ color, size }) => <Ionicons name="settings-outline" size={22} color={color} />
        }}
      />
    </Drawer.Navigator>
  );
}
