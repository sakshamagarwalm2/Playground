import { Platform } from 'react-native';

// UPDATE THIS WITH YOUR MACHINE'S LAN IP ADDRESS for real device testing
// You can find it by running `ipconfig` (Windows) or `ifconfig` / `ip addr` (Mac/Linux)
// It usually looks like 192.168.x.x
const DEV_MACHINE_IP = '10.97.249.210'; // Replace with your computer's IP

const localhost = Platform.OS === 'android' ? '10.0.2.2' : '127.0.0.1';

export const API_URL =
  process.env.NODE_ENV === 'development'
    ? `http://${DEV_MACHINE_IP}:3000` // Use LAN IP for development on device
    // ? `http://${localhost}:3000` // Use this for Simulator/Emulator if prefered
    : 'https://your-production-url.com';
