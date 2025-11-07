import React, { useState, useRef, useEffect } from 'react';
import { FaCamera, FaEdit, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import ImageUploadModal from './ImageUploadModal';
import Modal from './Modal';

const ProfileHeader = ({ onProfileImageChange, onCoverImageChange, profileImage, coverImage, firstName = '' }) => {
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [coverPreview, setCoverPreview] = useState('');
  const [profilePreview, setProfilePreview] = useState('');
  const [showCoverEditModal, setShowCoverEditModal] = useState(false);
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);

  // Main state (only applied after saving)
  const [coverImagePosition, setCoverImagePosition] = useState({ x: 0, y: 0 });
  const [profileImagePosition, setProfileImagePosition] = useState({ x: 0, y: 0 });
  const [coverZoom, setCoverZoom] = useState(1);
  const [profileZoom, setProfileZoom] = useState(1);

  // Temporary state for editing (only applied when user clicks Save)
  const [tempCoverImagePosition, setTempCoverImagePosition] = useState({ x: 0, y: 0 });
  const [tempProfileImagePosition, setTempProfileImagePosition] = useState({ x: 0, y: 0 });
  const [tempCoverZoom, setTempCoverZoom] = useState(1);
  const [tempProfileZoom, setTempProfileZoom] = useState(1);

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeImageType, setActiveImageType] = useState('cover'); // 'cover' or 'profile'

  const coverImageRef = useRef(null);
  const profileImageRef = useRef(null);
  const coverContainerRef = useRef(null);
  const profileContainerRef = useRef(null);

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      onCoverImageChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
        setShowCoverModal(false);
        setShowCoverEditModal(true);
        // Reset temporary states when opening edit modal
        setTempCoverZoom(1);
        setTempCoverImagePosition({ x: 0, y: 0 });
        setActiveImageType('cover');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      onProfileImageChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
        setShowProfileModal(false);
        setShowProfileEditModal(true);
        // Reset temporary states when opening edit modal
        setTempProfileZoom(1);
        setTempProfileImagePosition({ x: 0, y: 0 });
        setActiveImageType('profile');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMoveImage = (direction, imageType) => {
    const step = 10;
    if (imageType === 'cover') {
      setTempCoverImagePosition(prev => ({
        ...prev,
        y: direction === 'up' ? prev.y - step : prev.y + step
      }));
    } else {
      setTempProfileImagePosition(prev => ({
        ...prev,
        y: direction === 'up' ? prev.y - step : prev.y + step
      }));
    }
  };

  const handleMouseDown = (e, imageType) => {
    const imageRef = imageType === 'cover' ? coverImageRef : profileImageRef;
    const imagePosition = imageType === 'cover' ? tempCoverImagePosition : tempProfileImagePosition;

    if (e.target === imageRef.current) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - imagePosition.x,
        y: e.clientY - imagePosition.y
      });
      setActiveImageType(imageType);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const imageRef = activeImageType === 'cover' ? coverImageRef : profileImageRef;
    const containerRef = activeImageType === 'cover' ? coverContainerRef : profileContainerRef;

    if (imageRef.current && containerRef.current) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      const containerRect = containerRef.current.getBoundingClientRect();
      const imageRect = imageRef.current.getBoundingClientRect();
      const zoom = activeImageType === 'cover' ? tempCoverZoom : tempProfileZoom;

      const maxX = (imageRect.width * zoom - containerRect.width) / 2;
      const maxY = (imageRect.height * zoom - containerRect.height) / 2;

      const boundedX = Math.max(-maxX, Math.min(maxX, newX));
      const boundedY = Math.max(-maxY, Math.min(maxY, newY));

      if (activeImageType === 'cover') {
        setTempCoverImagePosition({ x: boundedX, y: boundedY });
      } else {
        setTempProfileImagePosition({ x: boundedX, y: boundedY });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomChange = (e, imageType) => {
    const newZoom = parseFloat(e.target.value);

    if (imageType === 'cover') {
      setTempCoverZoom(newZoom);
    } else {
      setTempProfileZoom(newZoom);
    }
  };

  // Apply changes when user clicks Save
  const handleSaveCoverChanges = () => {
    setCoverZoom(tempCoverZoom);
    setCoverImagePosition(tempCoverImagePosition);
    setShowCoverEditModal(false);
  };

  const handleSaveProfileChanges = () => {
    setProfileZoom(tempProfileZoom);
    setProfileImagePosition(tempProfileImagePosition);
    setShowProfileEditModal(false);
  };

  // Reset temporary states when canceling
  const handleCancelCoverEdit = () => {
    // Reset to current main state values
    setTempCoverZoom(coverZoom);
    setTempCoverImagePosition(coverImagePosition);
    setShowCoverEditModal(false);
  };

  const handleCancelProfileEdit = () => {
    // Reset to current main state values
    setTempProfileZoom(profileZoom);
    setTempProfileImagePosition(profileImagePosition);
    setShowProfileEditModal(false);
  };

  useEffect(() => {
    if (showCoverEditModal || showProfileEditModal) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [showCoverEditModal, showProfileEditModal, isDragging, dragStart, activeImageType]);

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

  const EditCoverImageModal = () => (
    <Modal
      isOpen={showCoverEditModal}
      onClose={handleCancelCoverEdit}
      title="Edit Cover Image"
    >
      <div className="space-y-6">
        <div
          ref={coverContainerRef}
          className="relative h-64 overflow-hidden bg-gray-100 rounded-lg"
        >
          <img
            ref={coverImageRef}
            src={coverPreview}
            alt="Cover"
            className="w-full h-full object-cover select-none cursor-move"
            style={{
              transform: `translate(${tempCoverImagePosition.x}px, ${tempCoverImagePosition.y}px) scale(${tempCoverZoom})`,
              transformOrigin: 'center',
              willChange: 'transform',
              transition: isDragging && activeImageType === 'cover' ? 'none' : 'transform 0.2s ease-out'
            }}
            draggable="false"
            onMouseDown={(e) => handleMouseDown(e, 'cover')}
          />
        </div>

        <div className="space-y-4">
          {/* Zoom Control */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 min-w-[60px]">Zoom:</label>
            <input
              type="range"
              min="1"
              max="2"
              step="0.1"
              value={tempCoverZoom}
              onChange={(e) => handleZoomChange(e, 'cover')}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #34A853 0%, #34A853 ${(tempCoverZoom - 1) * 100}%, #E5E7EB ${(tempCoverZoom - 1) * 100}%, #E5E7EB 100%)`
              }}
            />
            <span className="text-sm text-gray-600 min-w-[40px]">{(tempCoverZoom * 100).toFixed(0)}%</span>
          </div>

          {/* Position Controls */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleMoveImage('up', 'cover')}
              className="p-2 text-gray-600 hover:text-primary border rounded-lg transition-colors"
            >
              <FaArrowUp className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleMoveImage('down', 'cover')}
              className="p-2 text-gray-600 hover:text-primary border rounded-lg transition-colors"
            >
              <FaArrowDown className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => {
              setShowCoverEditModal(false);
              setShowCoverModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
          >
            <FaCamera /> Change Image
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setTempCoverZoom(1);
                setTempCoverImagePosition({ x: 0, y: 0 });
              }}
              className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleSaveCoverChanges}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );

  const EditProfileImageModal = () => (
    <Modal
      isOpen={showProfileEditModal}
      onClose={handleCancelProfileEdit}
      title="Edit Profile Image"
    >
      <div className="space-y-6">
        <div
          ref={profileContainerRef}
          className="relative h-64 w-64 mx-auto overflow-hidden bg-gray-100 rounded-full"
        >
          <img
            ref={profileImageRef}
            src={profilePreview}
            alt="Profile"
            className="w-full h-full object-cover select-none cursor-move"
            style={{
              transform: `translate(${tempProfileImagePosition.x}px, ${tempProfileImagePosition.y}px) scale(${tempProfileZoom})`,
              transformOrigin: 'center',
              willChange: 'transform',
              transition: isDragging && activeImageType === 'profile' ? 'none' : 'transform 0.2s ease-out'
            }}
            draggable="false"
            onMouseDown={(e) => handleMouseDown(e, 'profile')}
          />
        </div>

        <div className="space-y-4">
          {/* Zoom Control */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 min-w-[60px]">Zoom:</label>
            <input
              type="range"
              min="1"
              max="2"
              step="0.1"
              value={tempProfileZoom}
              onChange={(e) => handleZoomChange(e, 'profile')}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #34A853 0%, #34A853 ${(tempProfileZoom - 1) * 100}%, #E5E7EB ${(tempProfileZoom - 1) * 100}%, #E5E7EB 100%)`
              }}
            />
            <span className="text-sm text-gray-600 min-w-[40px]">{(tempProfileZoom * 100).toFixed(0)}%</span>
          </div>

          {/* Position Controls */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleMoveImage('up', 'profile')}
              className="p-2 text-gray-600 hover:text-primary border rounded-lg transition-colors"
            >
              <FaArrowUp className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleMoveImage('down', 'profile')}
              className="p-2 text-gray-600 hover:text-primary border rounded-lg transition-colors"
            >
              <FaArrowDown className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => {
              setShowProfileEditModal(false);
              setShowProfileModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
          >
            <FaCamera /> Change Image
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setTempProfileZoom(1);
                setTempProfileImagePosition({ x: 0, y: 0 });
              }}
              className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleSaveProfileChanges}
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
              transform: `translate(${coverImagePosition.x}px, ${coverImagePosition.y}px) scale(${coverZoom})`,
              transformOrigin: 'center',
              transition: 'transform 0.2s ease-out'
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
              onClick={() => setShowCoverEditModal(true)}
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
              <img
                src={profilePreview}
                alt="Profile"
                className="w-full h-full object-cover"
                style={{
                  transform: `translate(${profileImagePosition.x}px, ${profileImagePosition.y}px) scale(${profileZoom})`,
                  transformOrigin: 'center',
                  transition: 'transform 0.2s ease-out'
                }}
              />
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

      <EditCoverImageModal />
      <EditProfileImageModal />
    </div>
  );
};

export default ProfileHeader;