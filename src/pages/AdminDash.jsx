import React, { useEffect, useState } from 'react';
import { FiBox, FiMail, FiUsers, FiAlertCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { productApi } from '../services/productApi';
import { enquiryApi } from '../services/EnquiryApi';
import { DistributorApi } from '../services/DistributorApi';
import AdminSidebar from './AdminSidebar';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    enquiries: 0,
    distributors: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const [productResponse, enquiryResponse, distributorResponse] = await Promise.all([
          productApi.getCount().catch((err) => {
            console.error('Product count fetch failed:', err);
            return { data: { count: 0 } }; // Fallback to 0 on error
          }),
          enquiryApi.getCount().catch((err) => {
            console.error('Enquiry count fetch failed:', err);
            return { data: { count: 0 } }; // Fallback to 0 on error
          }),
          DistributorApi.getCount(token).catch((err) => {
            console.error('Distributor count fetch failed:', err);
            return { data: { count: 0 } }; // Fallback to 0 on error
          }),
        ]);

        setStats({
          products: productResponse.data.count || 0,
          enquiries: enquiryResponse.data.count || 0,
          distributors: distributorResponse.data.count || 0,
        });
      } catch (err) {
        console.error('Error fetching counts:', {
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

    fetchCounts();
  }, []);

  // Recent activities (static)
  // const recentActivities = [
  //   {
  //     id: 1,
  //     type: 'enquiry',
  //     title: 'New enquiry from John Smith',
  //     description: 'Interested in bulk order of digital calipers',
  //     time: '10 minutes ago',
  //     icon: <FiMail className="text-blue-500" />,
  //   },
  //   {
  //     id: 2,
  //     type: 'distributor',
  //     title: 'New distributor application',
  //     description: 'Precision Tools Co. applied to become distributor',
  //     time: '2 hours ago',
  //     icon: <FiUsers className="text-green-500" />,
  //   },
  // ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 flex items-center">
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
          {/* <span className="text-sm text-gray-500">Last updated: Today, 10:45 AM</span> */}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Products Card */}
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

          {/* Enquiries Card */}
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

          {/* Distributors Card */}
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

        {/* Recent Activity */}
        {/* <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">Recent Activity</h2>
          </div>

          <div className="space-y-3 md:space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition">
                <div className="flex-shrink-0 mt-1 mr-3 md:mr-4">{activity.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1 md:mt-2">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default AdminDashboard;