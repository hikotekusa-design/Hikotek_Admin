import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { FaFileDownload } from 'react-icons/fa';
import { productApi } from '../services/productApi';

const ViewProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const tabs = ['description', 'downloads'];

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProduct = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await productApi.getById(id);
        if (response.success) {
          const fetchedProduct = response.data;
          console.log('Fetched product descriptionAlignment:', fetchedProduct.descriptionAlignment);
          setProduct({
            ...fetchedProduct,
            descriptionAlignment: ['left', 'center', 'right', 'justify'].includes(fetchedProduct.descriptionAlignment)
              ? fetchedProduct.descriptionAlignment
              : 'left',
          });
          // Set the first image as selected, or mainImage if available
          if (fetchedProduct.images && fetchedProduct.images.length > 0) {
            setSelectedImage(fetchedProduct.images[0]);
          } else if (fetchedProduct.mainImage) {
            setSelectedImage(fetchedProduct.mainImage);
          }
        } else {
          setError('Failed to fetch product details. Please try again.');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(
          err.message.includes('PERMISSION_DENIED')
            ? 'Permission denied. Please check your admin credentials or contact support.'
            : err.message || 'Failed to fetch product details. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Function to handle image errors
  const handleImageError = (e, fallbackImage = '/placeholder-image.jpg') => {
    console.warn('Image failed to load:', e.target.src);
    e.target.src = fallbackImage;
  };

  // Parse specifications and highlights which might be stored as strings or objects
  const parseProductData = (product) => {
    if (!product) return product;

    const parsedProduct = { ...product };

    // Parse specifications if they're stored as a string
    if (parsedProduct.specifications && typeof parsedProduct.specifications === 'string') {
      try {
        parsedProduct.specifications = JSON.parse(parsedProduct.specifications);
      } catch (e) {
        console.error('Error parsing specifications:', e);
        parsedProduct.specifications = Array.isArray(parsedProduct.specifications) ? parsedProduct.specifications : [];
      }
    }

    // Parse highlights if they're stored as a string
    if (parsedProduct.highlights && typeof parsedProduct.highlights === 'string') {
      try {
        parsedProduct.highlights = JSON.parse(parsedProduct.highlights);
      } catch (e) {
        console.error('Error parsing highlights:', e);
        parsedProduct.highlights = Array.isArray(parsedProduct.highlights) ? parsedProduct.highlights : [];
      }
    }

    // Ensure descriptionAlignment is valid
    parsedProduct.descriptionAlignment = ['left', 'center', 'right', 'justify'].includes(parsedProduct.descriptionAlignment)
      ? parsedProduct.descriptionAlignment
      : 'left';

    return parsedProduct;
  };

  const renderContent = () => {
    if (!product) return null;

    const parsedProduct = parseProductData(product);

    switch (activeTab) {
      case 'description':
        return (
          <div className="text-gray-700 leading-relaxed">
            <div
              className={`mb-4 text-lg text-${parsedProduct.descriptionAlignment} whitespace-pre-wrap`}
              style={{ textAlign: parsedProduct.descriptionAlignment }}
            >
              {parsedProduct.description || 'No description available.'}
            </div>

            {parsedProduct.specifications && parsedProduct.specifications.length > 0 && (
              <>
                <p className="font-semibold text-orange-600 mt-6 text-xl">SPECIFICATIONS</p>
                <ul className="ml-8">
                  {parsedProduct.specifications.map((spec, idx) => {
                    // Handle both string format and object format
                    const specText = typeof spec === 'object' ? spec.text : spec;
                    const specAlignment = typeof spec === 'object' ? spec.alignment : 'left';

                    return (
                      <li
                        key={idx}
                        className={`text-base mb-2 text-${specAlignment}`}
                        style={{ textAlign: specAlignment }}
                      >
                        {specText}
                      </li>
                    );
                  })}
                </ul>
              </>
            )}

            {parsedProduct.highlights && parsedProduct.highlights.length > 0 && (
              <>
                <p className="font-semibold text-orange-600 mt-6 text-xl">HIGHLIGHTS</p>
                <ul className="ml-8">
                  {parsedProduct.highlights.map((highlight, idx) => {
                    // Handle both string format and object format
                    const highlightText = typeof highlight === 'object' ? highlight.text : highlight;
                    const highlightAlignment = typeof highlight === 'object' ? highlight.alignment : 'left';

                    return (
                      <li
                        key={idx}
                        className={`text-base mb-2 text-${highlightAlignment}`}
                        style={{ textAlign: highlightAlignment }}
                      >
                        {highlightText}
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>
        );
      case 'downloads':
        return (
          <div className="text-center">
            {product.downloads && product.downloads.length > 0 ? (
              product.downloads.map((download, idx) => (
                <a
                  key={idx}
                  href={download}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg flex items-center justify-center mx-auto gap-3 text-lg hover:bg-blue-700 transition mb-4"
                >
                  <FaFileDownload />
                  {`Download File ${idx + 1}`}
                </a>
              ))
            ) : (
              <p className="text-gray-500">No downloads available.</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6]">
      <div className="mx-auto w-full pt-4 pb-12 px-4">
        <div className="mb-4">
          <Link
            to="/admin/products"
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiArrowLeft className="mr-1" /> Back to Products
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex items-center">
              <svg
                className="animate-spin h-5 w-5 text-blue-600 mr-2"
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
              Loading product details...
            </div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        ) : !product ? (
          <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            Product not found.
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-12 bg-[#f6f6f6] p-6 rounded-lg">
              {/* Left Side: Images */}
              <div className="flex">
                <div className="flex flex-col gap-3 mr-3">
                  {product.images && product.images.length > 0 ? (
                    product.images.map((img, idx) => (
                      <div
                        key={idx}
                        className={`w-16 h-16 rounded-md cursor-pointer overflow-hidden transition-all duration-300 border-2 ${
                          selectedImage === img
                            ? 'border-blue-600 opacity-100'
                            : 'border-gray-300 opacity-70 hover:opacity-100'
                        }`}
                        onClick={() => setSelectedImage(img)}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => handleImageError(e)}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="w-16 h-16 rounded-md bg-gray-200 flex items-center justify-center text-gray-500">
                      No Images
                    </div>
                  )}
                </div>

                {/* Main Image */}
                <div className="flex-1 overflow-hidden max-h-[400px] rounded-lg flex items-center justify-center bg-white border border-gray-200">
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt={product.name}
                      className="w-full h-full object-contain"
                      onError={(e) => handleImageError(e)}
                    />
                  ) : (
                    <div className="text-gray-500">No image selected</div>
                  )}
                </div>
              </div>

              {/* Right Side: Product Info */}
              <div className="bg-[#f6f6f6]">
                <h2 className="text-3xl mb-4 font-bold text-gray-800">{product.name}</h2>
                <p className="text-black font-bold text-2xl mb-6">
                  Price: {product.showPrice ? `${product.price} USD` : 'Hidden'}
                </p>

                {product.highlights && product.highlights.length > 0 && (
                  <ul className="ml-5 space-y-2 mb-6">
                    {parseProductData(product).highlights.map((highlight, idx) => {
                      // Handle both string format and object format
                      const highlightText = typeof highlight === 'object' ? highlight.text : highlight;

                      return (
                        <li key={idx} className="text-gray-700">
                          {highlightText}
                        </li>
                      );
                    })}
                  </ul>
                )}

                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Category:</span> {product.category || 'N/A'}
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex justify-center mt-12 mb-8 flex-wrap gap-4 border-b border-gray-300 bg-[#f6f6f6]">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 capitalize text-lg font-medium transition duration-200 relative
                    ${activeTab === tab ? 'text-blue-600 font-semibold' : 'text-gray-500 hover:text-blue-500'}`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute left-0 bottom-0 h-1 w-full bg-blue-600 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              {renderContent()}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewProduct;