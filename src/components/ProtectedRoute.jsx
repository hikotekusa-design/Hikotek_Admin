// import { useEffect, useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { verifyToken } from '../services/authApi';

// const ProtectedRoute = ({ children }) => {
//   const [isVerified, setIsVerified] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const validateAuth = async () => {
//       const token = localStorage.getItem('adminToken');
//       if (!token) {
//         navigate('/login', { state: { from: location }, replace: true });
//         return;
//       }

//       try {
//         await verifyToken(token);
//         setIsVerified(true);
//       } catch (error) {
//         console.error('Auth verification failed:', error);
//         localStorage.removeItem('adminToken');
//         navigate('/login', { state: { from: location }, replace: true });
//       }
//     };

//     validateAuth();
//   }, [navigate, location]);

//   return isVerified ? children : null;
// };

// export default ProtectedRoute;