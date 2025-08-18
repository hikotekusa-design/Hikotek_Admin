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
  deleteApplication: async (id, token) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/distributor/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error(response.status === 404 ? 'Application not found' : 'Delete failed');
      }

      return true;
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  }
};