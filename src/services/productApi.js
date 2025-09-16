// src/services/productApi.js
import { BASE_URL } from './baseUrls';

export const productApi = {
  // Create a new product (Supports images & PDFs)
  create: async (formData) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch(`${BASE_URL}/admin/products`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      console.log('Create product raw response:', data);

      if (!response.ok) {
        const errorMessage = data.error || data.errors?.join(', ') || 'Failed to create product';
        throw new Error(errorMessage);
      }

      // Handle both response structures for backward compatibility
      return {
        success: true,
        productId: data.productId, // legacy
        data: data.data || data.product || { id: data.productId, ...data } // new structure
      };
    } catch (error) {
      console.error('API Create Product Error:', error);
      throw error;
    }
  },


  // Get all products
  getAll: async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch(`${BASE_URL}/admin/products`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch products');
      }

      return data;
    } catch (error) {
      console.error('API Get Products Error:', error);
      throw error;
    }
  },

  // Get single product by ID
  getById: async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch(`${BASE_URL}/admin/products/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch product');
      }

      return data;
    } catch (error) {
      console.error('API Get Product Error:', error);
      throw error;
    }
  },

  // Update product (Supports images & PDFs)
  update: async (id, formData) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch(`${BASE_URL}/admin/products/${id}`, {
        method: 'PATCH', // Changed from PUT to PATCH
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type for FormData
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.errors?.join(', ') || 'Failed to update product');
      }

      return data;
    } catch (error) {
      console.error('API Update Product Error:', error);
      throw error;
    }
  },

  // Delete product
  delete: async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch(`${BASE_URL}/admin/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete product');
      }

      return data;
    } catch (error) {
      console.error('API Delete Product Error:', {
        message: error.message,
        id,
        url: `${BASE_URL}/admin/products/${id}`,
      });
      throw error;
    }
  },

  // Update product status (Active / Inactive)
  updateStatus: async (id, status) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch(`${BASE_URL}/admin/products/${id}/status`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update product status');
      }

      return data;
    } catch (error) {
      console.error('API Update Product Status Error:', error);
      throw error;
    }
  },
  getCount: async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch(`${BASE_URL}/admin/products/count`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch product count');
      }

      return data;
    } catch (error) {
      console.error('API Get Product Count Error:', error);
      throw error;
    }
  },

deleteSubcategory: async (subcategory) => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Authentication token not found');

    const response = await fetch(`${BASE_URL}/admin/products/subcategory/${encodeURIComponent(subcategory)}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete subcategory');
    }

    return data;
  } catch (error) {
    console.error('API Delete Subcategory Error:', error);
    throw error;
  }
},

deleteCategory: async (category) => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Authentication token not found');

    const response = await fetch(`${BASE_URL}/admin/products/category/${encodeURIComponent(category)}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete category');
    }

    return data;
  } catch (error) {
    console.error('API Delete Category Error:', error);
    throw error;
  }
},
};