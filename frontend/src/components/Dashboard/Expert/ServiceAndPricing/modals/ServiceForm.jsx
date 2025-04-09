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

    // Dispatch createService action
    dispatch(createService(serviceData))
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
        toast.error("Failed to add service", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        console.error(error);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Service Name
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="1-on-1 Call"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Short Description
        </label>
        <input
          type="text"
          value={formData.shortDescription}
          onChange={(e) =>
            setFormData({ ...formData, shortDescription: e.target.value })
          }
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="Brief one line description of your service"
          required
        />
      </div>

      <TimeSlotSelector
        duration={formData.duration}
        price={formData.price}
        onChange={(field, value) =>
          setFormData({ ...formData, [field]: value })
        }
      />

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