// AdminProducts.jsx
import React, { useState, useEffect } from 'react';
import { FiEdit, FiEye, FiTrash2, FiPlus, FiSearch, FiArrowLeft } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { productApi } from '../services/productApi';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [productToDelete, setProductToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await productApi.getAll();
        if (response.success) {
          setProducts(response.data);
        } else {
          setError('Failed to fetch products. Please try again.');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(
          err.message.includes('PERMISSION_DENIED')
            ? 'Permission denied. Please check your admin credentials or contact support.'
            : err.message || 'Failed to fetch products. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle product deletion
  const handleDelete = async (id) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await productApi.delete(id);
      if (response.success) {
        setProducts(products.filter((product) => product.id !== id));
        setProductToDelete(null);
      } else {
        setError('Failed to delete product. Please try again.');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(
        err.message.includes('PERMISSION_DENIED')
          ? 'Permission denied. Please check your admin credentials or contact support.'
          : err.message || 'Failed to delete product. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  
const handleToggleFeatured = async (id, newValue) => {
  setIsLoading(true);
  setError('');
  try {
    const formData = new FormData();
    formData.append('isFeatured', newValue.toString());
    
    const response = await productApi.update(id, formData);
    if (response.success) {
      // Update the local state immediately
      setProducts(products.map((p) =>
        p.id === id ? { ...p, isFeatured: newValue } : p
      ));
    } else {
      throw new Error(response.error || 'Failed to update featured status');
    }
  } catch (err) {
    console.error('Error toggling featured:', err);
    setError(err.message || 'Failed to update featured status. Please try again.');
    // Revert the toggle on error
    setProducts(products.map((p) =>
      p.id === id ? { ...p, isFeatured: !newValue } : p
    ));
  } finally {
    setIsLoading(false);
  }
};

  // Filter products based on search
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {/* Header with Add Product button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Manage Products</h1>
        <Link
          to="/admin/products/add"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <FiPlus /> Add Product
        </Link>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Search bar */}
      <div className="mb-6 relative max-w-md">
        {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={isLoading}
        /> */}
      </div>

      {/* Products table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Product
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Featured
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    <div className="flex justify-center items-center">
                      <svg
                        className="animate-spin h-5 w-5 text-blue-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span className="ml-2">Loading products...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 object-contain"
                            src={product.mainImage || '/placeholder-image.jpg'}
                            alt={product.name}
                            onError={(e) => {
                              e.target.src = '/placeholder-image.jpg'; // Fallback image
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.showPrice ? `${product.price} USD` : 'Hidden'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={product.isFeatured || false}
                          onChange={(e) => handleToggleFeatured(product.id, e.target.checked)}
                          disabled={isLoading}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 peer-checked:after:border-white peer-checked:bg-blue-600"></div>
                      </label>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <Link
                          to={`/admin/products/view/${product.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="View"
                        >
                          <FiEye className="h-5 w-5" />
                        </Link>
                        <Link
                          to={`/admin/products/edit/${product.id}`}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Edit"
                        >
                          <FiEdit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => setProductToDelete(product.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                          disabled={isLoading}
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
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
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
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Product</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this product? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => handleDelete(productToDelete)}
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={() => setProductToDelete(null)}
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

export default AdminProducts;