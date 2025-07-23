import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.complymax.app',
  appName: 'Complymax Management Pvt. Ltd.',
  webDir: 'build',
  server: {
    cleartext: true, // allows http requests
    androidScheme: 'https', // or 'http' if not using SSL
    // hostname: 'localhost' // optional
  }
};

export default config;
