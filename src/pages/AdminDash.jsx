import React, { useEffect, useState } from 'react';
import { FiBox, FiMail, FiUsers, FiAlertCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { productApi } from '../services/productApi';
import { enquiryApi } from '../services/EnquiryApi';
import { DistributorApi } from '../services/DistributorApi';
import { getAllAdmins } from '../services/authApi';
import AdminSidebar from './AdminSidebar';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    enquiries: 0,
    distributors: 0,
  });
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const [productResponse, enquiryResponse, distributorResponse, adminsResponse] = await Promise.all([
          productApi.getCount().catch((err) => {
            console.error('Product count fetch failed:', err.message);
            return { data: { count: 0 } };
          }),
          enquiryApi.getCount().catch((err) => {
            console.error('Enquiry count fetch failed:', err.message);
            return { data: { count: 0 } };
          }),
          DistributorApi.getCount(token).catch((err) => {
            console.error('Distributor count fetch failed:', err.message);
            return { data: { count: 0 } };
          }),
          getAllAdmins(token).catch((err) => {
            console.error('Admins fetch failed:', err.message);
            if (err.message.includes('Admin data not found') || err.message.includes('Failed to fetch all admins')) {
              setError('Unable to load admin list. Please ensure admins are registered or contact support.');
            }
            return { admins: [] };
          }),
        ]);

        setStats({
          products: productResponse.data.count || 0,
          enquiries: enquiryResponse.data.count || 0,
          distributors: distributorResponse.data.count || 0,
        });
        setAdmins(adminsResponse.admins || []);
      } catch (err) {
        console.error('Error fetching data:', {
          message: err.message,
          stack: err.stack,
        });
        setError(
          err.message === 'Authentication token not found'
            ? 'Please log in as an admin to view the dashboard'
            : `Failed to load dashboard data: ${err.message}`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        <FiAlertCircle className="mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 md:mb-0">Dashboard Overview</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <Link
            to="/admin/products"
            className="bg-white p-4 md:p-6 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Products</p>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mt-1">{stats.products}</h3>
              </div>
              <div className="bg-blue-100 p-2 md:p-3 rounded-full">
                <FiBox className="text-blue-600 text-lg md:text-xl" />
              </div>
            </div>
          </Link>

          <Link
            to="/admin/enquiries"
            className="bg-white p-4 md:p-6 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Enquiries</p>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mt-1">{stats.enquiries}</h3>
              </div>
              <div className="bg-green-100 p-2 md:p-3 rounded-full">
                <FiMail className="text-green-600 text-lg md:text-xl" />
              </div>
            </div>
          </Link>

          <Link
            to="/admin/distributors"
            className="bg-white p-4 md:p-6 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Distributors</p>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mt-1">{stats.distributors}</h3>
              </div>
              <div className="bg-purple-100 p-2 md:p-3 rounded-full">
                <FiUsers className="text-purple-600 text-lg md:text-xl" />
              </div>
            </div>
          </Link>
        </div>

        {/* Admins List Table */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Registered Admins</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Email</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Username</th>
                </tr>
              </thead>
              <tbody>
                {admins.length > 0 ? (
                  admins.map((admin) => (
                    <tr key={admin.uid} className="border-t">
                      <td className="px-4 py-3 text-sm text-gray-800">{admin.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{admin.username}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="px-4 py-3 text-sm text-gray-500 text-center">
                      No admins found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;