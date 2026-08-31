import { firebase } from '@react-native-firebase/auth';

const API_BASE_URL = 'https://atmik-ai-backend.swatantra-backend.workers.dev';

const getAuthHeaders = async () => {
  let token = 'temp-user-token';
  const auth = firebase.auth();
  const currentUser = auth.currentUser;
  if (currentUser) {
    token = await currentUser.getIdToken();
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const apiService = {
  /**
   * Fetch all content from the library
   */
  async fetchLibraryContent(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/library/content`, {
        method: 'GET',
        headers: await getAuthHeaders(),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Backend returned error:", response.status, text);
        throw new Error(`Failed to fetch content: ${response.status} ${text}`);
      }

      const json = await response.json();
      return json.data || [];
    } catch (error) {
      console.error("Error fetching library content:", error);
      return [];
    }
  },
};
