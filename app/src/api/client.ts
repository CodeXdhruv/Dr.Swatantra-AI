import auth from '@react-native-firebase/auth';
import { Platform } from 'react-native';

// Hardcoded to deployed backend for testing
export const API_BASE_URL = 'https://atmik-ai-backend.swatantra-backend.workers.dev/api';

/**
 * A central fetch wrapper that automatically attaches the Firebase ID token
 * to every request going to our Cloudflare backend.
 */
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const currentUser = auth().currentUser;
  let token = '';
  
  if (currentUser) {
    // Force refresh if needed, otherwise grab cached token
    token = await currentUser.getIdToken();
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API Request Failed');
  }

  return data;
}
