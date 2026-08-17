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
  // Note: sendVoiceChatMessage has been removed. Voice chat is now handled via WebSocket using the useVoiceChat hook.

  /**
   * Sends a text message to the standard Text Chat RAG pipeline.
   */
  sendTextChatMessage: async (text: string, userId: string) => {
    return apiFetch('/chat', {
      method: 'POST',
      body: JSON.stringify({ text, userId }),
    });
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
