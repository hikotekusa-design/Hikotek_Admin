import { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiMapPin, FiArrowLeft, FiLoader } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { addressApi } from '../services/AddressApi';
import { toast } from 'react-toastify';

const AddressList = () => {
  const [addresses, setAddresses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    address: '',
    phone: '',
    email: '',
    status: 'active'
  });

  // Load addresses from API
  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await addressApi.getAll();
      
      if (response.success) {
        setAddresses(response.data);
      } else {
        throw new Error(response.error || 'Failed to load addresses');
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error(error.message || 'Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  // Load addresses on component mount
  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let response;
      if (editingAddress) {
        // Update existing address
        response = await addressApi.update(editingAddress.id, formData);
        toast.success('Address updated successfully');
      } else {
        // Add new address
        response = await addressApi.create(formData);
        toast.success('Address created successfully');
      }
      
      // Check if response was successful
      if (response.success) {
        // Refresh the address list
        await fetchAddresses();
        resetForm();
        setIsModalOpen(false);
      } else {
        throw new Error(response.error || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      const errorMessage = error.message || 'Failed to save address';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      title: address.title,
      name: address.name,
      address: address.address,
      phone: address.phone,
      email: address.email,
      status: address.status || 'active'
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        const response = await addressApi.delete(id);
        if (response.success) {
          toast.success('Address deleted successfully');
          // Refresh the address list
          await fetchAddresses();
        } else {
          throw new Error(response.error || 'Delete failed');
        }
      } catch (error) {
        console.error('Error deleting address:', error);
        const errorMessage = error.message || 'Failed to delete address';
        toast.error(errorMessage);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await addressApi.updateStatus(id, newStatus);
      if (response.success) {
        toast.success(`Address ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
        // Refresh the address list
        await fetchAddresses();
      } else {
        throw new Error(response.error || 'Status update failed');
      }
    } catch (error) {
      console.error('Error updating address status:', error);
      toast.error(error.message || 'Failed to update address status');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      name: '',
      address: '',
      phone: '',
      email: '',
      status: 'active'
    });
    setEditingAddress(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  if (loading) {
    return (
      <div className="p-6 ml-64 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FiLoader className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading addresses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 ml-64">
      <div className="mb-4">
        <Link
          to="/admin/dashboard"
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <FiArrowLeft className="mr-1" /> Back to Dashboard
        </Link>
      </div>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <FiMapPin className="mr-2" /> Address Management
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FiPlus className="mr-2" /> Add New Address
          </button>
        </div>

        {/* Address List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {addresses.map((address) => (
                  <tr key={address.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{address.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{address.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{address.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{address.phone}</div>
                      <div className="text-sm text-gray-500">{address.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={address.status}
                        onChange={(e) => handleStatusChange(address.id, e.target.value)}
                        className={`px-2 py-1 text-xs rounded-full border ${
                          address.status === 'active' 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : 'bg-gray-100 text-gray-800 border-gray-200'
                        }`}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(address)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <FiEdit className="inline" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(address.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 className="inline" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {addresses.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FiMapPin className="mx-auto text-4xl mb-3 opacity-50" />
              <p>No addresses found. Add your first address to get started.</p>
            </div>
          )}
        </div>

        {/* Preview Section - How users will see the addresses */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">User View Preview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.filter(addr => addr.status === 'active').map((address) => (
              <div key={address.id} className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">{address.title}</h3>
                <p className="font-medium text-gray-800 mb-2">{address.name}</p>
                <p className="text-gray-600 mb-4">{address.address}</p>
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-gray-700">
                    <span className="font-medium">Phone:</span> {address.phone}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Email:</span> {address.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="border-b px-6 py-4">
              <h2 className="text-xl font-semibold">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={submitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={submitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={submitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={submitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={submitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={submitting}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
                  disabled={submitting}
                >
                  {submitting && <FiLoader className="animate-spin mr-2" />}
                  {editingAddress ? 'Update Address' : 'Add Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressList;