import React, { useState, useEffect } from 'react';
import { 
  FiSearch, FiEye, FiTrash2, FiMail, FiPhone, 
  FiUser, FiBriefcase, FiCheck, FiX, FiArrowLeft 
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { DistributorApi } from '../services/DistributorApi';

const AdminDistributors = () => {
    const [distributors, setDistributors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDistributor, setSelectedDistributor] = useState(null);
    const [distributorToDelete, setDistributorToDelete] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All');
    const [dateSort, setDateSort] = useState('');

    const token = localStorage.getItem('adminToken');

    useEffect(() => {
        const fetchDistributors = async () => {
            try {
                setLoading(true);
                const response = await DistributorApi.getAllApplications(token);
                
                // Ensure we always get an array
                let applications = [];
                if (Array.isArray(response)) {
                    applications = response;
                } else if (response && Array.isArray(response.data)) {
                    applications = response.data;
                } else if (response && response.data) {
                    applications = [response.data];
                }

                setDistributors(applications);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch distributors:', err);
                setError(err.message || 'Failed to load distributor applications');
                setDistributors([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDistributors();
    }, [token]);

    const filteredDistributors = distributors
        .filter(distributor => {
            if (!distributor) return false;
            
            const matchesSearch =
                (distributor.company?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (distributor.contactName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (distributor.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (distributor.channels?.toLowerCase() || '').includes(searchTerm.toLowerCase());

            const matchesStatus = 
                statusFilter === 'All' ||
                (statusFilter === 'Pending' && distributor.status === 'pending') ||
                (statusFilter === 'Approved' && distributor.status === 'approved') ||
                (statusFilter === 'Rejected' && distributor.status === 'rejected');

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            if (!a || !b) return 0;
            const dateA = a.date || a.createdAt;
            const dateB = b.date || b.createdAt;
            if (!dateA || !dateB) return 0;
            if (dateSort === 'Newest') return new Date(dateB) - new Date(dateA);
            if (dateSort === 'Oldest') return new Date(dateA) - new Date(dateB);
            return 0;
        });

    const updateStatus = async (id, newStatus) => {
        try {
            const normalizedStatus = newStatus.toLowerCase();
            setDistributors(prev => prev.map(d => 
                d.id === id ? { ...d, status: normalizedStatus } : d
            ));
            
            await DistributorApi.updateStatus(id, normalizedStatus, token);
            
            if (selectedDistributor?.id === id) {
                const updated = await DistributorApi.getApplication(id, token);
                setSelectedDistributor(updated.data || updated);
            }
        } catch (err) {
            console.error('Status update failed:', err);
            setError(err.message || 'Failed to update status');
            // Revert the status change in UI
            setDistributors(prev => prev.map(d => 
                d.id === id ? { ...d, status: d.status } : d
            ));
        }
    };

   const handleDelete = async (id) => {
    try {
        console.log('Attempting to delete distributor with ID:', id);
        
        if (!id) {
            throw new Error('Invalid distributor ID');
        }

        // Get the full distributor object for debugging
        const distributor = distributors.find(d => d.id === id);
        if (!distributor) {
            throw new Error('Distributor not found in local state');
        }

        console.log('Deleting distributor:', distributor);

        await DistributorApi.deleteApplication(id, token);
        
        // Update state
        setDistributors(prev => prev.filter(d => d.id !== id));
        setDistributorToDelete(null);
        
        if (selectedDistributor?.id === id) {
            setSelectedDistributor(null);
        }

        setError(null);
    } catch (err) {
        console.error('Delete failed:', {
            message: err.message,
            id: id,
            error: err
        });
        setError(err.message || 'Failed to delete application');
    }
};

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
            return new Date(dateString).toLocaleDateString('en-US', options);
        } catch {
            return 'Invalid Date';
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-8">Loading distributor applications...</div>
            </div>
        );
    }

    if (error && distributors.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-8 text-red-500">Error: {error}</div>
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 mx-auto block bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-4">
                <Link
                    to="/admin/dashboard"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                >
                    <FiArrowLeft className="mr-1" /> Back to Dashboard
                </Link>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Distributor Applications</h1>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">Total: {distributors.length}</span>
                    <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        Pending: {distributors.filter(d => d.status === 'pending').length}
                    </span>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                    <button 
                        onClick={() => setError(null)}
                        className="float-right font-bold"
                    >
                        &times;
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                
                <div>
                    <select
                        className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>

                <div>
                    <select
                        className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={dateSort}
                        onChange={(e) => setDateSort(e.target.value)}
                    >
                        <option value="">Sort by Date</option>
                        <option value="Newest">Newest First</option>
                        <option value="Oldest">Oldest First</option>
                    </select>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Company
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredDistributors.length > 0 ? (
                                filteredDistributors.map((distributor) => (
                                    <tr key={distributor.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <FiBriefcase className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {distributor.company || 'N/A'}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {distributor.email || 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {distributor.contactName || 'N/A'}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {distributor.phone || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(distributor.date || distributor.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                distributor.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                distributor.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {distributor.status ? 
                                                    distributor.status.charAt(0).toUpperCase() + distributor.status.slice(1) : 
                                                    'Unknown'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-3">
                                                <button
                                                    onClick={() => setSelectedDistributor(distributor)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                    title="View"
                                                >
                                                    <FiEye className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => setDistributorToDelete(distributor.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Delete"
                                                >
                                                    <FiTrash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                        {distributors.length === 0 ? 
                                            'No distributor applications available' : 
                                            'No applications match your search criteria'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Modal */}
            {selectedDistributor && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                                {selectedDistributor.company || 'Distributor Details'}
                                            </h3>
                                            <button
                                                onClick={() => setSelectedDistributor(null)}
                                                className="text-gray-500 hover:text-black"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                        <div className="mt-4 space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex items-start">
                                                    <FiUser className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Contact Name</p>
                                                        <p className="text-sm text-gray-900">
                                                            {selectedDistributor.contactName || 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start">
                                                    <FiBriefcase className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Title</p>
                                                        <p className="text-sm text-gray-900">
                                                            {selectedDistributor.title || 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start">
                                                    <FiMail className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Email</p>
                                                        <p className="text-sm text-gray-900">
                                                            {selectedDistributor.email || 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start">
                                                    <FiPhone className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Phone</p>
                                                        <p className="text-sm text-gray-900">
                                                            {selectedDistributor.phone || 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Target Markets/Channels</p>
                                                <p className="text-sm text-gray-900 mt-1 bg-gray-50 p-3 rounded">
                                                    {selectedDistributor.channels || 'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Application Date</p>
                                                <p className="text-sm text-gray-900">
                                                    {formatDate(selectedDistributor.date || selectedDistributor.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse justify-between">
                                <div className="flex space-x-2">
                                    <select
                                        value={selectedDistributor.status || 'pending'}
                                        onChange={(e) => updateStatus(selectedDistributor.id, e.target.value)}
                                        className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                    {selectedDistributor.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => updateStatus(selectedDistributor.id, 'approved')}
                                                className="inline-flex items-center justify-center rounded-md border border-transparent shadow-sm px-4 py-1 bg-green-600 text-sm font-medium text-white hover:bg-green-700"
                                            >
                                                <FiCheck className="mr-1" /> Approve
                                            </button>
                                            <button
                                                onClick={() => updateStatus(selectedDistributor.id, 'rejected')}
                                                className="inline-flex items-center justify-center rounded-md border border-transparent shadow-sm px-4 py-1 bg-red-600 text-sm font-medium text-white hover:bg-red-700"
                                            >
                                                <FiX className="mr-1" /> Reject
                                            </button>
                                        </>
                                    )}
                                </div>
                                <button
                                    onClick={() => setSelectedDistributor(null)}
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-1 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {distributorToDelete && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <FiTrash2 className="h-6 w-6 text-red-600" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Application</h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Are you sure you want to delete this distributor application? This action cannot be undone.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    onClick={() => handleDelete(distributorToDelete)}
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => setDistributorToDelete(null)}
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDistributors;