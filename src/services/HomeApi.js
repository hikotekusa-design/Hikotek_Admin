import { BASE_URL } from './baseUrls';

export const HomeApi = {
  // Create a new item in the specified section
  create: async (section, formData) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch(`${BASE_URL}/admin/home/${section}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      console.log(`Create item raw response for ${section}:`, data);

      if (!response.ok) {
        const errorMessage = data.error || data.errors?.join(', ') || `Failed to create item in ${section}`;
        throw new Error(errorMessage);
      }

      return {
        success: true,
        itemId: data.data?.id,
        data: data.data || { id: data.itemId, ...data },
      };
    } catch (error) {
      console.error(`API Create Item Error (${section}):`, error);
      throw error;
    }
  },

  // Get all items for a section
  getAll: async (section) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch(`${BASE_URL}/admin/home/${section}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `Failed to fetch items from ${section}`);
      }

      return data;
    } catch (error) {
      console.error(`API Get Items Error (${section}):`, error);
      throw error;
    }
  },

  // Get single item by ID in a section
  getById: async (section, id) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch(`${BASE_URL}/admin/home/${section}/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `Failed to fetch item from ${section}`);
      }

      return data;
    } catch (error) {
      console.error(`API Get Item Error (${section}/${id}):`, error);
      throw error;
    }
  },

  // Update an item in the specified section
  update: async (section, id, formData) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch(`${BASE_URL}/admin/home/${section}/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.errors?.join(', ') || `Failed to update item in ${section}`);
      }

      return data;
    } catch (error) {
      console.error(`API Update Item Error (${section}/${id}):`, error);
      throw error;
    }
  },

  // Delete an item from the specified section
  delete: async (section, id) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch(`${BASE_URL}/admin/home/${section}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `Failed to delete item from ${section}`);
      }

      return data;
    } catch (error) {
      console.error(`API Delete Item Error (${section}/${id}):`, {
        message: error.message,
        url: `${BASE_URL}/admin/home/${section}/${id}`,
      });
      throw error;
    }
  },
};