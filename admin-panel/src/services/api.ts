import { auth } from "@/lib/firebase";

const API_BASE_URL = 'https://atmik-ai-backend.swatantra-backend.workers.dev';

// A helper to get the Firebase auth token
const getAuthHeaders = async () => {
  let token = 'temp-admin-token';
  if (auth.currentUser) {
    token = await auth.currentUser.getIdToken();
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const apiService = {
  /**
   * Save content metadata to Cloudflare D1 Database
   */
  async saveContentMetadata(data: { title: string; type: string; coverUrl?: string; fileUrl: string }): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/library/content`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to save content metadata: ${response.statusText}`);
    }
  },

  /**
   * Upload a file directly to the backend Worker, which stores it in R2
   */
  async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<{ fileKey: string; publicUrl: string }> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (e) {
            reject(new Error('Invalid response from server'));
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });

      const formData = new FormData();
      formData.append('file', file);

      xhr.open('POST', `${API_BASE_URL}/api/library/upload`, true);
      getAuthHeaders().then(headers => {
        // Remove Content-Type so browser sets boundary for FormData
        delete headers['Content-Type'];
        
        Object.keys(headers).forEach(key => {
          xhr.setRequestHeader(key, headers[key as keyof typeof headers]);
        });

        xhr.send(formData);
      });
    });
  }
};
