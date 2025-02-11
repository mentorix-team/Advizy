import React, { useState, useRef, useEffect } from 'react';
import { FaCamera, FaEdit, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import ImageUploadModal from './ImageUploadModal';
import Modal from './Modal';

const ProfileHeader = ({ onProfileImageChange, onCoverImageChange, profileImage, coverImage, firstName = '' }) => {
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [coverPreview,setCoverPreview] = useState('');
  const [profilePreview,setprofilePreview] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  // let coverPreview = ''; 
  // let profilePreview = ''; 

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Store the file for form submission
      onCoverImageChange(file);

      // Create a preview URL for display
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result); 
        setShowCoverModal(false);
        setShowEditModal(true);
        setZoom(1);
        setImagePosition({ x: 0, y: 0 });
      };
      console.log("This is cover preview",coverPreview)
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Store the file for form submission
      onProfileImageChange(file);

      // Create a preview URL for display
      const reader = new FileReader();
      reader.onloadend = () => {
        setprofilePreview(reader.result); 
        setShowProfileModal(false);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // const handleImageUpload = (type, file) => {
  //   if (type === 'cover') {
  //     onCoverImageChange(file);
  //   } else if (type === 'profile') {
  //     onProfileImageChange(file);
  //   }
  //   setActive(null); // Close modal after upload
  // };


  const handleMoveImage = (direction) => {
    const step = 10;
    setImagePosition(prev => ({
      ...prev,
      y: direction === 'up' ? prev.y - step : prev.y + step
    }));
  };

  const handleMouseDown = (e) => {
    if (e.target === imageRef.current) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - imagePosition.x,
        y: e.clientY - imagePosition.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && imageRef.current && containerRef.current) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const imageRect = imageRef.current.getBoundingClientRect();
      
      const maxX = (imageRect.width * zoom - containerRect.width) / 2;
      const maxY = (imageRect.height * zoom - containerRect.height) / 2;

      setImagePosition({
        x: Math.max(-maxX, Math.min(maxX, newX)),
        y: Math.max(-maxY, Math.min(maxY, newY))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomChange = (e) => {
    const newZoom = parseFloat(e.target.value);
    setZoom(newZoom);

    // Adjust position when zooming to maintain center
    if (imageRef.current && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const imageRect = imageRef.current.getBoundingClientRect();
      
      const maxX = (imageRect.width * newZoom - containerRect.width) / 2;
      const maxY = (imageRect.height * newZoom - containerRect.height) / 2;

      setImagePosition(prev => ({
        x: Math.max(-maxX, Math.min(maxX, prev.x)),
        y: Math.max(-maxY, Math.min(maxY, prev.y))
      }));
    }
  };

  useEffect(() => {
    if (showEditModal) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [showEditModal, isDragging, dragStart]);

  // Generate initials avatar if no profile image
  const getInitialsAvatar = () => {
    const initial = firstName.charAt(0).toUpperCase();
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500'];
    const colorIndex = initial.charCodeAt(0) % colors.length;
    const bgColor = colors[colorIndex];

    return (
      <div className={`w-full h-full ${bgColor} flex items-center justify-center text-white text-2xl font-semibold`}>
        {initial}
      </div>
    );
  };

  const EditImageModal = () => (
    <Modal
      isOpen={showEditModal}
      onClose={() => setShowEditModal(false)}
      title="Edit Cover Image"
    >
      <div className="space-y-6">
        <div 
          ref={containerRef}
          className="relative h-64 overflow-hidden bg-gray-100 rounded-lg"
        >
          <img 
            ref={imageRef}
            src={coverPreview} 
            alt="Cover" 
            className="w-full h-full object-cover select-none cursor-move"
            style={{ 
              transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${zoom})`,
              transformOrigin: 'center',
              willChange: 'transform',
              transition: isDragging ? 'none' : 'transform 0.1s ease-out'
            }}
            draggable="false"
            onMouseDown={handleMouseDown}
          />
        </div>

        <div className="space-y-4">
          {/* Zoom Control */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 min-w-[60px]">Zoom:</label>
            <input
              type="range"
              min="1"
              max="3"
              step="0.01"
              value={zoom}
              onChange={handleZoomChange}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #34A853 0%, #34A853 ${(zoom - 1) * 50}%, #E5E7EB ${(zoom - 1) * 50}%, #E5E7EB 100%)`
              }}
            />
            <span className="text-sm text-gray-600 min-w-[40px]">{(zoom * 100).toFixed(0)}%</span>
          </div>

          {/* Position Controls */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleMoveImage('up')}
              className="p-2 text-gray-600 hover:text-primary border rounded-lg transition-colors"
            >
              <FaArrowUp className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleMoveImage('down')}
              className="p-2 text-gray-600 hover:text-primary border rounded-lg transition-colors"
            >
              <FaArrowDown className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => {
              setShowEditModal(false);
              setShowCoverModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
          >
            <FaCamera /> Change Image
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setZoom(1);
                setImagePosition({ x: 0, y: 0 });
              }}
              className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );

  return (
    <div className="relative">
      <div className="relative h-32 sm:h-48 md:h-64 bg-gray-200 rounded-t-lg overflow-hidden">
        {coverImage ? (
          <img 
            src={coverPreview} 
            alt="Cover" 
            className="w-full h-full object-cover"
            style={{ 
              transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${zoom})`,
              transformOrigin: 'center',
              transition: 'transform 0.1s ease-out'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FaCamera className="text-gray-400 text-2xl sm:text-3xl md:text-4xl" />
          </div>
        )}
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex gap-2">
          {coverImage && (
            <button
              onClick={() => setShowEditModal(true)}
              className="bg-white rounded-lg px-2 py-1 sm:px-4 sm:py-2 flex items-center gap-1 sm:gap-2 hover:bg-gray-50 text-sm sm:text-base transition-colors"
            >
              <FaEdit className="text-primary" />
              <span className="text-primary hidden sm:inline">Edit Image</span>
            </button>
          )}
          <button 
            onClick={() => setShowCoverModal(true)}
            className="bg-white rounded-lg px-2 py-1 sm:px-4 sm:py-2 flex items-center gap-1 sm:gap-2 hover:bg-gray-50 text-sm sm:text-base transition-colors"
          >
            <FaCamera className="text-primary" />
            <span className="text-primary hidden sm:inline">Change Cover</span>
          </button>
        </div>
      </div>
      
      <div className="absolute -bottom-12 sm:-bottom-16 left-4 sm:left-8">
        <div className="relative">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
            {profileImage ? (
              <img src={profilePreview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              getInitialsAvatar()
            )}
          </div>
          <button 
            onClick={() => setShowProfileModal(true)}
            className="absolute bottom-0 right-0 bg-primary rounded-full p-1.5 sm:p-2 cursor-pointer hover:bg-green-600 transition-colors"
          >
            <FaCamera className="text-white text-sm sm:text-base" />
          </button>
        </div>
      </div>

      <ImageUploadModal
        isOpen={showCoverModal}
        onClose={() => setShowCoverModal(false)}
        type="cover"
        onUpload={handleCoverUpload}
      />

      <ImageUploadModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        type="profile"
        onUpload={handleProfileUpload}
      />

      <EditImageModal />
    </div>
  );
};

export default ProfileHeader;