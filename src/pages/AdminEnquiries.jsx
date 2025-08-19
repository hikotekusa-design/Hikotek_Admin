import React, { useEffect, useState } from 'react';
import { FiSearch, FiEye, FiMail, FiUser, FiPhone, FiGlobe, FiHome, FiArrowLeft, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { enquiryApi } from '../services/EnquiryApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminEnquiries = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const [enquiryToDelete, setEnquiryToDelete] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All');
    const [dateSort, setDateSort] = useState('');
    const [deleting, setDeleting] = useState(false);

    // Normalize status with strict defaulting
    const normalizeStatus = (status) => {
        if (!status || typeof status !== 'string') return 'New';
        const cleanStatus = status.trim();
        if (['New', 'In Progress', 'Completed'].includes(cleanStatus)) {
            return cleanStatus;
        }
        return 'New';
    };

    // Fetch enquiries with status normalization
    useEffect(() => {
        const fetchEnquiries = async () => {
            try {
                const response = await enquiryApi.getAll();
                const formattedEnquiries = response.data.map(enquiry => ({
                    ...enquiry,
                    id: enquiry.id,
                    status: normalizeStatus(enquiry.status) // Force normalization
                }));
                setEnquiries(formattedEnquiries);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
                toast.error('Failed to load enquiries');
            }
        };
        fetchEnquiries();
    }, []);

    // Fetch single enquiry with status normalization
    const fetchEnquiryDetails = async (id) => {
        try {
            const response = await enquiryApi.getById(id);
            const enquiryData = {
                ...response.data,
                status: normalizeStatus(response.data.status) // Force normalization
            };
            setSelectedEnquiry(enquiryData);
        } catch (err) {
            console.error("Error fetching enquiry details:", err);
            setError(err.message);
            toast.error('Failed to load enquiry details');
        }
    };

    // Update status with validation
    const updateStatus = async (id, newStatus) => {
        try {
            const normalizedStatus = normalizeStatus(newStatus);
            
            await enquiryApi.updateStatus(id, normalizedStatus);

            setEnquiries(prev => prev.map(enquiry =>
                enquiry.id === id ? { ...enquiry, status: normalizedStatus } : enquiry
            ));

            if (selectedEnquiry?.id === id) {
                setSelectedEnquiry({ ...selectedEnquiry, status: normalizedStatus });
            }

            toast.success('Status updated successfully');
        } catch (err) {
            console.error("Error updating status:", err);
            setError(err.message);
            toast.error(err.message || 'Failed to update status');
        }
    };

    // Delete enquiry
    const handleDelete = async (id) => {
        setDeleting(true);
        try {
            await enquiryApi.delete(id);
            setEnquiries(prev => prev.filter(enquiry => enquiry.id !== id));
            setEnquiryToDelete(null);
            
            if (selectedEnquiry?.id === id) {
                setSelectedEnquiry(null);
            }
            
            toast.success('Enquiry deleted successfully');
        } catch (err) {
            console.error("Error deleting enquiry:", err);
            setError(err.message);
            toast.error('Failed to delete enquiry');
        } finally {
            setDeleting(false);
        }
    };

    // Filter and sort enquiries
    const filteredEnquiries = enquiries
        .filter(enquiry => {
            const matchesSearch = ['fullName', 'email', 'company', 'comments'].some(
                field => (enquiry[field]?.toLowerCase() || '').includes(searchTerm.toLowerCase())
            );
            const matchesStatus = statusFilter === 'All' || enquiry.status === statusFilter;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            if (dateSort === 'Newest') return new Date(b.createdAt) - new Date(a.createdAt);
            if (dateSort === 'Oldest') return new Date(a.createdAt) - new Date(b.createdAt);
            return 0;
        });

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    // Get status color classes
    const getStatusColor = (status) => {
        const normalizedStatus = normalizeStatus(status);
        switch(normalizedStatus) {
            case 'New': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'In Progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header and controls */}
            <div className="mb-4">
                <Link to="/admin/dashboard" className="flex items-center text-blue-600 hover:text-blue-800">
                    <FiArrowLeft className="mr-1" /> Back to Dashboard
                </Link>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Customer Enquiries</h1>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">Total: {enquiries.length}</span>
                    <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        New: {enquiries.filter(e => normalizeStatus(e.status) === 'New').length}
                    </span>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                    <select
                        className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
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

            {/* Enquiries Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredEnquiries.length > 0 ? (
                                filteredEnquiries.map((enquiry) => {
                                    const status = normalizeStatus(enquiry.status);
                                    return (
                                        <tr key={enquiry.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <FiUser className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {enquiry.fullName || 'N/A'}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {enquiry.email || 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {enquiry.company || 'N/A'}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {enquiry.country || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(enquiry.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(status)}`}>
                                                    {status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-3">
                                                    <button
                                                        onClick={() => fetchEnquiryDetails(enquiry.id)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title="View"
                                                    >
                                                        <FiEye className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => setEnquiryToDelete(enquiry.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                        title="Delete"
                                                    >
                                                        <FiTrash2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                        No enquiries found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Enquiry Detail Modal */}
            {selectedEnquiry && (
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
                                                Enquiry from {selectedEnquiry.fullName || 'N/A'}
                                            </h3>
                                            <button
                                                onClick={() => setSelectedEnquiry(null)}
                                                className="text-gray-500 hover:text-black"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                        <div className="mt-4 space-y-4">
                                            {/* Enquiry details */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex items-start">
                                                    <FiMail className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Email</p>
                                                        <p className="text-sm text-gray-900">{selectedEnquiry.email || 'N/A'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start">
                                                    <FiHome className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Company</p>
                                                        <p className="text-sm text-gray-900">{selectedEnquiry.company || 'N/A'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start">
                                                    <FiPhone className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Phone</p>
                                                        <p className="text-sm text-gray-900">{selectedEnquiry.phone || 'Not provided'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start">
                                                    <FiGlobe className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Country</p>
                                                        <p className="text-sm text-gray-900">{selectedEnquiry.country || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Comments</p>
                                                <p className="text-sm text-gray-900 mt-1 bg-gray-50 p-3 rounded">
                                                    {selectedEnquiry.comments || 'N/A'}
                                                </p>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedEnquiry.subscribe || false}
                                                    readOnly
                                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                                />
                                                <label className="ml-2 block text-sm text-gray-700">
                                                    Subscribed to newsletter: {selectedEnquiry.subscribe ? 'Yes' : 'No'}
                                                </label>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Received</p>
                                                <p className="text-sm text-gray-900">{formatDate(selectedEnquiry.createdAt)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse justify-between">
                                <div className="flex space-x-2">
                                    <select
                                        value={normalizeStatus(selectedEnquiry.status)}
                                        onChange={(e) => updateStatus(selectedEnquiry.id, e.target.value)}
                                        className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                                    >
                                        <option value="New">New</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                                <button
                                    onClick={() => setSelectedEnquiry(null)}
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
            {enquiryToDelete && (
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
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Enquiry</h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Are you sure you want to delete this enquiry? This action cannot be undone.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    onClick={() => handleDelete(enquiryToDelete)}
                                    type="button"
                                    disabled={deleting}
                                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm ${deleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {deleting ? 'Deleting...' : 'Delete'}
                                </button>
                                <button
                                    onClick={() => setEnquiryToDelete(null)}
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

export default AdminEnquiries;