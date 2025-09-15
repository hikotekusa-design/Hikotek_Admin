import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiArrowLeft, FiImage, FiX } from 'react-icons/fi';
import { HomeApi } from '../services/HomeApi';

const AdminHome = () => {
  const [carouselItems, setCarouselItems] = useState([]);
  const [topImages, setTopImages] = useState([]);
  const [bottomImages, setBottomImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [currentSection, setCurrentSection] = useState('carousel');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    image: null,
    imagePreview: '',
    buttonText: '',
    buttonLink: '',
  });

  // Fetch data for all sections on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [carouselRes, topImagesRes, bottomImagesRes] = await Promise.all([
          HomeApi.getAll('carousel'),
          HomeApi.getAll('topImages'),
          HomeApi.getAll('bottomImages'),
        ]);
        setCarouselItems(carouselRes.data || []);
        setTopImages(topImagesRes.data || []);
        setBottomImages(bottomImagesRes.data || []);
      } catch (err) {
        console.error('Error fetching home content:', err);
        setError('Failed to load content. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      if (currentSection === 'carousel') {
        formDataToSend.append('title', formData.title);
      }
      if (formData.image) {
        formDataToSend.append('images', formData.image);
      }
      if (editingItem && formData.imagePreview === editingItem.imageUrl) {
        formDataToSend.append('keepExistingImage', 'true');
      }

      if (editingItem) {
        await HomeApi.update(currentSection, editingItem.id, formDataToSend);
      } else {
        await HomeApi.create(currentSection, formDataToSend);
      }

      // Refetch data to update UI
      const res = await HomeApi.getAll(currentSection);
      if (currentSection === 'carousel') setCarouselItems(res.data || []);
      if (currentSection === 'topImages') setTopImages(res.data || []);
      if (currentSection === 'bottomImages') setBottomImages(res.data || []);

      alert(editingItem ? 'Item updated successfully!' : 'Item created successfully!');
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(`Failed to save item: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item, section) => {
    setEditingItem(item);
    setCurrentSection(section);
    setFormData({
      title: item.title || '',
      image: null,
      imagePreview: item.imageUrl || '',
      buttonText: item.buttonText || '',
      buttonLink: item.buttonLink || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, section) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await HomeApi.delete(section, id);
        // Refetch data to update UI
        const res = await HomeApi.getAll(section);
        if (section === 'carousel') setCarouselItems(res.data || []);
        if (section === 'topImages') setTopImages(res.data || []);
        if (section === 'bottomImages') setBottomImages(res.data || []);
        alert('Item deleted successfully!');
      } catch (err) {
        console.error('Error deleting item:', err);
        setError(`Failed to delete item: ${err.message}`);
      }
    }
  };

  const openAddModal = (section) => {
    setCurrentSection(section);
    setEditingItem(null);
    resetForm();
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      image: null,
      imagePreview: '',
      buttonText: '',
      buttonLink: '',
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  return (
    <div className="p-4 sm:p-6 ml-64 w-[80%] mx-auto">
      <div className="mb-4">
        <a
          href="/admin/dashboard"
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <FiArrowLeft className="mr-1" /> Back to Dashboard
        </a>
      </div>

      <div className="max-w-5xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">Home Page Management</h1>

        {loading && <div className="text-center py-8">Loading...</div>}
        {error && <div className="text-center py-8 text-red-600">{error}</div>}

        {/* Carousel Section */}
        {!loading && (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-0">Carousel Items</h2>
              <button
                onClick={() => openAddModal('carousel')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center text-sm sm:text-base"
                disabled={submitting}
              >
                <FiPlus className="mr-2" /> Add Carousel Item
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {carouselItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <div className="h-32 sm:h-40 bg-gray-200 rounded-md mb-4 flex items-center justify-center overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg mb-2 truncate">{item.title}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(item, 'carousel')}
                      className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                      disabled={submitting}
                    >
                      <FiEdit className="mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, 'carousel')}
                      className="text-red-600 hover:text-red-800 flex items-center text-sm"
                      disabled={submitting}
                    >
                      <FiTrash2 className="mr-1" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {carouselItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FiImage className="mx-auto text-4xl mb-3" />
                <p>No carousel items found. Add your first item to get started.</p>
              </div>
            )}
          </div>
        )}

        {/* Top 3 Images Section */}
        {!loading && (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-0">Top Images Section (3 Images)</h2>
              <button
                onClick={() => openAddModal('topImages')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center text-sm sm:text-base"
                disabled={submitting}
              >
                <FiPlus className="mr-2" /> Add Image
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {topImages.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <div className="h-32 sm:h-40 bg-gray-200 rounded-md mb-4 flex items-center justify-center overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg mb-2 truncate">{item.title}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(item, 'topImages')}
                      className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                      disabled={submitting}
                    >
                      <FiEdit className="mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, 'topImages')}
                      className="text-red-600 hover:text-red-800 flex items-center text-sm"
                      disabled={submitting}
                    >
                      <FiTrash2 className="mr-1" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {topImages.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FiImage className="mx-auto text-4xl mb-3" />
                <p>No images found. Add images to display in this section.</p>
              </div>
            )}
          </div>
        )}

        {/* Bottom 2 Images Section */}
        {!loading && (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-0">Bottom Images Section (2 Images)</h2>
              <button
                onClick={() => openAddModal('bottomImages')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center text-sm sm:text-base"
                disabled={submitting}
              >
                <FiPlus className="mr-2" /> Add Image
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {bottomImages.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <div className="h-32 sm:h-40 bg-gray-200 rounded-md mb-4 flex items-center justify-center overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg mb-2 truncate">{item.title}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(item, 'bottomImages')}
                      className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                      disabled={submitting}
                    >
                      <FiEdit className="mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, 'bottomImages')}
                      className="text-red-600 hover:text-red-800 flex items-center text-sm"
                      disabled={submitting}
                    >
                      <FiTrash2 className="mr-1" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {bottomImages.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FiImage className="mx-auto text-4xl mb-3" />
                <p>No images found. Add images to display in this section.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xl sm:max-w-2xl max-h-[100vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b px-4 sm:px-6 py-4">
              <h2 className="text-lg sm:text-xl font-semibold">
                {editingItem ? 'Edit Item' : `Add ${currentSection === 'carousel' ? 'Carousel' : 'Image'} Item`}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <FiX size={20} sm:size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 sm:p-6">
              <div className="space-y-4">
                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image {!editingItem && '*'}
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                    {formData.imagePreview ? (
                      <div className="mb-4">
                        <img
                          src={formData.imagePreview}
                          alt="Preview"
                          className="h-32 sm:h-40 mx-auto rounded-md object-cover"
                        />
                      </div>
                    ) : (
                      <FiImage className="text-4xl text-gray-400 mx-auto mb-4" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                      required={!editingItem}
                      disabled={submitting}
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-blue-700 inline-block"
                    >
                      Choose Image
                    </label>
                    <p className="text-sm text-gray-500 mt-2">JPEG, PNG, JPG (Max 5MB)</p>
                  </div>
                </div>

                {/* Title Input for Carousel */}
                {currentSection === 'carousel' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      disabled={submitting}
                    />
                  </div>
                )}
              </div>

              {error && <div className="text-red-600 text-sm mt-4">{error}</div>}

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-3 sm:px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
                  disabled={submitting}
                >
                  {submitting ? 'Processing...' : (editingItem ? 'Update Item' : 'Add Item')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHome;