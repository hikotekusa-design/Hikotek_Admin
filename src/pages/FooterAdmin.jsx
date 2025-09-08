import React, { useState } from 'react';
import { FaSave, FaUndo, FaEye, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTiktok, FaPinterest, FaYoutube } from 'react-icons/fa';

const FooterAdmin = () => {
  const [activeTab, setActiveTab] = useState('company');
  const [footerData, setFooterData] = useState({
    companyInfo: {
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in nibh vehicula.',
      address: '123 Fashion Street, New York, NY 10001',
      email: 'hello@example.com'
    },
    socialMedia: {
      facebook: '',
      instagram: 'https://www.instagram.com/hikotek_llc/#',
      twitter: 'https://x.com/hikotek',
      tiktok: '',
      pinterest: '',
      youtube: ''
    }
  });

  const handleInputChange = (section, field, value) => {
    setFooterData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    // Save logic would go here
    console.log('Saving footer data:', footerData);
    alert('Footer content saved successfully!');
  };

  const handleReset = () => {
    // Reset logic would go here
    alert('Changes have been reset');
  };

  const handlePreview = () => {
    // Preview logic would go here
    alert('Preview mode activated');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <h1 className="text-2xl font-bold">Footer Content Management</h1>
          <p className="text-blue-100">Update company information and social media links displayed in the footer</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            className={`px-6 py-3 font-medium text-sm ${activeTab === 'company' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('company')}
          >
            Company Information
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm ${activeTab === 'social' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('social')}
          >
            Social Media
          </button>
        </div>

        <div className="p-6">
          {/* Company Information Tab */}
          {activeTab === 'company' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Company Details</h2>
                <p className="text-gray-600 text-sm">This information appears in the footer section of your website</p>
              </div>

              <div className="grid gap-6 md:grid-cols-1">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Description</label>
                  <textarea
                    value={footerData.companyInfo.description}
                    onChange={(e) => handleInputChange('companyInfo', 'description', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    rows="4"
                    placeholder="Enter company description"
                  />
                  <p className="text-xs text-gray-500 mt-1">Brief description about your company (max 200 characters)</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                      <FaMapMarkerAlt />
                    </span>
                    <input
                      type="text"
                      value={footerData.companyInfo.address}
                      onChange={(e) => handleInputChange('companyInfo', 'address', e.target.value)}
                      className="flex-1 block w-full rounded-none rounded-r-md px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="Enter company address"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                      <FaEnvelope />
                    </span>
                    <input
                      type="email"
                      value={footerData.companyInfo.email}
                      onChange={(e) => handleInputChange('companyInfo', 'email', e.target.value)}
                      className="flex-1 block w-full rounded-none rounded-r-md px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Social Media Tab */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Social Media Links</h2>
                <p className="text-gray-600 text-sm">Add your social media profiles to display in the footer</p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="border rounded-lg p-4 bg-gray-50">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FaFacebook className="text-blue-600 mr-2" />
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    value={footerData.socialMedia.facebook}
                    onChange={(e) => handleInputChange('socialMedia', 'facebook', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                
                <div className="border rounded-lg p-4 bg-gray-50">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FaInstagram className="text-pink-600 mr-2" />
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={footerData.socialMedia.instagram}
                    onChange={(e) => handleInputChange('socialMedia', 'instagram', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="https://instagram.com/yourprofile"
                  />
                </div>
                
                <div className="border rounded-lg p-4 bg-gray-50">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FaXTwitter className="text-black mr-2" />
                    Twitter URL
                  </label>
                  <input
                    type="url"
                    value={footerData.socialMedia.twitter}
                    onChange={(e) => handleInputChange('socialMedia', 'twitter', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="https://twitter.com/yourprofile"
                  />
                </div>
                
                <div className="border rounded-lg p-4 bg-gray-50">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FaTiktok className="text-black mr-2" />
                    TikTok URL
                  </label>
                  <input
                    type="url"
                    value={footerData.socialMedia.tiktok}
                    onChange={(e) => handleInputChange('socialMedia', 'tiktok', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="https://tiktok.com/@yourprofile"
                  />
                </div>
                
                <div className="border rounded-lg p-4 bg-gray-50">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FaPinterest className="text-red-600 mr-2" />
                    Pinterest URL
                  </label>
                  <input
                    type="url"
                    value={footerData.socialMedia.pinterest}
                    onChange={(e) => handleInputChange('socialMedia', 'pinterest', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="https://pinterest.com/yourprofile"
                  />
                </div>
                
                <div className="border rounded-lg p-4 bg-gray-50">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FaYoutube className="text-red-600 mr-2" />
                    YouTube URL
                  </label>
                  <input
                    type="url"
                    value={footerData.socialMedia.youtube}
                    onChange={(e) => handleInputChange('socialMedia', 'youtube', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="https://youtube.com/yourchannel"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <div className="flex gap-3">
              <button
                onClick={handlePreview}
                className="flex items-center px-5 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              >
                <FaEye className="mr-2" />
                Preview
              </button>
              <button
                onClick={handleReset}
                className="flex items-center px-5 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              >
                <FaUndo className="mr-2" />
                Reset
              </button>
            </div>
            
            <button
              onClick={handleSave}
              className="flex items-center px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              <FaSave className="mr-2" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterAdmin;