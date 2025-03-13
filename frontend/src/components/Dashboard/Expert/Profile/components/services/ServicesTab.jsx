import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ServicesHeader from './ServicesHeader';
import ServicesList from './ServicesList';
import ServiceForm from './ServiceForm';

export default function ServicesTab({ formData, onUpdate }) {
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const handleAddService = (newService) => {
    const updatedServices = [...formData, newService];
    onUpdate(updatedServices);
    setShowForm(false);
    setEditingService(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingService(null);
  };

  return (
    <div className="py-6">
      <ServicesHeader />
      
      {showForm ? (
        <ServiceForm 
          onSave={handleAddService}
          onCancel={handleCancel}
          initialData={editingService || {
            serviceName: '',
            shortDescription: '',
            detailedDescription: '',
            timeSlots: [],
            features: []
          }}
        />
      ) : (
        <ServicesList 
          services={formData}
          onAddClick={() => setShowForm(true)}
        />
      )}
    </div>
  );
}

ServicesTab.propTypes = {
  formData: PropTypes.array.isRequired,
  onUpdate: PropTypes.func.isRequired
};