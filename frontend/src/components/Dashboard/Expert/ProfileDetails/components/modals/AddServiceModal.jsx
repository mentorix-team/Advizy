import React, { useState } from "react";
import Modal from "../Modal";
import TimeSlotInput from "./TimeSlotInput";
import FeatureInput from "./FeatureInput";
import { toast } from "react-hot-toast";

export default function AddServiceModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    serviceName: "",
    shortDescription: "",
    detailedDescription: "",
    timeSlots: [],
    features: [],
  });

  const handleAddTimeSlot = (newSlot) => {
    // Check for duplicate time slots
    const isDuplicate = formData.timeSlots.some(
      (slot) => slot.duration === newSlot.duration
    );

    if (isDuplicate) {
      toast.error("This time duration already exists", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    setFormData({
      ...formData,
      timeSlots: [...formData.timeSlots, newSlot],
    });
  };

  const handleRemoveTimeSlot = (index) => {
    setFormData({
      ...formData,
      timeSlots: formData.timeSlots.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Service Details">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-left">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.serviceName}
            onChange={(e) =>
              setFormData({ ...formData, serviceName: e.target.value })
            }
            className="w-full p-2 border rounded-lg focus:ring-primary focus:border-primary"
            placeholder="1-on-1 Call"
            required
          />
        </div>

        <div className="text-left">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Short Description <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.shortDescription}
            onChange={(e) =>
              setFormData({ ...formData, shortDescription: e.target.value })
            }
            className="w-full p-2 border rounded-lg focus:ring-primary focus:border-primary"
            placeholder="Personal consultation session tailored to your specific needs"
            required
          />
        </div>

        <div className="text-left">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Detailed Description (Optional)
          </label>
          <textarea
            value={formData.detailedDescription}
            onChange={(e) =>
              setFormData({ ...formData, detailedDescription: e.target.value })
            }
            className="w-full p-2 border rounded-lg focus:ring-primary focus:border-primary h-32"
            placeholder="Provide a detailed description of your service..."
          />
        </div>

        <TimeSlotInput
          timeSlots={formData.timeSlots}
          onAdd={handleAddTimeSlot}
          onRemove={handleRemoveTimeSlot}
        />

        <FeatureInput
          features={formData.features}
          onChange={(features) => setFormData({ ...formData, features })}
        />

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}
