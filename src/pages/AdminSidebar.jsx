import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiPackage, 
  FiMail, 
  FiUsers, 
  FiSettings,
  FiLogOut
} from 'react-icons/fi';

const AdminSidebar = () => {
  return (
    <div className="w-64 bg-[#0e4da4] text-white min-h-screen fixed flex flex-col">
      {/* Logo/Branding */}
      <div className="p-5 border-b border-blue-700 flex items-center">
        <div className="w-8 h-8 bg-white rounded-md mr-3"></div>
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <NavLink 
          to="/admin/dashboard" 
          className={({isActive}) => 
            `flex items-center px-4 py-3 rounded-lg transition-all ${
              isActive ? 'bg-blue-700 text-white' : 'hover:bg-blue-600'
            }`
          }
        >
          <FiHome className="mr-3" />
          Dashboard
        </NavLink>

        <NavLink 
          to="/admin/products" 
          className={({isActive}) => 
            `flex items-center px-4 py-3 rounded-lg transition-all ${
              isActive ? 'bg-blue-700 text-white' : 'hover:bg-blue-600'
            }`
          }
        >
          <FiPackage className="mr-3" />
          Products
        </NavLink>

        <NavLink 
          to="/admin/enquiries" 
          className={({isActive}) => 
            `flex items-center px-4 py-3 rounded-lg transition-all ${
              isActive ? 'bg-blue-700 text-white' : 'hover:bg-blue-600'
            }`
          }
        >
          <FiMail className="mr-3" />
          Enquiries
          <span className="ml-auto bg-yellow-500 text-xs text-white px-2 py-1 rounded-full">
            5
          </span>
        </NavLink>

        <NavLink 
          to="/admin/distributors" 
          className={({isActive}) => 
            `flex items-center px-4 py-3 rounded-lg transition-all ${
              isActive ? 'bg-blue-700 text-white' : 'hover:bg-blue-600'
            }`
          }
        >
          <FiUsers className="mr-3" />
          Distributors
        </NavLink>
{/* 
        <NavLink 
          to="/admin/settings" 
          className={({isActive}) => 
            `flex items-center px-4 py-3 rounded-lg transition-all ${
              isActive ? 'bg-blue-700 text-white' : 'hover:bg-blue-600'
            }`
          }
        >
          <FiSettings className="mr-3" />
          Settings
        </NavLink> */}
      </nav>

      {/* Footer/Logout */}
      <div className="p-4 border-t border-blue-700">
        <button className="flex items-center w-full px-4 py-3 text-left rounded-lg hover:bg-blue-600 transition-all">
          <FiLogOut className="mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;