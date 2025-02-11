import { useState, useEffect } from 'react'
import Modal from './Modal'
import { TimeSlot } from './TimeSlot'
import { FeatureList } from './FeatureList'
import toast from 'react-hot-toast'

function EditDefaultServiceModal({ isOpen, onClose, onSave, service }) {
  const [formData, setFormData] = useState({
    id: '',
    serviceName: '',
    shortDescription: '',
    detailedDescription: '',
    timeSlots: [],
    features: ['']
  })

  useEffect(() => {
    if (service) {
      setFormData({
        id: service.id,
        serviceName: service.serviceName || '',
        shortDescription: service.shortDescription || '',
        detailedDescription: service.detailedDescription || '',
        timeSlots: service.timeSlots || [],
        features: service.features || ['']
      })
    }
  }, [service])

  const handleTimeSlotChange = (index, field, value) => {
    const newTimeSlots = [...formData.timeSlots]
    
    if (field === 'duration') {
      // Check for duplicate duration
      const isDuplicate = formData.timeSlots.some(
        (slot, i) => i !== index && slot.duration === value
      )
      
      if (isDuplicate) {
        toast.error('This time slot duration already exists')
        return
      }
    }
    
    newTimeSlots[index] = { ...newTimeSlots[index], [field]: value }
    setFormData({ ...formData, timeSlots: newTimeSlots })
  }

  const addTimeSlot = () => {
    const availableDurations = [15, 30, 45, 60, 90]
    const unusedDurations = availableDurations.filter(
      duration => !formData.timeSlots.some(slot => slot.duration === duration)
    )
    
    if (unusedDurations.length === 0) {
      toast.error('All time slot durations are already in use')
      return
    }
    
    setFormData({
      ...formData,
      timeSlots: [...formData.timeSlots, { duration: unusedDurations[0], price: 25 }]
    })
  }

  const removeTimeSlot = (index) => {
    const newTimeSlots = formData.timeSlots.filter((_, i) => i !== index)
    setFormData({ ...formData, timeSlots: newTimeSlots })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
    toast.success('Service updated successfully')
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
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 required">Time Slots</label>
            <button
              type="button"
              onClick={addTimeSlot}
              className="text-sm text-green-600 hover:text-green-700"
              disabled={formData.timeSlots.length >= 5}
            >
              + Add Time Slot
            </button>
          </div>
          <div className="space-y-3">
            {formData.timeSlots.map((slot, index) => (
              <div key={index} className="flex gap-2">
                <TimeSlot
                  duration={slot.duration}
                  price={slot.price}
                  onChange={(field, value) => handleTimeSlotChange(index, field, value)}
                />
                <button
                  type="button"
                  onClick={() => removeTimeSlot(index)}
                  className="text-gray-400 hover:text-gray-600 self-center"
                  disabled={formData.timeSlots.length <= 1}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
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

export default EditDefaultServiceModal