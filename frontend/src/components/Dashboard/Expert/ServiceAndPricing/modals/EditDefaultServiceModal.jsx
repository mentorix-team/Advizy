import { useState, useEffect } from "react";
import Modal from "./Modal";
import { FeatureList } from "./FeatureList";
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
    console.log('Processing service data for default modal:', serviceData);

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

    // For "One-on-One Mentoring" service, timeSlots might be in 'one_on_one' field
    let timeSlots;
    if (serviceData.one_on_one && Array.isArray(serviceData.one_on_one)) {
      // Backend stores mentoring timeSlots in 'one_on_one' field
      timeSlots = serviceData.one_on_one;
    } else if (serviceData.timeSlots && Array.isArray(serviceData.timeSlots)) {
      // Fallback to timeSlots if one_on_one doesn't exist
      timeSlots = serviceData.timeSlots;
    } else {
      // Default timeSlots if none exist
      timeSlots = [15, 30, 45, 60, 90].map((duration) => ({
        duration,
        price: calculatePrice(DEFAULT_HOURLY_RATE, duration),
        enabled: true,
      }));
    }

    // Calculate hourly rate from 60-minute slot
    const sixtyMinSlot = timeSlots.find((slot) => slot.duration === 60);
    const hourlyRate = sixtyMinSlot
      ? Math.round(sixtyMinSlot.price).toString()
      : serviceData.hourlyRate || DEFAULT_HOURLY_RATE;

    // Create complete timeSlots array with all durations
    const completeTimeSlots = [15, 30, 45, 60, 90].map((duration) => {
      const existingSlot = timeSlots.find((slot) => slot.duration === duration);
      return {
        duration,
        price: existingSlot ? existingSlot.price : calculatePrice(hourlyRate, duration),
        enabled: existingSlot?.enabled ?? true,
      };
    });

    return {
      id: serviceData.serviceId || serviceData._id,
      serviceName: serviceData.title || serviceData.serviceName || "",
      shortDescription: serviceData.shortDescription || "",
      detailedDescription: serviceData.detailedDescription || "",
      hourlyRate,
      timeSlots: completeTimeSlots,
      features: serviceData.features && serviceData.features.length > 0 ? serviceData.features : [""],
    };
  };

  const [formData, setFormData] = useState(getInitialState(service));

  useEffect(() => {
    console.log('EditDefaultServiceModal useEffect triggered, service:', service);
    if (service) {
      console.log('Setting form data with service:', service);
      setFormData(getInitialState(service));
    } else {
      console.log('No service provided, using default state');
      setFormData(getInitialState(null));
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

    // Map form data to the structure expected by the backend API
    const updatedService = {
      id: formData.id,
      serviceName: "One-on-One Mentoring", // Fixed service name for default service
      shortDescription: formData.shortDescription,
      detailedDescription: formData.detailedDescription,
      hourlyRate: formData.hourlyRate,
      timeSlots: formData.timeSlots.map(slot => ({
        duration: slot.duration,
        price: slot.price,
        enabled: slot.enabled
      })),
      features: formData.features.filter(feature => feature.trim() !== '') // Remove empty features
    };

    console.log('Sending updated default service data:', updatedService);
    onSave(updatedService, {
      serviceType: "default",
      serviceName: updatedService.serviceName,
    });

    // Don't close immediately - let parent handle closing after API success
    // onClose();
  };

  const netEarnings = formData.hourlyRate
    ? `₹${(parseInt(formData.hourlyRate, 10) * 0.8).toFixed(2)}`
    : "₹0.00";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Service Details">
      <div className="flex flex-col h-[70vh] max-h-[80vh]">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto space-y-6 pb-16">
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
                Short Description<span className="text-red-500">*</span>
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
                  Hourly Rate (60 minutes)<span className="text-red-500">*</span>
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
                Available Durations<span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {formData.timeSlots.map((timeSlot) => (
                  <div
                    key={timeSlot.duration}
                    className={`flex items-center justify-between p-3 border rounded-lg ${timeSlot.enabled
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
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${timeSlot.enabled ? "bg-green-600" : "bg-gray-200"
                          }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${timeSlot.enabled ? "translate-x-6" : "translate-x-1"
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
          </div>

          {/* Fixed buttons at the bottom of the form */}
          <div className="flex justify-end gap-3 pt-4 border-t bg-white">
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
      </div>
    </Modal>
  );
}

export default EditDefaultServiceModal;