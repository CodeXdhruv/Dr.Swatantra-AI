const API_BASE_URL = 'https://atmik-ai-backend.swatantra-backend.workers.dev';

const getAuthHeaders = () => {
  return {
    'Authorization': `Bearer temp-user-token`,
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
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch content: ${response.statusText}`);
      }

      const json = await response.json();
      return json.data || [];
    } catch (error) {
      console.error("Error fetching library content:", error);
      return [];
    }
  },
};
