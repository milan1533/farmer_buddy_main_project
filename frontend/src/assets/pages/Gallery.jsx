import React, { useState } from 'react';
import { FiGrid, FiImage, FiHeart, FiShare2, FiDownload } from 'react-icons/fi';

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);

  const categories = [
    { id: 'all', name: 'All Photos' },
    { id: 'farms', name: 'Farm Views' },
    { id: 'products', name: 'Fresh Products' },
    { id: 'harvest', name: 'Harvest Time' },
    { id: 'equipment', name: 'Farm Equipment' },
    { id: 'workers', name: 'Farm Workers' }
  ];

  const galleryImages = [
    // Farm Views
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop',
      alt: 'Beautiful farm landscape',
      category: 'farms',
      title: 'Green Farm Landscape',
      description: 'Rolling hills of green crops under blue sky'
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop',
      alt: 'Sunset over farm',
      category: 'farms',
      title: 'Sunset Over Fields',
      description: 'Golden hour lighting over agricultural fields'
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=600&h=400&fit=crop',
      alt: 'Aerial farm view',
      category: 'farms',
      title: 'Aerial Farm View',
      description: 'Drone view of organized crop fields'
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?w=600&h=400&fit=crop',
      alt: 'Farm house',
      category: 'farms',
      title: 'Farm House',
      description: 'Traditional farm house surrounded by fields'
    },

    // Fresh Products
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=600&h=400&fit=crop',
      alt: 'Fresh vegetables',
      category: 'products',
      title: 'Fresh Vegetables',
      description: 'Colorful assortment of fresh vegetables'
    },
    {
      id: 6,
      src: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&h=400&fit=crop',
      alt: 'Fresh fruits',
      category: 'products',
      title: 'Fresh Fruits',
      description: 'Juicy and colorful fresh fruits'
    },
    {
      id: 7,
      src: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&h=400&fit=crop',
      alt: 'Fresh milk',
      category: 'products',
      title: 'Fresh Dairy',
      description: 'Fresh milk and dairy products'
    },
    {
      id: 8,
      src: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&h=400&fit=crop',
      alt: 'Fresh eggs',
      category: 'products',
      title: 'Farm Fresh Eggs',
      description: 'Fresh eggs from free-range chickens'
    },

    // Harvest Time
    {
      id: 9,
      src: 'https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?w=600&h=400&fit=crop',
      alt: 'Wheat harvest',
      category: 'harvest',
      title: 'Wheat Harvest',
      description: 'Golden wheat ready for harvest'
    },
    {
      id: 10,
      src: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&h=400&fit=crop',
      alt: 'Banana harvest',
      category: 'harvest',
      title: 'Banana Harvest',
      description: 'Fresh bananas being harvested'
    },
    {
      id: 11,
      src: 'https://images.unsplash.com/photo-1447175008436-170170e8a4d7?w=600&h=400&fit=crop',
      alt: 'Carrot harvest',
      category: 'harvest',
      title: 'Carrot Harvest',
      description: 'Fresh carrots being pulled from soil'
    },
    {
      id: 12,
      src: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=600&h=400&fit=crop',
      alt: 'Tomato harvest',
      category: 'harvest',
      title: 'Tomato Harvest',
      description: 'Ripe tomatoes ready for picking'
    },

    // Farm Equipment
    {
      id: 13,
      src: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&h=400&fit=crop',
      alt: 'Tractor in field',
      category: 'equipment',
      title: 'Modern Tractor',
      description: 'Modern farming tractor in action'
    },
    {
      id: 14,
      src: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&h=400&fit=crop',
      alt: 'Irrigation system',
      category: 'equipment',
      title: 'Irrigation System',
      description: 'Advanced irrigation system in field'
    },
    {
      id: 15,
      src: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&h=400&fit=crop',
      alt: 'Harvesting machine',
      category: 'equipment',
      title: 'Harvesting Machine',
      description: 'Modern harvesting equipment'
    },
    {
      id: 16,
      src: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&h=400&fit=crop',
      alt: 'Greenhouse',
      category: 'equipment',
      title: 'Modern Greenhouse',
      description: 'Advanced greenhouse technology'
    },

    // Farm Workers
    {
      id: 17,
      src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
      alt: 'Farmer working',
      category: 'workers',
      title: 'Hardworking Farmer',
      description: 'Dedicated farmer tending to crops'
    },
    {
      id: 18,
      src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
      alt: 'Harvesting team',
      category: 'workers',
      title: 'Harvesting Team',
      description: 'Team of workers during harvest season'
    },
    {
      id: 19,
      src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
      alt: 'Farm family',
      category: 'workers',
      title: 'Farm Family',
      description: 'Family working together on the farm'
    },
    {
      id: 20,
      src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
      alt: 'Young farmer',
      category: 'workers',
      title: 'Young Farmer',
      description: 'Young generation learning farming'
    }
  ];

  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Farm Gallery
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Explore the beauty of farming through our curated collection of photos
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-700'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => openModal(image)}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                  }}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-white text-center">
                    <FiImage className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-semibold">{image.title}</p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 mr-2">
                    <FiHeart className="w-4 h-4 text-red-500" />
                  </button>
                  <button className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300">
                    <FiShare2 className="w-4 h-4 text-blue-500" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
                  {image.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {image.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Image Count */}
        <div className="text-center mt-8 text-gray-600 dark:text-gray-400">
          <FiGrid className="w-5 h-5 inline mr-2" />
          Showing {filteredImages.length} of {galleryImages.length} photos
        </div>
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-gray-300 z-10"
            >
              ×
            </button>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-auto max-h-96 object-cover"
              />
              
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  {selectedImage.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {selectedImage.description}
                </p>
                
                <div className="flex gap-4">
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300">
                    <FiHeart className="w-4 h-4" />
                    Like
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300">
                    <FiShare2 className="w-4 h-4" />
                    Share
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300">
                    <FiDownload className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;




