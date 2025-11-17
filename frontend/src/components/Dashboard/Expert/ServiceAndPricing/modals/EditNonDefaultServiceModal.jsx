import { useState, useEffect } from 'react'
import Modal from './Modal'
import { SingleTimeSlot } from './SingleTimeSlot'
import { FeatureList } from './FeatureList'

function EditNonDefaultServiceModal({ isOpen, onClose, onSave, service }) {
  const [formData, setFormData] = useState({
    id: '',
    serviceName: '',
    shortDescription: '',
    detailedDescription: '',
    timeSlot: { duration: 15, price: 25 },
    features: ['']
  })

  useEffect(() => {
    // console.log('EditNonDefaultServiceModal useEffect triggered, service:', service)
    if (service) {
      // console.log('Loading non-default service data:', service)
      // console.log('Service timeSlots:', service.timeSlots)
      // console.log('Service duration/price fallback:', service.duration, service.price)

      const timeSlot = service.timeSlots?.[0] || {
        duration: service.duration || 15,
        price: service.price || 25,
        enabled: service.enabled ?? true,
      };

      // console.log('Selected timeSlot:', timeSlot)

      setFormData({
        // IMPORTANT: Backend matches by service.serviceId only
        id: service.serviceId,
        serviceName: service.serviceName || service.title || '',
        shortDescription: service.shortDescription || '',
        detailedDescription: service.detailedDescription || '',
        timeSlot: timeSlot,
        features: service.features && service.features.length > 0 ? service.features : ['']
      });
    } else {
      // console.log('No service provided to EditNonDefaultServiceModal')
    }
  }, [service]);


  const handleSubmit = (e) => {
    e.preventDefault()

   // Validate that price is not zero
   const priceNum = parseInt(formData.timeSlot.price) || 0;
   if (priceNum <= 0) {
     alert("Price must be greater than zero");
     return;
   }

    // Map form data to the structure expected by the backend API
    const updatedService = {
      id: formData.id,
      serviceName: formData.serviceName, // Backend maps this to 'title' field for storage
      shortDescription: formData.shortDescription,
      detailedDescription: formData.detailedDescription,
      timeSlots: [{
        duration: parseInt(formData.timeSlot.duration),
        price: parseFloat(formData.timeSlot.price),
        enabled: formData.timeSlot.enabled ?? true
      }],
      features: formData.features.filter(feature => feature.trim() !== '') // Remove empty features
    }

    // console.log('Sending updated non-default service data:', updatedService)
    // console.log('FormData timeSlot before mapping:', formData.timeSlot)

    // Call the parent's onSave function with context
    onSave(updatedService, {
      serviceType: 'non-default',
      serviceName: updatedService.serviceName,
    })

    // Don't show toast here - let parent handle success/error feedback
    // Don't close modal here - let parent handle modal closing after API response
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Service Details">
      <div className="flex flex-col h-[70vh] max-h-[80vh]">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto space-y-6 pb-16">
            <div>
              <label className="block text-sm font-medium text-gray-700 required">Service Name<span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.serviceName}
                onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 required">Short Description<span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder='Brief one line description of your service'
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Detailed Description
              </label>
              <textarea
                value={formData.detailedDescription}
                onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                rows="3"
                placeholder="Provide a detailed description of your service..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 required">Time Slot<span className="text-red-500">*</span></label>
              <SingleTimeSlot
                timeSlot={formData.timeSlot}
                onChange={(updatedTimeSlot) => setFormData({ ...formData, timeSlot: updatedTimeSlot })}
              />
            </div>

            <FeatureList
              features={formData.features}
              onFeatureChange={(index, value) => {
                const newFeatures = [...formData.features]
                newFeatures[index] = value
                setFormData({ ...formData, features: newFeatures })
              }}
              onAddFeature={() => setFormData({ ...formData, features: [...formData.features, ''] })}
              onRemoveFeature={(index) => {
                const newFeatures = formData.features.filter((_, i) => i !== index)
                setFormData({ ...formData, features: newFeatures })
              }}
            />
          </div>

          {/* Fixed footer with buttons */}
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
  )
}

export default EditNonDefaultServiceModal;