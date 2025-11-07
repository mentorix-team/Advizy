import React, { useState, useRef, useEffect } from "react";
import { FaCamera, FaEdit, FaArrowUp, FaArrowDown } from "react-icons/fa";
import ImageUploadModal from "./ImageUploadModal";
import Modal from "./Modal";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { expertImages } from "@/Redux/Slices/expert.Slice";
const ProfileHeader = ({
  onProfileImageChange,
  onCoverImageChange,
  profileImage,
  coverImage,
  firstName = "",
}) => {
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [coverPreview, setCoverPreview] = useState("");
  const [profilePreview, setprofilePreview] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [profileImagePosition, setProfileImagePosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [profileZoom, setProfileZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Zoom slider dragging states
  const [isZoomSliderDragging, setIsZoomSliderDragging] = useState(false);
  const [isProfileZoomSliderDragging, setIsProfileZoomSliderDragging] = useState(false);
  const zoomSliderRef = useRef(null);
  const profileZoomSliderRef = useRef(null);

  // Separate states for saved transformations
  const [savedImagePosition, setSavedImagePosition] = useState({ x: 0, y: 0 });
  const [savedProfileImagePosition, setSavedProfileImagePosition] = useState({ x: 0, y: 0 });
  const [savedZoom, setSavedZoom] = useState(1);
  const [savedProfileZoom, setSavedProfileZoom] = useState(1);

  // Temporary states for editing (before save)
  const [tempImagePosition, setTempImagePosition] = useState({ x: 0, y: 0 });
  const [tempProfileImagePosition, setTempProfileImagePosition] = useState({ x: 0, y: 0 });
  const [tempZoom, setTempZoom] = useState(1);
  const [tempProfileZoom, setTempProfileZoom] = useState(1);
  const imageRef = useRef(null);
  const profileImageRef = useRef(null);
  const containerRef = useRef(null);
  const profileContainerRef = useRef(null);
  const dispatch = useDispatch();
  // let coverPreview = '';
  // let profilePreview = '';

  const handleEditCoverImage = () => {
    if (coverImage) {
      setCoverPreview(coverImage); // Set preview to current image
      // Initialize temp states with saved values
      setTempZoom(savedZoom);
      setTempImagePosition(savedImagePosition);
      // Set working states for the editor
      setZoom(savedZoom);
      setImagePosition(savedImagePosition);
      setShowEditModal(true);
    }
  };

  const handleEditProfileImage = () => {
    const currentSource =
      profilePreview || (typeof profileImage === "string" ? profileImage : "");

    if (currentSource) {
      setShowProfileModal(false);
      setprofilePreview(currentSource);
      // Initialize temp states with saved values
      setTempProfileZoom(savedProfileZoom);
      setTempProfileImagePosition(savedProfileImagePosition);
      // Set working states for the editor
      setProfileZoom(savedProfileZoom);
      setProfileImagePosition(savedProfileImagePosition);
      setShowEditProfileModal(true);
    }
  };

  const handleRemoveProfileImage = async () => {
    try {
      setShowProfileModal(false);
      setShowEditProfileModal(false);

      const profileData = new FormData();
      profileData.append("removeProfileImage", "true");

      const response = await dispatch(expertImages(profileData)).unwrap();

      if (response.success) {
        setprofilePreview("");
        // Reset all transformation states
        setProfileZoom(1);
        setProfileImagePosition({ x: 0, y: 0 });
        setSavedProfileZoom(1);
        setSavedProfileImagePosition({ x: 0, y: 0 });
        setTempProfileZoom(1);
        setTempProfileImagePosition({ x: 0, y: 0 });
        onProfileImageChange("");

        toast.success("Profile image removed successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error("Failed to remove profile image", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Error removing profile image:", error);
      toast.error("An error occurred while removing the profile image", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      onCoverImageChange(file); // Store file for form submission

      const reader = new FileReader();
      reader.onloadend = async () => {
        setCoverPreview(reader.result);
        setShowCoverModal(false);
        setShowEditModal(true);
        // Reset transformations for new image
        setZoom(1);
        setImagePosition({ x: 0, y: 0 });
        setTempZoom(1);
        setTempImagePosition({ x: 0, y: 0 });
        setSavedZoom(1);
        setSavedImagePosition({ x: 0, y: 0 });

        // Create FormData and Dispatch Action to Update Cover Image
        const coverData = new FormData();
        coverData.append("coverImage", file); // Append the image file

        try {
          const response = await dispatch(expertImages(coverData)).unwrap();
          if (response.success) {
            toast.success("Cover image updated successfully!", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          } else {
            toast.error("Failed to update cover image", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          }
        } catch (error) {
          console.error("Error updating cover image:", error);
          toast.error("An error occurred while updating the cover image", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      onProfileImageChange(file); // Store file for form submission

      const reader = new FileReader();
      reader.onloadend = async () => {
        setprofilePreview(reader.result);
        setShowProfileModal(false);
        setShowEditProfileModal(true);
        // Reset transformations for new image
        setProfileZoom(1);
        setProfileImagePosition({ x: 0, y: 0 });
        setTempProfileZoom(1);
        setTempProfileImagePosition({ x: 0, y: 0 });
        setSavedProfileZoom(1);
        setSavedProfileImagePosition({ x: 0, y: 0 });

        // Create FormData and Dispatch Action to Update Profile Image
        const profileData = new FormData();
        profileData.append("profileImage", file); // Append the image file

        try {
          const response = await dispatch(expertImages(profileData)).unwrap();
          if (response.success) {
            toast.success("Profile image updated successfully!", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          } else {
            toast.error("Failed to update profile image", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          }
        } catch (error) {
          console.error("Error updating profile image:", error);
          toast.error("An error occurred while updating the profile image", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
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

    if (imageRef.current && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const imageRect = imageRef.current.getBoundingClientRect();

      // Calculate maximum allowed movement in each direction
      const maxX = Math.max(0, (imageRect.width * zoom - containerRect.width) / 2);
      const maxY = Math.max(0, (imageRect.height * zoom - containerRect.height) / 2);

      setImagePosition((prev) => {
        const newY = direction === "up" ? prev.y - step : prev.y + step;

        return {
          ...prev,
          y: Math.max(-maxY, Math.min(maxY, newY))
        };
      });
    } else {
      // Fallback if refs are not available
      setImagePosition((prev) => ({
        ...prev,
        y: direction === "up" ? prev.y - step : prev.y + step,
      }));
    }
  };

  const handleMoveProfileImage = (direction) => {
    const step = 10;

    if (profileImageRef.current && profileContainerRef.current) {
      const containerRect = profileContainerRef.current.getBoundingClientRect();
      const imageRect = profileImageRef.current.getBoundingClientRect();

      // Calculate maximum allowed movement in each direction
      const maxX = Math.max(0, (imageRect.width * profileZoom - containerRect.width) / 2);
      const maxY = Math.max(0, (imageRect.height * profileZoom - containerRect.height) / 2);

      setProfileImagePosition((prev) => {
        const newY = direction === "up" ? prev.y - step : prev.y + step;

        return {
          ...prev,
          y: Math.max(-maxY, Math.min(maxY, newY))
        };
      });
    } else {
      // Fallback if refs are not available
      setProfileImagePosition((prev) => ({
        ...prev,
        y: direction === "up" ? prev.y - step : prev.y + step,
      }));
    }
  };

  const handleMouseDown = (e) => {
    if (e.target === imageRef.current) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - imagePosition.x,
        y: e.clientY - imagePosition.y,
      });
    } else if (e.target === profileImageRef.current) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - profileImagePosition.x,
        y: e.clientY - profileImagePosition.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      if (imageRef.current && containerRef.current && showEditModal) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;

        const containerRect = containerRef.current.getBoundingClientRect();
        const imageRect = imageRef.current.getBoundingClientRect();

        // Calculate maximum allowed movement considering zoom
        const maxX = Math.max(0, (imageRect.width * zoom - containerRect.width) / 2);
        const maxY = Math.max(0, (imageRect.height * zoom - containerRect.height) / 2);

        setImagePosition({
          x: Math.max(-maxX, Math.min(maxX, newX)),
          y: Math.max(-maxY, Math.min(maxY, newY)),
        });
      } else if (profileImageRef.current && profileContainerRef.current && showEditProfileModal) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;

        const containerRect = profileContainerRef.current.getBoundingClientRect();
        const imageRect = profileImageRef.current.getBoundingClientRect();

        // Calculate maximum allowed movement considering zoom
        const maxX = Math.max(0, (imageRect.width * profileZoom - containerRect.width) / 2);
        const maxY = Math.max(0, (imageRect.height * profileZoom - containerRect.height) / 2);

        setProfileImagePosition({
          x: Math.max(-maxX, Math.min(maxX, newX)),
          y: Math.max(-maxY, Math.min(maxY, newY)),
        });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomChange = (e) => {
    const newZoom = parseFloat(e.target.value);
    setZoom(newZoom);

    // Adjust position when zooming to maintain center and respect boundaries
    if (imageRef.current && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const imageRect = imageRef.current.getBoundingClientRect();

      const maxX = Math.max(0, (imageRect.width * newZoom - containerRect.width) / 2);
      const maxY = Math.max(0, (imageRect.height * newZoom - containerRect.height) / 2);

      setImagePosition((prev) => ({
        x: Math.max(-maxX, Math.min(maxX, prev.x)),
        y: Math.max(-maxY, Math.min(maxY, prev.y)),
      }));
    }
  };

  // Enhanced zoom slider handlers
  const handleZoomSliderMouseDown = (e) => {
    e.preventDefault();
    setIsZoomSliderDragging(true);
    updateZoomFromMousePosition(e);
  };

  const handleZoomSliderMouseMove = (e) => {
    if (isZoomSliderDragging && zoomSliderRef.current) {
      updateZoomFromMousePosition(e);
    }
  };

  const handleZoomSliderMouseUp = () => {
    setIsZoomSliderDragging(false);
  };

  const updateZoomFromMousePosition = (e) => {
    if (zoomSliderRef.current) {
      const rect = zoomSliderRef.current.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const newZoom = 1 + (percentage * 2); // Range from 1 to 3

      setZoom(newZoom);

      // Adjust position when zooming to maintain center and respect boundaries
      if (imageRef.current && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const imageRect = imageRef.current.getBoundingClientRect();

        const maxX = Math.max(0, (imageRect.width * newZoom - containerRect.width) / 2);
        const maxY = Math.max(0, (imageRect.height * newZoom - containerRect.height) / 2);

        setImagePosition((prev) => ({
          x: Math.max(-maxX, Math.min(maxX, prev.x)),
          y: Math.max(-maxY, Math.min(maxY, prev.y)),
        }));
      }
    }
  };

  const handleProfileZoomChange = (e) => {
    const newZoom = parseFloat(e.target.value);
    setProfileZoom(newZoom);

    // Adjust position when zooming to maintain center and respect boundaries
    if (profileImageRef.current && profileContainerRef.current) {
      const containerRect = profileContainerRef.current.getBoundingClientRect();
      const imageRect = profileImageRef.current.getBoundingClientRect();

      const maxX = Math.max(0, (imageRect.width * newZoom - containerRect.width) / 2);
      const maxY = Math.max(0, (imageRect.height * newZoom - containerRect.height) / 2);

      setProfileImagePosition((prev) => ({
        x: Math.max(-maxX, Math.min(maxX, prev.x)),
        y: Math.max(-maxY, Math.min(maxY, prev.y)),
      }));
    }
  };

  // Enhanced profile zoom slider handlers
  const handleProfileZoomSliderMouseDown = (e) => {
    e.preventDefault();
    setIsProfileZoomSliderDragging(true);
    updateProfileZoomFromMousePosition(e);
  };

  const handleProfileZoomSliderMouseMove = (e) => {
    if (isProfileZoomSliderDragging && profileZoomSliderRef.current) {
      updateProfileZoomFromMousePosition(e);
    }
  };

  const handleProfileZoomSliderMouseUp = () => {
    setIsProfileZoomSliderDragging(false);
  };

  const updateProfileZoomFromMousePosition = (e) => {
    if (profileZoomSliderRef.current) {
      const rect = profileZoomSliderRef.current.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const newZoom = 1 + (percentage * 2); // Range from 1 to 3

      setProfileZoom(newZoom);

      // Adjust position when zooming to maintain center and respect boundaries
      if (profileImageRef.current && profileContainerRef.current) {
        const containerRect = profileContainerRef.current.getBoundingClientRect();
        const imageRect = profileImageRef.current.getBoundingClientRect();

        const maxX = Math.max(0, (imageRect.width * newZoom - containerRect.width) / 2);
        const maxY = Math.max(0, (imageRect.height * newZoom - containerRect.height) / 2);

        setProfileImagePosition((prev) => ({
          x: Math.max(-maxX, Math.min(maxX, prev.x)),
          y: Math.max(-maxY, Math.min(maxY, prev.y)),
        }));
      }
    }
  };

  const handleSaveChanges = async () => {
    try {
      // Save the transformations permanently
      setSavedZoom(zoom);
      setSavedImagePosition(imagePosition);

      // For demonstration - in real app, you'd send the transformation data to server
      // You might need to create a canvas, apply transformations, and upload the result
      const transformationData = {
        zoom: zoom,
        position: imagePosition,
        imageUrl: coverPreview || coverImage
      };

      console.log('Saving cover image transformations:', transformationData);

      // Close the modal
      setShowEditModal(false);

      toast.success("Cover image changes saved!", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error saving cover image changes:", error);
      toast.error("Failed to save changes", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleSaveProfileImageChanges = async () => {
    try {
      // Save the transformations permanently
      setSavedProfileZoom(profileZoom);
      setSavedProfileImagePosition(profileImagePosition);

      // For demonstration - in real app, you'd send the transformation data to server
      const transformationData = {
        zoom: profileZoom,
        position: profileImagePosition,
        imageUrl: profilePreview || profileImage
      };

      console.log('Saving profile image transformations:', transformationData);

      // Close the modal
      setShowEditProfileModal(false);

      toast.success("Profile image changes saved!", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error saving profile image changes:", error);
      toast.error("Failed to save changes", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  // Handle modal close without saving (revert changes)
  const handleCancelCoverEdit = () => {
    // Revert to saved values
    setZoom(savedZoom);
    setImagePosition(savedImagePosition);
    setShowEditModal(false);
  };

  const handleCancelProfileEdit = () => {
    // Revert to saved values
    setProfileZoom(savedProfileZoom);
    setProfileImagePosition(savedProfileImagePosition);
    setShowEditProfileModal(false);
  };

  useEffect(() => {
    if (showEditModal || showEditProfileModal) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      // Add zoom slider event listeners
      if (isZoomSliderDragging) {
        document.addEventListener("mousemove", handleZoomSliderMouseMove);
        document.addEventListener("mouseup", handleZoomSliderMouseUp);
      }

      if (isProfileZoomSliderDragging) {
        document.addEventListener("mousemove", handleProfileZoomSliderMouseMove);
        document.addEventListener("mouseup", handleProfileZoomSliderMouseUp);
      }

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("mousemove", handleZoomSliderMouseMove);
        document.removeEventListener("mouseup", handleZoomSliderMouseUp);
        document.removeEventListener("mousemove", handleProfileZoomSliderMouseMove);
        document.removeEventListener("mouseup", handleProfileZoomSliderMouseUp);
      };
    }
  }, [showEditModal, showEditProfileModal, isDragging, dragStart, isZoomSliderDragging, isProfileZoomSliderDragging]);

  useEffect(() => {
    if (!profileImage) {
      setprofilePreview("");
      // Reset all transformation states when no profile image
      setProfileZoom(1);
      setProfileImagePosition({ x: 0, y: 0 });
      setSavedProfileZoom(1);
      setSavedProfileImagePosition({ x: 0, y: 0 });
      setTempProfileZoom(1);
      setTempProfileImagePosition({ x: 0, y: 0 });
    }
  }, [profileImage]);

  // Generate initials avatar if no profile image
  const getInitialsAvatar = () => {
    const initial = firstName.charAt(0).toUpperCase();
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-purple-500",
    ];
    const colorIndex = initial.charCodeAt(0) % colors.length;
    const bgColor = colors[colorIndex];

    return (
      <div
        className={`w-full h-full ${bgColor} flex items-center justify-center text-white text-2xl font-semibold`}
      >
        {initial}
      </div>
    );
  };

  const EditImageModal = () => (
    <Modal
      isOpen={showEditModal}
      onClose={handleCancelCoverEdit}
      title="Edit Cover Image"
    >
      <div
        className="space-y-6"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          ref={containerRef}
          className="relative h-64 overflow-hidden bg-gray-100 rounded-lg cursor-move"
        >
          <img
            ref={imageRef}
            src={coverPreview || coverImage}
            alt="Cover"
            className="w-full h-full object-cover select-none cursor-move"
            style={{
              transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${zoom})`,
              transformOrigin: "center",
              willChange: "transform",
              transition: isDragging ? "none" : "transform 0.1s ease-out",
            }}
            draggable="false"
            onMouseDown={handleMouseDown}
          />
        </div>

        <div className="space-y-4">
          {/* Zoom Control */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 min-w-[60px]">
              Zoom:
            </label>
            <div className="flex-1 relative">
              {/* Custom draggable slider track */}
              <div
                ref={zoomSliderRef}
                className="h-2 bg-gray-200 rounded-lg cursor-pointer relative"
                onMouseDown={handleZoomSliderMouseDown}
                style={{
                  background: `linear-gradient(to right, #34A853 0%, #34A853 ${(zoom - 1) * 50}%, #E5E7EB ${(zoom - 1) * 50}%, #E5E7EB 100%)`,
                }}
              >
                {/* Slider thumb */}
                <div
                  className="absolute top-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow-sm cursor-grab active:cursor-grabbing transition-all duration-150 hover:scale-110"
                  style={{
                    left: `${(zoom - 1) * 50}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10
                  }}
                  onMouseDown={handleZoomSliderMouseDown}
                />
              </div>
              {/* Hidden range input for accessibility and fallback */}
              <input
                type="range"
                min="1"
                max="3"
                step="0.01"
                value={zoom}
                onChange={handleZoomChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                style={{ zIndex: 5 }}
              />
            </div>
            <span className="text-sm text-gray-600 min-w-[40px]">
              {(zoom * 100).toFixed(0)}%
            </span>
          </div>

          {/* Position Controls */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleMoveImage("up")}
              className="p-2 text-gray-600 hover:text-primary border rounded-lg transition-colors"
            >
              <FaArrowUp className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleMoveImage("down")}
              className="p-2 text-gray-600 hover:text-primary border rounded-lg transition-colors"
            >
              <FaArrowDown className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex justify-between">
          {/* <button
            onClick={() => {
              handleCancelCoverEdit();
              setShowCoverModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
          >
            <FaCamera /> Change Image
          </button> */}
          <div className="flex justify-center items-center w-full gap-2">
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
              onClick={handleCancelCoverEdit}
              className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveChanges}
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
      isOpen={showEditProfileModal}
      onClose={handleCancelProfileEdit}
      title="Edit Profile Image"
    >
      <div
        className="space-y-6"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          ref={profileContainerRef}
          className="relative w-64 h-64 bg-gray-100 rounded-full overflow-hidden border cursor-move mx-auto"
        >
          <img
            ref={profileImageRef}
            src={profilePreview || profileImage}
            alt="Profile"
            className="w-full h-full object-cover select-none cursor-move"
            style={{
              transform: `translate(${profileImagePosition.x}px, ${profileImagePosition.y}px) scale(${profileZoom})`,
              transformOrigin: "center",
              willChange: "transform",
              transition: isDragging ? "none" : "transform 0.1s ease-out",
            }}
            draggable="false"
            onMouseDown={handleMouseDown}
          />
        </div>

        <div className="space-y-4">
          {/* Zoom Control */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 min-w-[60px]">
              Zoom:
            </label>
            <div className="flex-1 relative">
              {/* Custom draggable slider track */}
              <div
                ref={profileZoomSliderRef}
                className="h-2 bg-gray-200 rounded-lg cursor-pointer relative"
                onMouseDown={handleProfileZoomSliderMouseDown}
                style={{
                  background: `linear-gradient(to right, #34A853 0%, #34A853 ${(profileZoom - 1) * 50}%, #E5E7EB ${(profileZoom - 1) * 50}%, #E5E7EB 100%)`,
                }}
              >
                {/* Slider thumb */}
                <div
                  className="absolute top-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow-sm cursor-grab active:cursor-grabbing transition-all duration-150 hover:scale-110"
                  style={{
                    left: `${(profileZoom - 1) * 50}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10
                  }}
                  onMouseDown={handleProfileZoomSliderMouseDown}
                />
              </div>
              {/* Hidden range input for accessibility and fallback */}
              <input
                type="range"
                min="1"
                max="3"
                step="0.01"
                value={profileZoom}
                onChange={handleProfileZoomChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                style={{ zIndex: 5 }}
              />
            </div>
            <span className="text-sm text-gray-600 min-w-[40px]">
              {(profileZoom * 100).toFixed(0)}%
            </span>
          </div>

          {/* Position Controls */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleMoveProfileImage("up")}
              className="p-2 text-gray-600 hover:text-primary border rounded-lg transition-colors"
            >
              <FaArrowUp className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleMoveProfileImage("down")}
              className="p-2 text-gray-600 hover:text-primary border rounded-lg transition-colors"
            >
              <FaArrowDown className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex justify-center items-center">
          {/* <button
            onClick={() => {
              handleCancelProfileEdit();
              setShowProfileModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
          >
            <FaCamera /> Change Image
          </button> */}
          <div className="flex justify-center items-center w-full gap-2">
            <button
              onClick={() => {
                setProfileZoom(1);
                setProfileImagePosition({ x: 0, y: 0 });
              }}
              className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleCancelProfileEdit}
              className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveProfileImageChanges}
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
            src={coverPreview || coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
            style={{
              transform: `translate(${savedImagePosition.x}px, ${savedImagePosition.y}px) scale(${savedZoom})`,
              transformOrigin: "center",
              transition: "transform 0.1s ease-out",
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
              onClick={handleEditCoverImage}
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
                src={profilePreview || profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
                style={{
                  transform: `translate(${savedProfileImagePosition.x}px, ${savedProfileImagePosition.y}px) scale(${savedProfileZoom})`,
                  transformOrigin: "center",
                  transition: "transform 0.1s ease-out",
                }}
              />
            ) : (
              getInitialsAvatar()
            )}
          </div>
          <div className="absolute bottom-0 right-0">
            <button
              onClick={() => setShowProfileModal(true)}
              className="bg-primary rounded-full p-1.5 sm:p-2 cursor-pointer hover:bg-green-600 transition-colors shadow-sm"
            >
              <FaCamera className="text-white text-xs sm:text-sm" />
            </button>
          </div>
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
        onEdit={profileImage ? handleEditProfileImage : undefined}
        onRemove={profileImage ? handleRemoveProfileImage : undefined}
        canEdit={Boolean(profileImage)}
        canRemove={Boolean(profileImage)}
      />

      <EditImageModal />
      <EditProfileImageModal />
    </div>
  );
};

export default ProfileHeader;
