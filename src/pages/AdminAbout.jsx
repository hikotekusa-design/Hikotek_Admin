import React, { useState, useRef, useEffect } from 'react';
import { AboutApi } from '../services/AboutApi';
import { FiArrowLeft } from 'react-icons/fi';

const AdminAbout = () => {
    const [aboutData, setAboutData] = useState({
        bannerImage: '',
        tagline: '',
        companyProfile: '',
        companyImage: '',
        profileImage: '', // Added separate profileImage field
        profileTitle: '',
        profileDescription: '',
        stats: [
            { value: '', label: '' }, // Changed from 0 to empty string
            { value: '', label: '' },
            { value: '', label: '' }
        ],
        logo: null
    });

    const [isEditing, setIsEditing] = useState(false);
    const [tempData, setTempData] = useState({});
    const [loading, setLoading] = useState(false);
    const bannerInputRef = useRef(null);
    const companyImageInputRef = useRef(null);
    const profileImageInputRef = useRef(null); // Added separate ref for profile image
    const logoInputRef = useRef(null);

    // Fetch about data on component mount
    useEffect(() => {
        fetchAboutData();
    }, []);

    const fetchAboutData = async () => {
        try {
            setLoading(true);
            const response = await AboutApi.get();
            if (response.success && response.data) {
                // Ensure stats have proper values (convert 0 to empty string if needed)
                const data = response.data;
                if (data.stats) {
                    data.stats = data.stats.map(stat => ({
                        value: stat.value === 0 ? '' : String(stat.value),
                        label: stat.label || ''
                    }));
                }
                setAboutData(data);
            }
        } catch (error) {
            console.error('Error fetching about data:', error);
            alert('Failed to load about data: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        // Ensure stats values are strings for proper input handling
        const editData = { ...aboutData };
        if (editData.stats) {
            editData.stats = editData.stats.map(stat => ({
                value: stat.value === 0 ? '' : String(stat.value),
                label: stat.label || ''
            }));
        }
        setTempData(editData);
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            setLoading(true);

            const formData = new FormData();

            // Append text fields
            formData.append('tagline', tempData.tagline);
            formData.append('companyProfile', tempData.companyProfile);
            formData.append('profileTitle', tempData.profileTitle);
            formData.append('profileDescription', tempData.profileDescription);

            // Convert stats values to numbers before sending
            const statsToSend = tempData.stats.map(stat => ({
                value: stat.value ? parseInt(stat.value) || 0 : 0,
                label: stat.label
            }));
            formData.append('stats', JSON.stringify(statsToSend));

            // Append images and deletion flags
            if (tempData.bannerImage instanceof File) {
                formData.append('bannerImage', tempData.bannerImage);
            } else if (tempData.bannerImage === null) {
                formData.append('deleteBannerImage', 'true');
            }

            if (tempData.companyImage instanceof File) {
                formData.append('companyImage', tempData.companyImage);
            } else if (tempData.companyImage === null) {
                formData.append('deleteCompanyImage', 'true');
            }

            if (tempData.profileImage instanceof File) {
                formData.append('profileImage', tempData.profileImage);
            } else if (tempData.profileImage === null) {
                formData.append('deleteProfileImage', 'true'); // Fixed field name
            }

            if (tempData.logo instanceof File) {
                formData.append('logo', tempData.logo);
            } else if (tempData.logo === null) {
                formData.append('deleteLogo', 'true');
            }

            const response = await AboutApi.update(formData);

            if (response.success) {
                await fetchAboutData();
                setIsEditing(false);
                alert('About data updated successfully!');
            }
        } catch (error) {
            console.error('Error saving about data:', error);
            alert('Failed to save about data: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleChange = (field, value) => {
        setTempData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleStatChange = (index, field, value) => {
        const updatedStats = [...tempData.stats];
        if (field === 'value') {
            // Only allow numbers and empty string
            if (value === '' || /^\d*$/.test(value)) {
                updatedStats[index].value = value;
            }
        } else {
            updatedStats[index].label = value;
        }
        setTempData(prev => ({
            ...prev,
            stats: updatedStats
        }));
    };

    const handleImageUpload = (event, field) => {
        const file = event.target.files[0];
        if (file) {
            setTempData(prev => ({
                ...prev,
                [field]: file
            }));
        }
    };

    const triggerFileInput = (ref) => {
        if (ref.current) {
            ref.current.click();
        }
    };

    const removeImage = (field) => {
        setTempData(prev => ({
            ...prev,
            [field]: null
        }));
    };

    const getImageSrc = (image, defaultImage) => {
        if (image instanceof File) {
            return URL.createObjectURL(image);
        }
        return image || defaultImage;
    };

    if (loading && !isEditing) {
        return <div className="p-6">Loading about data...</div>;
    }

    return (
        <div className="bg-white text-gray-800 font-sans p-6">
            <div className="mb-4">
                <a
                    href="/admin/dashboard"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                >
                    <FiArrowLeft className="mr-1" /> Back to Dashboard
                </a>
            </div>
            {/* Header with Edit Button */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">About Us Management</h1>
                {!isEditing ? (
                    <button
                        onClick={handleEdit}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Edit Content'}
                    </button>
                ) : (
                    <div className="space-x-4">
                        <button
                            onClick={handleSave}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            onClick={handleCancel}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>

            {/* Banner Section */}
            <section className="bg-gray-100 p-6 rounded-lg mb-6">
                <h2 className="text-xl font-semibold mb-4">Banner Section</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Banner Image</label>
                        {isEditing ? (
                            <div className="space-y-4">
                                <input
                                    type="file"
                                    ref={bannerInputRef}
                                    onChange={(e) => handleImageUpload(e, 'bannerImage')}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <button
                                    onClick={() => triggerFileInput(bannerInputRef)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                                >
                                    Upload New Banner
                                </button>
                                {tempData.bannerImage && (
                                    <button
                                        onClick={() => removeImage('bannerImage')}
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded ml-2"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="h-48 bg-gray-200 rounded flex items-center justify-center">
                                <img
                                    src={aboutData.bannerImage || 'https://via.placeholder.com/800x200?text=No+Banner+Image'}
                                    alt="Banner Preview"
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Preview</label>
                        <div className="h-48 bg-gray-200 rounded flex items-center justify-center">
                            <img
                                src={isEditing ? getImageSrc(tempData.bannerImage, 'https://via.placeholder.com/800x200?text=Upload+Banner+Image') : aboutData.bannerImage}
                                alt="Banner Preview"
                                className="max-h-full max-w-full object-contain"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Logo & Tagline Section */}
            <section className="bg-gray-100 p-6 rounded-lg mb-6">
                <h2 className="text-xl font-semibold mb-4">Logo & Tagline</h2>
                <div className="flex flex-col items-center">
                    {isEditing ? (
                        <div className="mb-4 flex flex-col items-center">
                            <input
                                type="file"
                                ref={logoInputRef}
                                onChange={(e) => handleImageUpload(e, 'logo')}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                onClick={() => triggerFileInput(logoInputRef)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-2"
                            >
                                {tempData.logo ? 'Change Logo' : 'Upload Logo'}
                            </button>
                            {tempData.logo && (
                                <button
                                    onClick={() => removeImage('logo')}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                                >
                                    Remove Logo
                                </button>
                            )}
                        </div>
                    ) : null}

                    <div className="h-24 flex items-center justify-center mb-4">
                        {isEditing ? (
                            tempData.logo ? (
                                <img
                                    src={getImageSrc(tempData.logo)}
                                    alt="Logo Preview"
                                    className="max-h-full max-w-full object-contain"
                                />
                            ) : aboutData.logo ? (
                                <img
                                    src={aboutData.logo}
                                    alt="Hikotek Logo"
                                    className="max-h-full max-w-full object-contain"
                                />
                            ) : (
                                <div className="text-gray-400">No logo uploaded</div>
                            )
                        ) : aboutData.logo ? (
                            <img
                                src={aboutData.logo}
                                alt="Hikotek Logo"
                                className="max-h-full max-w-full object-contain"
                            />
                        ) : (
                            <div className="text-gray-400">No logo uploaded</div>
                        )}
                    </div>

                    {isEditing ? (
                        <textarea
                            value={tempData.tagline}
                            onChange={(e) => handleChange('tagline', e.target.value)}
                            className="w-full md:w-2/3 p-2 border rounded text-center text-lg"
                            rows="2"
                        />
                    ) : (
                        <p className="text-lg font-medium text-gray-600 text-center">
                            {aboutData.tagline}
                        </p>
                    )}
                </div>
            </section>

            {/* Company Profile Section */}
            <section className="bg-gray-100 p-6 rounded-lg mb-6">
                <h2 className="text-xl font-semibold mb-4">Company Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Company Profile Text</label>
                        {isEditing ? (
                            <textarea
                                value={tempData.companyProfile}
                                onChange={(e) => handleChange('companyProfile', e.target.value)}
                                className="w-full p-2 border rounded"
                                rows="10"
                            />
                        ) : (
                            <div className="p-4 bg-white rounded border">
                                <p className="whitespace-pre-line">{aboutData.companyProfile}</p>
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Company Image</label>
                        {isEditing ? (
                            <div className="space-y-4 mb-4">
                                <input
                                    type="file"
                                    ref={companyImageInputRef}
                                    onChange={(e) => handleImageUpload(e, 'companyImage')}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <button
                                    onClick={() => triggerFileInput(companyImageInputRef)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                                >
                                    Upload New Image
                                </button>
                                {tempData.companyImage && (
                                    <button
                                        onClick={() => removeImage('companyImage')}
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded ml-2"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ) : null}
                        <div className="h-64 bg-gray-200 rounded flex items-center justify-center">
                            <img
                                src={isEditing ? getImageSrc(tempData.companyImage, 'https://via.placeholder.com/400x300?text=Upload+Company+Image') : aboutData.companyImage}
                                alt="Company"
                                className="max-h-full max-w-full object-contain"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Profile Section with Stats */}
            <section className="bg-gray-100 p-6 rounded-lg mb-6">
                <h2 className="text-xl font-semibold mb-4">Profile Section</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Profile Image</label>
                        {isEditing ? (
                            <div className="space-y-4 mb-4">
                                <input
                                    type="file"
                                    ref={profileImageInputRef}
                                    onChange={(e) => handleImageUpload(e, 'profileImage')}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <button
                                    onClick={() => triggerFileInput(profileImageInputRef)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                                >
                                    Upload New Image
                                </button>
                                {tempData.profileImage && (
                                    <button
                                        onClick={() => removeImage('profileImage')}
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded ml-2"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ) : null}
                        <div className="h-64 bg-gray-200 rounded flex items-center justify-center">
                            <img
                                src={isEditing ? getImageSrc(tempData.profileImage, 'https://via.placeholder.com/400x300?text=Upload+Profile+Image') : aboutData.profileImage}
                                alt="Profile"
                                className="max-h-full max-w-full object-contain"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Profile Title</label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={tempData.profileTitle}
                                onChange={(e) => handleChange('profileTitle', e.target.value)}
                                className="w-full p-2 border rounded mb-4"
                            />
                        ) : (
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                {aboutData.profileTitle}
                            </h3>
                        )}

                        <label className="block text-sm font-medium mb-2">Profile Description</label>
                        {isEditing ? (
                            <textarea
                                value={tempData.profileDescription}
                                onChange={(e) => handleChange('profileDescription', e.target.value)}
                                className="w-full p-2 border rounded mb-6"
                                rows="3"
                            />
                        ) : (
                            <p className="text-gray-600 mb-6">
                                {aboutData.profileDescription}
                            </p>
                        )}

                        <div className="bg-blue-900 p-6 rounded-lg grid grid-cols-3 gap-4">
                            {tempData.stats?.map((stat, index) => (
                                <div key={index} className="text-white text-center">
                                    {isEditing ? (
                                        <>
                                            <input
                                                type="text"
                                                value={stat.value}
                                                onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                                                className="w-16 text-center bg-blue-800 border border-blue-700 rounded p-1 text-white mb-2"
                                                placeholder="0"
                                            />
                                            <input
                                                type="text"
                                                value={stat.label}
                                                onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                                                className="w-full text-center bg-blue-800 border border-blue-700 rounded p-1 text-white text-sm"
                                                placeholder="Label"
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <div className="text-2xl font-bold">{stat.value || 0}+</div>
                                            <div className="text-sm mt-1">{stat.label}</div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Preview Section */}
            {isEditing && (
                <section className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                    <h2 className="text-xl font-semibold mb-4 text-yellow-800">Live Preview</h2>
                    <div className="bg-white p-4 rounded">
                        {/* Banner Preview */}
                        <div className="h-32 bg-gray-200 rounded mb-6 flex items-center justify-center">
                            <img
                                src={getImageSrc(tempData.bannerImage, 'https://via.placeholder.com/800x200?text=Upload+Banner+Image')}
                                alt="Banner Preview"
                                className="max-h-full max-w-full object-contain"
                            />
                        </div>

                        {/* Logo & Tagline Preview */}
                        <div className="text-center mb-6">
                            <div className="h-16 flex items-center justify-center mx-auto mb-2">
                                {tempData.logo ? (
                                    <img
                                        src={getImageSrc(tempData.logo)}
                                        alt="Logo Preview"
                                        className="max-h-full max-w-full object-contain"
                                    />
                                ) : (
                                    <div className="text-gray-400">No logo uploaded</div>
                                )}
                            </div>
                            <p className="text-lg text-gray-600">{tempData.tagline}</p>
                        </div>

                        {/* Stats Preview */}
                        <div className="bg-blue-900 p-4 rounded grid grid-cols-3 gap-4 mb-6">
                            {tempData.stats.map((stat, index) => (
                                <div key={index} className="text-white text-center">
                                    <div className="text-xl font-bold">{(stat.value || 0)}+</div>
                                    <div className="text-xs">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default AdminAbout;