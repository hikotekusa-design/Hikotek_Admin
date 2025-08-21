import { BASE_URL } from './baseUrls';

export const DistributorApi = {
  // Submit new application
  submitApplication: async (applicationData) => {
    try {
      const response = await fetch(`${BASE_URL}/distributor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(applicationData)
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Submission error:', error);
      throw error;
    }
  },

  // Get all applications (Admin)
  getAllApplications: async (token) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/distributor`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }

      return await response.json();
    } catch (error) {
      console.error('Fetch applications error:', error);
      throw error;
    }
  },

  // Get single application (Admin)
  getApplication: async (id, token) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/distributor/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Application not found');
        }
        throw new Error('Failed to fetch application');
      }

      return await response.json();
    } catch (error) {
      console.error('Fetch application error:', error);
      throw error;
    }
  },

  // Update status (Admin)
  updateStatus: async (id, status, token) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/distributor/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error(response.status === 404 ? 'Application not found' : 'Status update failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Status update error:', error);
      throw error;
    }
  },

  // Delete application (Admin)
// Update the deleteApplication method
deleteApplication: async (id, token) => {
    try {
      const url = `${BASE_URL}/admin/distributor/${id}`; // Changed from /distributor to /distributors
      console.log('DELETE request to:', url);
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || 
          `Delete failed with status ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error('Delete error:', {
        message: error.message,
        id: id,
        url: `${BASE_URL}/admin/distributors/${id}`
      });
      throw error;
    }
  },

getCount: async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/admin/distributor/count`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log('Distributor count response:', { status: response.status, data }); // Debug log
    if (!response.ok) {
      throw new Error(
        data.error || `Failed to fetch distributor count (Status: ${response.status})`
      );
    }

    return data;
  } catch (error) {
    console.error('API Get Distributor Count Error:', {
      message: error.message,
      url: `${BASE_URL}/admin/distributor/count`,
    });
    throw error;
  }
},
getRecent: async (token) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/distributor/recent`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log('Recent applications response:', { status: response.status, data });
      if (!response.ok) {
        throw new Error(
          data.error || `Failed to fetch recent applications (Status: ${response.status})`
        );
      }
      return data;
    } catch (error) {
      console.error('API Get Recent Applications Error:', {
        message: error.message,
        url: `${BASE_URL}/admin/distributor/recent`,
      });
      throw error;
    }
  },
};