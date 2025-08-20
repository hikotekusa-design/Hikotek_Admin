import React, { useState, useEffect, useRef } from 'react';
import { FiUpload, FiTrash2, FiPlus, FiX, FiArrowLeft, FiEye, FiEyeOff } from 'react-icons/fi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { productApi } from '../services/productApi';

const EditProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    price: '',
    showPrice: true,
    category: '',
    description: '',
    specifications: [''],
    highlights: [''],
    downloads: [],
    images: [],
    imageFiles: [],
    mainImage: '',
  });
  const [activeTab, setActiveTab] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  // Clean up object URLs when component unmounts or images change
  useEffect(() => {
    return () => {
      product.images.forEach((url) => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
      if (product.mainImage && product.mainImage.startsWith('blob:')) {
        URL.revokeObjectURL(product.mainImage);
      }
    };
  }, [product.images, product.mainImage]);

  // Fetch existing product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productApi.getById(id);
        if (response.success) {
          const data = response.data;
          setProduct({
            name: data.name || '',
            price: data.price || '',
            showPrice: data.showPrice || true,
            category: data.category || '',
            description: data.description || '',
            specifications: Array.isArray(data.specifications) ? data.specifications : [''],
            highlights: Array.isArray(data.highlights) ? data.highlights : [''],
            downloads: data.downloads || [],
            images: data.images || [],
            imageFiles: [],
            mainImage: data.mainImage || (data.images.length > 0 ? data.images[0] : ''),
          });
        } else {
          setServerError('Failed to fetch product details.');
        }
      } catch (error) {
        setServerError(error.message || 'Failed to fetch product details.');
      }
    };
    fetchProduct();
  }, [id]);

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!product.name.trim()) newErrors.name = 'Product name is required';
    if (!product.price || parseFloat(product.price) <= 0) newErrors.price = 'Valid price is required';
    if (!product.category.trim()) newErrors.category = 'Category is required';
    if (product.images.length === 0) newErrors.images = 'At least one image is required';
    if (product.specifications.some((spec) => !spec.trim())) {
      newErrors.specifications = 'All specifications must be filled';
    }
    if (product.highlights.some((highlight) => !highlight.trim())) {
      newErrors.highlights = 'All highlights must be filled';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    setServerError('');
  };

  // Handle specification changes
  const handleSpecChange = (index, value) => {
    const newSpecs = [...product.specifications];
    newSpecs[index] = value;
    setProduct((prev) => ({ ...prev, specifications: newSpecs }));
    if (errors.specifications) setErrors((prev) => ({ ...prev, specifications: '' }));
    setServerError('');
  };

  // Handle highlights changes
  const handleHighlightChange = (index, value) => {
    const newHighlights = [...product.highlights];
    newHighlights[index] = value;
    setProduct((prev) => ({ ...prev, highlights: newHighlights }));
    if (errors.highlights) setErrors((prev) => ({ ...prev, highlights: '' }));
    setServerError('');
  };

  // Add new specification field
  const addSpecField = () => {
    setProduct((prev) => ({ ...prev, specifications: [...prev.specifications, ''] }));
  };

  // Add new highlight field
  const addHighlightField = () => {
    setProduct((prev) => ({ ...prev, highlights: [...prev.highlights, ''] }));
  };

  // Validate file type and size
  const validateFile = (file, allowedTypes, maxSizeMB = 10) => {
    if (!allowedTypes.includes(file.type)) {
      return `File type not allowed for ${file.name}. Allowed types: ${allowedTypes.join(', ')}`;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `File ${file.name} exceeds ${maxSizeMB}MB limit`;
    }
    return null;
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = product.imageFiles.length + files.length;
    if (totalImages > 5) {
      setErrors((prev) => ({ ...prev, images: 'Maximum 5 images allowed' }));
      return;
    }

    const newImageFiles = [...product.imageFiles];
    const newImageUrls = [...product.images];
    const newErrors = { ...errors };
    let hasValidFiles = false;

    files.forEach((file) => {
      const error = validateFile(file, ['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
      if (error) {
        newErrors.images = newErrors.images ? `${newErrors.images}, ${error}` : error;
      } else {
        newImageFiles.push(file);
        const objectUrl = URL.createObjectURL(file);
        newImageUrls.push(objectUrl);
        hasValidFiles = true;
      }
    });

    setErrors(newErrors);

    if (hasValidFiles) {
      setProduct((prev) => ({
        ...prev,
        imageFiles: newImageFiles,
        images: newImageUrls,
        mainImage: prev.mainImage || newImageUrls[0] || '',
      }));
      if (newErrors.images && newImageUrls.length > 0) {
        setErrors((prev) => ({ ...prev, images: '' }));
      }
    }

    e.target.value = '';
  };

  // Handle download upload
  const handleDownloadUpload = (e) => {
    const files = Array.from(e.target.files);
    const totalDownloads = product.downloads.length + files.length;
    if (totalDownloads > 3) {
      setErrors((prev) => ({ ...prev, downloads: 'Maximum 3 PDF files allowed' }));
      return;
    }

    const validFiles = [];
    const newErrors = { ...errors };

    files.forEach((file) => {
      const error = validateFile(file, ['application/pdf'], 10);
      if (error) {
        newErrors.downloads = newErrors.downloads
          ? `${newErrors.downloads}, ${error}`
          : error;
      } else {
        validFiles.push(file);
      }
    });

    setErrors(newErrors);

    if (validFiles.length > 0) {
      setProduct((prev) => ({
        ...prev,
        downloads: [...prev.downloads, ...validFiles],
      }));
    }

    e.target.value = '';
  };

  // Remove specification field
  const removeSpecField = (index) => {
    const newSpecs = product.specifications.filter((_, i) => i !== index);
    setProduct((prev) => ({ ...prev, specifications: newSpecs }));
    if (errors.specifications) setErrors((prev) => ({ ...prev, specifications: '' }));
  };

  // Remove highlight field
  const removeHighlightField = (index) => {
    const newHighlights = product.highlights.filter((_, i) => i !== index);
    setProduct((prev) => ({ ...prev, highlights: newHighlights }));
    if (errors.highlights) setErrors((prev) => ({ ...prev, highlights: '' }));
  };

  // Remove image
  const removeImage = (index) => {
    if (!window.confirm('Are you sure you want to remove this image?')) return;

    const newImages = product.images.filter((_, i) => i !== index);
    const newImageFiles = product.imageFiles.filter((_, i) => i !== index);

    if (product.images[index].startsWith('blob:')) {
      URL.revokeObjectURL(product.images[index]);
    }

    const newMainImage =
      product.mainImage === product.images[index] ? newImages[0] || '' : product.mainImage;

    setProduct((prev) => ({
      ...prev,
      images: newImages,
      imageFiles: newImageFiles,
      mainImage: newMainImage,
    }));

    if (newImages.length === 0 && !errors.images) {
      setErrors((prev) => ({ ...prev, images: 'At least one image is required' }));
    }
  };

  // Remove download
  const removeDownloadFile = (index) => {
    const newDownloads = product.downloads.filter((_, i) => i !== index);
    setProduct((prev) => ({ ...prev, downloads: newDownloads }));
    if (errors.downloads) setErrors((prev) => ({ ...prev, downloads: '' }));
  };

  // Set main image
  const setMainImage = (img) => {
    setProduct((prev) => ({ ...prev, mainImage: img }));
    if (errors.mainImage) setErrors((prev) => ({ ...prev, mainImage: '' }));
  };

  // Toggle price visibility
  const togglePriceVisibility = () => {
    setProduct((prev) => ({ ...prev, showPrice: !prev.showPrice }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        document
          .querySelector(`[name="${firstError}"], [data-tab="${firstError}"]`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    setServerError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('name', product.name);
      formData.append('price', product.price);
      formData.append('showPrice', product.showPrice);
      formData.append('category', product.category);
      formData.append('description', product.description || '');
      formData.append(
        'specifications',
        JSON.stringify(product.specifications.filter((s) => s.trim() !== ''))
      );
      formData.append(
        'highlights',
        JSON.stringify(product.highlights.filter((h) => h.trim() !== ''))
      );
      product.imageFiles.forEach((file) => formData.append('images', file));
      product.downloads.forEach((file) => {
        if (file instanceof File) formData.append('downloads', file);
      });

      // Indicate to keep existing images/downloads if no new ones are uploaded
      formData.append('keepExistingImages', product.images.length > product.imageFiles.length ? 'true' : 'false');
      formData.append('keepExistingDownloads', product.downloads.every(d => typeof d === 'string') ? 'true' : 'false');

      const response = await productApi.update(id, formData);
      console.log('Update product response:', response);

      if (response.success) {
        setSuccess('Product updated successfully!');
        setTimeout(() => navigate('/admin/products'), 2000);
        // Clean up blob URLs for new images
        product.imageFiles.forEach((file, idx) => {
          if (product.images[idx] && product.images[idx].startsWith('blob:')) {
            URL.revokeObjectURL(product.images[idx]);
          }
        });
      } else {
        setServerError(response.error || 'Failed to update product.');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setServerError(error.message || 'Failed to update product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.click();
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
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

      {serverError && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {serverError}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['basic', 'description', 'specifications', 'highlights', 'downloads'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                data-tab={tab}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'basic' && (
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-lg font-semibold mb-4">Product Images</h2>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Product Image{' '}
                  {errors.mainImage && <span className="text-red-500 text-xs">({errors.mainImage})</span>}
                </label>
                {product.mainImage ? (
                  <div className="relative border rounded-lg p-4 flex items-center justify-center h-64 group">
                    <img src={product.mainImage} alt="Main product" className="max-h-60 object-contain" />
                    <button
                      type="button"
                      onClick={() => {
                        const index = product.images.indexOf(product.mainImage);
                        if (index !== -1) removeImage(index);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center h-64 flex items-center justify-center">
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageUpload}
                        multiple
                      />
                      <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="text-sm text-gray-500 mt-2">Upload images to see preview</p>
                      <button
                        type="button"
                        onClick={triggerFileInput}
                        className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Select Images
                      </button>
                    </div>
                  </div>
                )}
                {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images</label>
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className={`h-20 w-full object-cover rounded border cursor-pointer ${
                          product.mainImage === img ? 'border-2 border-blue-500' : 'border-gray-300'
                        }`}
                        onClick={() => setMainImage(img)}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  ))}
                  {product.images.length < 5 && (
                    <label className="h-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
                      <FiPlus className="text-gray-400 text-2xl" />
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageUpload}
                        multiple
                      />
                    </label>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">Click an image to set it as the main image. Max 5 images.</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Product Name {errors.name && <span className="text-red-500 text-xs">({errors.name})</span>}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category {errors.category && <span className="text-red-500 text-xs">({errors.category})</span>}
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                    className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price (USD) {errors.price && <span className="text-red-500 text-xs">({errors.price})</span>}
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={product.price}
                      onChange={handleChange}
                      className={`mt-1 block w-full border rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                        errors.price ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                      step="0.01"
                      min="0"
                    />
                    <button
                      type="button"
                      onClick={togglePriceVisibility}
                      className={`mt-1 px-3 border border-l-0 rounded-r-md flex items-center ${
                        product.showPrice
                          ? 'bg-green-500 text-white border-green-500'
                          : 'bg-gray-300 text-gray-700 border-gray-300'
                      }`}
                      title={product.showPrice ? 'Price is visible' : 'Price is hidden'}
                    >
                      {product.showPrice ? <FiEye /> : <FiEyeOff />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {product.showPrice ? 'Price will be shown to users' : 'Price will be hidden from users'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'description' && (
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Product Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={6}
              value={product.description}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter detailed product description..."
            />
          </div>
        )}

        {activeTab === 'specifications' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specifications {errors.specifications && <span className="text-red-500 text-xs">({errors.specifications})</span>}
            </label>
            <div className="space-y-2">
              {product.specifications.map((spec, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="text"
                    value={spec}
                    onChange={(e) => handleSpecChange(index, e.target.value)}
                    className={`flex-1 block border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.specifications ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={`Specification ${index + 1}`}
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

        {activeTab === 'highlights' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Highlights/Bullet Points{' '}
              {errors.highlights && <span className="text-red-500 text-xs">({errors.highlights})</span>}
            </label>
            <div className="space-y-2">
              {product.highlights.map((highlight, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="text"
                    value={highlight}
                    onChange={(e) => handleHighlightChange(index, e.target.value)}
                    className={`flex-1 block border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.highlights ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={`Highlight ${index + 1}`}
                  />
                  {product.highlights.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeHighlightField(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addHighlightField}
                className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiPlus className="-ml-0.5 mr-1 h-4 w-4" />
                Add Highlight
              </button>
            </div>
          </div>
        )}

        {activeTab === 'downloads' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Download Files (PDF only){' '}
              {errors.downloads && <span className="text-red-500 text-xs">({errors.downloads})</span>}
            </label>
            <div className="space-y-4">
              {product.downloads.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center">
                    <FiUpload className="mr-2 text-gray-500" />
                    <span className="text-sm truncate">{typeof file === 'string' ? file.split('/').pop() : file.name}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      {typeof file === 'string' ? '' : `(${(file.size / 1024 / 1024).toFixed(2)} MB)`}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDownloadFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
              <label className="block border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:border-blue-500 transition-colors">
                <FiUpload className="mx-auto h-8 w-8 text-gray-400" />
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Upload PDF files (max 10MB each, max 3 files)
                </span>
                <input
                  type="file"
                  className="sr-only"
                  accept=".pdf"
                  multiple
                  onChange={handleDownloadUpload}
                />
              </label>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Link
            to="/admin/products"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                Updating...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProducts;