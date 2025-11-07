import { useState } from "react";
import { useDispatch } from "react-redux";
import { FeatureList } from "./FeatureList";
import { TimeSlotSelector } from "./TimeSlotSelector";
import toast from "react-hot-toast";
import { createService } from "@/Redux/Slices/expert.Slice";

export function ServiceForm({ onClose, submitLabel = "Save" }) {
  const dispatch = useDispatch();

  // Manage form data state here
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    detailedDescription: "",
    duration: "15",
    price: "",
    features: [""],
  });

  const [errors, setErrors] = useState({});

  const validate = (data = formData) => {
    const newErrors = {};

    // Service Name (required)
    if (!data.title || !data.title.trim()) {
      newErrors.title = "Service name is required";
    }

    // Short Description (required)
    if (!data.shortDescription || !data.shortDescription.trim()) {
      newErrors.shortDescription = "Short description is required";
    }

    // Duration (required, positive integer)
    const durationNum = parseInt(data.duration, 10);
    if (Number.isNaN(durationNum) || durationNum <= 0) {
      newErrors.duration = "Duration is required";
    }

    // Price (required, positive number)
    const priceNum = parseFloat(data.price);
    if (Number.isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ""] });
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      // Show inline warnings only; keep the form open and do not show a toast
      return;
    }

    // Transform duration and price into timeSlots array
    const timeSlots = [
      {
        duration: parseInt(formData.duration),
        price: parseFloat(formData.price),
      },
    ];

    const serviceData = {
      ...formData,
      timeSlots,
    };

    // Dispatch createService action and unwrap to only treat fulfilled as success
    dispatch(createService(serviceData))
      .unwrap()
      .then(() => {
        toast.success("Service added successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        onClose();
      })
      .catch((error) => {
        // Error toast is already handled centrally in the thunk; keep form open
        console.error("Failed to add service:", error);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Service Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => {
            const value = e.target.value;
            setFormData({ ...formData, title: value });
            if (errors.title && value.trim()) {
              setErrors((prev) => ({ ...prev, title: undefined }));
            }
          }}
          className={`mt-1 block w-full rounded-md px-3 py-2 border ${errors.title ? "border-red-500" : "border-gray-300"
            }`}
          placeholder="1-on-1 Call"
          required
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Short Description <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.shortDescription}
          onChange={(e) => {
            const value = e.target.value;
            setFormData({ ...formData, shortDescription: value });
            if (errors.shortDescription && value.trim()) {
              setErrors((prev) => ({ ...prev, shortDescription: undefined }));
            }
          }}
          className={`mt-1 block w-full rounded-md px-3 py-2 border ${errors.shortDescription ? "border-red-500" : "border-gray-300"
            }`}
          placeholder="Brief one line description of your service"
          required
        />
        {errors.shortDescription && (
          <p className="mt-1 text-sm text-red-600">{errors.shortDescription}</p>
        )}
      </div>

      <TimeSlotSelector
        duration={formData.duration}
        price={formData.price}
        onChange={(field, value) => {
          setFormData({ ...formData, [field]: value });
          if ((field === "duration" && errors.duration) || (field === "price" && errors.price)) {
            // Re-validate only these fields quickly
            const draft = { ...formData, [field]: value };
            const durationNum = parseInt(draft.duration, 10);
            const priceNum = parseFloat(draft.price);
            setErrors((prev) => ({
              ...prev,
              duration:
                Number.isNaN(durationNum) || durationNum <= 0
                  ? "Duration is required"
                  : undefined,
              price:
                Number.isNaN(priceNum) || priceNum <= 0
                  ? "Price must be greater than 0"
                  : undefined,
            }));
          }
        }}
      />
      {(errors.duration || errors.price) && (
        <div className="text-sm text-red-600">
          {errors.duration && <p>{errors.duration}</p>}
          {errors.price && <p>{errors.price}</p>}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Detailed Description (Optional)
        </label>
        <textarea
          value={formData.detailedDescription}
          onChange={(e) =>
            setFormData({ ...formData, detailedDescription: e.target.value })
          }
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          rows="3"
          placeholder="This is where you'll showcase a detailed explanation of the service offered. Include what the service entails, who it’s designed for, and the specific outcomes or benefits clients can expect."
        />
      </div>

      <FeatureList
        features={formData.features}
        onFeatureChange={handleFeatureChange}
        onAddFeature={addFeature}
        onRemoveFeature={removeFeature}
      />

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
      >
        {submitLabel}
      </button>
    </form>
  );
}

export default ServiceForm