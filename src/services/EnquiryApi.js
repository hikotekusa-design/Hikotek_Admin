import { BASE_URL } from './baseUrls';

export const enquiryApi = {
  // Get all enquiries
  getAll: async () => {
    const response = await fetch(`${BASE_URL}/admin/enquiries`);
    if (!response.ok) {
      throw new Error('Failed to fetch enquiries');
    }
    return await response.json();
  },

  // Get single enquiry by ID
  getById: async (id) => {
    const response = await fetch(`${BASE_URL}/admin/enquiries/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch enquiry');
    }
    return await response.json();
  },

  // In your EnquiryApi service
updateStatus: async (id, status) => {
    const response = await fetch(`${BASE_URL}/admin/enquiries/${id}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) {
        throw new Error('Failed to update enquiry status');
    }
    return await response.json();
},

delete: async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/admin/enquiries/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // Add auth header if needed
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete enquiry');
    }
    
    return data;
  } catch (error) {
    console.error('API Delete Error:', {
      message: error.message,
      id,
      url: `${BASE_URL}/admin/enquiries/${id}`
    });
    throw error;
  }
},
getCount: async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch(`${BASE_URL}/admin/enquiries/count`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('Enquiry count response:', { status: response.status, data }); // Debug log
      if (!response.ok) {
        throw new Error(
          data.error || `Failed to fetch enquiry count (Status: ${response.status})`
        );
      }

      return data;
    } catch (error) {
      console.error('API Get Enquiry Count Error:', {
        message: error.message,
        url: `${BASE_URL}/admin/enquiries/count`,
      });
      throw error;
    }
  },
  getRecent: async (token) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/enquiries/recent`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log('Recent enquiries response:', { status: response.status, data });
      if (!response.ok) {
        throw new Error(
          data.error || `Failed to fetch recent enquiries (Status: ${response.status})`
        );
      }
      return data;
    } catch (error) {
      console.error('API Get Recent Enquiries Error:', {
        message: error.message,
        url: `${BASE_URL}/admin/enquiries/recent`,
      });
      throw error;
    }
  },



};

