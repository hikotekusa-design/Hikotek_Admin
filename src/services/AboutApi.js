import { BASE_URL } from './baseUrls';

export const AboutApi = {
  // Get about data
  get: async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers = {
        'Content-Type': 'application/json',
      };

      // Add authorization header only if token exists (for admin route)
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      // Use admin endpoint if token exists, otherwise public endpoint
      const endpoint = token ? `${BASE_URL}/admin/about` : `${BASE_URL}/about`;
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch about data');
      }

      return data;
    } catch (error) {
      console.error('API Get About Error:', error);
      throw error;
    }
  },

  // Update about data
  update: async (formData) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch(`${BASE_URL}/admin/about`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        const errorMessage = data.error || data.errors?.join(', ') || 'Failed to update about data';
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error('API Update About Error:', error);
      throw error;
    }
  },

  // Upload image only (for separate image uploads if needed)
  uploadImage: async (imageType, imageFile) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication token not found');

      const formData = new FormData();
      formData.append(imageType, imageFile);

      const response = await fetch(`${BASE_URL}/admin/about/image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Failed to upload ${imageType}`);
      }

      return data;
    } catch (error) {
      console.error(`API Upload Image Error (${imageType}):`, error);
      throw error;
    }
  },

  // Delete specific image
  deleteImage: async (imageType) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch(`${BASE_URL}/admin/about/image/${imageType}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Failed to delete ${imageType}`);
      }

      return data;
    } catch (error) {
      console.error(`API Delete Image Error (${imageType}):`, error);
      throw error;
    }
  }
};