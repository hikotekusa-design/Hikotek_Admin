import { BASE_URL } from './baseUrls';

export const footerApi = {
  // Get all footer details
  getAll: async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch(`${BASE_URL}/admin/footer`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch footer details');
      }

      return data;
    } catch (error) {
      console.error('API Get Footer Error:', error);
      throw error;
    }
  },

  // Get single footer detail by ID
  getById: async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch(`${BASE_URL}/admin/footer/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch footer detail');
      }

      return data;
    } catch (error) {
      console.error('API Get Footer Detail Error:', error);
      throw error;
    }
  },

  // Create new footer detail
  create: async (footerData) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch(`${BASE_URL}/admin/footer`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(footerData),
      });

      const data = await response.json();
      if (!response.ok) {
        const errorMessage = data.error || data.errors?.join(', ') || 'Failed to create footer detail';
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error('API Create Footer Error:', error);
      throw error;
    }
  },

  // Update footer detail
  update: async (id, footerData) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch(`${BASE_URL}/admin/footer/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(footerData),
      });

      const data = await response.json();
      if (!response.ok) {
        const errorMessage = data.error || data.errors?.join(', ') || 'Failed to update footer detail';
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error('API Update Footer Error:', error);
      throw error;
    }
  },

  // Delete footer detail
  delete: async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch(`${BASE_URL}/admin/footer/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete footer detail');
      }

      return data;
    } catch (error) {
      console.error('API Delete Footer Error:', {
        message: error.message,
        id,
        url: `${BASE_URL}/admin/footer/${id}`,
      });
      throw error;
    }
  },

  // Get footer count
  getCount: async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch(`${BASE_URL}/admin/footer-count`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch footer count');
      }

      return data;
    } catch (error) {
      console.error('API Get Footer Count Error:', error);
      throw error;
    }
  },
};