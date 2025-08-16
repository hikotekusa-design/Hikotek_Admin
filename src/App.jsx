import { Route, Routes, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDash';
import AdminProducts from './pages/AdminProducts';
import AddProducts from './pages/AddProducts';
import AdminEnquiries from './pages/AdminEnquiries';
import AdminDistributors from './pages/AdminDistributors';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      
      <Route path="/admin/dashboard" element={
        // <ProtectedRoute>
          <AdminDashboard />
        // </ProtectedRoute>
      } />
      
      <Route path="/admin/products" element={
        // <ProtectedRoute>
          <AdminProducts />
        // </ProtectedRoute>
      } />
      
      <Route path="/admin/products/add" element={
        // <ProtectedRoute>
          <AddProducts />
        // </ProtectedRoute>
      } />
      
      <Route path="/admin/enquiries" element={
        // <ProtectedRoute>
          <AdminEnquiries />
        // </ProtectedRoute>
      } />
      
      <Route path="/admin/distributors" element={
        // <ProtectedRoute>
          <AdminDistributors />
        // </ProtectedRoute>
      } />

      {/* <Route path="*" element={<Navigate to="/" />} /> */}
    </Routes>
  );
}

export default App;