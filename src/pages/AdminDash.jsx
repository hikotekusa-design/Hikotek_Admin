import React from 'react';
import { FiBox, FiMail, FiUsers, FiAlertCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminDashboard = () => {
  // Sample data - replace with API calls
  const stats = {
    products: 42,
    enquiries: 18,
    distributors: 9,
  };

  // Recent activities
  const recentActivities = [
    {
      id: 1,
      type: 'enquiry',
      title: 'New enquiry from John Smith',
      description: 'Interested in bulk order of digital calipers',
      time: '10 minutes ago',
      icon: <FiMail className="text-blue-500" />
    },
    {
      id: 2,
      type: 'distributor',
      title: 'New distributor application',
      description: 'Precision Tools Co. applied to become distributor',
      time: '2 hours ago',
      icon: <FiUsers className="text-green-500" />
    },
    // {
    //   id: 3,
    //   type: 'product',
    //   title: 'Low stock alert',
    //   description: 'Mitutoyo 511-711 Dial Bore Gauge stock below threshold',
    //   time: '5 hours ago',
    //   icon: <FiAlertCircle className="text-yellow-500" />
    // }
  ];

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      
      <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 md:mb-0">Dashboard Overview</h1>
          <span className="text-sm text-gray-500">Last updated: Today, 10:45 AM</span>
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
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">Recent Activity</h2>
            {/* <Link 
              to="/admin/activity" 
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              View All
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link> */}
          </div>
          
          <div className="space-y-3 md:space-y-4">
            {recentActivities.map((activity) => (
              <div 
                key={activity.id} 
                className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition"
              >
                <div className="flex-shrink-0 mt-1 mr-3 md:mr-4">
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1 md:mt-2">{activity.time}</p>
                </div>
                {/* <button className="text-gray-400 hover:text-gray-500 ml-2">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                </button> */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;