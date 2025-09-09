import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import { footerApi } from "../services/FooterApi";

const FooterAdmin = () => {
  const [formData, setFormData] = useState({
    description: "",
    email: "",
    address: "",
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
    phone: ""
  });

  const [footerDetails, setFooterDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch footer details on component mount
  useEffect(() => {
    fetchFooterDetails();
  }, []);

  // Fetch all footer details
  const fetchFooterDetails = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await footerApi.getAll();
      setFooterDetails(response.data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch footer details");
      console.error("Error fetching footer details:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle Text Area Change
  const handleTextAreaChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add/Update Footer Details
  const handleSubmit = async () => {
    if (!formData.description || !formData.email || !formData.address) {
      setError("Please fill all required fields (description, email, address)!");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (formData.id) {
        // Update existing footer
        await footerApi.update(formData.id, formData);
        setSuccess("Footer details updated successfully!");
      } else {
        // Create new footer
        await footerApi.create(formData);
        setSuccess("Footer details created successfully!");
      }

      // Refresh the list
      await fetchFooterDetails();
      
      // Reset form
      setFormData({
        description: "",
        email: "",
        address: "",
        facebook: "",
        instagram: "",
        twitter: "",
        youtube: "",
        phone: ""
      });

    } catch (err) {
      setError(err.message || "Failed to save footer details");
      console.error("Error saving footer details:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete Footer Details
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this footer detail?")) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      await footerApi.delete(id);
      setSuccess("Footer detail deleted successfully!");
      
      // Refresh the list
      await fetchFooterDetails();
    } catch (err) {
      setError(err.message || "Failed to delete footer detail");
      console.error("Error deleting footer detail:", err);
    } finally {
      setLoading(false);
    }
  };

  // Edit Footer Details
  const handleEdit = (footer) => {
    setFormData(footer);
    setError("");
    setSuccess("");
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Clear form
  const handleClear = () => {
    setFormData({
      description: "",
      email: "",
      address: "",
      facebook: "",
      instagram: "",
      twitter: "",
      youtube: "",
      phone: ""
    });
    setError("");
    setSuccess("");
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-4">
        <Link
          to="/admin/dashboard"
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <FiArrowLeft className="mr-1" /> Back to Dashboard
        </Link>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Footer Details</h2>

      {/* Success and Error Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Description */}
        <div className="sm:col-span-2">
          <label className="block text-gray-700 font-medium mb-1">Company Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleTextAreaChange}
            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-400 focus:outline-none"
            placeholder="Enter company description"
            rows="4"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-400 focus:outline-none"
            placeholder="Enter email address"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-400 focus:outline-none"
            placeholder="Enter phone number"
          />
        </div>

        {/* Address */}
        <div className="sm:col-span-2">
          <label className="block text-gray-700 font-medium mb-1">Address *</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleTextAreaChange}
            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-400 focus:outline-none"
            placeholder="Enter company address"
            rows="3"
          />
        </div>

        {/* Social Media Links */}
        <div className="sm:col-span-2">
          <h3 className="text-lg font-semibold mb-3">Social Media Links</h3>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Facebook</label>
          <input
            type="url"
            name="facebook"
            value={formData.facebook}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-400 focus:outline-none"
            placeholder="https://facebook.com/username"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Instagram</label>
          <input
            type="url"
            name="instagram"
            value={formData.instagram}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-400 focus:outline-none"
            placeholder="https://instagram.com/username"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Twitter</label>
          <input
            type="url"
            name="twitter"
            value={formData.twitter}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-400 focus:outline-none"
            placeholder="https://twitter.com/username"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">YouTube</label>
          <input
            type="url"
            name="youtube"
            value={formData.youtube}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-400 focus:outline-none"
            placeholder="https://youtube.com/channel"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg transition duration-300"
        >
          {loading ? "Processing..." : (formData.id ? "Update Details" : "Add Details")}
        </button>

        {formData.id && (
          <button
            onClick={handleClear}
            disabled={loading}
            className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition duration-300"
          >
            Cancel Edit
          </button>
        )}
      </div>

      {/* Footer Details List */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-3">Saved Footer Details</h3>
        
        {loading && <p className="text-gray-500">Loading footer details...</p>}
        
        {!loading && footerDetails.length === 0 ? (
          <p className="text-gray-500">No footer details added yet.</p>
        ) : (
          <div className="space-y-4">
            {footerDetails.map((detail) => (
              <div
                key={detail.id}
                className="bg-gray-100 p-4 rounded-lg flex justify-between items-center shadow"
              >
                <div className="flex-1">
                  <p className="font-semibold">{detail.email}</p>
                  <p className="text-sm text-gray-600 mb-2">{detail.address}</p>
                  <p className="text-xs text-gray-500">
                    Social links: {[
                      detail.facebook && 'Facebook',
                      detail.instagram && 'Instagram',
                      detail.twitter && 'Twitter',
                      detail.youtube && 'YouTube'
                    ].filter(Boolean).join(', ') || 'None'}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(detail)}
                    disabled={loading}
                    className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-300 text-white px-3 py-2 rounded-lg"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(detail.id)}
                    disabled={loading}
                    className="bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white px-3 py-2 rounded-lg"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FooterAdmin;