import React, { useState } from 'react';
import { FiUpload, FiTrash2, FiPlus, FiX, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const AddProducts = () => {
  // Form state
  const [product, setProduct] = useState({
    name: '',
    brand: '',
    modelNo: '',
    price: '',
    range: '',
    warranty: '',
    stock: '',
    description: '',
    specifications: [''],
    images: []
  });

  const [activeTab, setActiveTab] = useState('description');
  const [previewImage, setPreviewImage] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  // Handle specification changes
  const handleSpecChange = (index, value) => {
    const newSpecs = [...product.specifications];
    newSpecs[index] = value;
    setProduct(prev => ({ ...prev, specifications: newSpecs }));
  };

  // Add new specification field
  const addSpecField = () => {
    setProduct(prev => ({ ...prev, specifications: [...prev.specifications, ''] }));
  };

  // Remove specification field
  const removeSpecField = (index) => {
    const newSpecs = product.specifications.filter((_, i) => i !== index);
    setProduct(prev => ({ ...prev, specifications: newSpecs }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProduct(prev => ({ ...prev, images: [...prev.images, reader.result] }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image
  const removeImage = (index) => {
    const newImages = product.images.filter((_, i) => i !== index);
    setProduct(prev => ({ ...prev, images: newImages }));
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Product submitted:', product);
    // Here you would typically send the data to your backend API
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
         <div className="mb-4">
                <Link
                  to="/admin/products"
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <FiArrowLeft className="mr-1" /> Back to Products
                </Link>
              </div>
      <h1 className="text-2xl font-bold mb-6">{product.id ? 'Edit Product' : 'Add New Product'}</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        {/* Basic Information Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Left Column - Images */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Product Images</h2>
            
            {/* Main Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Product Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                {previewImage ? (
                  <div className="relative">
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="max-h-60 mx-auto object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setPreviewImage(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2 text-sm text-gray-600">
                      <label className="relative cursor-pointer">
                        <span>Upload an image</span>
                        <input 
                          type="file" 
                          className="sr-only" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) setPreviewImage(URL.createObjectURL(file));
                          }}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Thumbnail Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images</label>
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={img} 
                      alt={`Thumbnail ${index + 1}`} 
                      className="h-20 w-full object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5"
                    >
                      <FiX size={12} />
                    </button>
                  </div>
                ))}
                {product.images.length < 4 && (
                  <label className="h-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer">
                    <FiPlus className="text-gray-400" />
                    <input 
                      type="file" 
                      className="sr-only" 
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Column - Product Details */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={product.brand}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="modelNo" className="block text-sm font-medium text-gray-700">Model Number</label>
                  <input
                    type="text"
                    id="modelNo"
                    name="modelNo"
                    value={product.modelNo}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (SAR)</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={product.price}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={product.stock}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="range" className="block text-sm font-medium text-gray-700">Range/Size</label>
                <input
                  type="text"
                  id="range"
                  name="range"
                  value={product.range}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="warranty" className="block text-sm font-medium text-gray-700">Warranty</label>
                <input
                  type="text"
                  id="warranty"
                  name="warranty"
                  value={product.warranty}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs for Description/Specifications */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              type="button"
              onClick={() => setActiveTab('description')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'description'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Description
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('specifications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'specifications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Specifications
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        {activeTab === 'description' ? (
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Product Description</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={product.description}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        ) : (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Specifications</label>
            <div className="space-y-2">
              {product.specifications.map((spec, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="text"
                    value={spec}
                    onChange={(e) => handleSpecChange(index, e.target.value)}
                    className="flex-1 block border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {product.specifications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSpecField(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addSpecField}
                className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiPlus className="-ml-0.5 mr-1 h-4 w-4" />
                Add Specification
              </button>
            </div>
          </div>
        )}
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProducts;