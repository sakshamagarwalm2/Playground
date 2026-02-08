# React Native + Fastify Project

This project contains a Fastify backend and a React Native (Expo) frontend.

## Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- Expo Go app on your physical device (iOS or Android)

## Setup

1. **Install Dependencies**

   ```bash
   # Backend
   cd backend
   npm install

   # Mobile
   cd ../mobile
   npm install
   ```

2. **Configure IP Address**

   For the mobile app to connect to the backend on your computer, they must be on the same Wi-Fi network.
   
   - Find your computer's local IP address:
     - **Mac/Linux**: `ifconfig` or `ip addr` (look for `192.168.x.x` or `10.x.x.x`)
     - **Windows**: `ipconfig`
   - Open `mobile/config.js`.
   - Update `DEV_MACHINE_IP` with your IP address.

## Running the Project

1. **Start the Backend**

   Open a terminal and run:
   ```bash
   cd backend
   npm run dev
   ```
   The server will start on port 3000.

2. **Start the Mobile App**

   Open another terminal and run:
   ```bash
   cd mobile
   npx expo start
   ```
   
   - Scan the QR code with the Expo Go app on your phone.
   - Or press `i` to run in iOS Simulator / `a` for Android Emulator (make sure to update `config.js` to use `localhost` or `10.0.2.2` if needed, although the IP address should work for emulators too if bridge mode is on).

## Troubleshooting

- **Connection Refused**: Ensure the backend is running and you entered the correct IP address in `mobile/config.js`.
- **Network Error**: Make sure your phone and computer are on the exact same Wi-Fi network. firewall might be blocking port 3000.
