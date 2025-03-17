import { useState, useEffect } from 'react'
import Modal from './Modal'
import { ServiceForm } from './ServiceForm'

function EditServiceModal({ isOpen, onClose, onSave, service }) {
  const [formData, setFormData] = useState({
    serviceName: '',
    shortDescription: '',
    detailedDescription: '',
    duration: '15',
    price: '',
    features: ['']
  })

  useEffect(() => {
    if (service) {
      setFormData({
        serviceName: service.title || '',
        shortDescription: service.shortDescription || '',
        detailedDescription: service.detailedDescription || '',
        duration: service.duration?.toString() || '15',
        price: service.price?.toString() || '',
        features: service.features || ['']
      })
    }
  }, [service])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!service?.id) return
    onSave({ ...formData, id: service.id })
    onClose()
  }

  if (!isOpen) return null

  return (
    <Modal title="Edit Service Details" onClose={onClose}>
      <ServiceForm 
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
      />
    </Modal>
  )
}

export default EditServiceModal