import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FiHome, 
  FiPackage, 
  FiMail, 
  FiUsers, 
  FiSettings,
  FiLogOut,
  FiMapPin
} from 'react-icons/fi';

const AdminSidebar = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Add any logout logic here (like clearing tokens, etc.)
    // Then navigate to the login page
    navigate('/');
  };

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

        {/* Added Address NavLink */}
        <NavLink 
          to="/admin/address" 
          className={({isActive}) => 
            `flex items-center px-4 py-3 rounded-lg transition-all ${
              isActive ? 'bg-blue-700 text-white' : 'hover:bg-blue-600'
            }`
          }
        >
          <FiMapPin className="mr-3" />
          Contact
        </NavLink>

        <NavLink 
          to="/admin/footer" 
          className={({isActive}) => 
            `flex items-center px-4 py-3 rounded-lg transition-all ${
              isActive ? 'bg-blue-700 text-white' : 'hover:bg-blue-600'
            }`
          }
        >
          <FiSettings className="mr-3" />
          Footer
        </NavLink>
        <NavLink 
          to="/admin/home" 
          className={({isActive}) => 
            `flex items-center px-4 py-3 rounded-lg transition-all ${
              isActive ? 'bg-blue-700 text-white' : 'hover:bg-blue-600'
            }`
          }
        >
          <FiSettings className="mr-3" />
          Home
        </NavLink>
        <NavLink 
          to="/admin/about" 
          className={({isActive}) => 
            `flex items-center px-4 py-3 rounded-lg transition-all ${
              isActive ? 'bg-blue-700 text-white' : 'hover:bg-blue-600'
            }`
          }
        >
          <FiSettings className="mr-3" />
          About
        </NavLink>
      </nav>

      
      <div className="p-4 border-t border-blue-700">
        <button 
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-left rounded-lg hover:bg-blue-600 transition-all"
        >
          <FiLogOut className="mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;