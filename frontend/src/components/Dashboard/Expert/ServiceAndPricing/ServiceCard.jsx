import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { EditIcon, DeleteIcon } from "@/icons/Icons";
import { ServiceFeatures } from "./ServiceFeatures";
import { deleteServicebyId, updateServicebyId } from "@/Redux/Slices/expert.Slice";
import ConfirmDialog from "./ConfirmDialog";
// import Spinner from "@/components/LoadingSkeleton/Spinner";
import Spinner from "@/components/LoadingSkeleton/Spinner";


const ServiceCard = ({ service, isDefault = false, onEdit, onToggle }) => {
  const dispatch = useDispatch();
  const [isEnabled, setIsEnabled] = useState(true);
  const [editedService, setEditedService] = useState(service);
  const [showToggleConfirm, setShowToggleConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleToggleConfirm = () => {
    if (isEnabled) {
      setShowToggleConfirm(true);
    } else {
      handleToggle();
    }
  };

  const handleToggle = () => {
    setIsEnabled(!isEnabled);
    onToggle?.(!isEnabled);
    setShowToggleConfirm(false);
  };

  const handleDeleteConfirm = () => {
    setShowDeleteConfirm(true);
  };

  const handleDelete = () => {
    if (isEnabled && service?._id) {
      console.log("This is service id", service._id);
      dispatch(deleteServicebyId(service._id));
    }
    setShowDeleteConfirm(false);
  };

  const handleEdit = (updatedService) => {
    setEditedService((prevService) => {
      const newService = { ...prevService, ...updatedService };
      console.log("Updated Service Data: ", newService);
      dispatch(updateServicebyId(newService));
      return newService;
    });
  };

  const handleUpdate = () => {
    if (isEnabled && editedService?._id) {
      console.log("Data passed: ", editedService);
      dispatch(updateServicebyId(editedService));
    }
  };

  if (!service) return null;

  const {
    title = "",
    shortDescription = "",
    features = [],
    duration = "",
    price = "",
    _id,
  } = editedService;

  return (
    <div
      className={`rounded-xl shadow-md p-5 transition-opacity border ${
        isEnabled
          ? "bg-white border-gray-200 hover:shadow-lg"
          : "bg-gray-50 text-gray-500"
      }`}
    >
      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={showToggleConfirm}
        message="Are you sure you want to turn off your service?"
        onConfirm={handleToggle}
        onCancel={() => setShowToggleConfirm(false)}
      />
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        message="Are you sure you want to delete this service?"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {/* Top Row: Service Name, Toggle, Edit, and Delete */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <h3
            className={`text-xl font-semibold ${
              isEnabled ? "text-gray-900" : "text-gray-500"
            }`}
            title={title}
          >
            {title.length > 15 ? `${title.slice(0, 15)}...` : title}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          {!isDefault && (
            <div className="relative">
              <button
                onClick={handleToggleConfirm}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${
                  isEnabled ? "bg-[#16A348] text-white" : "bg-gray-300 text-gray-500"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              {showTooltip && isEnabled && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-md whitespace-nowrap">
                  Click to toggle service status
                </div>
              )}
            </div>
          )}
          <button
            onClick={() => {
              onEdit(service);
            }}
            className={`rounded-full transition-colors ${
              isEnabled ? "hover:bg-gray-100" : "cursor-not-allowed"
            }`}
            disabled={!isEnabled}
          >
            <EditIcon className="w-5 h-4.5 text-gray-600" />
          </button>
          {!isDefault && service.title !== "One-on-One Mentoring" && (
            <button
              onClick={handleDeleteConfirm}
              className={`rounded-full transition-colors ${
                isEnabled ? "hover:bg-gray-100" : "cursor-not-allowed"
              }`}
              disabled={!isEnabled}
            >
              <DeleteIcon className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Time and Pricing */}
      <div className="flex flex-col gap-2">
        <p className={`text-sm ${isEnabled ? "text-gray-600" : "text-gray-400"}`}>
          {shortDescription.length > 50
            ? `${shortDescription.slice(0, 50)}...`
            : shortDescription}
        </p>
        <p className={`font-semibold ${isEnabled ? "font-semibold" : "text-gray-500"}`}>
          {duration && price && (
            <span>
              {duration} minutes - Rs {price}
            </span>
          )}
        </p>
      </div>

      {/* Features Section */}
      <div className="mt-4">
        <ServiceFeatures features={features} />
      </div>
    </div>
  );
};

export default ServiceCard;