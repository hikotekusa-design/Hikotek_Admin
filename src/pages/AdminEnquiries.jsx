import React, { useState } from 'react';
import { FiSearch, FiEye, FiTrash2, FiMail, FiUser, FiPhone, FiGlobe, FiHome, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const AdminEnquiries = () => {
    // Sample enquiry data - replace with API call
    const [enquiries, setEnquiries] = useState([
        {
            id: 1,
            fullName: 'John Doe',
            email: 'john@example.com',
            company: 'Tech Solutions Inc.',
            phone: '+966 50 123 4567',
            country: 'Saudi Arabia',
            comments: 'Interested in your digital calipers for our quality control department. Please send more details and pricing for bulk orders.',
            subscribe: true,
            date: '2023-05-15T10:30:00',
            status: 'New'
        },
        {
            id: 2,
            fullName: 'Sarah Smith',
            email: 'sarah@manufacturing.com',
            company: 'Precision Manufacturing',
            phone: '+1 555 123 4567',
            country: 'USA',
            comments: 'Need information about your measurement tools for our new production line. What certifications do your products have?',
            subscribe: false,
            date: '2023-05-14T14:45:00',
            status: 'In Progress'
        },
        {
            id: 3,
            fullName: 'Ahmed Al-Farsi',
            email: 'ahmed@industrial.com',
            company: 'Industrial Solutions KSA',
            phone: '+966 55 987 6543',
            country: 'Saudi Arabia',
            comments: 'Requesting catalog and dealer information for your full product range in the Eastern Province.',
            subscribe: true,
            date: '2023-05-12T09:15:00',
            status: 'Completed'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const [enquiryToDelete, setEnquiryToDelete] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All');
    const [dateSort, setDateSort] = useState('');

    // Filter and sort enquiries
    const filteredEnquiries = enquiries
        .filter(enquiry => {
            const matchesSearch =
                enquiry.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                enquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                enquiry.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                enquiry.comments.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'All' || enquiry.status === statusFilter;

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            if (dateSort === 'Newest') {
                return new Date(b.date) - new Date(a.date);
            } else if (dateSort === 'Oldest') {
                return new Date(a.date) - new Date(b.date);
            }
            return 0; // Default order if no sort selected
        });

    // Delete enquiry
    const handleDelete = (id) => {
        setEnquiries(enquiries.filter(enquiry => enquiry.id !== id));
        setEnquiryToDelete(null);
    };

    // Update enquiry status
    const updateStatus = (id, newStatus) => {
        setEnquiries(enquiries.map(enquiry => 
            enquiry.id === id ? { ...enquiry, status: newStatus } : enquiry
        ));
    };

    // Format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

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
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Customer Enquiries</h1>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">Total: {enquiries.length}</span>
                    <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        New: {enquiries.filter(e => e.status === 'New').length}
                    </span>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                

                {/* Status filter */}
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

                {/* Date sort dropdown */}
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

            {/* Enquiries table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Company
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
                            {filteredEnquiries.length > 0 ? (
                                filteredEnquiries.map((enquiry) => (
                                    <tr key={enquiry.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <FiUser className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{enquiry.fullName}</div>
                                                    <div className="text-sm text-gray-500">{enquiry.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{enquiry.company}</div>
                                            <div className="text-sm text-gray-500">{enquiry.country}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(enquiry.date)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                enquiry.status === 'New' ? 'bg-blue-100 text-blue-800' :
                                                enquiry.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-green-100 text-green-800'
                                            }`}>
                                                {enquiry.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-3">
                                                <button
                                                    onClick={() => setSelectedEnquiry(enquiry)}
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
                                ))
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
                                                Enquiry from {selectedEnquiry.fullName}
                                            </h3>
                                            <button
                                                onClick={() => setSelectedEnquiry(null)}
                                                className="text-gray-500 hover:text-black"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                        <div className="mt-4 space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex items-start">
                                                    <FiMail className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Email</p>
                                                        <p className="text-sm text-gray-900">{selectedEnquiry.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start">
                                                    <FiHome className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Company</p>
                                                        <p className="text-sm text-gray-900">{selectedEnquiry.company}</p>
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
                                                        <p className="text-sm text-gray-900">{selectedEnquiry.country}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Comments</p>
                                                <p className="text-sm text-gray-900 mt-1 bg-gray-50 p-3 rounded">
                                                    {selectedEnquiry.comments}
                                                </p>
                                            </div>
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedEnquiry.subscribe}
                                                    readOnly
                                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                                />
                                                <label className="ml-2 block text-sm text-gray-700">
                                                    Subscribed to newsletter: {selectedEnquiry.subscribe ? 'Yes' : 'No'}
                                                </label>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Received</p>
                                                <p className="text-sm text-gray-900">{formatDate(selectedEnquiry.date)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse justify-between">
                                <div className="flex space-x-2">
                                    <select
                                        value={selectedEnquiry.status}
                                        onChange={(e) => updateStatus(selectedEnquiry.id, e.target.value)}
                                        className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                                    >
                                        <option value="New">New</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-1 bg-blue-600 text-sm font-medium text-white hover:bg-blue-700"
                                    >
                                        Reply
                                    </button>
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
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Delete
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