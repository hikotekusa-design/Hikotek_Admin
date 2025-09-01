// src/services/addressApi.js
import { BASE_URL } from './baseUrls';

export const addressApi = {
  // Create a new address
  create: async (addressData) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch(`${BASE_URL}/admin/addresses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      });

      const data = await response.json();
      console.log('Create address response:', data); // Debug log

      if (!response.ok) {
        throw new Error(data.error || data.errors?.join(', ') || 'Failed to create address');
      }

      return data;
    } catch (error) {
      console.error('API Create Address Error:', error);
      throw error;
    }
  },

  // Get all addresses
  getAll: async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch(`${BASE_URL}/admin/addresses`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch addresses');
      }

      return data;
    } catch (error) {
      console.error('API Get Addresses Error:', error);
      throw error;
    }
  },

  // Get single address by ID
  getById: async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch(`${BASE_URL}/admin/addresses/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch address');
      }

      return data;
    } catch (error) {
      console.error('API Get Address Error:', error);
      throw error;
    }
  },

  // Update address
  update: async (id, addressData) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch(`${BASE_URL}/admin/addresses/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.errors?.join(', ') || 'Failed to update address');
      }

      return data;
    } catch (error) {
      console.error('API Update Address Error:', error);
      throw error;
    }
  },

  // Delete address
  delete: async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch(`${BASE_URL}/admin/addresses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete address');
      }

      return data;
    } catch (error) {
      console.error('API Delete Address Error:', {
        message: error.message,
        id,
        url: `${BASE_URL}/admin/addresses/${id}`,
      });
      throw error;
    }
  },

  // Update address status (Active / Inactive)
  updateStatus: async (id, status) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch(`${BASE_URL}/admin/addresses/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update address status');
      }

      return data;
    } catch (error) {
      console.error('API Update Address Status Error:', error);
      throw error;
    }
  },

  // Get active addresses (public route - no auth required)
  getActive: async () => {
    try {
      const response = await fetch(`${BASE_URL}/addresses`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch active addresses');
      }

      return data;
    } catch (error) {
      console.error('API Get Active Addresses Error:', error);
      throw error;
    }
  },

  // Get address count
  getCount: async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch(`${BASE_URL}/admin/addresses/count`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch address count');
      }

      return data;
    } catch (error) {
      console.error('API Get Address Count Error:', error);
      throw error;
    }
  },
};