import { useState, useEffect } from 'react'
import Modal from './Modal'
import { SingleTimeSlot } from './SingleTimeSlot'
import { FeatureList } from './FeatureList'
import toast from 'react-hot-toast'

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
    if (service) {
      setFormData({
        id: service.serviceId,
        serviceName: service.serviceName || '',
        shortDescription: service.shortDescription || '',
        detailedDescription: service.detailedDescription || '',
        timeSlot: service.timeSlots?.[0] || { duration: 15, price: 25 },
        features: service.features || ['']
      })
    }
  }, [service])

  const handleSubmit = (e) => {
    e.preventDefault()
    const updatedService = {
      ...formData,
      timeSlots: [formData.timeSlot]
    }
    onSave(updatedService)
    toast.success('Service updated successfully',  {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Service Details">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 required">Service Name</label>
          <input
            type="text"
            value={formData.serviceName}
            onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 required">Short Description</label>
          <input
            type="text"
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Detailed Description <span className="text-gray-500">(Optional)</span>
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
          <label className="block text-sm font-medium text-gray-700 required">Time Slot</label>
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
  )
}

export default EditNonDefaultServiceModal