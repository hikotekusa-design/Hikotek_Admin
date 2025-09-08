import { Route, Routes, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDash';
import AdminProducts from './pages/AdminProducts';
import AddProducts from './pages/AddProducts';
import AdminEnquiries from './pages/AdminEnquiries';
import AdminDistributors from './pages/AdminDistributors';
import ViewProduct from './pages/ViewProduct';
import EditProducts from './pages/EditProducts';
import AddressList from './pages/AddressList';
import FooterAdmin from './pages/FooterAdmin';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      
      <Route path="/admin/dashboard" element={
          <AdminDashboard />
      } />
      
      <Route path="/admin/products" element={
          <AdminProducts />
      } />
      
      <Route path="/admin/products/add" element={
          <AddProducts />
      } />
      
      <Route path="/admin/enquiries" element={
          <AdminEnquiries />
      } />
      
      <Route path="/admin/distributors" element={
          <AdminDistributors />
      } />

      <Route path="/admin/products/view/:id" element={<ViewProduct/>}/>
      <Route path="/admin/products/edit/:id" element={<EditProducts/>}/>
      <Route path="/admin/address" element={<AddressList/>}/>
      <Route path="/admin/footer" element={<FooterAdmin/>}/>




    </Routes>
  );
}

export default App;