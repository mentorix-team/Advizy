import { useState, useEffect } from "react"; // Add useEffect
import { useDispatch } from "react-redux";
import { EditIcon, DeleteIcon } from "@/icons/Icons";
import { ServiceFeatures } from "./ServiceFeatures";
import { deleteServicebyId, toggleService, updateServicebyId } from "@/Redux/Slices/expert.Slice";

function ServiceCard({ service, isDefault = false, onEdit, onToggle }) {
  const dispatch = useDispatch();

  // Set isEnabled based on the service.showMore property
  const [isEnabled, setIsEnabled] = useState(service?.showMore );

  // Update isEnabled whenever the service.showMore property changes
  useEffect(() => {
    setIsEnabled(service?.showMore || false);
  }, [service?.showMore]);

  const [editedService, setEditedService] = useState(service);

  // Updated handleToggle to accept the service object
  const handleToggle = () => {
    if (service) {
      dispatch(toggleService(service.serviceId)); // Pass serviceId from the service object
      setIsEnabled((prev) => !prev); // Toggle the local state
      onToggle?.(!isEnabled); // Call the onToggle callback if provided
    }
  };

  const handleDelete = () => {
    if (isEnabled && service?._id) {
      console.log("This is service id", service._id);
      dispatch(deleteServicebyId(service._id));
    }
  };

  const handleEdit = (updatedService) => {
    setEditedService((prevService) => {
      const newService = { ...prevService, ...updatedService }; // Merge updates
      console.log("Updated Service Data: ", newService);
      dispatch(updateServicebyId(newService)); // Dispatch after updating state
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
            <button
              onClick={handleToggle} // Call handleToggle directly
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
          )}
          <button
            onClick={() => {
              onEdit(service); // Pass the service object to onEdit
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
              onClick={handleDelete}
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
}

export default ServiceCard;