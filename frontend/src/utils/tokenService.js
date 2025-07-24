// src/utils/tokenStorage.js
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

const TOKEN_KEY = 'token';

// ✅ Check platform: true = mobile (iOS/Android), false = web
const isNative = Capacitor.isNativePlatform();

// ✅ Store token
export const storeToken = async (token) => {
  if (isNative) {
    await Preferences.set({ key: TOKEN_KEY, value: token });
  } else {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

// ✅ Get token
export const getToken = async () => {
  if (isNative) {
    const { value } = await Preferences.get({ key: TOKEN_KEY });
    return value;
  } else {
    return localStorage.getItem(TOKEN_KEY);
  }
};

// ✅ Remove token
export const removeToken = async () => {
  if (isNative) {
    await Preferences.remove({ key: TOKEN_KEY });
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};
