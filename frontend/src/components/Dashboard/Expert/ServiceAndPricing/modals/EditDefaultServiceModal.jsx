import { useState, useEffect } from "react";
import Modal from "./Modal";
import { FeatureList } from "./FeatureList";
import toast from "react-hot-toast";
import { ClockIcon } from "../icons";

function EditDefaultServiceModal({ isOpen, onClose, onSave, service }) {
  const DEFAULT_HOURLY_RATE = "100";
  console.log("THis is the default srvice", service);
  const calculatePrice = (hourlyRate, duration) => {
    // Calculate price based on full hourly rate
    const rateNum = parseInt(hourlyRate, 10);
    return Math.round((rateNum * duration) / 60);
  };

  const getInitialState = (serviceData) => {
    if (!serviceData) {
      return {
        id: "",
        serviceName: "",
        shortDescription: "",
        detailedDescription: "",
        hourlyRate: DEFAULT_HOURLY_RATE,
        timeSlots: [15, 30, 45, 60, 90].map((duration) => ({
          duration,
          price: calculatePrice(DEFAULT_HOURLY_RATE, duration),
          enabled: true,
        })),
        features: [""],
      };
    }

    // Initialize timeSlots with enabled status and calculated prices based on duration
    const sixtyMinSlot = serviceData.timeSlots?.find(
      (slot) => slot.duration === 60
    );
    const hourlyRate = sixtyMinSlot
      ? Math.round(sixtyMinSlot.price).toString()
      : serviceData.hourlyRate;

    const timeSlots = [15, 30, 45, 60, 90].map((duration) => {
      const existingSlot = serviceData.timeSlots?.find(
        (slot) => slot.duration === duration
      );
      return {
        duration,
        price: calculatePrice(hourlyRate, duration),
        enabled: existingSlot?.enabled ?? true,
      };
    });

    return {
      id: serviceData.serviceId,
      serviceName: serviceData.title || "",
      shortDescription: serviceData.shortDescription || "",
      detailedDescription: serviceData.detailedDescription || "",
      hourlyRate,
      timeSlots,
      features: serviceData.features || [""],
    };
  };

  const [formData, setFormData] = useState(getInitialState(service));

  useEffect(() => {
    if (service) {
      setFormData(getInitialState(service));
    }
  }, [service]);

  const handleHourlyRateChange = (rate) => {
    const exactRate = rate.toString();

    const updatedTimeSlots = formData.timeSlots.map((slot) => ({
      ...slot,
      price: calculatePrice(exactRate, slot.duration),
    }));

    setFormData({
      ...formData,
      hourlyRate: exactRate,
      timeSlots: updatedTimeSlots,
    });
  };

  const toggleTimeSlot = (duration) => {
    const updatedTimeSlots = formData.timeSlots.map((slot) =>
      slot.duration === duration ? { ...slot, enabled: !slot.enabled } : slot
    );

    setFormData({
      ...formData,
      timeSlots: updatedTimeSlots,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);

    toast.success("Service updated successfully", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    onClose();
  };

  const netEarnings = formData.hourlyRate
    ? `₹${(parseInt(formData.hourlyRate, 10) * 0.8).toFixed(2)}`
    : "₹0.00";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Service Details">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 required">
            Service Name
          </label>
          <input
            type="text"
            value={formData.serviceName}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100 cursor-not-allowed"
            placeholder="1-on-1 Call"
            disabled
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 required">
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

        <div>
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">
              Hourly Rate (60 minutes)
            </label>
            <div className="text-sm">
              Net Earnings:{" "}
              <span className="text-green-600 font-medium">{netEarnings}</span>
            </div>
          </div>
          <div className="mt-1 relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              ₹
            </span>
            <input
              type="number"
              value={formData.hourlyRate}
              onChange={(e) => handleHourlyRateChange(e.target.value)}
              className="block w-full rounded-md border border-gray-300 pl-7 pr-3 py-2"
              placeholder={DEFAULT_HOURLY_RATE}
              min="0"
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            We charge a 20% commission on all bookings
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available Durations
          </label>
          <div className="grid grid-cols-2 gap-3">
            {formData.timeSlots.map((timeSlot) => (
              <div
                key={timeSlot.duration}
                className={`flex items-center justify-between p-3 border rounded-lg ${
                  timeSlot.enabled
                    ? "border-gray-200"
                    : "border-gray-100 bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2 text-gray-700">
                  <ClockIcon />
                  <span>{timeSlot.duration} min</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-gray-900 font-medium">
                    ₹{timeSlot.price}
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleTimeSlot(timeSlot.duration)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      timeSlot.enabled ? "bg-green-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        timeSlot.enabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Detailed Description{" "}
            <span className="text-gray-500">(Optional)</span>
          </label>
          <textarea
            value={formData.detailedDescription}
            onChange={(e) =>
              setFormData({ ...formData, detailedDescription: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            rows="3"
            placeholder="Description"
          />
        </div>

        <FeatureList
          features={formData.features}
          onFeatureChange={(index, value) => {
            const newFeatures = [...formData.features];
            newFeatures[index] = value;
            setFormData({ ...formData, features: newFeatures });
          }}
          onAddFeature={() =>
            setFormData({ ...formData, features: [...formData.features, ""] })
          }
          onRemoveFeature={(index) => {
            const newFeatures = formData.features.filter((_, i) => i !== index);
            setFormData({ ...formData, features: newFeatures });
          }}
        />

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default EditDefaultServiceModal;
