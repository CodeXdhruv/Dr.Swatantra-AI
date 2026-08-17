import { apiFetch } from './client';

export const AuthService = {
  /**
   * Syncs the successfully logged-in Firebase user with our D1 Database.
   */
  syncUser: async (firebaseUid: string, email: string, displayName?: string) => {
    return apiFetch('/auth/sync', {
      method: 'POST',
      body: JSON.stringify({ firebaseUid, email, displayName }),
    });
  }
};

export const ChatService = {
  /**
   * Sends a text message to the standard Text Chat RAG pipeline.
   * Parses the SSE stream to extract the final response text.
   */
  sendTextChatMessage: async (text: string, userId: string) => {
    const { apiFetch, API_BASE_URL } = require('./client');
    const auth = require('@react-native-firebase/auth').default;
    
    let token = '';
    const currentUser = auth().currentUser;
    if (currentUser) {
      token = await currentUser.getIdToken();
    }

    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ text, userId }),
    });

    const responseText = await response.text();
    
    // Parse SSE stream format
    const lines = responseText.split('\n');
    let final_text = '';
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.substring(6));
          if (data.type === 'done') {
            final_text = data.final_text;
          } else if (data.type === 'error') {
            throw new Error(data.message);
          }
        } catch (e) {
          // ignore invalid JSON lines
        }
      }
    }
    
    return { response: final_text };
  }
};

export const LibraryService = {
  /**
   * Gets a pre-signed URL to upload a file directly to Cloudflare R2
   */
  getUploadUrl: async (filename: string) => {
    return apiFetch(`/library/upload-url?filename=${encodeURIComponent(filename)}`, {
      method: 'GET',
    });
  },

  /**
   * Saves the media record to the D1 Database after it's uploaded to R2
   */
  saveContentRecord: async (title: string, type: 'BOOK' | 'VIDEO' | 'AUDIO', fileUrl: string, coverUrl?: string) => {
    return apiFetch('/library/content', {
      method: 'POST',
      body: JSON.stringify({ title, type, fileUrl, coverUrl }),
    });
  },

  /**
   * Fetches all library content
   */
  getAllContent: async () => {
    return apiFetch('/library/content', {
      method: 'GET',
    });
  }
};
