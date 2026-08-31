import { auth } from "@/lib/firebase";

const API_BASE_URL = 'https://atmik-ai-backend.swatantra-backend.workers.dev';

// A helper to get the Firebase auth token
const getAuthHeaders = async () => {
  if (!auth.currentUser) {
    throw new Error('User is not authenticated via Firebase');
  }
  
  const token = await auth.currentUser.getIdToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const apiService = {
  /**
   * Save content metadata to Cloudflare D1 Database
   */
  async saveContentMetadata(data: { title: string; type: string; coverUrl?: string; fileUrl: string; description?: string; author?: string; readTime?: number }): Promise<void> {
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
          try {
            const errResponse = JSON.parse(xhr.responseText);
            reject(new Error(errResponse.error || `Upload failed with status ${xhr.status}`));
          } catch (e) {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
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
  },

  /**
   * Fetch all users from the backend
   */
  async fetchUsers(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
      method: 'GET',
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Failed to fetch users. Status: ${response.status}, Body: ${errText}`);
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data;
  },

  /**
   * Update a user's role
   */
  async updateUserRole(id: string, role: 'ADMIN' | 'USER'): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${id}/role`, {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: JSON.stringify({ role }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update user role: ${response.statusText}`);
    }
  }
};
