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
}



};

